const {pool} = require('../configurations/db');

exports.login = (req, res)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT signin($1,$2)', [req.query.email, req.query.password], (error, result)=>{
            if(error){
                reject(error);
            }
            resolve(result.rows[0]['signin']);
        })
    })
}