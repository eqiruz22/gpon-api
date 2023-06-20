const express = require('express')
const cors = require('cors')
const endPoint = require('./app/route.js')
const dotenv = require('dotenv')
const https = require('https')
const fs = require('fs')
const app = express()
dotenv.config()
app.use(cors())
app.use(express.json())
const port = 4000
const key = fs.readFileSync('./key_back_gpon.key', 'utf-8')
const certificate = fs.readFileSync('./back_gpon.crt', 'utf-8')
const credentials = { key: key, cert: certificate }
app.use('/api', endPoint)
const httpsServer = https.createServer(credentials, app)
httpsServer.listen(port, () => {
    console.log(`server running over https on port ${port}`)
})

