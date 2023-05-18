const { createTransaction, getAllTransactions, getMyTransactions, getSingleUserTransactions } = require('../controllers/transactionController');
const { protect } = require('../middlewares/protect');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');

const router = require('express').Router();

router.route('/')
    .post(protect(User) , createTransaction)
    .get(getAllTransactions)

router.get('/my' , protect(User) , getMyTransactions);

router.get('/user/:id' , protect(Admin) , getSingleUserTransactions)

module.exports = router;