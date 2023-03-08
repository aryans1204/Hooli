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
 * expenditureSchema schema
 * @class Expenditure
 * @property {UserObject} expenditure_owner
 */
const expenditureSchema = new mongoose.Schema({
    expenditure_owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

/**
 * Transaction virtual
 */
expenditureSchema.virtual('transaction', {
    req: 'Transaction',
    localField: '_id',
    foreignField: 'transaction_component'
})

const Expenditure = mongoose.model('Expenditure', expenditureSchema)

/**
 * Expenditure module
 * @module Expenditure
 */
module.exports = Expenditure
