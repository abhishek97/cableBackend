/**
 * Created by abhishek on 23/07/17.
 */
'use strict';
 
const Sequelize = require('sequelize');

module.exports = {
    define (db) {
        const Customer = db.define('customer', {
            id: {
                type         : Sequelize.BIGINT,
                primaryKey   : true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            address: {
                type: Sequelize.STRING,
                allowNull: false
            },
            mobile: {
                type: Sequelize.STRING(10),
                allowNull: false
            },
            vc_no_trail: {
                type: Sequelize.STRING,
                allowNull: true
            },
            status: {
                type: Sequelize.ENUM('0', '1', '2'),
                defaultValue: '0',
            },
            expiry_date: {
                type: Sequelize.DATE,
                allowNull: false
            }
        })
        return Customer
    },

    associate ({customer, stb, payment, user}) {
        customer.hasMany(payment)
        customer.hasOne(stb)
        customer.belongsTo(user, {as: 'createdBy'})
    }
}