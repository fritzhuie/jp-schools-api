import express from "express"
const seed = express.Router()
import { seedCompliments, seedSchoolData } from "../seed/seed.js"

seed.get("/seed", async (req, res) => {
    try {
        const id = req.params.sid
        const response = await seedCompliments()
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

seed.get("/schools/seed", async function (req, res) {
    try {

        const API_KEY = process.env.API_KEY
        const clientApiKey = req.headers['x-api-key']

        if (!clientApiKey || clientApiKey !== API_KEY) {
            // res.status(401).json({ message: "Invalid API key" })
        }

        const id = req.params.sid
        const response = await seedSchoolData()
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

export default seed