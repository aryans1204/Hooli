/**
 * mongoose module
 * @const
 */
const mongoose = require('mongoose')

/**
 * validator module
 * @const
 */
const validator = require('validator')

/**
 * @typedef {Object} Currency
 * @property {String} currency_from
 * @property {String} currency_to
 * @property {UserAccountObject} currency_owner
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
        ref: 'UserAccount'
    }
})

const Currency = mongoose.model('Currency', currencySchema)

module.exports = Currency