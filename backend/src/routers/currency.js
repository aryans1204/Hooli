const express = require('express')
const Currency = require('../models/currency')
const auth = require('../authentication/auth')
const date = require('date-and-time')
const request = require('request')

const router = new express.Router()

//GET endpoint to get all the stored currencies of User
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

//GET endpoint for getting a specific currency for the User by ID
router.get('/api/currencies/:id', auth, async (req, res) => {
    const currency = await Currency.findOne({ _id: req.params.id, currency_owner: req.user._id })
    try {
        if (!currency) throw new Error("Currency doesn't exist.")
        res.send(currency)
    } catch (e) {
        res.status(500).send()
    }
})

//POST endpoint to create a new currency for a user
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

//DELETE endpoint to delete a currency for the user
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