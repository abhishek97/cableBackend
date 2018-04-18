/**
 * Created by abhishek on 23/07/17.
 */
'use strict';

const Sequelize = require('sequelize'),
    DataTypes = require('sequelize/lib/data-types');

module.exports = {
    define (db) {
        const Stb = db.define('stb', {
            id          : {
                type         : Sequelize.BIGINT,
                primaryKey   : true,
                autoIncrement: true
            },
            vc_no       : {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            status      : {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            remarks      : Sequelize.TEXT
        })
        return Stb
    },

    associate ({customer, stb, agent, cable_network, user}) {
        stb.belongsTo(customer)
        stb.belongsTo(agent)
        stb.belongsTo(cable_network)
        stb.belongsTo(user, {as: 'createdBy'})
    }

}