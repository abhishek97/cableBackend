/**
 * Created by abhishek on 23/07/17.
 */
'use strict';


const Router = require('express').Router(),
    U = require('../utils'),
    R = require('ramda'),
    Handlebars = require('handlebars'),
    path = require('path'),
    config = require('../config.json'),
    pdf = require('html-pdf'),
    fs = require('fs-extra'),
    DB = require('../models');

const model = DB.payment

Router.get('/', (req, res, next) => {
    if (U.isNotEmpty (req.query))
        return next ()

    model.findAll().then(payments => {
        res.json(payments)
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
        }
    }).then(customers => {
        res.json(customers)
    })
})

Router.get('/:id/bill', (req, res) => {

    const sourcePromise = fs.readFile(path.join(__dirname,'../templates/invoice.hbs'))
    const paymentPromise = model.findById(req.params.id,{
        include: DB.customer
    })

    Promise.all([sourcePromise, paymentPromise])
        .then( ([source, payment]) => {
            const template = Handlebars.compile(String (source))
            const html = template(payment)
            const fileName = `bill_${payment.vc_no}.pdf`
            const generateBillPromise = new Promise((resolve, reject) => {
                pdf.create(html).toFile(path.join(__dirname, `../bills/${fileName}`), function(err, res) {
                    if (err)
                        return reject(err)
                    resolve(res.filename)
                })
            })

            const createBillPromise = DB.bill.create({
                paymentId: payment.id,
                url: `${config.baseURL}/static/${fileName}`
            })

            return Promise.all([generateBillPromise, createBillPromise])
        })
        .then( ([filename, bill]) => {
            console.log(filename)
            res.json(bill)
        })
        .catch(err => {
        console.error(err)
        res.sendStatus(500)
        })
    
})

Router.post('/', (req, res) => {
    model.create(req.body).then(payment =>{
        res.json(payment)
    }).catch(err => {
        res.sendStatus(500)
    })

})


module.exports = Router
