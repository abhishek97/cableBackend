/**
 * Created by abhishek on 23/07/17.
 */
'use strict';

const Sequelize = require('sequelize'),
    DataTypes = require('sequelize/lib/data-types');

module.exports = {
    define (db) {
        const Payment = db.define('payment', {
            id          : {
                type         : Sequelize.BIGINT,
                primaryKey   : true,
                autoIncrement: true
            },
            vc_no       : Sequelize.STRING,
            payment_date: {
                type        : Sequelize.DATE,
                defaultValue: DataTypes.NOW,

            },
            amount      : Sequelize.INTEGER
        })
        return Payment
    },

    associate ({customer, payment}) {
        payment.belongsTo(customer)
    }

}