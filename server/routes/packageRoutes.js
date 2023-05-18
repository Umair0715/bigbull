const { createPackage, getAllPackages, getSinglepackage, updatePackage, deletePackage } = require('../controllers/packageController');

const router =require('express').Router();

router.route('/')
    .post(createPackage)
    .get(getAllPackages)
    
router.route('/:packageId')
    .put(updatePackage)
    .get(getSinglepackage)
    .delete(deletePackage);

module.exports = router;