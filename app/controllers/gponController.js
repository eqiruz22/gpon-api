const Gpon = require('../models/gpon.js')
const History = require('../models/history.js')
const getGpon = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0
        const limit = parseInt(req.query.limit) || 10
        const search = req.query.query || ''
        const offset = limit * page
        const [count] = await Gpon.CountGpon(search)
        const [row] = await Gpon.Select(search, offset, limit)
        const totalPage = Math.ceil(count[0]['label'] / limit)
        return res.status(200).json({
            message: 'show all data gpon port',
            result: row,
            page: page,
            limit: limit,
            row: count[0]['label'],
            totalPage: totalPage
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const getGponSelect = async (req, res) => {
    try {
        const [row] = await Gpon.SelectGpon()
        return res.status(200).json({
            message: 'show gpon for select',
            result: row
        })
    } catch (error) {
        return res.status(500).json({
            error: error
        })
    }
}

const getGponById = async (req, res) => {
    let id = req.query.id

    try {
        const [row] = await Gpon.SelectId(id)
        if (row.length < 1) {
            return res.status(404).json({
                message: `gpon port ${id} not found`,
                result: null
            })
        } else {
            return res.status(200).json({
                message: 'show data gpon by id',
                result: row[0]
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const createDataGpon = async (req, res) => {
    const data = {
        ponPort: req.body.pon_port,
        ponId: req.body.pon_id,
        odpId: req.body.odp_id,
        odpPort: req.body.odp_port,
        label: req.body.labeling,
        gpon: req.body.gpon_fullpath,
        status: req.body.status,
        user: req.body.user
    }

    if (!req.body.pon_port) {
        return res.status(400).json({
            message: 'Pon Port required!'
        })
    }
    if (!req.body.pon_id) {
        return res.status(400).json({
            message: 'Pon ID required!'
        })
    }
    if (!req.body.odp_id) {
        return res.status(400).json({
            message: 'ODP ID required!'
        })
    }
    if (!req.body.odp_port) {
        return res.status(400).json({
            message: 'ODP Port required!'
        })
    }
    if (!req.body.labeling) {
        return res.status(400).json({
            message: 'Labeling required!'
        })
    }
    if (!req.body.gpon_fullpath) {
        return res.status(400).json({
            message: 'GPON Fullpath required!'
        })
    }
    if (!req.body.status) {
        return res.status(400).json({
            message: 'Status required'
        })
    }
    try {
        await Gpon.CreateGpon(data.ponPort, data.ponId, data.odpId, data.odpPort, data.label, data.gpon, data.status)
        await History.Create(data.user, `Created new gpon port ${data.ponPort}`)
        return res.status(200).json({
            message: 'success create data gpon'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const updateDataGpon = async (req, res) => {
    const data = {
        ponPort: req.body.pon_port,
        ponId: req.body.pon_id,
        odpId: req.body.odp_id,
        odpPort: req.body.odp_port,
        label: req.body.labeling,
        gpon: req.body.gpon_fullpath,
        status: req.body.status,
        id: req.body.old_pon_port,
        user: req.body.user
    }

    if (!req.body.pon_port) {
        return res.status(400).json({
            message: 'Pon Port required!'
        })
    }
    if (!req.body.pon_id) {
        return res.status(400).json({
            message: 'Pon ID required!'
        })
    }
    if (!req.body.odp_id) {
        return res.status(400).json({
            message: 'ODP ID required!'
        })
    }
    if (!req.body.odp_port) {
        return res.status(400).json({
            message: 'ODP Port required!'
        })
    }
    if (!req.body.labeling) {
        return res.status(400).json({
            message: 'Labeling required!'
        })
    }
    if (!req.body.status) {
        return res.status(400).json({
            message: 'Status required'
        })
    }
    try {
        const [row] = await Gpon.SelectId(data.id)
        if (row.length < 1) {
            return res.status(404).json({
                message: `gpon port ${data.id} not found`
            })
        } else {
            await Gpon.UpdateGpon(data.ponPort, data.ponId, data.odpId, data.odpPort, data.label, data.gpon, data.status, data.id)
            await History.Create(data.user, `Update gpon port ${data.ponPort}`)
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

const destroyGpon = async (req, res) => {
    let id = req.query.id
    const user = req.body.user
    try {
        const [row] = await Gpon.SelectId(id)
        if (row.length < 1) {
            return res.status(404).json({
                message: `gpon port ${id} not found`
            })
        } else {
            const idValue = row[0]?.id || id
            await History.Create(user, `Deleted gpon port ${idValue}`)
            await Gpon.DeleteGpon(id)
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
    getGpon,
    getGponById,
    createDataGpon,
    updateDataGpon,
    destroyGpon,
    getGponSelect
}