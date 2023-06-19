const mysql = require('mysql2')

const dbPool = mysql.createPool({
    host: '127.0.0.1',
    user: 'ist',
    password: 'user.100',
    database: 'data_gpon',
    multipleStatements: true
})

if (dbPool) console.log('connected to database')

module.exports = dbPool.promise()