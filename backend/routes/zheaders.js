const express = require('express');
const router = express.Router();

// const {authorization} = require('../../middleware/authorization')
const {get_zheaders} = require('../controller/zheaders');

router.get('/list',  (req, res) => {
    get_zheaders(req, res)
    .then(result=> res.status(200).send(result))
    .catch(err=>console.log(err));
});


module.exports = router;