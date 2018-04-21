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

Router.use(U.ensureLogin)

Router.get('/', (req, res, next) => {
    if (U.isNotEmpty (req.query))
        return next ()

    model.findAll().then(payments => {
        res.json(payments)
    }).catch(err => {
        console.error(err)
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
        }
    }).then(customers => {
        res.json(customers)
    }).catch(err => {
        console.error(err)
        res.status(500).json(err)
    })
})

Router.get('/:id/bill', (req, res) => {
    // Drop this request for now
    res.send(404)
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
            res.status(500).json(err)
        })

})

Router.post('/', async (req, res) => {
    const payment = {
        amount: req.body.amount,
        remarks: req.body.remarks,
        customerId: req.body.customerId,
        stbId: req.body.stbId,
        createdById: req.user.id
    }
    const customerId = req.body.customerId
    
    const dbPayment = await model.create(payment)

    await DB.customer.update({
        expiry_date: DB.sequelize.literal('date_add(DATE(expiry_date), INTERVAL 30 day)')
    },{
        where: {
            id: customerId
        }
    })

    res.json(dbPayment)

})


module.exports = Router
