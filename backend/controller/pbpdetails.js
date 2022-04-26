const {pool} = require('../configurations/db');

exports.get_pbpdetails = (req, res)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT get_pbpdetails(1)', (error, result)=>{
            if(error){
                reject(error);
            }
            resolve(result.rows[0]);
        })
    })
}

exports.update_pbpdetail = (req, res)=>{
    return "update"
    // res.status(200).send({"UPDATE"})
}