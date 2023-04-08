const express = require('express')
const cors = require('cors')
require('dotenv').config()
require('./db/mongoose')
const userRouter = require('./routers/user')
const currencyRouter = require('./routers/currency')
const investmentRouter = require('./routers/investments')
const incomeRouter = require('./routers/income')
const expenditureRouter = require('./routers/expenditure')


const app = express()
const port = process.env.PORT
app.use(cors())

app.use(express.json())
app.use(userRouter)
app.use(currencyRouter)
app.use(incomeRouter)
app.use(investmentRouter)
app.use(expenditureRouter)

app.listen(port, () => {
    console.log("Server is up and running on port " + port)
})

module.exports = app