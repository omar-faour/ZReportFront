const {pool} = require('../configurations/db');

exports.get_zdetails = (req, res)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT get_zdetails(1)', (error, result)=>{
            if(error){
                reject(error);
            }
            resolve(result.rows[0]);
        })
    })
}

exports.update_zdetail = (req, res)=>{
    return "update"
    // res.status(200).send({"UPDATE"})
}