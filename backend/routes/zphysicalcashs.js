const express = require('express');
const router = express.Router();

// const {authorization} = require('../../middleware/authorization')
const {get_zphysicalcashs, update_zphysicalcash} = require('../controller/zphysicalcashs');


router.get('/',  (req, res) => {
    get_zphysicalcashs(req, res)
    .then(result=> res.status(200).send(result))
    .catch(err=>console.log(err));
});
router.put('/', update_zphysicalcash);

module.exports = router;