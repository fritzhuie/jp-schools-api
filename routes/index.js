import express from 'express' 
const router = express.Router() 
import { getSchools, createSchool } from '../controllers/schools.js' 

router.get('/schools', async function(req, res) {
    try {
        const response = await getSchools()
        console.log(response)
        res.status(200).json({
            response
        })
    }catch(error) {
        res.status(418).json({
            message: message,
            message: `There was an error getting schools`
        })
    }
})

router.post('/schools', async function(req, res) {
    try {
        const payload = req.body
        const response = await createSchool(payload)
        res.status(200).json({
            response
        })
    } catch(error) {
        const message = error.message
        res.status(418).json({
            message: message,
            message: `There was an error creating a school`
        })
    }
})

export default router