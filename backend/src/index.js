const express = require('express')
require('dotenv').config()
require('./db/mongoose')
const userAccountRouter = require('./routers/userAccount')
const currencyRouter = require('./routers/currency')
const investmentRouter = require('./routers/investments')
const incomeRouter = require('./routers/income')
//const expenditureRouter = require('./routers/expenditure')


const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userAccountRouter)
app.use(currencyRouter)
app.use(incomeRouter)
app.use(investmentRouter)
//app.use(expenditureRouter)

app.listen(port, () => {
    console.log("Server is up and running on port " + port)
})

module.exports = app