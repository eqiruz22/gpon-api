const dbPool = require('../db/db.js')

const Select = (search, offset, limit) => {
    const sql = `SELECT * FROM olt WHERE olt_id LIKE ? LIMIT ? OFFSET ?`
    const query = dbPool.execute(sql, [`%${search}%`, limit, offset])
    return query
}

const SelectId = (id) => {
    const sql = `SELECT * FROM olt WHERE olt_id = ?`
    const query = dbPool.execute(sql, [id])
    return query
}

const CreateOlt = (olt, host, kapasitas, status, ip, site, desc) => {
    const sql = `INSERT INTO olt (olt_id,hostname,kapasitas,status,ip_management,site,deskripsi) VALUES (?,?,?,?,?,?,?)`
    const query = dbPool.execute(sql, [olt, host, kapasitas, status, ip, site, desc])
    return query
}

const UpdateOlt = (host, kapasitas, status, ip, site, desc, olt) => {
    const sql = `UPDATE olt SET hostname=?,kapasitas=?,status=?,ip_management=?,site=?,deskripsi=? WHERE olt_id=?`
    const query = dbPool.execute(sql, [host, kapasitas, status, ip, site, desc, olt])
    return query
}

const DeleteOlt = (olt) => {
    const sql = `DELETE FROM olt WHERE olt_id = ?`
    const query = dbPool.execute(sql, [olt])
    return query
}

const CountOlt = (search) => {
    const sql = `SELECT COUNT(olt_id) as olt FROM olt WHERE olt_id LIKE ?`
    const query = dbPool.execute(sql, [`%${search}%`])
    return query
}

const SelectCapacity = (olt) => {
    const sql = `SELECT kapasitas FROM olt WHERE olt_id = ?`
    const query = dbPool.execute(sql, [olt])
    return query
}

module.exports = {
    Select,
    SelectId,
    CreateOlt,
    UpdateOlt,
    DeleteOlt,
    CountOlt,
    SelectCapacity
}