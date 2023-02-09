const express = require('express')
const Expenditure = require('../models/expenditure')
const Transaction = require('../models/transaction')
const auth = require('../authentication/auth')

const router = new express.Router()

//GET endpoint to get all expenditures
router.get('/api/expenditure', auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'expenditures',
        })
        res.send(req.user.expenditures)
    } catch (e) {
        res.status(500).send()
    } 
})

//GET endpoint for a particular Expenditure by ID
router.get('/api/expenditure/:id', auth, async (req, res) => {
    try {
        const expenditure = await Expenditure.findOne({ _id: req.params.id, expenditue_owner: req.user._id })
        if (!expenditure) throw new Error("This expenditure does not exist")

        res.send(expenditure)
    } catch (e) {
        res.status(500).send()
    }
})

//POST endpoint for creating a new expenditure
router.post('/api/expenditure', auth, async (req, res) => {
    const expenditure = new Expenditure({
        expenditure_owner: req.user._id
    })

    try {
        await expenditure.save()
        res.send(expenditure)
    } catch (e) {
        res.status(500).send()
    }
})
