/**
 * express module
 * @const
 */
const express = require('express')

/**
 * Currency module
 * @const
 */
const Currency = require('../models/currency')

/**
 * auth module
 * @const
 */
const auth = require('../authentication/auth')

/**
 * date-and-time module
 * @const
 */
const date = require('date-and-time')

/**
 * request module
 * @const
 */
const request = require('request')

/**
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 */
const router = new express.Router()

/**
 * Route to get all the stored currencies of a user.
 * @name get/api/currencies
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
router.get('/api/currencies', auth, async (req, res) => {
    
    try {
        await req.user.populate({
            path: 'currencies',
        })
        res.send(req.user.currencies)
    } catch (e) {
        res.status(500).send()
    }

})

//GET endpoint to get a specific currency of User, this would be done via fetch in frontend


//GET endpoint for historic monthly forex/crypto data, used for charts, done via fetch in frontend


/**
 * Route to get a specific currency for a user by ID.
 * @name get/api/currencies/:id
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
router.get('/api/currencies/:id', auth, async (req, res) => {
    const currency = await Currency.findOne({ _id: req.params.id, currency_owner: req.user._id })
    try {
        if (!currency) throw new Error("Currency doesn't exist.")
        res.send(currency)
    } catch (e) {
        res.status(500).send()
    }
})

/**
 * Route to create a new currency for a user.
 * @name post/api/currencies
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
router.post('/api/currencies', auth, async (req, res) => {
    try {
        console.log("trying")
        const currency = new Currency({
            ...req.body,
            currency_owner: req.user._id
        })
        await currency.save()
        res.send(currency)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

/**
 * Route to delete a currency for a user.
 * @name delete/api/currencies/:id
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
router.delete('/api/currencies/:id', auth, async (req, res) => {
    try {
        const currency = await Currency.findOneAndDelete({ _id: req.params.id, currency_owner: req.user._id })
        if (!currency) throw new Error("Provided currency doesn't exist.")
        res.send(currency)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router