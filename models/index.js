/**
 * Created by abhishek on 23/07/17.
 */
'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require('../config.json')[env];
var db        = {};
var dbModel     = {}

if (config.use_env_variable) {
    var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function(file) {
        var model = require(path.join(__dirname, file)).define(sequelize);
        dbModel[model.name] = require(path.join(__dirname, file))
        db[model.name] = model;
    });

Object.keys(dbModel).forEach(function(modelName) {
    if(dbModel[modelName].associate){
        dbModel[modelName].associate(db)
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;