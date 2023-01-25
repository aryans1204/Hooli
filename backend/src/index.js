const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const currencyRouter = require('./routers/currency')
const portfolioRouter = require('./routers/portfolio')
const incomeRouter = require('./routers/income')
const expenditureRouter = require('./routers/expenditure')


const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(currencyRouter)
app.use(incomeRouter)
app.use(portfolioRouter)
app.use(expenditureRouter)

app.listen(port, () => {
    console.log("server is up an running on port " + port)
})