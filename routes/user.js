const express = require('express');
const router = express.Router();

const {signup,login,logout,forgotPassword,resetPassword} = require('../controllers/userController');

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/forgotpassword').post(forgotPassword)
router.route('/resetPassword/:resetToken').put(resetPassword)
module.exports = router;