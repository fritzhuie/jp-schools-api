
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import 'dotenv/config.js'
import './config/database.js'
import router from './routes/index.js'
//  Allows forms to work properly with delete and put requests
import methodOverride from 'method-override'


const {PORT = 2000} = process.env;
const app = express();


app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
//  Form requests put and delete
app.use(methodOverride('_method'))
//  Parse urlencoded request
app.use(express.urlencoded({extended: true}))
app.use('/api', router)


app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})