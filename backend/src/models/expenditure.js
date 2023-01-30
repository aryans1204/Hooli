const mongoose = require('mongoose')
const validator = require('validator')

const expenditureSchema = new mongoose.Schema({
    expenditure_owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

expenditureSchema.virtual('transaction', {
    req: 'Transaction',
    localField: '_id',
    foreignField: 'transaction_component'
})

const Expenditure = mongoose.model('Expenditure', expenditureSchema)
module.exports = Expenditure
