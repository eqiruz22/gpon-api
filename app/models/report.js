const dbPool = require('../db/db.js')

const Select = (search, offset, limit) => {
    const sql = `SELECT report.iptv,report.internet,report.voice,report.other,costumer.pelanggan FROM report JOIN costumer WHERE report.costumer_id = costumer.id AND costumer.pelanggan LIKE ? LIMIT ? OFFSET ?`
    const query = dbPool.execute(sql, [`%${search}%`, limit, offset])
    return query
}

const Create = (costumer, iptv, inet, voice, other) => {
    const sql = `INSERT INTO report (costumer_id,iptv,internet,voice,other) VALUES (?,?,?,?,?)`
    const query = dbPool.execute(sql, [costumer, iptv, inet, voice, other])
    return query
}

const Count = (search) => {
    const sql = `SELECT COUNT(costumer.pelanggan) as pelanggan FROM report JOIN costumer where costumer.pelanggan LIKE ?`
    const query = dbPool.execute(sql, [`%${search}%`])
    return query
}

module.exports = {
    Select,
    Create,
    Count
}