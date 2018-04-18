const DB = require('../models')
const Rules = [
    // while creating a customer its stbId must be avilable, i.e status be <= 0
    {
        predicate: (req) => {
            return req.originalUrl.split('/').pop() === 'customers' && req.method === 'POST'
        },
        async test (req) {
            const customer = req.body
            const stb = await DB.stb.findById(customer.stb.id)
            debugger;
            return !isNaN(+stb.status) && stb.status <= 0
        },
        errorMessage: "The Stb chosen is not available!"
    }
]

module.exports = Rules