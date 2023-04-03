/**
 * express module
 * @const
 */
const express = require('express')

/**
 * User module
 * @const
 */
const User = require('../models/user')

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
 * @name get/api/users
 * @async
 * @param {String} path
 * @param {callback} middleware
 * @throws {NotFoundError} User cannot be found.
 */
router.get('/api/users', async (req, res) => {
    try{
        const users = await User.find()
        res.send(users)
    } catch (e) {
        res.status(404).send()
    }
    
})

/**
 * Route to create a new user.
 * @name post/api/users
 * @async
 * @param {String} path
 * @param {callback} middleware
 * @throws {}
 */
router.post('/api/users', async (req, res) => {
    const user = new User(req.body)
    
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.send(e)
    }
})

/**
 * Route to sign in a user.
 * @name post/api/users/login
 * @async
 * @param {String} path
 * @param {callback} middleware
 * @throws {BadRequestError} When the email or password is incorrect.
 */
router.post('/api/users/login', async (req, res) => {
    try {
        console.log(req.body.email)
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send({error: "The email or password is incorrect. Please try again."})
    }
})

/**
 * Route to log out a user.
 * @name post/api/users/logout
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
router.post('/api/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        const user = req.user
        res.send({user})
    } catch (e) {
        res.status(500).send()
    }
})

/**
 * Route to log out a user from all devices.
 * @name post/api/users/logoutAll
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
router.post('/api/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

/**
 * Route to get a user profile.
 * @name get/api/users/me
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 */
router.get('/api/users/me', auth, async (req, res) => {
    res.send(req.user)
})

/**
 * Route to update a user profile.
 * @name patch/api/users/me
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {BadRequestError} When update is invalid.
 */
router.patch('/api/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

/**
 * Route to permanently remove a user.
 * @name delete/api/users/me
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
router.delete('/api/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

module.exports = router



