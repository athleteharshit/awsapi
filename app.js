const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {MONGOURI} = require("./key")
const PORT = process.env.PORT || 5000


mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on("connected", () => {
    console.log("mongodb is connected yeah")
})
mongoose.connection.on("error", (err) => {
    console.log(`mongodb in not connected ${err}`)
})

require('./models/user')
require('./models/post')

app.use(express.json())

app.use(require('./routes/auth'))
app.use(require('./routes/post'))



app.listen(PORT, () => {
    console.log(`open server to this port http://localhost:${PORT}`)
})