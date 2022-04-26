const express = require('express');
const router = express.Router();

// const {authorization} = require('../../middleware/authorization')
const {get_zphysicalcards, update_zphysicalcard} = require('../controller/zphysicalcards');


router.get('/',  (req, res) => {
    get_zphysicalcards(req, res)
    .then(result=> res.status(200).send(result))
    .catch(err=>console.log(err));
});
router.put('/', update_zphysicalcard);

module.exports = router;