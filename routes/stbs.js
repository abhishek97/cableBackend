const Router = require('express').Router(),
    U = require('../utils'),
    DB = require('../models')

const model = DB.stb;

Router.use(U.ensureLogin)

Router.get('/', (req, res) => {
    console.log(req.query)
    model.findAll({
        where: req.query.filter,
        limit: 10
    }).then(stb => res.json(stb))
})

Router.post('/', (req, res) => {
    let stb = {}
    try {
        stb = {
            vc_no: req.body.vc_no,
            status: U.STBSTATUS.NEW,
            agentId: req.body.agent.id,
            cableNetworkId: req.body.cable_network.id,
            createdById: req.user.id
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json(err) 
    }

    model.create(stb, {returning: true})
    .then(stb => res.json(stb))
    .catch(err => {
        console.error(err)
        res.status(500).json(err)
    })
})

module.exports = Router