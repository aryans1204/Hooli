const mongoose = require('mongoose')

const db = mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser:true
})