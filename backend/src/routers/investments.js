/**
 * mongoose module
 * @const
 */
const mongoose = require('mongoose')

/**
 * express module
 * @const
 */
const express = require('express')

/**
 * Investment module
 * @const
 */
const Investment = require('../models/investments')

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
 * request module
 * @const
 */
const needle = require('needle')
const request = require('request')

/**
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 */
const router = new express.Router()

const fetchData = async (params, type) => {
    const data = []
    if (type === "equities") {
        ind = 0
        for (param of params) {
            var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${params[ind].equity_ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
            const temp = await needle('get', url)
            data[ind] = temp.body
            ind = ind + 1 
        }
    }
    else {
        ind = 0
        for (param of params) {
            var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${params[ind].derivative_ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
            const temp = await needle('get', url)
            data[ind] = temp.body
            ind = ind + 1 
        }
    }
    
    return data
}
/**
 * Route to create a new portfolio.
 * @name post/api/investments
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {BadRequestError}
 */
router.post('/api/investments', auth, async (req, res) => {
    const portfolio = new Investment({
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

/**
 * Route to get a portfolio by ID.
 * @name get/api/investments/:id
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {NotFoundError} Portfolio cannot be found.
 * @throws {InternalServerError}
 */
router.get('/api/investments/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const portfolio = await Investment.findOne({ _id, portfolio_owner: req.user._id })

        if (!portfolio) {
            return res.status(404).send()
        }
        let now = new Date()
        now.setDate(now.getDate()-1)
        let getYear = now.toLocaleDateString("default", {year: "numeric"})
        let getMonth = now.toLocaleDateString("default", {month: "2-digit"})
        let getDay = now.toLocaleDateString("default", {day: "2-digit"})
        now = getYear + "-" + getMonth + "-" + getDay
        const data = await fetchData(portfolio.equities, "equities")
        console.log(data)
        portfolio.equities.forEach((equity, index) => {
            
            console.log(data[index]["Time Series (Daily)"]["2022-12-07"])
            const current_price = parseInt(data[index]["Time Series (Daily)"][now]['1. open'])
            console.log(`current price ${current_price}`)
            const pnl = (((current_price - equity.equity_buy_price) / equity.equity_buy_price ) * 100).toString() + "%"
            portfolio.equities[index].equity_current_price = current_price
            portfolio.equities[index].equity_pnl = pnl   
            console.log(portfolio.equities) 
        })
        
        console.log(portfolio)
        const optionsData = await fetchData(portfolio.options, "options")
        console.log(data)
        portfolio.options.forEach((option, index) => {
            const current_price = parseInt(optionsData[index]["Time Series (Daily)"][now]['1. open'])
            portfolio.options[index].derivative_current_price = current_price
            
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
        console.log("saved and sent")
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

/**
 * Route to update an existing equity in a portfolio by ID.
 * @name patch/api/investments/equities:id
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {NotFoundError} Portfolio cannot be found.
 * @throws {BadRequestError}
 */
router.patch('/api/investments/equities:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)

    try {
        const portfolio = await Investment.findOne({ _id: req.params.id, portfolio_owner: req.user._id})

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

/**
 * Route to update an existing option in a portfolio by ID.
 * @name patch/api/investments/options/:id
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {NotFoundError} Portfolio cannot be found.
 * @throws {BadRequestError}
 */
router.patch('/api/investments/options/:id', auth, async (req, res) => {
    try {
        const portfolio = await Investment.findOne({ _id: req.users._id, portfolio_owner: req.user._id })
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

/**
 * Route to update an existing commodity in a portfolio by ID. 
 * @name patch/api/investments/commodities/:id
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {NotFoundError} Portfolio cannot be found.
 * @throws {BadRequestError}
 */
router.patch('/api/investments/commodities/:id', auth, async (req, res) => {
    try {
        const portfolio = await Investment.findOne({ _id: req.users._id, portfolio_owner: req.user._id })
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
          }, async (err, res, data) => {
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

/**
 * Route to delete an entire portfolio.
 * @name delete/api/investments/:id
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {NotFoundError} Portfolio cannot be found.
 * @throws {InternalServerError}
 */
router.delete('/api/investments/:id', auth, async (req, res) => {
    try {
        const portfolio = await Investment.findOneAndDelete({ _id: req.params.id, portfolio_owner: req.user._id })

        if (!portfolio) {
            res.status(404).send()
        }

        res.send(portfolio)
    } catch (e) {
        res.status(500).send()
    }
})

/**
 * Route to delete an equity in a portfolio.
 * @name delete/api/investments/equities/:id
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
router.delete('/api/investments/equities/:id', auth, async (req, res) => {
    try {
        const portfolio = await Investment.findOne({ _id: req.params._id, portfolio_owner: req.user._id })
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

/**
 * Route to delete an option in a portfolio.
 * @name delete/api/investments/options/:id
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
router.delete('/api/investments/options/:id', auth, async (req, res) => {
    try {
        const portfolio = await Investment.findOne({ _id: req.params._id, portfolio_owner: req.user._id })
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

/**
 * Route to delete a commodity in a portfolio.
 * @name delete/api/investments/commodities/:id
 * @async
 * @param {String} path
 * @param {Object} auth
 * @param {callback} middleware
 * @throws {InternalServerError}
 */
router.delete('/api/investments/commodities/:id', auth, async (req, res) => {
    try {
        const portfolio = await Investment.findOne({ _id: req.params._id, portfolio_owner: req.user._id })
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