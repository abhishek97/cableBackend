/**
 * Created by abhishek on 23/07/17.
 */
'use strict';
 
const Sequelize = require('sequelize');

module.exports = {
    define (db) {
        const Customer = db.define('customer', {
            id             : {
                type         : Sequelize.BIGINT,
                primaryKey   : true,
                autoIncrement: true
            },
            name           : Sequelize.STRING,
            address        : Sequelize.STRING,
            mobile         : Sequelize.BIGINT,
            vc_no          : Sequelize.STRING,
            monthly_payment: Sequelize.INTEGER,
            arrears        : Sequelize.INTEGER,
            cable_network  : Sequelize.STRING,
            status         : Sequelize.STRING,
            cable_guy      : Sequelize.STRING,
            total_payment  : Sequelize.INTEGER
        })
        return Customer
    },

    associate ({customer, payment}) {
        customer.hasMany(payment)
    }
}