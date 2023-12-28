import express from 'express' 
const router = express.Router() 
//import { getMovies, createMovie, updateMovie, deleteMovie } from '../controllers/controller.js' 

router.get('/', (req, res) => {
    res.send('DICTIONARY APP!!')
})

export default router