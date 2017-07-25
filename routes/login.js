 const Router = require('express').Router(),
    U = require('../utils'),
    R = require('ramda'),
    createHash = require('sha.js'),
    DB = require('../models'),
    jwt = require('jsonwebtoken');

Router.post('/', (req, res) => {
    const {username, password} = req.body
    const sha256 = createHash('sha256')
    const safe = R.ifElse(R.isNil, R.always(''), R.identity)
    //console.log( sha256.update(safe(password)).digest('hex'))
    DB.user.findOne({
        where: {
            username: safe(username),
            password: sha256.update(safe(password)).digest('hex')
        }
    }).then(user => {
        if ( U.isNotEmpty(user) )
            res.json(U.signJwt(U.normalize(user), 'private'))
        else
            res.sendStatus(401)
    }).catch(err => {
        console.error(err)
        res.sendStatus(500)
    })
})


module.exports = Router
