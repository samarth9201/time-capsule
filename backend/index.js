const express = require('express')
const cors = require('cors')
const cron = require('node-cron')
const mongoose = require('mongoose')
require('dotenv').config()

const handleMails = require('./emails')
const UserRouter = require('./routes/user')

const hostname = 'localhost'
const port = process.env.PORT || 3000
const url = process.env.DATABASE_URL

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to Database')
}).catch((err) => {
    console.log(err.toString())
})

app.use('/api/users', UserRouter)

cron.schedule("5 * * * * *", async () =>{
    handleMails()
})

app.listen(port, hostname, () => {
    console.log(`Server up and running on http://${hostname}:${port}`)
})