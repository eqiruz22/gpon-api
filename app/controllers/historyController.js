const history = require('../models/history.js')

const fetchHistory = async (req, res) => {
    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.query || ''
    const offset = limit * page
    try {
        const [count] = await history.Count(search)
        const [row] = await history.Select(search, offset, limit)
        const totalPage = Math.ceil(count[0]['name'] / limit)
        return res.status(200).json({
            message: 'show all history',
            result: row,
            page: page,
            limit: limit,
            row: count[0]['name'],
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
    fetchHistory
}