const dbPool = require('../db/db.js')

const SelectInstallation = (search, offset, limit) => {
    const sql = `SELECT bsmscustomer.bsms_id,instalasi_report.status, instalasi_report.wo_number, instalasi_report.pelanggan, instalasi_report.alamat, instalasi_report.package, instalasi_report.tgl_instalasi, instalasi_report.teknisi, instalasi_report.gpon_path, instalasi_report.sn_ont,ip_ont.ip_address,instalasi_report.ont_user_pass, instalasi_report.sn_stb, instalasi_report.mac_stb, instalasi_report.inet_username, instalasi_report.inet_password, instalasi_report.description, instalasi_report.status_perangkat FROM instalasi_report JOIN bsmscustomer JOIN ip_ont WHERE instalasi_report.bsms_id = bsmscustomer.bsms_id AND instalasi_report.ip_ont = ip_ont.ip_address AND instalasi_report.bsms_id LIKE ? LIMIT ? OFFSET ?`
    const query = dbPool.execute(sql, [`%${search}%`, limit, offset])
    return query
}

const SelectId = (id) => {
    const sql = `SELECT bsmscustomer.bsms_id, instalasi_report.status, instalasi_report.wo_number, instalasi_report.pelanggan, instalasi_report.alamat, instalasi_report.package, instalasi_report.tgl_instalasi, instalasi_report.teknisi, instalasi_report.gpon_path, instalasi_report.sn_ont, instalasi_report.ip_ont, instalasi_report.ont_user_pass, instalasi_report.sn_stb, instalasi_report.mac_stb, instalasi_report.inet_username, instalasi_report.inet_password, instalasi_report.description, instalasi_report.status_perangkat FROM instalasi_report JOIN bsmscustomer WHERE instalasi_report.bsms_id = bsmscustomer.bsms_id AND instalasi_report.bsms_id = ?`
    const query = dbPool.execute(sql, [id])
    return query
}

const Create = (bsms, status, wo, pelanggan, alamat, package, instalasi, teknisi, gpon, snOnt, ipOnt, ont, snStb, macStb, username, password, status_perangkat, desc) => {
    const sql = `INSERT INTO instalasi_report (bsms_id,status,wo_number,pelanggan,alamat,package,tgl_instalasi,teknisi,gpon_path,sn_ont,ip_ont,ont_user_pass,sn_stb,mac_stb,inet_username,inet_password,status_perangkat,description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    const query = dbPool.execute(sql, [bsms, status, wo, pelanggan, alamat, package, instalasi, teknisi, gpon, snOnt, ipOnt, ont, snStb, macStb, username, password, status_perangkat, desc])
    return query
}

const Update = (bsms, status, wo, pelanggan, alamat, package, instalasi, teknisi, gpon, snOnt, ipOnt, ont, snStb, macStb, username, password, status_perangkat, desc, id) => {
    const sql = `UPDATE instalasi_report SET bsms_id = ?,status = ?,wo_number = ?,pelanggan = ?,alamat = ?,package = ?,tgl_instalasi = ?,teknisi = ?,gpon_path = ?,sn_ont = ?,ip_ont = ?,ont_user_pass = ?,sn_stb = ?,mac_stb = ?,inet_username = ?,inet_password = ?,status_perangkat = ?,description = ? WHERE bsms_id = ?`
    const query = dbPool.execute(sql, [bsms, status, wo, pelanggan, alamat, package, instalasi, teknisi, gpon, snOnt, ipOnt, ont, snStb, macStb, username, password, status_perangkat, desc, id])
    return query
}

const Delete = (id) => {
    const sql = `DELETE FROM instalasi_report WHERE bsms_id = ?`
    const query = dbPool.execute(sql, [id])
    return query
}

const Count = (search) => {
    const sql = `SELECT COUNT(instalasi_report.bsms_id) as instalasi FROM instalasi_report JOIN bsmscustomer WHERE instalasi_report.bsms_id = bsmscustomer.bsms_id AND instalasi_report.bsms_id LIKE ?`
    const query = dbPool.execute(sql, [`%${search}%`])
    return query
}

module.exports = {
    SelectInstallation,
    SelectId,
    Create,
    Update,
    Delete,
    Count
}