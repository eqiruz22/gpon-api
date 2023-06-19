const dbPool = require('../db/db.js')

const Select = (search, offset, limit) => {
    const sql = `SELECT * FROM dismantle WHERE bsms_id LIKE ? LIMIT ? OFFSET ?`
    const query = dbPool.execute(sql, [`%${search}%`, limit, offset])
    return query
}

const SelectDatatable = (offset, limit) => {
    const sql = `SELECT * FROM dismantle LIMIT ? OFFSET ?`
    const query = dbPool.execute(sql, [limit, offset])
    return query
}

const Create = (bsms, keterangan) => {
    const sql = `INSERT INTO dismantle (bsms_id,tanggal,keterangan) VALUES (?,NOW(),?)`
    const query = dbPool.execute(sql, [bsms, keterangan])
    return query
}

const SelectById = (id) => {
    const sql = `SELECT * FROM dismantle WHERE id = ?`
    const query = dbPool.execute(sql, [id])
    return query
}

const Update = (bsms, keterangan, id) => {
    const sql = `UPDATE dismantle SET bsms_id=?,updatedAt=NOW(),keterangan=? WHERE id=?`
    const query = dbPool.execute(sql, [bsms, keterangan, id])
    return query
}

const Delete = (id) => {
    const sql = `DELETE FROM dismantle WHERE id = ?`
    const query = dbPool.execute(sql, [id])
    return query
}

const Count = (search) => {
    const sql = `SELECT COUNT(bsms_id) as bsms FROM dismantle WHERE bsms_id LIKE ?`
    const query = dbPool.execute(sql, [`%${search}%`])
    return query
}

module.exports = {
    Select,
    SelectById,
    SelectDatatable,
    Create,
    Count,
    Update,
    Delete
}