/**
 * express module
 * @const
 */
const express = require('express')

/**
 * Expenditure module
 * @const
 */
const Expenditure = require('../models/expenditure')

/**
 * Transaction module
 * @const
 */
const Transaction = require('../models/transaction')

/**
 * auth module
 * @const
 */
const auth = require('../authentication/auth')

/**
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 */
const router = new express.Router()

/**
 * Route to get all expenditures.
 * @name get/api/expenditure
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
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

/**
 * Route to get a particular expenditure by ID.
 * @name get/api/expenditure/:id
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
router.get('/api/expenditure/:id', auth, async (req, res) => {
    try {
        const expenditure = await Expenditure.findOne({ _id: req.params.id, expenditue_owner: req.user._id })
        if (!expenditure) throw new Error("This expenditure does not exist.")

        res.send(expenditure)
    } catch (e) {
        res.status(500).send()
    }
})

/**
 * Route to create a new expenditure.
 * @name post/api/expenditure
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
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
