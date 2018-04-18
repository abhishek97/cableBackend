const Sequelize = require('sequelize'),
    DataTypes = require('sequelize/lib/data-types');

module.exports = {
    define (db) {
        const Agent = db.define('agent', {
            id          : {
                type         : Sequelize.BIGINT,
                primaryKey   : true,
                autoIncrement: true
            },
            name       : {
                type: Sequelize.STRING,
                allowNull: false,
            },
            number      : {
                type: Sequelize.STRING,
                allowNull: true
            },
            remarks      : Sequelize.TEXT
        })
        return Agent
    },

    associate ({agent, stb}) {
        agent.hasMany(stb)
    }

}