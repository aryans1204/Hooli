const mongoose = require('mongoose')
const validator = require('validator')

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

module.exports = Transaction