import mongoose from 'mongoose'

const {PORT = 2000, MONGODB_URI} = process.env;

console.log(MONGODB_URI)

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewURLParser: true
})


mongoose.connection
.on('open', () => console.log('connected to mongo'))
.on('close', () => console.log('disconnected from mongo'))
.on('error', (error) => console.log(error))