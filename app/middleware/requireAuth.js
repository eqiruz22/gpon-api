const jwt = require('jsonwebtoken')
const Users = require('../models/user.js')
const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(403).json({ message: 'Authorization token is required' })
    }

    const token = authorization.split(' ')[1]

    try {
        const { guid } = jwt.verify(token, process.env.ACCESS_TOKEN)
        req.user = await Users.SelectByGuid(guid)
        next()
    } catch (error) {
        return res.status(500).json({ message: 'Invalid token' })
    }
}

module.exports = requireAuth