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
            username: Sequelize.STRING,
            password: Sequelize.STRING,
        })
        return User
    },

    associate () {
        return ;
    }
}
