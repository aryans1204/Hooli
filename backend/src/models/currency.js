/**
 * mongoose module
 * @const
 */
const mongoose = require('mongoose')

/**
 * currencySchema schema
 * @class Currency
 * @property {String} currency_from
 * @property {String} currency_to
 * @property {UserObject} currency_owner
 */
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

/**
 * Currency module
 * @module Currency
 */
module.exports = Currency