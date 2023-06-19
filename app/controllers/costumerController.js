const Costumer = require('../models/costumer.js')
const Ont = require('../models/ont.js')
const History = require('../models/history.js')

const formatDate = (date) => {
    const originalDate = new Date(date)
    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, "0");
    const day = String(originalDate.getDate()).padStart(2, "0");
    const hour = String(originalDate.getHours()).padStart(2, "0");
    const minute = String(originalDate.getMinutes()).padStart(2, "0");
    const second = String(originalDate.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
const getCostumer = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0
        const limit = parseInt(req.query.limit) || 10
        const search = req.query.query || ''
        const offset = limit * page
        const [count] = await Costumer.CountCostumer(search)
        const [row] = await Costumer.Select(search, offset, limit)
        const result = row.map(item => {
            const lastupdate = formatDate(item.lastupdate)
            return {
                ...item,
                lastupdate
            }
        })
        const totalPage = Math.ceil(count[0]['costumer'] / limit)
        return res.status(200).json({
            message: 'show all data customer',
            result: result,
            page: page,
            limit: limit,
            row: count[0]['costumer'],
            totalPage: totalPage
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const getCostumerById = async (req, res) => {
    let id = req.params.id
    try {
        const [row] = await Costumer.SelectId(id)
        const formatTtl = formatDate(row[0]?.ttl)
        const formatAct = formatDate(row[0]?.tgl_act)
        const formatLastUpdate = formatDate(row[0]?.lastupdate)
        const formatResult = { ...row[0], ttl: formatTtl, tgl_act: formatAct, lastupdate: formatLastUpdate }
        if (row.length < 1) {
            return res.status(404).json({
                message: `Customer id ${id} not found`,
                result: formatResult

            })
        } else {
            return res.status(200).json({
                message: 'show data customer by id',
                result: formatResult
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const createDataCostumer = async (req, res) => {
    const data = {
        bsms: req.body.bsms_id,
        type: req.body.type,
        status: req.body.status,
        nama: req.body.nama,
        nohp: req.body.nohp,
        email: req.body.email,
        gedung: req.body.ins_gedung,
        unit: req.body.ins_unit,
        alamat: req.body.alamat,
        user: req.body.user
    }

    try {
        await Costumer.CreateCostumer(
            data.bsms,
            data.type,
            data.status,
            data.nama,
            data.nohp,
            data.email,
            data.gedung,
            data.unit,
            data.alamat
        )
        await History.Create(data.user, `Created Customer ${data.bsms}`)
        return res.status(200).json({
            message: 'success create new customer'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const updateDataCostumer = async (req, res) => {
    const data = {
        bsms: req.body.bsms_id,
        id: req.body.oldbsms_id,
        type: req.body.type,
        status: req.body.status,
        nama: req.body.nama,
        nohp: req.body.nohp,
        email: req.body.email,
        gedung: req.body.ins_gedung,
        unit: req.body.ins_unit,
        alamat: req.body.alamat,
        user: req.body.user
    }

    try {
        const [row] = await Costumer.SelectId(data.id)
        if (row.length < 1) {
            return res.status(404).json({
                message: `Customer id ${data.id} not found`
            })
        } else {
            const update = await Costumer.UpdateCostumer(
                data.bsms,
                data.type,
                data.status,
                data.nama,
                data.nohp,
                data.email,
                data.gedung,
                data.unit,
                data.alamat,
                data.id
            )
            await History.Create(data.user, `Update Customer with bsms id ${data.bsms}`)
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

const destroyCostumer = async (req, res) => {
    let id = req.params.id
    const user = req.body.user
    try {
        const [row] = await Costumer.SelectId(id)
        if (row.length < 1) {
            return res.status(404).json({
                message: `Costumer with bsms id ${id} not found`
            })
        } else {
            await History.Create(user, `Deleted Customer with bsms id ${row[0].bsms_id}`)
            await Costumer.DeleteCostumer(id)
            return res.status(200).json({
                message: 'Deleted',
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server ' + error
        })
    }
}

const showListCostumer = async (req, res) => {
    try {
        const [row] = await Costumer.ListCostumer()
        return res.status(200).json({
            message: 'Show all list customer',
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
    getCostumer,
    getCostumerById,
    createDataCostumer,
    updateDataCostumer,
    destroyCostumer,
    showListCostumer
}