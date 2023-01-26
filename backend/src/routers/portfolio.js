const mongoose = require('mongoose')
const express = require('express')
const Portfolio = require('../models/portfolio')
const auth = require('../authentication/auth')
const date = require('date-and-time')

const request = require('request')
const router = new express.Router()



//POST endpoint, create a new portfolio
router.post('/api/portfolio', auth, async (req, res) => {
    const portfolio = new Portfolio({
        ...req.body,
        portfolio_owner: req.user._id
    })

    try {
        await portfolio.save()
        res.status(201).send(portfolio)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

//GET endpoint to get a portfolio by ID
router.get('/api/portfolio/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const portfolio = await Portfolio.findOne({ _id, portfolio_owner: req.user._id })

        if (!portfolio) {
            return res.status(404).send()
        }

        res.send(portfolio)
    } catch (e) {
        res.status(500).send()
    }
})

//PATCH endpoint to update a portfolio by ID
router.patch('/api/portfolio/equities:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)

    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.id, portfolio_owner: req.user._id})

        if (!portfolio) {
            return res.status(404).send()
        }
        let now = new Date()
        date.format(now, "YYYY-MM-DD")
        var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${req.body.equity_ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`

        request.get({
            url: url,
            json: true,
            headers: {'User-Agent': 'request'}
          }, (err, res, data) => {
            if (err) {
              console.log('Error:', err);
            } else if (res.statusCode !== 200) {
              console.log('Status:', res.statusCode);
            } 
        })

        const current_price = data["Time Series (Daily)"][now].open
        const pnl = (((current_price - req.body.equity_buy_price) / req.body.equity_buy_price ) * 100).toString() + "%"
        portfolio.equities.concat({ 
            equity_ticker: req.body.equity_ticker, 
            equity_pnl: pnl, 
            equity_buy_price: req.body.equity_buy_price, 
            equity_current_price: current_price
        })
        await portfolio.save()
        res.send(portfolio)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/api/portfolio/:id', auth, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOneAndDelete({ _id: req.params.id, portfolio_owner: req.user._id })

        if (!portfolio) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router