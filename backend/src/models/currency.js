const mongoose = require('mongoose')
const validator = require('validator')

const currencySchema = new mongoose.Schema({
    currencies: [{
        currency: {
            type: String,
            required: true,
            validate(value) {
                if (!validator.isCurrency(value)) {
                    throw new Error("Please enter a valid currency!")
                }
            },
            cur_exchange_rate: {
                type: Number,
                required: true
            }
        }
    }],
    currency_owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Currency = mongoose.model('Currency', currencySchema)

module.exports = Currency