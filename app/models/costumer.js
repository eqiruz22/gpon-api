const dbPool = require('../db/db.js')

const Select = (search, offset, limit) => {
    const sql = `SELECT bsms_id,type,status,nama,ttl,tgl_act,lastupdate,nohp,email,ins_gedung,ins_unit,alamat
    FROM bsmscustomer WHERE bsms_id LIKE ? OR nama LIKE ? ORDER BY bsms_id DESC LIMIT ? OFFSET ?`
    const query = dbPool.execute(sql, [`%${search}%`, `%${search}%`, limit, offset])
    return query
}

const SelectId = (id) => {
    const sql = `SELECT bsms_id,type,status,nama,ttl,tgl_act,lastupdate,nohp,email,ins_gedung,ins_unit,alamat
    FROM bsmscustomer WHERE bsms_id = ?`
    const query = dbPool.execute(sql, [id])
    return query
}

const CreateCostumer = (bsms, type, status, nama, nohp, email, ins_gedung, ins_unit, alamat) => {
    const sql = `INSERT INTO bsmscustomer (bsms_id,type,status,nama,ttl,tgl_act,nohp,email,ins_gedung,ins_unit,alamat) VALUES (?,?,?,?,NOW(),NOW(),?,?,?,?,?)`
    const query = dbPool.execute(sql, [bsms, type, status, nama, nohp, email, ins_gedung, ins_unit, alamat])
    return query
}

const UpdateCostumer = (bsms, type, status, nama, nohp, email, ins_gedung, ins_unit, alamat, id) => {
    const sql = `UPDATE bsmscustomer SET bsms_id = ?,type = ?,status = ?,nama = ?,lastupdate = NOW(),nohp = ?,email = ?,ins_gedung = ?,ins_unit = ?,alamat = ? WHERE bsms_id= ?`
    const query = dbPool.execute(sql, [bsms, type, status, nama, nohp, email, ins_gedung, ins_unit, alamat, id])
    return query
}

const DeleteCostumer = (id) => {
    const sql = `DELETE FROM bsmscustomer WHERE bsms_id = ?`
    const query = dbPool.execute(sql, [id])
    return query
}

const CountCostumer = (search) => {
    const sql = `SELECT COUNT(bsms_id) as costumer FROM bsmscustomer WHERE bsms_id LIKE ?`
    const query = dbPool.execute(sql, [`%${search}%`])
    return query
}

const ListCostumer = () => {
    const sql = `SELECT bsms_id FROM bsmscustomer`
    const query = dbPool.execute(sql)
    return query
}

module.exports = {
    Select,
    SelectId,
    CreateCostumer,
    UpdateCostumer,
    DeleteCostumer,
    CountCostumer,
    ListCostumer
}