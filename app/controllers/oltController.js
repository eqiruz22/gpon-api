const Olt = require('../models/olt.js')
const History = require('../models/history.js')
const getOlt = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0
        const limit = parseInt(req.query.limit) || 10
        const search = req.query.search || ''
        const offset = limit * page
        const [count] = await Olt.CountOlt(search)
        const [row] = await Olt.Select(search, offset, limit)
        const totalPage = Math.ceil(count[0]['olt'] / limit)
        return res.status(200).json({
            message: 'show all data olt',
            result: row,
            page: page,
            limit: limit,
            row: count[0]['olt'],
            totalPage: totalPage
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const getOltById = async (req, res) => {
    let id = req.params.id
    try {
        const [row] = await Olt.SelectId(id)
        if (row.length < 1) {
            return res.status(404).json({
                message: `olt with id ${id} not found`,
                result: null
            })
        }
        return res.status(200).json({
            message: 'show data olt by id',
            result: row[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const createDataOlt = async (req, res) => {
    const data = {
        olt: req.body.olt_id,
        host: req.body.hostname,
        kapasitas: req.body.kapasitas,
        status: req.body.status,
        ip: req.body.ip,
        site: req.body.site,
        desc: req.body.deskripsi,
        user: req.body.user
    }

    const ipvalidate = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

    if (!req.body.olt_id) {
        return res.status(400).json({
            message: 'OLT ID is required'
        })
    }
    if (!req.body.hostname) {
        return res.status(400).json({
            message: 'Hostname is required'
        })
    }
    if (!req.body.kapasitas) {
        return res.status(400).json({
            message: 'Capacity is required'
        })
    }
    if (!req.body.status) {
        return res.status(400).json({
            message: 'Status is required'
        })
    }
    if (!req.body.ip) {
        return res.status(400).json({
            message: 'IP Management is required'
        })
    }
    if (!ipvalidate.test(req.body.ip)) {
        return res.status(400).json({
            message: 'Format IP is invalid'
        })
    }
    if (!req.body.site) {
        return res.status(400).json({
            message: 'Site is required'
        })
    }
    if (!req.body.deskripsi) {
        return res.status(400).json({
            message: 'Description is required'
        })
    }

    try {
        await Olt.CreateOlt(data.olt, data.host, data.kapasitas, data.status, data.ip, data.site, data.desc)
        await History.Create(data.user, `Create olt with id ${data.olt}`)
        return res.status(200).json({
            message: 'create new data olt'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const updateDataOlt = async (req, res) => {
    const data = {
        olt: req.body.olt_id,
        host: req.body.hostname,
        kapasitas: req.body.kapasitas,
        status: req.body.status,
        ip: req.body.ip,
        site: req.body.site,
        desc: req.body.deskripsi,
        user: req.body.user
    }

    const ipvalidate = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

    if (!req.body.olt_id) {
        return res.status(400).json({
            message: 'OLT ID is required'
        })
    }
    if (!req.body.hostname) {
        return res.status(400).json({
            message: 'Hostname is required'
        })
    }
    if (!req.body.kapasitas) {
        return res.status(400).json({
            message: 'Capacity is required'
        })
    }
    if (!req.body.status) {
        return res.status(400).json({
            message: 'Status is required'
        })
    }
    if (!req.body.ip) {
        return res.status(400).json({
            message: 'IP Management is required'
        })
    }
    if (!ipvalidate.test(req.body.ip)) {
        return res.status(400).json({
            message: 'Format IP is invalid'
        })
    }
    if (!req.body.site) {
        return res.status(400).json({
            message: 'Site is required'
        })
    }
    if (!req.body.deskripsi) {
        return res.status(400).json({
            message: 'Description is required'
        })
    }
    try {
        const [row] = await Olt.SelectId(data.olt)
        if (row.length < 1) {
            return res.status(404).json({
                message: `olt with id ${data.olt} not found`
            })
        } else {
            await Olt.UpdateOlt(data.host, data.kapasitas, data.status, data.ip, data.site, data.desc, data.olt)
            await History.Create(data.user, `Updated olt with id ${data.olt}`)
            return res.status(200).json({
                message: 'Update success'
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const destroyOlt = async (req, res) => {
    let id = req.params.id
    const user = req.body.user
    try {
        const [row] = await Olt.SelectId(id)
        if (row.length < 1) {
            return res.status(404).json({
                message: `olt with id ${id} not found`
            })
        } else {
            const idValue = row[0]['olt_id'] || id
            await History.Create(user, `Delete olt with id ${idValue}`)
            await Olt.DeleteOlt(id)
            return res.status(200).json({
                message: 'Delete success'
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
    getOlt,
    getOltById,
    createDataOlt,
    updateDataOlt,
    destroyOlt
}