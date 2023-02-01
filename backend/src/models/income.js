const mongoose = require('mongoose')
const validator = require('validator')

const incomeSchema = new mongoose.Schema({
    income_type: {
        type: String,
        required: true,
        validate(value) {
            const allowedSet = ["FT", "PT", "Passive", "Others"] 
            if (!allowedSet.includes(value)) throw new Error("Only supported income types are allowed")
        }
    },
    monthly_income: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) throw new Error("Income cannot be negative")
        }
    },
    start_date: {
        type: Date,
        required: true,
        validate(value) {
            if (!validator.isDate(value)) throw new Error("Please enter a valid date")
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
module.exports = Income