const express = require('express')
const app = express()
const port = 3001
const {pool} = require('./configurations/db');

const zdetails = require('./routes/zdetails');
const zphysicalcards = require('./routes/zphysicalcards');
const zphysicalpbps = require('./routes/zphysicalpbps');
const bankdetails = require('./routes/bankdetails');
const pbpdetails = require('./routes/pbpdetails');
const zphysicalcashs = require('./routes/zphysicalcashs');
const zphysicalcashsin = require('./routes/zphysicalcashsin');
const zphysicalcashsout = require('./routes/zphysicalcashsout');
const login = require('./routes/login');
const countries = require('./routes/countries');
const cities = require('./routes/cities');
const stores = require('./routes/stores');
const zheaders = require('./routes/zheaders');


app.use('/api/zdetails', zdetails);
app.use('/api/zphysicalcards', zphysicalcards);
app.use('/api/zphysicalpbps', zphysicalpbps);
app.use('/api/bankdetails', bankdetails);
app.use('/api/pbpdetails', pbpdetails);
app.use('/api/zphysicalcashs', zphysicalcashs);
app.use('/api/zphysicalcashsin', zphysicalcashsin);
app.use('/api/zphysicalcashsout', zphysicalcashsout);
app.use('/api/countries', countries)
app.use('/api/cities', cities)
app.use('/api/stores', stores)
app.use('/api/zheaders', zheaders)
app.use('/api/auth/signin', login)
// app.get('/', (req, res) => {
//     return new Promise((resolve, reject)=>{
//         pool.query('SELECT get_zdetails(1)', (error, result)=>{
//             if(error){
//                 reject(error)
//             }
//             res.status(200).send(result.rows);
//             resolve(result.rows)
//         })
//     })
  
// })

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})