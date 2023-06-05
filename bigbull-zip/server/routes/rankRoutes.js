const router = require('express').Router();
const { createRank, getAllRanks, updateRank, deleteRank , getSingleRank } = require('../controllers/ranksConstorller');
const { protect } = require('../middlewares/protect');
const Admin = require('../models/adminModel');

router.route('/')
    .post(protect(Admin) , createRank)
    .get(getAllRanks)

router.route('/:id')
    .put(protect(Admin) , updateRank)
    .delete(protect(Admin) , deleteRank)
    .get(getSingleRank)

module.exports = router;