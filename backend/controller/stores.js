const {pool} = require('../configurations/db');

exports.get_all_stores = (req, res)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM stores', (error, result)=>{
            if(error){
                reject(error);
            }
            resolve(result.rows);
        })
    })
}

exports.get_stores = (req, res)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT * FROM stores WHERE id IN (${req.query.array_list.join(",")})`, (error, result)=>{
            if(error){
                reject(error);
            }
            console.log(result.rows)
            resolve(result.rows);
        })
    })
}

exports.get_store = (req, res)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM stores WHERE id = $1', [req.query.store_id], (error, result)=>{
            if(error){
                reject(error);
            }
            resolve(result.rows);
        })
    })
}



exports.update_bankdetail = (req, res)=>{
    return "update"
    // res.status(200).send({"UPDATE"})
}