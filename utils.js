/**
 * Created by abhishek on 23/07/17.
 */
'use strict';

const R = require('ramda');

const neg = f => R.pipe(
    f,
    R.not
)

const isNotEmpty = R.both(
    neg(R.isEmpty),
    neg(R.isNil)
)

module.exports = {
    isNotEmpty
}