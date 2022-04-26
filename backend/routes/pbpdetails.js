const express = require('express');
const router = express.Router();

// const {authorization} = require('../../middleware/authorization')
const {get_pbpdetails, update_pbpdetail} = require('../controller/pbpdetails');


router.get('/',  (req, res) => {
    get_pbpdetails(req, res)
    .then(result=> res.status(200).send(result))
    .catch(err=>console.log(err));
});
router.put('/', update_pbpdetail);

module.exports = router;