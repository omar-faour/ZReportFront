const {pool} = require('../configurations/db');

exports.get_all_countries = (req, res)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM countries', (error, result)=>{
            if(error){
                reject(error);
            }
            resolve(result.rows);
        })
    })
}

exports.get_countries = (req, res)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT * FROM countries WHERE id IN (${req.query.array_list.join(",")})`, (error, result)=>{
            if(error){
                reject(error);
            }
            console.log(result.rows)
            resolve(result.rows);
        })
    })
}

exports.get_country = (req, res)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM countries WHERE id = $1', [req.query.country_id], (error, result)=>{
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