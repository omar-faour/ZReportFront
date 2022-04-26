const express = require('express');
const router = express.Router();

// const {authorization} = require('../../middleware/authorization')
const {get_all_stores, get_stores, get_store} = require('../controller/stores');

router.get('/all',  (req, res) => {
    get_all_stores(req, res)
    .then(result=> res.status(200).send(result))
    .catch(err=>console.log(err));
});

router.get('/list',  (req, res) => {
    get_stores(req, res)
    .then(result=> res.status(200).send(result))
    .catch(err=>console.log(err));
});

router.get('/',  (req, res) => {
    get_country(req, res)
    .then(result=> res.status(200).send(result))
    .catch(err=>console.log(err));
});

module.exports = router;