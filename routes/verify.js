const express = require('express')
const router = express.Router()

const VerifyControllers = require('../controllers/verify-controller')

router.post('/', VerifyControllers.Verify)

module.exports = router