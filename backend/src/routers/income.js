const express = require('express')
const Income = require('../models/income')
const auth = require('../authentication/auth')
const date = require('date-and-time')

const router = new express.Router()

//GET endpoint for all employments
router.get('/api/income', auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'income',
        }).execPopulate()
        res.send(req.user.income)
    } catch (e) {
        res.status(500).send()
    }
})

//GET endpoint for a specific income or employment
router.get('api/income/:id', auth, async (req, res) => {
    try {
        const income = await Income.findOne({ _id: req.params.id, income_owner: req.user._id })
        if (!income) re.status(404).send()

        res.send(income)
    } catch (e) {
        res.status(500).send()
    }
})

//POST endpoint to post a new income
router.post('api/income', auth, async (req, res) => {
    try {
        const income = new Income({
            ...req.body,
            income_owner: req.user._id
        })
        await income.save()
        res.send(income)
    } catch (e) {
        re.status(500).send()
    }
})

//DELET endpoint for deleting a period of employment
router.delete('api/income/:id', auth, async (req, res) => {
    try {
        const income = await Income.findOneAndDelete({ _id: req.params.id, income_owner: req.user._id })
        if (!income) res.status(404).send()

        res.send(income)

    } catch (e) {
        re.status(500).send()
    }
})

module.exports = router