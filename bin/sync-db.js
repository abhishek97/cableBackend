#!/usr/local/bin/node

/**
 * Created by abhishek on 23/07/17.
 */
'use strict';

const db = require('../models')

db.sequelize.sync({force: true}).then(() => {
    console.log('DB SYNCED!')
    process.exit(0)
})
