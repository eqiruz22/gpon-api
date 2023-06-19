const dismantle = require('../models/dismantle.js')
const History = require('../models/history.js')
const fetchDismantle = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0
        const limit = parseInt(req.query.limit) || 10
        const search = req.query.query || ''
        const offset = limit * page
        const [count] = await dismantle.Count(search)
        const [row] = await dismantle.Select(search, offset, limit)
        const totalPage = Math.ceil(count[0]['bsms'] / limit)
        return res.status(200).json({
            message: 'Show all data dismantle',
            result: row,
            page: page,
            limit: limit,
            row: count[0]['bsms'],
            totalPage: totalPage
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const fetchDismantleById = async (req, res) => {
    let id = req.params.id
    try {
        const [row] = await dismantle.SelectById(id)
        if (row.length < 1) {
            return res.status(404).json({
                message: `dismantle id ${id} not found`,
                result: null
            })
        }
        return res.status(200).json({
            message: 'show data dismantle by id',
            result: row[0]
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const createDismantle = async (req, res) => {
    const data = {
        bsms: req.body.bsms,
        keterangan: req.body.keterangan,
        user: req.body.user
    }
    if (!req.body.bsms) {
        return res.status(400).json({
            message: 'BSMS ID is required!'
        })
    }
    if (!req.body.keterangan) {
        return res.status(400).json({
            message: 'Description is required'
        })
    }

    try {
        const create = await dismantle.Create(data.bsms, data.keterangan)
        await History.Create(data.user, `Created new dismantle id ${create[0]['insertId']}`)
        return res.status(200).json({
            message: 'Created'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const updateDismantle = async (req, res) => {
    const data = {
        bsms: req.body.bsms,
        keterangan: req.body.keterangan,
        user: req.body.user,
        id: req.body.id
    }
    if (!req.body.bsms) {
        return res.status(400).json({
            message: 'BSMS ID is required!'
        })
    }
    if (!req.body.keterangan) {
        return res.status(400).json({
            message: 'Description is required'
        })
    }

    try {
        await dismantle.Update(data.bsms, data.keterangan, data.id)
        await History.Create(data.user, `Updated in dismantle id ${data.id}`)
        return res.status(200).json({
            message: 'Updated',
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const destroyDismantle = async (req, res) => {
    let id = req.params.id
    const user = req.body.user
    try {
        const [row] = await dismantle.SelectById(id)
        if (row.length < 1) {
            return res.status(404).json({
                message: `Dismantle id ${id} not found`
            })
        } else {
            const idValue = row[0]?.id || id
            await History.Create(user, `Delete dismantle with id ${idValue}`)
            await dismantle.Delete(id)
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
    fetchDismantle,
    fetchDismantleById,
    createDismantle,
    updateDismantle,
    destroyDismantle,
}