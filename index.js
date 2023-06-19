const express = require('express')
const cors = require('cors')
const endPoint = require('./app/route.js')
const dotenv = require('dotenv')
const app = express()
dotenv.config()
app.use(cors())
app.use(express.json())
const port = 4000
app.use('/api', endPoint)

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})

