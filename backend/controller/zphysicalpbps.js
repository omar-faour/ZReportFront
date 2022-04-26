const {pool} = require('../configurations/db');

exports.get_zphysicalpbps = (req, res)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT get_zphysicalpbps(1)', (error, result)=>{
            if(error){
                reject(error);
            }
            resolve(result.rows[0]);
        })
    })
}

exports.update_zphysicalpbp = (req, res)=>{
    return "update"
    // res.status(200).send({"UPDATE"})
}