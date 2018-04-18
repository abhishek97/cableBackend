/**
 * Created by abhishek on 23/07/17.
 */
'use strict';

const Router = require('express').Router(),
    U = require('../utils'),
    R = require('ramda'),
    A = require('../auth'),
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
            all: true
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
            vc_no: {
                $like: `%${vc_no}%`
            }
        },
        include: {
            all: true
        },
        limit: 30
    }).then(customers => {
        res.json(customers)
    }).catch(err => {
        res.status(500).json(err)
    })
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
    const customer = req.body
    customer.createdById = req.user.id
    customer.stbId = customer.stb.id 
    customer.vc_no = customer.stb.vc_no

    model.create(customer, {
        returning: true
    }).then(dbCustomer => {
        res.json(dbCustomer)
    }).catch(err => {
        console.error(err)
        res.status(500).json(err)
    })
})


module.exports = Router
