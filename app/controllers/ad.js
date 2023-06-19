const { ActiveDirectory } = require('node-ad-tools')
const jwt = require('jsonwebtoken')
const Users = require('../models/user.js')
const bcrypt = require('bcrypt')
const createToken = (guid) => {
    return jwt.sign({ guid }, process.env.ACCESS_TOKEN, { expiresIn: '1d' })
}

const loginAd = async (req, res) => {
    const config = {
        url: process.env.HOST,
        base: process.env.BASE
    }

    const AD = new ActiveDirectory(config)
    const user = req.body.username
    const pass = req.body.password
    if (!req.body.username) {
        return res.status(400).json({
            message: 'Username is required!'
        })
    }
    if (!req.body.password) {
        return res.status(400).json({
            message: 'Password is required!'
        })
    }
    try {
        const response = await AD.loginUser(user + '@zumstar.co.id', pass)
        if (!response.success) {
            console.log(response.message)
            return res.status(400).json({
                message: response.message,
            })
        }
        const obj = ActiveDirectory.createUserObj(response.entry)
        const [selectUser] = await Users.SelectByGuid(obj['guid'])
        const token = createToken(obj['guid'])
        if (selectUser.length > 0) {
            const withoutPass = selectUser.map(item => {
                const { password, ...withoutPass } = item
                return withoutPass
            })
            return res.status(200).json({
                message: 'Login success',
                ...withoutPass[0],
                token
            })
        } else {
            const hash = await bcrypt.hash(pass, 10)
            const created = await Users.Create(obj['guid'], obj['mail'], obj['name'], hash)
            const [selectId] = await Users.SelectById(created[0]['insertId'])
            return res.status(200).json({
                message: 'Login success',
                ...selectId[0],
                token
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: error
        })
    }
}

module.exports = loginAd