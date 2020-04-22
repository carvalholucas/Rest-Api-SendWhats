const express = require('express')
const router = express.Router()

const UsersControllers = require('../controllers/users-controller')

router.post('/register', UsersControllers.newUser)

router.post('/login', UsersControllers.authUser)

module.exports = router