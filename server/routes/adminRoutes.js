const { registerAdmin, login, getProfile, logout, updatePassword, transferAmount , getAdminTransferHistory } = require('../controllers/adminController');
const { protect } = require('../middlewares/protect');
const Admin = require('../models/adminModel');

const router = require('express').Router();

router.post('/register' , registerAdmin);
router.post('/login' , login);
router.get('/profile' , protect(Admin) , getProfile);
router.get('/logout' , logout);
router.put('/update-password' , protect(Admin) , updatePassword)
router.post('/transfer-amount' , protect(Admin) , transferAmount)
router.get('/transfer-history' , getAdminTransferHistory)

module.exports = router;