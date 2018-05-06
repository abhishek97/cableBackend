const Router = require('express').Router(),
    U = require('../utils'),
    DB = require('../models')

const model = DB.stb;

Router.use(U.ensureLogin)

Router.get('/', (req, res) => {
    Object.keys(req.query.filter).forEach(key => {
        if (req.query.filter[key] === '')
            req.query.filter[key] = null
    })
    model.findAll({
        where: {
            customerId: {
                $not: null
            },
            ...req.query.filter
        },
        include: [{
            model: DB.agent,
        }, {
            model: DB.cable_network
        }, {
            model: DB.user,
            as: 'createdBy',
            attributes: ['id', 'username']
        }],
        limit: 10
    }).then(stb => res.json(stb))
})

Router.get('/:id', (req, res) => {
    model.findById(req.params.id, {
        where: {
            customerId: {
                $not: null
            }
        },
        include: [{
            model: DB.agent,
        }, {
            model: DB.cable_network
        },{
            model: DB.customer
        }, {
            model: DB.user,
            as: 'createdBy',
            attributes: ['id', 'username']
        }],
    }).then(result => res.json(result))
})

Router.get('/:id/return', async (req, res) => {
    const stbId = req.params.id
    const result = await model.update({
        status: -1,
        customerId: null
    }, {
        where: {
            id: stbId
        }
    })
    res.sendStatus(200)
})

Router.post('/', (req, res) => {
    let stb = {}
    try {
        stb = {
            vc_no: req.body.vc_no,
            status: U.STBSTATUS.NEW,
            remarks: req.body.remarks,
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