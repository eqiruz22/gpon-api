const dbPool = require('../db/db.js')

const Select = (search, offset, limit) => {
    const sql = `SELECT * FROM ip_ont WHERE ip_address LIKE ? ORDER BY ip_address DESC LIMIT ? OFFSET ?`
    const query = dbPool.execute(sql, [`%${search}%`, limit, offset])
    return query
}

const SelectId = (id) => {
    const sql = `SELECT * FROM ip_ont WHERE ip_address = ?`
    const query = dbPool.execute(sql, [id])
    return query
}

const SelectIdle = () => {
    const sql = `SELECT * FROM ip_ont WHERE status = 'idle'`
    const query = dbPool.execute(sql)
    return query
}

const CreateOnt = (ip, status, bsms) => {
    const sql = `INSERT INTO ip_ont (ip_address,status,bsms_id) VALUES (?,?,?)`
    const query = dbPool.execute(sql, [ip, status, bsms])
    return query
}

const UpdateOnt = (ip, status, bsms, id) => {
    const sql = `UPDATE ip_ont SET ip_address = ?,status = ?,bsms_id = ? WHERE ip_address = ?`
    const query = dbPool.execute(sql, [ip, status, bsms, id])
    return query
}

const UpdateActiveOnt = (id) => {
    const sql = `UPDATE ip_ont SET status = 'active' WHERE ip_address = ?`
    const query = dbPool.execute(sql, [id])
    return query
}

const UpdateIdleOnt = (id) => {
    const sql = `UPDATE ip_ont SET status = 'idle' WHERE ip_address = ?`
    const query = dbPool.execute(sql, [id])
    return query
}

const DeleteOnt = (id) => {
    const sql = `DELETE FROM ip_ont WHERE ip_address = ?`
    const query = dbPool.execute(sql, [id])
    return query
}

const CountOnt = (search) => {
    const sql = `SELECT COUNT(ip_address) as ip_address FROM ip_ont WHERE ip_address LIKE ?`
    const query = dbPool.execute(sql, [`%${search}%`])
    return query
}

const List = () => {
    const sql = `SELECT ip_address FROM ip_ont WHERE status = 'idle'`
    const query = dbPool.execute(sql)
    return query
}

module.exports = {
    Select,
    SelectId,
    SelectIdle,
    CreateOnt,
    UpdateOnt,
    UpdateActiveOnt,
    UpdateIdleOnt,
    DeleteOnt,
    CountOnt,
    List
}