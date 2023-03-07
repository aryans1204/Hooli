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
 * @typedef {Object} Expenditure
 * @property {UserAccountObject} expenditure_owner
 */
const expenditureSchema = new mongoose.Schema({
    expenditure_owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'UserAccount'
    }
})

expenditureSchema.virtual('transaction', {
    req: 'Transaction',
    localField: '_id',
    foreignField: 'transaction_component'
})

const Expenditure = mongoose.model('Expenditure', expenditureSchema)
module.exports = Expenditure
