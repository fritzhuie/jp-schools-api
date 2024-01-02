import express from 'express' 
const router = express.Router() 
import jwt from 'jsonwebtoken'
import { getSchools, createSchool, updateSchool, deleteSchool, seedEverything } from '../controllers/schools.js' 

const JWT_SECRET = 'your_secret_key'; // remove from codepabe, replace with a secure key

router.post('/signin', (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    
    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
    }

    // Create a token
    const token = jwt.sign({ phone: phoneNumber }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ token });
});

router.get('/schools', async function(req, res) {
    try {

        const API_KEY = process.env.API_KEY
        // const clientApiKey = req.headers['x-api-key'];
        // if (!clientApiKey || clientApiKey !== API_KEY) {
        //     return res.status(401).json({ message: "Invalid API key" });
        // }

        const grade = req.query.grade
        const latitude = req.query.latitude
        const longitude = req.query.longitude
        const response = await getSchools(grade, latitude, longitude)
        console.log(`response: ${response}`)
        res.status(200).json(response)
    }catch(error) {
        res.status(500).json({
            message: `There was an error getting schools: ${error}`
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
        res.status(500).json({
            message: message,
            message: `There was an error creating a school`
        })
    }
})

router.put('/schools/:sid', async function(req, res) {
    try {
        const payload = req.body
        const id = req.params.sid
        console.log(payload)
        const updatedSchool = await updateSchool(id, payload)
        res.status(200).json({
            message: "it worked, maybe",
            updatedSchool
        })
    } catch (error) {
        const message = error.message
        res.status(500).json({
            message: error,
        })
    }
})

router.delete('/schools/:sid', async function(req, res) {
    try {
        const id = req.params.sid
        const response = await deleteSchool(id)
        res.status(200).json({
            response
        })
    } catch(error) {
        const message = error.message
        res.status(418).json({
            message: message,
            message: `There was an error deleting a movie`
        })
    }
})

router.get('/schools/seed', async function(req, res) {
    try {
        const id = req.params.sid
        const response = await seedEverything()
        res.status(200).json({
            response
        })
    } catch(error) {
        const message = error.message
        res.status(418).json({
            message: message,
            message: `There was an error deleting a movie`
        })
    }
})

export default router