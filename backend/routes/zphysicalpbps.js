const express = require('express');
const router = express.Router();

// const {authorization} = require('../../middleware/authorization')
const {get_zphysicalpbps, update_zphysicalpbp} = require('../controller/zphysicalpbps');


router.get('/',  (req, res) => {
    get_zphysicalpbps(req, res)
    .then(result=> res.status(200).send(result))
    .catch(err=>console.log(err));
});
router.put('/', update_zphysicalpbp);

module.exports = router;