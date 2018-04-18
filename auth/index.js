const Authoritah = require('cb-authoritah')
const A = new Authoritah()

const filenames = ['customers']

filenames.forEach(filename => {
    require('./'+filename).forEach(rule => {
        A.addRule(rule)
    })
})

module.exports = A