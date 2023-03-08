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
 * incomeSchema schema
 * @class Income
 * @property {String} industry
 * @property {Number} monthly_income
 * @property {Number} weekly_hours
 * @property {Date} start_date
 * @property {Date} end_date
 * @property {String} company
 * @property {UserObject} income_owner
 */
const incomeSchema = new mongoose.Schema({
    industry: {
        type: String,
        required: true,
        validate(value) {
            const allowedSet = ["manufacturing", "services", "construction", "others"] 
            if (!allowedSet.includes(value)) throw new Error("Only supported industries are allowed.")
        }
    },
    monthly_income: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) throw new Error("Income cannot be negative.")
        }
    },
    weekly_hours: {
        type: Number,
        required: false,
        validate(value) {
            if (value < 0) throw new Error("Weekly hours cannot be negative")
        }
    },
    start_date: {
        type: Date,
        required: true,
        validate(value) {
            if (!validator.isDate(value)) throw new Error("Please enter a valid date.")
        }
    },
    end_date: {
        type: Date,
        required: false
    },
    company: {
        type: String,
        required: false
    },
    income_owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Income = mongoose.model('Income', incomeSchema)

/**
 * Income module
 * @module Income
 */
module.exports = Income