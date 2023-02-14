const jwt = require('jsonwebtoken')
const UserAccount = require('../models/userAccount')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await UserAccount.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!userAccount) {
            throw new Error()
        }

        req.token = token
        req.userAccount = userAccount
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth