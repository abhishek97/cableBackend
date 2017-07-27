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
    pdf = require('handlebars-pdf'),
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
            const document = {
                template: source.toString('utf-8'),
                context: payment,
                path: path.join(__dirname, `../bills/${fileName}`),
                options : {
                    "format"     : "A4",
                    "orientation": "portrait",
                    "border"     : "0",
                    "zoomFactor" : "0.4"
                }
            }
            const generateBillPromise = pdf.create(document)

            const createBillPromise = DB.bill.create({
                paymentId: payment.id,
                url: `${config.baseURL}/static/${fileName}`
            })

            return Promise.all([generateBillPromise, createBillPromise])
        })
        .then( ([filename, bill]) => {
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
