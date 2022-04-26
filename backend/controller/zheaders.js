const {pool} = require('../configurations/db');



exports.get_zheaders = (req, res)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT * FROM z_header WHERE store_code = $1`,[req.query.store_code], (error, result)=>{
            if(error){
                reject(error);
            }
            resolve(result.rows);
        })
    })
}
