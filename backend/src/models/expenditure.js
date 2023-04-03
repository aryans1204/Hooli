/**
 * mongoose module
 * @const
 */
const mongoose = require('mongoose')

/**
 * @typedef {Object} Expenditure
 * @property {String} memo
 * @property {Number} amount
 * @property {String} category
 * @property {Date} date
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
            const allowedCats = ["Food", "Housing", "Utilities", "Bills", "Clothes", "Lifestyle", "Transport",
            "Healthcare", "Pets", "Others"]

            if (!allowedCats.includes(value)) throw new Error("Please choose one of the supported categories.")
        }
    },
    date: {
        type: Date,
        required: true
    },
    expenditure_owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Expenditure = mongoose.model('Expenditure', expenditureSchema)

/**
 * Expenditure module
 * @module Expenditure
 */
module.exports = Expenditure
