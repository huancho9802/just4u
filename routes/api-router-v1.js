var router = require('express').Router()
var authRouter = require('./auth-router.js')

// /api/v1
router.get('/', (req, res) => {
    res.send('Hello API v1')
})

// use for /auth path
router.use('/auth', authRouter)

// use for /data path

module.exports = router