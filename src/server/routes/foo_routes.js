const router = require('express').Router()

const foo_controller = require('../controllers/foo_controller')

router.get('/foos', foo_controller.get)

module.exports = router
