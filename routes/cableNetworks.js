const Router = require('express').Router(),
    U = require('../utils'),
    R = require('ramda'),
    A = require('../auth'),
    DB = require('../models');

const model = DB.cable_network

Router.use(U.ensureLogin)

Router.get('/', (req, res) => {
    const { filter } = req.query
    model.findAll({
        where: filter,
        limit: 10
    }).then(agents => {
        res.json(agents)
    }).catch(err => {
        console.error(err)
        res.status(500).json(err)
    })
})

module.exports = Router