const router = require('express').Router();
const { getAllAchievedRanks, getSingleUserAchievedRanks, getMyAchievedRanks } = require('../controllers/achievedRanksController');
const { protect } = require('../middlewares/protect');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');

router.route('/')
    .get(protect(Admin) , getAllAchievedRanks);
    
router.get('/my' , protect(User) , getMyAchievedRanks);

router.get('/:id' , protect(Admin) , getSingleUserAchievedRanks);

module.exports = router;