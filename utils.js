/**
 * Created by abhishek on 23/07/17.
 */
'use strict';

const R = require('ramda'),
    jwt = require('jsonwebtoken'),
    path = require('path'),
    fs = require('fs-extra');

const signJwt = (data, keyName) => {
    const filePath = path.join(__dirname, `keys/${keyName}.key`)
    const cert = fs.readFileSync(filePath)
    return jwt.sign(data, cert, {algorithm: 'RS256'})
}

const normalize = R.pipe(JSON.stringify, JSON.parse)

const ensureLogin = (req, res, next) => {
    const filePath = path.join(__dirname, 'keys/public.key')
    const publicKey = fs.readFileSync(filePath);
    console.log(req.headers)
    const token = req.headers['authorization'].split(' ')[1]
    console.log(token)
    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            console.error(err)
            res.sendStatus(401)
        } else {
            req.user = decoded
            next()
        }
    })
}

const neg = f => R.pipe(
    f,
    R.not
)

const isNotEmpty = R.both(
    neg(R.isEmpty),
    neg(R.isNil)
)

module.exports = {
    isNotEmpty,
    signJwt,
    ensureLogin,
    normalize
}
