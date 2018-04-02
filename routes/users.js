const Router = require('express').Router(),
    U = require('../utils')

Router.use(U.ensureLogin)

Router.get('/me', (req, res) => {
    res.json(req.user)
})

module.exports = Router