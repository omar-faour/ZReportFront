const express = require('express');
const router = express.Router();

// const {authorization} = require('../../middleware/authorization')
const {login,} = require('../controller/login');


router.post('/',  (req, res) => {
    login(req, res)
    .then(result=> {
        if(result.error){
            res.status(400).send(result);
        }else{
            res.status(200).send(result);
        }
    })
    .catch(err=>console.log(err));
});
module.exports = router;