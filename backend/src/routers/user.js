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



