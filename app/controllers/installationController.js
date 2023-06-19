const Installation = require('../models/installation.js')
const History = require('../models/history.js')
const Ont = require('../models/ont.js')
const formatDate = (date) => {
    const originalDate = new Date(date)
    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, "0");
    const day = String(originalDate.getDate()).padStart(2, "0");
    // const hour = String(originalDate.getHours()).padStart(2, "0");
    // const minute = String(originalDate.getMinutes()).padStart(2, "0");
    // const second = String(originalDate.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}`
}

const fetchInstallation = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0
        const limit = parseInt(req.query.limit) || 10
        const search = req.query.query || ''
        const offset = limit * page
        const [count] = await Installation.Count(search)
        const [row] = await Installation.SelectInstallation(search, offset, limit)
        const totalPage = Math.ceil(count[0]['instalasi'] / limit)

        return res.status(200).json({
            message: 'Show all installation report',
            result: row,
            page: page,
            limit: limit,
            row: count[0]['instalasi'],
            totalPage: totalPage
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const fetchInstallationById = async (req, res) => {
    let id = req.params.id
    try {
        const [row] = await Installation.SelectId(id)
        const result = row.map(item => {
            const tgl_instalasi = formatDate(row[0]['tgl_instalasi'])
            return {
                ...item,
                tgl_instalasi
            }
        })
        if (row.length < 1) {
            return res.status(404).json({
                message: `Installation report with bsms id ${id} not found`,
                result: null
            })
        } else {
            return res.status(200).json({
                message: `Show installation report id ${id}`,
                result: result[0]
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const createInstallation = async (req, res) => {
    const data = {
        bsms: req.body.bsms_id,
        status: req.body.status,
        wo: req.body.wo_number,
        pelanggan: req.body.pelanggan,
        alamat: req.body.alamat,
        package: req.body.package,
        tgl: req.body.tgl_instalasi,
        teknisi: req.body.teknisi,
        gpon_path: req.body.gpon_path,
        snOnt: req.body.sn_ont,
        ipOnt: req.body.ip_ont,
        ont: req.body.ont_user_pass,
        sn: req.body.sn_stb,
        mac: req.body.mac_stb,
        username: req.body.inet_username,
        password: req.body.inet_password,
        perangkat: req.body.status_perangkat,
        desc: req.body.description,
        user: req.body.user
    }
    console.log(data)
    try {
        await Installation.Create(
            data.bsms,
            data.status,
            data.wo,
            data.pelanggan,
            data.alamat,
            data.package,
            data.tgl,
            data.teknisi,
            data.gpon_path,
            data.snOnt,
            data.ipOnt,
            data.ont || 'Support/theworldinyourhand',
            data.sn,
            data.mac,
            data.username,
            data.password,
            data.perangkat,
            data.desc,
        )
        await Ont.UpdateActiveOnt(data.ipOnt)
        await History.Create(data.user, `Create new installation with bsms id ${data.bsms}`)
        return res.status(200).json({
            message: 'success create new installation'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const updateInstallation = async (req, res) => {
    const data = {
        bsms: req.body.bsms_id,
        status: req.body.status,
        wo: req.body.wo_number,
        pelanggan: req.body.pelanggan,
        alamat: req.body.alamat,
        package: req.body.package,
        tgl: req.body.tgl_instalasi,
        teknisi: req.body.teknisi,
        gpon_path: req.body.gpon_path,
        snOnt: req.body.sn_ont,
        ipOnt: req.body.ip_ont,
        oldIp: req.body.oldIp,
        ont: req.body.ont_user_pass,
        sn: req.body.sn_stb,
        mac: req.body.mac_stb,
        username: req.body.inet_username,
        password: req.body.inet_password,
        perangkat: req.body.status_perangkat,
        desc: req.body.description,
        id: req.body.oldbsms_id,
        user: req.body.user
    }
    try {
        const [row] = await Installation.SelectId(data.id)
        if (row.length < 1) {
            return res.status(404).json({
                message: `Installation report id ${data.id} not found`,
                result: null
            })
        } else {
            await Installation.Update(
                data.bsms,
                data.status,
                data.wo,
                data.pelanggan,
                data.alamat,
                data.package,
                formatDate(data.tgl),
                data.teknisi,
                data.gpon_path,
                data.snOnt,
                data.ipOnt,
                data.ont || 'Support/theworldinyourhand',
                data.sn,
                data.mac,
                data.username,
                data.password,
                data.perangkat,
                data.desc,
                data.id
            )
            if (data.ipOnt !== data.oldIp) {
                await Ont.UpdateActiveOnt(data.ipOnt)
                await Ont.UpdateIdleOnt(data.oldIp)
            }
            await History.Create(data.user, `Update installation with bsms id ${data.bsms}`)
            return res.status(200).json({
                message: 'updated'
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const destroyInstallation = async (req, res) => {
    let id = req.params.id
    const user = req.body.user
    try {
        const [row] = await Installation.SelectId(id)
        if (row.length < 1) {
            return res.status(404).json({
                message: `Installation report with bsms id ${id} not found`
            })
        } else {
            await Ont.UpdateIdleOnt(row[0]['ip_ont'])
            await History.Create(user, `Delete installation report with bsms id ${id}`)
            await Installation.Delete(id)
            return res.status(200).json({
                message: 'Deleted'
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

module.exports = {
    fetchInstallation,
    fetchInstallationById,
    createInstallation,
    updateInstallation,
    destroyInstallation
}