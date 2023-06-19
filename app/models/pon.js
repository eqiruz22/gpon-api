const dbPool = require('../db/db.js')

const Select = (search, offset, limit) => {
    const sql = `SELECT pon.pon_id,pon.fsp,pon.kapasitas,pon.splitter,pon.status,pon.alokasi_site,pon.keterangan,olt.olt_id FROM pon JOIN olt WHERE pon.olt_id = olt.olt_id AND pon_id LIKE ? LIMIT ? OFFSET ?`
    const query = dbPool.execute(sql, [`%${search}%`, limit, offset])
    return query
}

const SelectId = (id) => {
    const sql = `SELECT * FROM pon JOIN olt WHERE pon.olt_id = olt.olt_id AND pon_id = ?`
    const query = dbPool.execute(sql, [id])
    return query
}

const CreatePon = (pon, fsp, kapasitas, splitter, status, alokasi, desc, olt) => {
    const sql = `INSERT INTO pon (pon_id,fsp,kapasitas,splitter,status,alokasi_site,keterangan,olt_id) VALUES (?,?,?,?,?,?,?,?)`
    const query = dbPool.execute(sql, [pon, fsp, kapasitas, splitter, status, alokasi, desc, olt])
    return query
}

const UpdatePon = (fsp, kapasitas, splitter, status, alokasi, desc, olt, pon) => {
    const sql = `UPDATE pon SET fsp=?,kapasitas=?,splitter=?,status=?,alokasi_site=?,keterangan=?,olt_id=? WHERE pon_id=?`
    const query = dbPool.execute(sql, [fsp, kapasitas, splitter, status, alokasi, desc, olt, pon])
    return query
}

const DeletePon = (id) => {
    const sql = `DELETE FROM pon WHERE pon_id = ?`
    const query = dbPool.execute(sql, [id])
    return query
}

const CountPon = (search) => {
    const sql = `SELECT COUNT(pon_id) as pon FROM pon WHERE pon_id LIKE ?`
    const query = dbPool.execute(sql, [`%${search}%`])
    return query
}

const ForSelectOption = () => {
    const sql = `SELECT * FROM pon`
    const query = dbPool.execute(sql)
    return query
}

const CountForOlt = (olt) => {
    const sql = `SELECT COUNT(olt_id) as olt FROM pon WHERE olt_id = ?`
    const query = dbPool.execute(sql, [olt])
    return query
}

module.exports = {
    Select,
    SelectId,
    CreatePon,
    UpdatePon,
    DeletePon,
    CountPon,
    ForSelectOption,
    CountForOlt
}