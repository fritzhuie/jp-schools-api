import express from "express"
const schools = express.Router()
import {
    getSchools,
    createSchool,
    updateSchool,
    deleteSchool,
} from "../controllers/schools.js"

schools.get("/schools", async function (req, res) {
    try {
        const API_KEY = process.env.API_KEY
        const clientApiKey = req.headers['x-api-key']

        if (!clientApiKey || clientApiKey !== API_KEY) {
            // res.status(401).json({ message: "Invalid API key" })
        }

        const parameters = req.query
        const response = await getSchools(parameters)
        console.log(`response: ${response}`)
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            message: `There was an error getting schools: ${error}`,
        })
    }
})

schools.post("/schools", async function (req, res) {
    try {
        const payload = req.body
        const response = await createSchool(payload)
        res.status(200).json({
            response,
        })
    } catch (error) {
        const message = error.message
        res.status(500).json({
            message: message,
            message: `There was an error creating a school`,
        })
    }
})

schools.put("/schools/:sid", async function (req, res) {
    try {
        const payload = req.body
        const id = req.params.sid
        console.log(payload)
        const updatedSchool = await updateSchool(id, payload)
        res.status(200).json({
            message: "it worked, maybe",
            updatedSchool,
        })
    } catch (error) {
        const message = error.message
        res.status(500).json({
            message: error,
        })
    }
})

schools.delete("/schools/:sid", async function (req, res) {
    try {
        const id = req.params.sid
        const response = await deleteSchool(id)
        res.status(200).json({
            response,
        })
    } catch (error) {
        const message = error.message
        res.status(418).json({
            message: message,
            message: `There was an error deleting a movie`,
        })
    }
})

export default schools