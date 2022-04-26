const {pool} = require('../configurations/db');

exports.get_all_cities = (req, res)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM cities', (error, result)=>{
            if(error){
                reject(error);
            }
            resolve(result.rows);
        })
    })
}

exports.get_cities = (req, res)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT * FROM cities WHERE id IN (${req.query.array_list?.join(",")})`, (error, result)=>{
            if(error){
                reject(error);
            }
            resolve(result.rows);
        })
    })
}

exports.get_city = (req, res)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM cities WHERE id = $1', [req.query.city_id], (error, result)=>{
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