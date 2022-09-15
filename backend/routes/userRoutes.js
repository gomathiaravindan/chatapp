const express = require('express')

const router = express.Router()
const { authUser,
     allUsers, 
    registerUser } = require("../controller/userController");

const { protect } = require("../middleware/authMiddleware")
router.route('/').post(registerUser).get(protect,allUsers)
router.post('/login',authUser)

module.exports = router