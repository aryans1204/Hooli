const mongoose = require('mongoose')
const validator = require('validator')

const currencySchema = new mongoose.Schema({
    currency: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isCurrency(value)) {
                throw new Error("Please enter a valid currency!")
            }
        }
   },
    currency_owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Currency = mongoose.model('Currency', currencySchema)

module.exports = Currency