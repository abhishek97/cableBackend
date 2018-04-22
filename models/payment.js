/**
 * Created by abhishek on 23/07/17.
 */
'use strict';

const Sequelize = require('sequelize'),
    DataTypes = require('sequelize/lib/data-types');

module.exports = {
    define (db) {
        const Payment = db.define('payment', {
            id: {
                type         : Sequelize.BIGINT,
                primaryKey   : true,
                autoIncrement: true
            },
            payment_date: {
                type        : Sequelize.DATE,
                defaultValue: DataTypes.NOW,

            },
            months: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            remarks: {
                type: Sequelize.STRING
            }
        })
        return Payment
    },

    associate ({customer, payment, user, stb}) {
        payment.belongsTo(customer)
        payment.belongsTo(stb)
        payment.belongsTo(user, {as: 'createdBy'})
    }

}