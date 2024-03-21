const express = require('express');
const router = express.Router();

const {signup,login, logout, forgotPassword, resetPassword, getLoggedInUserDetails, changePassword, updateUserDetails, adminAllUsers, admingetSingleUser, managerAllUsers, adminUpdateUser, adminDeleteUser} = require('../controllers/userController');
const { isLoggedIn, customRole } = require('../middlewares/user');

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/forgotpassword').post(forgotPassword)
router.route('/resetPassword/:resetToken').put(resetPassword)
router.route('/userDashboard').get(isLoggedIn, getLoggedInUserDetails)
router.route('/password/update').put(isLoggedIn, changePassword)
router.route('/userDashboard/update').put(isLoggedIn, updateUserDetails)

// admin routes
router.route('/admin/users').get(isLoggedIn, customRole("admin") ,adminAllUsers)
router
    .route('/admin/user/:id')
    .get(isLoggedIn, customRole("admin") ,admingetSingleUser)
    .put(isLoggedIn, customRole("admin") ,adminUpdateUser)
    .delete(isLoggedIn, customRole("admin") ,adminDeleteUser)

// manager routes
router.route('/manager/users').get(isLoggedIn, customRole("manager") ,managerAllUsers)

module.exports = router;