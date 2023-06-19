const report = require('../models/report.js')

const fetchReport = async (req, res) => {
    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.query || ''
    const offset = limit * page
    try {
        const [count] = await report.Count(search)
        const [row] = await report.Select(search, offset, limit)
        const totalPage = Math.ceil(count[0]['pelanggan'] / limit)
        return res.status(200).json({
            message: 'Show all report',
            result: row,
            page: page,
            limit: limit,
            row: count[0]['pelanggan'],
            totalPage: totalPage
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error ' + error
        })
    }
}

module.exports = {
    fetchReport
}