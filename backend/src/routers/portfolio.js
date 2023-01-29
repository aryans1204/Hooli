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

//GET endpoint to get a portfolio by ID
router.get('/api/portfolio/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const portfolio = await Portfolio.findOne({ _id, portfolio_owner: req.user._id })

        if (!portfolio) {
            return res.status(404).send()
        }
        let now = new Date()
        date.format(now, "YYYY-MM-DD")
        portfolio.equities.forEach((equity) => {
            var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${equity.equity_ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`

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
                const current_price = data["Time Series (Daily)"][now].open
                const pnl = (((current_price - equity.equity_buy_price) / equity.equity_buy_price ) * 100).toString() + "%"
                equity.current_price = current_price
                equity.pnl = pnl       
            })
        })

        portfolio.options.forEach((option) => {
            var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${option.derivative_ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`

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
                const current_price = data["Time Series (Daily)"][now].open
                option.derivative_current_price = current_price
            })
        })    
        
        portfolio.commodities.forEach((commodity) => {
            keys_obj = {
                crude_oil: 'BRENT',
                natural_gas: 'NATURAL_GAS',
                copper: 'COPPER',
                aluminum: 'ALUMINUM',
                coffee: 'COFFEE',
                wheat: 'WHEAT'
            }
            
            var url = `https://www.alphavantage.co/query?function=${keys_obj[commodity.commodity_type]}&interval=monthly&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    
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
                const current_price = data.data[0].value
                commodity.commodity_price = current_price 
            })
        })
        await portfolio.save()
        res.send(portfolio)
    } catch (e) {
        res.status(500).send()
    }
})

//PATCH endpoint to update portfolio equities by portfolio ID
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
          }, async (err, res, data) => {
            if (err) {
              console.log('Error:', err);
            } else if (res.statusCode !== 200) {
              console.log('Status:', res.statusCode);
            }
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
        })   
        
    } catch (e) {
        res.status(400).send(e)
    }
})

//PATCH endpoint to patch existing options in a portfolio by ID
router.patch('/api/portfolio/options/:id', auth, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.users._id, portfolio_owner: req.user._id })
        if (!portfolio) {
            res.status(404).send()
        }

        let now = new Date()
        var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${req.body.derivative_ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`

        request.get({
            url: url,
            json: true,
            headers: {'User-Agent': 'request'}
          }, async (err, res, data) => {
            if (err) {
              console.log('Error:', err);
            } else if (res.statusCode !== 200) {
              console.log('Status:', res.statusCode);
            }
            const current_price = data["Time Series (Daily)"][now].open

            portfolio.options.concat({ 
                derivative_ticker: req.body.derivative_ticker, 
                option_type: req.body.option_type, 
                strike_price: req.body.strike_price, 
                expiration_date: req.body.expiration_date,
                derivative_current_price: current_price
            })
            await portfolio.save()
            res.send(portfolio) 
        })   
        
    } catch (e) {
        res.status(400).send(e)
    }

})

//PATCH endpoint to patch an existing commodites portfolio by ID
router.patch('/api/portfolio/commodities/:id', auth, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.users._id, portfolio_owner: req.user._id })
        if (!portfolio) {
            res.status(404).send()
        }
        keys_obj = {
            crude_oil: 'BRENT',
            natural_gas: 'NATURAL_GAS',
            copper: 'COPPER',
            aluminum: 'ALUMINUM',
            coffee: 'COFFEE',
            wheat: 'WHEAT'
        }
        let now = new Date()
        var url = `https://www.alphavantage.co/query?function=${keys_obj[req.body.commodity_type]}&interval=monthly&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`

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
            const current_price = data.data[0].value

            portfolio.commodities.concat({ 
                commodity_type: req.body.commodity_type,
                commodity_price: current_price
            })
            await portfolio.save()
            res.send(portfolio) 
        })   
        
    } catch (e) {
        res.status(400).send(e)
    }

})


//DELETE endpoint to delete an entire portfolio
router.delete('/api/portfolio/:id', auth, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOneAndDelete({ _id: req.params.id, portfolio_owner: req.user._id })

        if (!portfolio) {
            res.status(404).send()
        }

        res.send(portfolio)
    } catch (e) {
        res.status(500).send()
    }
})

//DELETE endpoint to delete an equity in a portfolio
router.delete('/api/portfolio/equities/:id', auth, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params._id, portfolio_owner: req.user._id })
        const eq = portfolio.equities
        const del_val = req.body.equity_ticker
        eq.forEach((equity) => {if (equity.equity_ticker == del_val) {
            eq.remove(eq.indexOf(equity))
        }})
        portfolio.equities = eq
        await portfolio.save()
    } catch (e) {
        res.status(500).send()
    }   
})

//DELETE endpoint to delete options in a portfolio
router.delete('/api/portfolio/options/:id', auth, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params._id, portfolio_owner: req.user._id })
        const opt = portfolio.options
        const del_val = req.body.derivative_ticker
        opt.forEach((option) => {if (option.derivative_ticker === del_val) {
            opt.remove(opt.indexOf(option))
        }})
        portfolio.options = opt
        await portfolio.save()
    } catch (e) {
        res.status(500).send()
    }
})

//DELET endpoint to delete commodity in a portfolio
router.delete('/api/portfolio/commodities/:id', auth, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params._id, portfolio_owner: req.user._id })
        const com = portfolio.commodities
        const del_val = req.body.commodity_type
        com.forEach((commodity) => {if (commodity.commodity_type === del_val) {
            com.remove(com.indexOf(commodity))
        }})
        portfolio.commodities = com
        await portfolio.save()
    } catch (e) {
        res.status(500).send()
    }
})
module.exports = router