const express = require('express')
const mongoose = require('mongoose')
const jsonwebtoken = requrie('jsonwebtoken')
const User = require('../models/user')
const auth = require('../authentication/auth')


const router = new express.Router()

//POST endpoint, body: {}


