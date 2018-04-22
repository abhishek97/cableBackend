/**
 * Created by abhishek on 23/07/17.
 */
'use strict';

const Router = require('express').Router(),
    U = require('../utils'),
    R = require('ramda'),
    A = require('../auth'),
    moment = require('moment'),
    DB = require('../models');

const model = DB.customer

Router.use(U.ensureLogin)

Router.use((req, res, next) => {
    debugger;
    /*const errors = A.disrespectedRules (req)
    
    console.log(errors)
    if (errors.length === 0)
        return next()

    console.error(errors)*/
    A.respectAsync(req)
    .then ( () => next())
    .catch(err => {
        res.status(500).json(errors)
    })
    
})

Router.get('/', (req, res, next) => {
    if (U.isNotEmpty (req.query))
        return next ()

    model.findAll({
        limit: 30,
        include: {
            model: DB.stb,
            include: [{
                model: DB.agent,
            }, {
                model: DB.cable_network
            }]
        }
    }).then(customers => {
        res.json(customers)
    }).catch(err => {
        res.status(500).json(err)
    })
})

Router.get('/', (req, res) => {
    const {filter} = req.query
    const {vc_no} = JSON.parse(filter)
    model.findAll({
        where: {
            vc_no_trail: {
                $like: `%${vc_no}%`
            }
        },
        include: {
            model: DB.stb,
            include: [{
                model: DB.agent,
            }, {
                model: DB.cable_network
            }]
        },
        limit: 30
    }).then(customers => {
        res.json(customers)
    }).catch(err => {
        res.status(500).json(err)
    })
})

Router.get('/incompleteCaf', async (req, res) => {
    let stbs = await DB.stb.findAll({
        limit: 30,
        include: [{
            model: DB.payment
        },{
            model: DB.customer,
            include: {
                model: DB.stb,
                include: [{
                    model: DB.agent,
                }, {
                    model: DB.cable_network
                }]
            }
        }, {
            model: DB.agent,
        }, {
            model: DB.cable_network 
        }, {
            model: DB.user,
            attributes: ['id', 'username'],
            as: 'createdBy'
        }]
    })
    stbs = stbs.map(stb => stb.get({plain: true})).filter(stb => !stb.payments.length)
    res.json(stbs)
})

Router.get('/collectPayments', async (req, res) => {
    let customers = await model.findAll({
        where: {    
            $and: [{
                expiry_date: {
                    $lte: moment().add(2, 'days').format('YYYY-MM-DD HH:mm:ss')
                }  
            }, {
                vc_no_trail: {
                    $like: '%' + (req.query.vc_no || '') + '%'
                }
            }] 
                
        },
        include: [{
            model: DB.stb,
            include: [{
                model: DB.agent,
            }, {
                model: DB.cable_network
            }],
            where: {
                customerId: {
                    $not: null
                }
            }
        }, {
            model: DB.user,
            attributes: ['id', 'username'],
            as: 'createdBy'
        }]
    })
    customers = customers.map(c => c.get({plain: true}))
    res.json(customers)
})

Router.get('/:id', (req, res) => {
    model.findById(req.params.id, {
        include : {
            all: true,
            nested: true
        }
    }).then(customer => {
            res.json(customer)
    }).catch(err=> {
        console.error(err)
        res.status(500).json(err)
    })
})

Router.post('/', async (req, res) => {
    try {
        const customer = {
            name: req.body.name,
            address: req.body.address,
            mobile: req.body.mobile,
            vc_no_trail: req.body.stb.vc_no,
            expiry_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            createdById : req.user.id,
            //stbId : customer.stb.id,
            //vc_no : customer.stb.vc_no
        }
        const stbId = req.body.stb.id

        const dbCustomer = await model.create(customer, {
            returning: true
        })

        await DB.stb.update({
            status: 1
        },{
            where: {
                id: stbId,
                status: 0
            }
        })
        
        await dbCustomer.setStb(stbId)
    
        res.json(dbCustomer)
    } catch (e) {
        console.error(e)
        return res.status(500).json(e)
    }
})



module.exports = Router
