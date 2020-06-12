const mongoose = require('mongoose')

mongoose.set('useUnifiedTopology', true)
mongoose
    .connect(process.env.DB_URI, { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db