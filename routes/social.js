import express from "express"
const social = express.Router()
import { seedCompliments } from "../seed/seed.js"

router.get("/seed", async (req, res) => {
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