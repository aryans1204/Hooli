/**
 * express module
 * @const
 */
const express = require('express')

/**
 * Income module
 * @const
 */
const Income = require('../models/income')

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
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 */
const router = new express.Router()

/**
 * Route to get all employments.
 * @name get/api/income
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
router.get('/api/income', auth, async (req, res) => {
    try {
        await req.user.populate('income')
        res.send(req.user.income)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

/**
 * Route to get a specific income record.
 * @name get/api/income/:id
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {NotFoundError} Income record cannot be found.
 * @throws {InternalServerError}
 */
router.get('/api/income/:id', auth, async (req, res) => {
    try {
        const income = await Income.findOne({ _id: req.params.id, income_owner: req.user._id })
        if (!income) re.status(404).send()

        res.send(income)
    } catch (e) {
        res.status(500).send()
    }
})

/**
 * Route to create a new income record.
 * @name post/api/income
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
router.post('/api/income', auth, async (req, res) => {
    try {
        const income = new Income({
            ...req.body,
            income_owner: req.user._id
        })
        await income.save()
        res.send(income)
    } catch (e) {
        res.status(500).send()
    }
})

/**
 * Route to delete an income record.
 * @name delete/api/income/:id
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
router.delete('/api/income/:id', auth, async (req, res) => {
    try {
        const income = await Income.findOneAndDelete({ _id: req.params.id, income_owner: req.user._id })
        if (!income) res.status(404).send()

        res.send(income)

    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router