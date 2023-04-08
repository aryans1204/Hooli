/**
 * mongoose module
 * @const
 */
const mongoose = require('mongoose')

/**
 * Connects to the MongoDB database. 
 */
const db = mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser:true
})