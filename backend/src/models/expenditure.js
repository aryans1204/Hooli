/**
 * mongoose module
 * @const
 */
const mongoose = require('mongoose')

/**
 * validator module
 * @const
 */
//const validator = require('validator')

/**
 * @typedef {Object} Expenditure
 * @property {String} memo
 * @property {Number} amount
 * @property {String} category
 * @property {UserObject} expenditure_owner
 */
const expenditureSchema = new mongoose.Schema({
    memo: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        validate(value) {
            if (value <= 0) throw new Error("Amount cannot be zero.")
        }
    },
    category: {
        type: String,
        required: true,
        validate(value) {
            const allowedCats = ["food", "housing", "utilities", "bills", "clothes", "lifestyle", "transport",
            "healthcare", "pets", "others"]

            if (!allowedCats.includes(value)) throw new Error("Please choose one of the supported categories.")
        }
    },
    expenditure_owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Expenditure = mongoose.model('Expenditure', expenditureSchema)
module.exports = Expenditure
