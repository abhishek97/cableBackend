const Sequelize = require('sequelize'),
    DataTypes = require('sequelize/lib/data-types');

module.exports = {
    define (db) {
        const CableNetwork = db.define('cable_network', {
            id          : {
                type         : Sequelize.BIGINT,
                primaryKey   : true,
                autoIncrement: true
            },
            name       : {
                type: Sequelize.STRING,
                allowNull: false,
            },
            remarks      : Sequelize.TEXT
        })
        return CableNetwork
    },

    associate ({cable_network, stb}) {
        cable_network.hasMany(stb)
    }

}