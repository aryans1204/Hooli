const mongoose = require('mongoose')
const validator = require('validator')
const investmentSchema = new mongoose.Schema({
    equities: [{
        equity_ticker: {
            type: String,
            required: true,
            maxlength: 4
        },
        equity_pnl: {
            type: String,  //to be represented as a percentage like 89% or -12%
            required: true
        },
        equity_buy_price: {
            type: Number,
            required: true
        },
        equity_current_price: {
            type: Number,
            required: false
        } 
    }],
    options: [{
        derivative_ticker: {
            type: String,
            required: true,
            maxlength: 4
        },
        option_type: {
            type: String,
            required: true,
            validate(value) {
                if (value != 'call' || value != 'put') throw new Error('Options contract can only be put or call.')
            }
        },
        strike_price: {
            type: Number,  //to be represented as a percentage like 89% or -12%
            required: true
        },
        expiration_date: {
            type: Date,
            required: true,
            validate(value) {
                if (!validator.isDate(value)) throw new Error("Expiration Date must be a Date.")
            }
        },
        derivative_current_price: {
            type: Number,
            required: false
        }  
    }],
    commodities: [{
        commodity_type: {
            type: String,
            required: false,
            validate(value) {
                const accepted_values = ['crude_oil', 'natural_gas', 'copper', 'aluminium', 'wheat', 'coffee']
                if (!accepted_values.contains(value)) throw new Error("Commodity type not supported.")
            }
        },
        commodity_price: {
            type: Number,
            required: false
        }
    }],
    portfolio_owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Investment = mongoose.model('Investment', investmentSchema)

module.exports = Investment