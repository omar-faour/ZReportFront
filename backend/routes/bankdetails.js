const express = require('express');
const router = express.Router();

// const {authorization} = require('../../middleware/authorization')
const {get_bankdetails, update_bankdetail} = require('../controller/bankdetails');


router.get('/',  (req, res) => {
    get_bankdetails(req, res)
    .then(result=> res.status(200).send(result))
    .catch(err=>console.log(err));
});
router.put('/', update_bankdetail);

module.exports = router;