const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Currency = require('./currency')
const Investment = require('./investments')
const Expenditures = require('./expenditure')
const Income = require('./income')

const userSchema = new mongoose.Schema({
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
                throw new Error("email is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
    },
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
userSchema.virtual('investments', {
    ref: 'Investment',
    localField: '_id',
    foreignField: 'portfolio_owner'
})
//currencies virtual
userSchema.virtual('currencies', {
    ref: 'Currency',
    localField: '_id',
    foreignField: 'currency_owner'
})
//expenditure virtual
userSchema.virtual('expenditures', {
    ref: 'Expenditures',
    localField: '_id',
    foreignField: 'expenditure_owner'
})
//income virtual
userSchema.virtual('income', {
    ref: 'Income',
    localField: '_id',
    foreignField: 'income_owner'
})
//toJSON method for User
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    //delete userObject.tokens

    return userObject
}
//generating JWT auth tokens for a user
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}
//find user by email credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error({error: "The password hashing is fucked"})
    }

    return user
}
//password ecnryption after changing password
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})
//delete user portfolios, currencies, expenditures and income
userSchema.pre('remove', async function (next) {
    const user = this
    await Income.deleteMany({ income_owner: user._id })
    await Expenditures.deleteMany({ expenditure_owner: user._id })
    await Portfolio.deleteMany({ portfolio_owner: user._id })
    await Currency.deleteMany({ currency_owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User