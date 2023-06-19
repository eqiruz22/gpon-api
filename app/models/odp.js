const dbPool = require('../db/db.js')

const Select = (search, offset, limit) => {
    const sql = `SELECT * FROM odp JOIN pon WHERE odp.pon_id = pon.pon_id AND odp.odp_id LIKE ? ORDER BY odp.odp_id ASC LIMIT ? OFFSET ?`
    const query = dbPool.execute(sql, [`%${search}%`, limit, offset])
    return query
}

const SelectId = (id) => {
    const sql = `SELECT * FROM odp JOIN pon WHERE odp.pon_id = pon.pon_id AND odp_id = ?`
    const query = dbPool.execute(sql, [id])
    return query
}

const CreateOdp = (odp, pon, type, status, odpUplink, odpPort, kapasitas, lokasi, deskripsi) => {
    const sql = `INSERT INTO odp (odp_id,pon_id,type,status,odp_uplink,odp_uplink_port,kapasitas,lokasi,deskripsi) VALUES (?,?,?,?,?,?,?,?,?)`
    const query = dbPool.execute(sql, [odp, pon, type, status, odpUplink, odpPort, kapasitas, lokasi, deskripsi])
    return query
}

const UpdateOdp = (odp, pon, type, status, odpUplink, odpPort, kapasitas, lokasi, deskripsi, id) => {
    const sql = `UPDATE odp SET odp_id=?,pon_id=?,type=?,status=?,odp_uplink=?,odp_uplink_port=?,kapasitas=?,lokasi=?,deskripsi=? WHERE odp_id=?`
    const query = dbPool.execute(sql, [odp, pon, type, status, odpUplink, odpPort, kapasitas, lokasi, deskripsi, id])
    return query
}

const DeleteOdp = (odp) => {
    const sql = `DELETE FROM odp WHERE odp_id = ?`
    const query = dbPool.execute(sql, [odp])
    return query
}

const CountOdp = (search) => {
    const sql = `SELECT COUNT(odp_id) as odp FROM odp WHERE odp_id LIKE ?`
    const query = dbPool.execute(sql, [`%${search}%`])
    return query
}

const ForOptionSelect = () => {
    const sql = `SELECT * FROM odp`
    const query = dbPool.execute(sql)
    return query
}

module.exports = {
    Select,
    SelectId,
    CreateOdp,
    UpdateOdp,
    DeleteOdp,
    CountOdp,
    ForOptionSelect
}