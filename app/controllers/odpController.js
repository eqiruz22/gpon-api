const Odp = require('../models/odp.js')
const History = require('../models/history.js')
const getOdp = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0
        const limit = parseInt(req.query.limit) || 0
        const search = req.query.query || ''
        const offset = limit * page
        const [count] = await Odp.CountOdp(search)
        const [row] = await Odp.Select(search, offset, limit)
        const totalPage = Math.ceil(count[0]['odp'] / limit)
        return res.status(200).json({
            message: 'show all data odp',
            result: row,
            page: page,
            limit: limit,
            row: count[0]['odp'],
            totalPage: totalPage
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const getOdpById = async (req, res) => {
    let odp = req.params.id
    try {
        const [row] = await Odp.SelectId(odp)
        if (row.length < 1) {
            return res.status(404).json({
                message: `ODP ${odp} not found`,
                result: null
            })
        } else {
            return res.status(200).json({
                message: 'show detail data odp',
                result: row
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const createDataOdp = async (req, res) => {
    const data = {
        odp: req.body.odp_id,
        pon: req.body.pon_id,
        type: req.body.type,
        status: req.body.status,
        uplink: req.body.odp_uplink,
        port: req.body.odp_uplink_port,
        kapasitas: req.body.kapasitas,
        lokasi: req.body.lokasi,
        desc: req.body.deskripsi,
        user: req.body.user
    }

    if (!req.body.odp_id) {
        return res.status(400).json({
            message: 'ODP ID required!'
        })
    }

    if (!req.body.pon_id) {
        return res.status(400).json({
            message: 'PON ID required'
        })
    }

    if (!req.body.type) {
        return res.status(400).json({
            message: 'Type required!'
        })
    }

    if (!req.body.status) {
        return res.status(400).json({
            message: 'Status required'
        })
    }

    if (!req.body.odp_uplink) {
        return res.status(400).json({
            message: 'ODP Uplink required!'
        })
    }

    if (!req.body.odp_uplink_port) {
        return res.status(400).json({
            message: 'ODP Uplink Port required!'
        })
    }

    if (!req.body.kapasitas) {
        return res.status(400).json({
            message: 'Capacity required!'
        })
    }

    if (!req.body.lokasi) {
        return res.status(400).json({
            message: 'Location required!'
        })
    }

    if (!req.body.deskripsi) {
        return res.status(400).json({
            message: 'Description required!'
        })
    }

    try {
        await Odp.CreateOdp(data.odp, data.pon, data.type, data.status, data.uplink, data.port, data.kapasitas, data.lokasi, data.desc)
        await History.Create(data.user, `Created new odp ${data.odp}`)
        return res.status(200).json({
            message: 'success created'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }

}

const updateDataOdp = async (req, res) => {
    const data = {
        odp: req.body.odp_id,
        type: req.body.type,
        status: req.body.status,
        uplink: req.body.odp_uplink,
        port: req.body.odp_uplink_port,
        kapasitas: req.body.kapasitas,
        lokasi: req.body.lokasi,
        desc: req.body.deskripsi,
        pon: req.body.pon_id,
        id: req.body.oldOdp,
        user: req.body.user
    }

    if (!req.body.odp_id) {
        return res.status(400).json({
            message: 'ODP ID required!'
        })
    }
    if (!req.body.type) {
        return res.status(400).json({
            message: 'Type required!'
        })
    }

    if (!req.body.status) {
        return res.status(400).json({
            message: 'Status required'
        })
    }

    if (!req.body.odp_uplink) {
        return res.status(400).json({
            message: 'ODP Uplink required!'
        })
    }

    if (!req.body.odp_uplink_port) {
        return res.status(400).json({
            message: 'ODP Uplink Port required!'
        })
    }

    if (!req.body.kapasitas) {
        return res.status(400).json({
            message: 'Capacity required!'
        })
    }

    if (!req.body.lokasi) {
        return res.status(400).json({
            message: 'Location required!'
        })
    }

    if (!req.body.deskripsi) {
        return res.status(400).json({
            message: 'Description required!'
        })
    }

    if (!req.body.pon_id) {
        return res.status(400).json({
            message: 'PON ID required'
        })
    }
    try {
        const [row] = await Odp.SelectId(data.id)
        if (row.length < 1) {
            return res.status(404).json({
                message: `ODP ${data.id} not found`
            })
        } else {
            await Odp.UpdateOdp(data.odp, data.pon, data.type, data.status, data.uplink, data.port, data.kapasitas, data.lokasi, data.desc, data.id)
            await History.Create(data.user, `Updated odp ${data.odp}`)
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

const destroyOdp = async (req, res) => {
    let odp = req.params.id
    const user = req.body.user
    try {
        const [row] = await Odp.SelectId(odp)
        if (row.length < 1) {
            return res.status(404).json({
                message: `ODP ${odp} not found`
            })
        } else {
            const idValue = row[0]['odp_id'] || odp
            await History.Create(user, `Delete odp ${idValue}`)
            await Odp.DeleteOdp(idValue)
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

const getOdpForSelect = async (req, res) => {
    try {
        const [row] = await Odp.ForOptionSelect()
        return res.status(200).json({
            message: 'Show all odp for select',
            result: row
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error ' + error
        })
    }
}

module.exports = {
    getOdp,
    getOdpById,
    createDataOdp,
    updateDataOdp,
    destroyOdp,
    getOdpForSelect
}