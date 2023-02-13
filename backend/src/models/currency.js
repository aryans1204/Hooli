const mongoose = require('mongoose')
const validator = require('validator')

const currencySchema = new mongoose.Schema({
    currency_from: {
        type: String,
        required: true
    },
    currency_to: {
        type: String,
        required: true
    },
    currency_owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Currency = mongoose.model('Currency', currencySchema)

module.exports = Currency