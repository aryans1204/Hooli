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
 * bcrypt module
 * @const
 */
const bcrypt = require('bcrypt')

/**
 * jsonwebtoken module
 * @const
 */
const jwt = require('jsonwebtoken')

/**
 * Currency module
 * @const
 */
const Currency = require('./currency')

/**
 * Investment module
 * @const
 */
const Investment = require('./investments')

/**
 * Expenditures module
 * @const
 */
const Expenditures = require('./expenditure')

/**
 * Income module
 * @const
 */
const Income = require('./income')

/**
 * @typedef {Object} UserAccount
 * @property {String} name
 * @property {String} email
 * @property {String} password
 * @property {Object} tokens
 * @property {} timestamps
 */
const userAccountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid.")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
    },
    /**
     * @memberof UserAccount
     * @property {String} token
     */
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps:true
})

//portfolio virtual
userAccountSchema.virtual('investments', {
    ref: 'Investment',
    localField: '_id',
    foreignField: 'portfolio_owner'
})

//currencies virtual
userAccountSchema.virtual('currencies', {
    ref: 'Currency',
    localField: '_id',
    foreignField: 'currency_owner'
})

//expenditure virtual
userAccountSchema.virtual('expenditures', {
    ref: 'Expenditures',
    localField: '_id',
    foreignField: 'expenditure_owner'
})

//income virtual
userAccountSchema.virtual('income', {
    ref: 'Income',
    localField: '_id',
    foreignField: 'income_owner'
})

//toJSON method for User
userAccountSchema.methods.toJSON = function () {
    const userAccount = this
    const userAccountObject = userAccount.toObject()

    delete userAccountObject.password
    //delete userObject.tokens

    return userAccountObject
}

//generating JWT auth tokens for a user
userAccountSchema.methods.generateAuthToken = async function() {
    const userAccount = this
    const token = jwt.sign({ _id: userAccount._id.toString() }, process.env.JWT_SECRET)

    userAccount.tokens = userAccount.tokens.concat({ token })
    await userAccount.save()

    return token
}

//find user by email credentials
userAccountSchema.statics.findByCredentials = async (email, password) => {
    const userAccount = await UserAccount.findOne({ email: email })
    if (!userAccount) {
        throw new Error('Unable to login.')
    }
    const isMatch = await bcrypt.compare(password, userAccount.password)

    if (!isMatch) {
        throw new Error({error: "Either the password or email is incorrect."})
    }

    return userAccount
}

//password encryption after changing password
userAccountSchema.pre('save', async function (next) {
    const userAccount = this

    if (userAccount.isModified('password')) {
        userAccount.password = await bcrypt.hash(userAccount.password, 8)
    }

    next()
})

//delete user portfolios, currencies, expenditures and income
userAccountSchema.pre('remove', async function (next) {
    const userAccount = this
    await Income.deleteMany({ income_owner: userAccount._id })
    await Expenditures.deleteMany({ expenditure_owner: userAccount._id })
    await Investment.deleteMany({ portfolio_owner: userAccount._id })
    await Currency.deleteMany({ currency_owner: userAccount._id })
    next()
})

const UserAccount = mongoose.model('UserAccount', userAccountSchema)

module.exports = UserAccount