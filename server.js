
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import 'dotenv/config.js'
import './config/database.js'

import router from './routes/index.js'
import schools from './routes/schools.js'
import social from './routes/social.js'
//  Allows forms to work properly with delete and put requests
import methodOverride from 'method-override'

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}))

app.use('/api', router)
app.use('/api', schools)
app.use('/api', social)

const {PORT = 2000} = process.env
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})