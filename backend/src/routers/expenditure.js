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
        await req.user.populate('expenditures')
        res.send(req.user.expenditures)
    } catch (e) {
        console.log(e)
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
        const expenditure = await Expenditure.findOne({ _id: req.params.id, expenditure_owner: req.user._id })
        if (!expenditure) re.status(404).send()

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
    try {
        const expenditure = new Expenditure({
            ...req.body,
            expenditure_owner: req.user._id
        })
        await expenditure.save()
        res.send(expenditure)
    } catch (e) {
        res.status(500).send()
    }
})

/**
 * Route to delete an expenditure.
 * @name delete/api/expenditure/:id
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
router.delete('/api/expenditure/:id', auth, async (req, res) => {
    try {
        const expenditure = await Expenditure.findOneAndDelete({ _id: req.params.id, expenditure_owner: req.user._id })
        if (!expenditure) res.status(404).send()

        res.send(expenditure)

    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
