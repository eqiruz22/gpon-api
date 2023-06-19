const dbPool = require('../db/db.js')

const Select = (search, offset, limit) => {
    const sql = `SELECT * FROM history WHERE name LIKE ? ORDER BY tanggal DESC LIMIT ? OFFSET ?`
    const query = dbPool.execute(sql, [`%${search}%`, limit, offset])
    return query
}

const Create = (name, action) => {
    const sql = `INSERT INTO history (name,action,tanggal) VALUES (?,?,NOW())`
    const query = dbPool.execute(sql, [name, action])
    return query
}

const Count = (search) => {
    const sql = `SELECT COUNT(name) as name FROM history WHERE name LIKE ?`
    const query = dbPool.execute(sql, [`%${search}%`])
    return query
}

module.exports = {
    Select,
    Create,
    Count
}