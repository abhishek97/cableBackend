/**
 * Created by abhishek on 23/07/17.
 */
'use strict';

const Sequelize = require('sequelize'),
    DataTypes = require('sequelize/lib/data-types');

module.exports = {
    define (db) {
        const Bill = db.define('bill', {
            id             : {
                type         : Sequelize.BIGINT,
                primaryKey   : true,
                autoIncrement: true
            },
            generation_date: {
                type        : Sequelize.DATE,
                defaultValue: DataTypes.NOW,

            },
            url: Sequelize.STRING
        })
        return Bill
    },

    associate ({payment, bill}) {
        bill.belongsTo(payment)
        payment.hasOne(bill)
    }
}