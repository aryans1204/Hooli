/**
 * express module
 * @const
 */
const express = require('express')

/**
 * mongoose module
 * @const
 */
const mongoose = require('mongoose')

/**
 * jsonwebtoken module
 * @const
 */
const jsonwebtoken = require('jsonwebtoken')

/**
 * UserAccount module
 * @const
 */
const UserAccount = require('../models/userAccount')

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
 * Route to get a user.
 * @name get/api/userAccounts
 * @async
 * @param {String} path
 * @param {callback} middleware
 * @throws {NotFoundError} User cannot be found.
 */
router.get('/api/userAccounts', async (req, res) => {
    try{
        const userAccounts = await UserAccount.find()
        res.send(userAccounts)
    } catch (e) {
        res.status(404).send()
    }
    
})

/**
 * Route to create a new user.
 * @name post/api/userAccounts
 * @async
 * @param {String} path
 * @param {callback} middleware
 * @throws {}
 */
router.post('/api/userAccounts', async (req, res) => {
    const userAccount = new UserAccount(req.body)
    
    try {
        await userAccount.save()
        const token = await userAccount.generateAuthToken()
        res.status(201).send({ userAccount, token })
    } catch (e) {
        res.send(e)
        //res.status(400).send(e)
    }
})

/**
 * Route to sign in a user.
 * @name post/api/userAccounts/login
 * @async
 * @param {String} path
 * @param {callback} middleware
 * @throws {BadRequestError} When the email or password is incorrect.
 */
router.post('/api/userAccounts/login', async (req, res) => {
    try {
        console.log(req.body.email)
        const userAccount = await UserAccount.findByCredentials(req.body.email, req.body.password)
        const token = await userAccount.generateAuthToken()
        res.send({userAccount, token})
    } catch (e) {
        res.status(400).send({error: "The email or password is incorrect. Please try again."})
    }
})

/**
 * Route to log out a user.
 * @name post/api/userAccounts/logout
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
router.post('/api/userAccounts/logout', auth, async (req, res) => {
    try {
        req.userAccount.tokens = req.userAccount.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.userAccount.save()
        const userAccount = req.userAccount
        res.send({userAccount})
    } catch (e) {
        res.status(500).send()
    }
})

/**
 * Route to log out a user from all devices.
 * @name post/api/userAccounts/logoutAll
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
router.post('/api/userAccounts/logoutAll', auth, async (req, res) => {
    try {
        req.userAccount.tokens = []
        await req.userAccount.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

/**
 * Route to get a user profile.
 * @name get/api/userAccounts/me
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 */
router.get('/api/userAccounts/me', auth, async (req, res) => {
    res.send(req.userAccount)
})

/**
 * Route to update a user profile.
 * @name patch/api/userAccounts/me
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {BadRequestError} When update is invalid.
 */
router.patch('/api/userAccounts/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" })
    }

    try {
        updates.forEach((update) => req.userAccount[update] = req.body[update])
        await req.userAccount.save()
        res.send(req.userAccount)
    } catch (e) {
        res.status(400).send(e)
    }
})

/**
 * Route to permanently remove a user.
 * @name delete/api/userAccounts/me
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
router.delete('/api/userAccounts/me', auth, async (req, res) => {
    try {
        await req.userAccount.remove()
        res.send(req.userAccount)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

module.exports = router



