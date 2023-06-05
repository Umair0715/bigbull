const { setAdminProfit } = require('../controllers/adminProfitController');
const { protect } = require('../middlewares/protect');
const Admin = require('../models/adminModel');

const router = require('express').Router();

router.route('/')
    .post(protect(Admin) , setAdminProfit);

module.exports = router;