const express = require('express');
const router = express.Router();

// const {authorization} = require('../../middleware/authorization')
const {get_all_countries, get_countries, get_country} = require('../controller/countries');

router.get('/all',  (req, res) => {
    get_all_countries(req, res)
    .then(result=> res.status(200).send(result))
    .catch(err=>console.log(err));
});

router.get('/list',  (req, res) => {
    get_countries(req, res)
    .then(result=> res.status(200).send(result))
    .catch(err=>console.log(err));
});

router.get('/',  (req, res) => {
    get_country(req, res)
    .then(result=> res.status(200).send(result))
    .catch(err=>console.log(err));
});

module.exports = router;