/**
 * Created by abhishek on 23/07/17.
 */
'use strict';

const Router = require('express').Router(),
    U = require('../utils'),
    R = require('ramda'),
    DB = require('../models');

const model = DB.customer

Router.use(U.ensureLogin)

Router.get('/', (req, res, next) => {
    if (U.isNotEmpty (req.query))
        return next ()

    model.findAll({
        limit: 30
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

Router.post('/', (req, res) => {
    const customer = req.body
    customer.createdById = req.user.id
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
