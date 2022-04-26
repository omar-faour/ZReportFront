const express = require('express');
const router = express.Router();

// const {authorization} = require('../../middleware/authorization')
const {get_all_cities, get_cities, get_city} = require('../controller/cities');

router.get('/all',  (req, res) => {
    get_all_cities(req, res)
    .then(result=> res.status(200).send(result))
    .catch(err=>console.log(err));
});

router.get('/list',  (req, res) => {
    get_cities(req, res)
    .then(result=> res.status(200).send(result))
    .catch(err=>console.log(err));
});

router.get('/',  (req, res) => {
    get_city(req, res)
    .then(result=> res.status(200).send(result))
    .catch(err=>console.log(err));
});

module.exports = router;