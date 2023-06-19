const dbPool = require('../db/db.js')

const Create = (guid, email, name, password) => {
    const sql = `INSERT INTO user (guid,email,name,password) VALUES (?,?,?,?)`
    const query = dbPool.execute(sql, [guid, email, name, password])
    return query
}

const SelectByGuid = (guid) => {
    const sql = `SELECT id,guid,email,name,password FROM user WHERE guid = ?`
    const query = dbPool.execute(sql, [guid])
    return query
}

const SelectById = (id) => {
    const sql = `SELECT id,guid,email,name FROM user WHERE id = ?`
    const query = dbPool.execute(sql, [id])
    return query
}


module.exports = {
    Create,
    SelectByGuid,
    SelectById
}
