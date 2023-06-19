const Ont = require('../models/ont.js')
const History = require('../models/history.js')
const getOnt = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0
        const limit = parseInt(req.query.limit) || 10
        const search = req.query.query || ''
        const offset = limit * page
        const [count] = await Ont.CountOnt(search)
        const [row] = await Ont.Select(search, offset, limit)
        const totalPage = Math.ceil(count[0]['ip_address'] / limit)
        return res.status(200).json({
            message: 'show all ip ont',
            result: row,
            page: page,
            limit: limit,
            row: count[0]['ip_address'],
            totalPage: totalPage
        })
    } catch (error) {
        console.log(error)
        return res.status.json({
            message: 'Internal server ' + error
        })
    }
}

const getOntIdle = async (req, res) => {
    try {
        const [row] = await Ont.SelectIdle()
        return res.status(200).json({
            message: 'show all idle ont',
            result: row
        })
    } catch (error) {
        return res.status(500).json({
            error: error
        })
    }
}

const getOntById = async (req, res) => {
    let id = req.query.ip
    try {
        const [row] = await Ont.SelectId(id)
        if (row.length < 1) {
            return res.status(404).json({
                message: 'ip ont not found',
                result: null
            })
        }
        return res.status(200).json({
            message: 'show detail ip ont',
            result: row[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const createDataOnt = async (req, res) => {
    const data = {
        ip: req.body.ip_address,
        status: req.body.status,
        bsms: req.body.bsms,
        user: req.body.user
    }

    const ipvalidate = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

    if (!req.body.ip_address) {
        return res.status(400).json({
            message: 'IP Address required'
        })
    }

    if (!ipvalidate.test(req.body.ip_address)) {
        return res.status(400).json({
            message: 'Format ip is invalid'
        })
    }

    if (!req.body.status) {
        return res.status(400).json({
            message: 'status required'
        })
    }

    if (!req.body.bsms) {
        return res.status(400).json({
            message: 'Bsms id required'
        })
    }

    try {
        await Ont.CreateOnt(data.ip, data.status, data.bsms)
        await History.Create(data.user, `Create ont ip ${data.ip}`)
        return res.status(200).json({
            message: 'Created new ip ont'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }

}

const updateDataOnt = async (req, res) => {
    const data = {
        ip: req.body.ip_address,
        oldIp: req.body.oldip,
        status: req.body.status,
        bsms: req.body.bsms_id,
        user: req.body.user
    }

    const ipvalidate = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

    if (!req.body.ip_address) {
        return res.status(400).json({
            message: 'IP Address required'
        })
    }

    if (!ipvalidate.test(req.body.ip_address)) {
        return res.status(400).json({
            message: 'Format ip is invalid'
        })
    }

    if (!req.body.status) {
        return res.status(400).json({
            message: 'status required'
        })
    }

    if (!req.body.bsms_id) {
        return res.status(400).json({
            message: 'Bsms id required'
        })
    }
    try {
        await Ont.UpdateOnt(data.ip, data.status, data.bsms, data.oldIp)
        await History.Create(data.user, `Update ont ip ${data.ip}`)
        return res.status(200).json({
            message: 'Update success'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const destroyOnt = async (req, res) => {
    let ip = req.query.ip
    const user = req.body.user
    try {
        const [row] = await Ont.SelectId(ip)
        if (row.length > 0) {
            await History.Create(user, `Delete ont ip ${ip}`)
            await Ont.DeleteOnt(ip)
            return res.status(200).json({
                message: 'Deleted',
            })
        } else {
            return res.status(404).json({
                message: `ont ip ${ip} not found`,
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const fetchListOnt = async (req, res) => {
    try {
        const [row] = await Ont.List()
        return res.status(200).json({
            message: "show list ip ont",
            result: row
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

module.exports = {
    getOnt,
    getOntById,
    getOntIdle,
    createDataOnt,
    updateDataOnt,
    destroyOnt,
    fetchListOnt
}