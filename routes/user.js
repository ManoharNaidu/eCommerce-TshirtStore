const express = require('express');
const router = express.Router();

const {signup,login,logout,forgotPassword,resetPassword,getLoggedInUserDetails,changePassword, updateUserDetails} = require('../controllers/userController');
const { isLoggedIn } = require('../middlewares/user');

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/forgotpassword').post(forgotPassword)
router.route('/resetPassword/:resetToken').put(resetPassword)
router.route('/userDashboard').get(isLoggedIn, getLoggedInUserDetails)
router.route('/password/update').put(isLoggedIn, changePassword)
router.route('/userDashboard/update').put(isLoggedIn, updateUserDetails)
module.exports = router;