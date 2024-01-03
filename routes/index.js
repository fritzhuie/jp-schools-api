import express from "express"
const router = express.Router()
import jwt from "jsonwebtoken"

const JWT_SECRET = "your_secret_key" // remove from codepabe, replace with a secure key

router.post("/signin", (req, res) => {
    try {
        const phoneNumber = req.body.phoneNumber

        if (!phoneNumber) {
            return res
                .status(400)
                .json({ message: "Phone number is required" })
        }

        // Create a token
        const token = jwt.sign({ phone: phoneNumber }, JWT_SECRET, {
            expiresIn: "24h",
        })

        res.json({ token })
    } catch (error) {
        res.status(500).json({
            message: `There was an error getting schools: ${error}`,
        })
    }
})

function verifyToken(req, res, next) {
    // Get the token from the request header
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' })
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' })
    }
    return next()
}

export default router
