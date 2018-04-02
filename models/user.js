const Sequelize = require('sequelize'),
    DataTypes = require('sequelize/lib/data-types');

module.exports = {
    define (db) {
        const User = db.define('user', {
            id             : {
                type         : Sequelize.BIGINT,
                primaryKey   : true,
                autoIncrement: true
            },
            username: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            }
        })
        return User
    },

    associate () {
        return ;
    }
}
