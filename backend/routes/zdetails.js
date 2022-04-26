const express = require('express');
const router = express.Router();

// const {authorization} = require('../../middleware/authorization')
const {get_zdetails, update_zdetail} = require('../controller/zdetails');

// router.get('/' ,authorization, getLeases); 
// router.get('/:tenant_id', authorization, getTenantLeases)

// router.post('/' , authorization, addLease); 

// router.put('/' , authorization, editLease); 

// router.delete('/', authorization, deleteLease);

router.get('/',  (req, res) => {
    get_zdetails(req, res)
    .then(result=> res.status(200).send(result))
    .catch(err=>console.log(err));
});
router.put('/', update_zdetail);

module.exports = router;