import express from 'express' 
const router = express.Router() 
import { getSchools, createSchool, updateSchool, deleteSchool, seedEverything } from '../controllers/schools.js' 

let username = null

router.get('/schools', async function(req, res) {
    try {
        const grade = req.query.grade
        const latitude = req.query.latitude
        const longitude = req.query.longitude
        const response = await getSchools(grade, latitude, longitude)
        res.status(200).json({
            response
        })
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