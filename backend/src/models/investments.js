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
 * @typedef {Object} Investment
 * @property {Object} equities
 * @property {Object} options
 * @property {Object} commodities
 * @property {UserObject} portfolio_owner
 * @property {} timestamps
 */
const investmentSchema = new mongoose.Schema({
    /**
     * @memberof Investment
     * @property {String} equity_ticker
     * @property {String} equity_pnl
     * @property {Number} equity_buy_price
     * @property {Number} equity_current_price
     */
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
    /**
     * @memberof Investment
     * @property {String} derivative_ticker
     * @property {String} option_type
     * @property {Number} strike_price
     * @property {Date} expiration_date
     * @property {Number} derivative_current_price
     */
    options: [{
        derivative_ticker: {
            type: String,
            required: false,
            maxlength: 4
        },
        option_type: {
            type: String,
            required: false,
        },
        strike_price: {
            type: Number, 
            required: false
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