const Pon = require('../models/pon.js')
const History = require('../models/history.js')
const Olt = require('../models/olt.js')
const getPon = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0
        const limit = parseInt(req.query.limit) || 10
        const search = req.query.query || ''
        const offset = limit * page
        const [count] = await Pon.CountPon(search)
        const [row] = await Pon.Select(search, offset, limit)
        const totalPage = Math.ceil(count[0]['pon'] / limit)
        return res.status(200).json({
            message: 'Show all data pon',
            result: row,
            page: page,
            limit: limit,
            row: count[0]['pon'],
            totalPage: totalPage
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const getPonForOptions = async (req, res) => {
    try {
        const [row] = await Pon.ForSelectOption()
        return res.status(200).json({
            message: 'Show data pon for select',
            result: row
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error ' + error
        })
    }
}

const getPonById = async (req, res) => {
    let id = req.params.id
    try {
        const [row] = await Pon.SelectId(id)
        if (row.length < 1) {
            return res.status(404).json({
                message: `PON ID ${id} not found`,
                result: null
            })
        } else {
            return res.status(200).json({
                message: 'show data pon by id',
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

const createDataPon = async (req, res) => {
    const data = {
        pon: req.body.pon_id,
        fsp: req.body.fsp,
        capacity: req.body.capacity,
        splitter: req.body.splitter,
        status: req.body.status,
        alokasi: req.body.alokasi,
        keterangan: req.body.desc,
        olt: req.body.olt_id,
        user: req.body.user
    }
    if (!req.body.pon_id) {
        return res.status(400).json({
            message: 'PON ID is required'
        })
    }
    if (!req.body.fsp) {
        return res.status(400).json({
            message: 'FSP field is required'
        })
    }
    if (!req.body.capacity) {
        return res.status(400).json({
            message: 'Capacity field is required'
        })
    }
    if (!req.body.splitter) {
        return res.status(400).json({
            message: 'Splitter field is required'
        })
    }
    if (!req.body.status) {
        return res.status(400).json({
            message: 'Status field is required'
        })
    }
    if (!req.body.alokasi) {
        return res.status(400).json({
            message: 'Alokasi field is required'
        })
    }
    if (!req.body.desc) {
        return res.status(400).json({
            message: 'Description field is required'
        })
    }
    if (!req.body.olt_id) {
        return res.status(400).json({
            message: 'OLT ID is required'
        })
    }
    try {
        const [countpon] = await Pon.CountForOlt(data.olt)
        const [selectolt] = await Olt.SelectCapacity(data.olt)
        if (countpon[0]['olt'] >= selectolt[0]['kapasitas']) {
            return res.status(400).json({
                message: `olt reaching maximum capacity ${selectolt[0]['kapasitas']}`
            })
        } else {
            await Pon.CreatePon(data.pon, data.fsp, data.capacity, data.splitter, data.status, data.alokasi, data.keterangan, data.olt)
            await History.Create(data.user, `Create new Pon Data with id ${data.pon}`)
            return res.status(200).json({
                message: 'Create new data pon'
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const updateDataPon = async (req, res) => {
    const data = {
        pon: req.body.pon_id,
        fsp: req.body.fsp,
        capacity: req.body.capacity,
        splitter: req.body.splitter,
        status: req.body.status,
        alokasi: req.body.alokasi,
        keterangan: req.body.desc,
        olt: req.body.olt
    }
    if (!req.body.pon_id) {
        return res.status(400).json({
            message: 'PON ID is required'
        })
    }
    if (!req.body.fsp) {
        return res.status(400).json({
            message: 'FSP field is required'
        })
    }
    if (!req.body.capacity) {
        return res.status(400).json({
            message: 'Capacity field is required'
        })
    }
    if (!req.body.splitter) {
        return res.status(400).json({
            message: 'Splitter field is required'
        })
    }
    if (!req.body.status) {
        return res.status(400).json({
            message: 'Status field is required'
        })
    }
    if (!req.body.alokasi) {
        return res.status(400).json({
            message: 'Alokasi field is required'
        })
    }
    if (!req.body.desc) {
        return res.status(400).json({
            message: 'Description field is required'
        })
    }
    if (!req.body.olt) {
        return res.status(400).json({
            message: 'OLT ID is required'
        })
    }
    try {
        const [row] = await Pon.SelectId(data.pon)
        if (row.length < 1) {
            return res.status(404).json({
                message: `PON ID ${data.pon} not found`
            })
        } else {
            await Pon.UpdatePon(data.fsp, data.capacity, data.splitter, data.status, data.alokasi, data.keterangan, data.olt, data.pon)
            await History.Create(data.user, `Update pon with id ${data.pon}`)
            return res.status(200).json({
                message: 'Data pon update'
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const destroyPon = async (req, res) => {
    let id = req.params.id
    const user = req.body.user
    try {
        const [row] = await Pon.SelectId(id)
        if (row.length < 1) {
            return res.status(404).json({
                message: `PON ID ${id} not found`
            })
        } else {
            await History.Create(user, `Delete pon id ${row[0]['pon_id']}`)
            await Pon.DeletePon(id)
            return res.status(200).json({
                message: 'deleted pon'
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const Test = async (req, res) => {
    const data = req.body.olt
    try {
        const [pon] = await Pon.CountForOlt(data)
        const [olt] = await Olt.SelectCapacity(data)

        if (pon[0]['olt'] > olt[0]['kapasitas']) {
            return res.status(200).json({
                message: `olt is reaching maximum capacity is ${olt[0]['kapasitas']}`
            })
        }
        return res.status(200).json({
            pon: pon[0]['olt'],
            olt: olt[0]['kapasitas']
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getPon,
    getPonById,
    createDataPon,
    updateDataPon,
    destroyPon,
    getPonForOptions,
    Test
}