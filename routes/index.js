import express from 'express' 
const router = express.Router() 
//import { getMovies, createMovie, updateMovie, deleteMovie } from '../controllers/controller.js' 

router.get('/schools', (req, res) => {
    res.status(200).send('school list')
})

router.post('/schools', (req, res) => {
    res.status(200).send('seed schools here')
})

export default router