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
 * transactionSchema schema
 * @class Transaction
 * @property {Number} amount
 * @property {String} transaction_category
 * @property {ExpenditureObject} transaction_component
 */
const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        validate(value) {
            if (value <= 0) throw new Error("Amount cannot be zero.")
        }
    },
    transaction_category: {
        type: String,
        required: true,
        validate(value) {
            const allowedCats = ["Food", "Housing", "Utilities", "Bills", "Clothes", "Lifestyle", "Transport",
            "Healthcare", "Pets", "Others"]

            if (!allowedCats.contains(value)) throw new Error("Please choose one of the supported categories.")
        }
    },
    transaction_component: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Expenditure'
    }
})

const Transaction = mongoose.model('Transaction', transactionSchema)

/**
 * Transaction module
 * @module Transaction
 */
module.exports = Transaction