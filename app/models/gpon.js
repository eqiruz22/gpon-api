const dbPool = require('../db/db.js')

const Select = (search, offset, limit) => {
    const sql = `SELECT gpon_port.pon_port,pon.pon_id,odp.odp_id,gpon_port.odp_port,gpon_port.labeling,gpon_port.gpon_fullpath,gpon_port.status FROM gpon_port JOIN pon JOIN odp WHERE gpon_port.pon_id = pon.pon_id AND gpon_port.odp_id = odp.odp_id AND labeling LIKE ? LIMIT ? OFFSET ?`
    const query = dbPool.execute(sql, [`%${search}%`, limit, offset])
    return query
}

const SelectId = (id) => {
    const sql = `SELECT gpon_port.pon_port,pon.pon_id,odp.odp_id,gpon_port.odp_port,gpon_port.labeling,gpon_port.gpon_fullpath,gpon_port.status FROM gpon_port JOIN pon JOIN odp WHERE gpon_port.pon_id = pon.pon_id AND gpon_port.odp_id = odp.odp_id AND gpon_port.pon_port = ?`
    const query = dbPool.execute(sql, [id])
    return query
}

const SelectGpon = () => {
    const sql = `SELECT pon_port FROM gpon_port`
    const query = dbPool.execute(sql)
    return query
}

const CreateGpon = (ponPort, ponId, odpId, odpPort, labeling, gponpath, status) => {
    const sql = `INSERT INTO gpon_port (pon_port,pon_id,odp_id,odp_port,labeling,gpon_fullpath,status) VALUES (?,?,?,?,?,?,?)`
    const query = dbPool.execute(sql, [ponPort, ponId, odpId, odpPort, labeling, gponpath, status])
    return query
}

const UpdateGpon = (ponPort, ponId, odpId, odpPort, labeling, gponpath, status, id) => {
    const sql = `UPDATE gpon_port SET pon_port=?,pon_id=?,odp_id=?,odp_port=?,labeling=?,gpon_fullpath=?,status=? WHERE pon_port=?`
    const query = dbPool.execute(sql, [ponPort, ponId, odpId, odpPort, labeling, gponpath, status, id])
    return query
}

const DeleteGpon = (id) => {
    const sql = `DELETE FROM gpon_port WHERE pon_port=?`
    const query = dbPool.execute(sql, [id])
    return query
}

const CountGpon = (search) => {
    const sql = `SELECT COUNT(labeling) as label FROM gpon_port WHERE labeling LIKE ?`
    const query = dbPool.execute(sql, [`%${search}%`])
    return query
}


module.exports = {
    Select,
    SelectId,
    SelectGpon,
    CreateGpon,
    UpdateGpon,
    DeleteGpon,
    CountGpon
}