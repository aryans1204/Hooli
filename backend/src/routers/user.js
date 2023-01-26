const express = require('express')
const mongoose = require('mongoose')
const jsonwebtoken = requrie('jsonwebtoken')
const User = require('../models/user')
const auth = require('../authentication/auth')


const router = new express.Router()

//POST endpoint, create new user
router.post('/api/users', async (req, res) => {
    const user = new User(req.body)
    
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

//POST endpoint, sign in user
router.post('/api/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await User.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})

//POST endpoint, log out user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//POST endpoint to logout user from ALL devices
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//GET endpoint, get User profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

//PATCH endpoint, update my profile
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//DELETE endpoint, permanently remove a user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router



