import express from "express"
const social = express.Router()

import jwt from "jsonwebtoken"
// import dotenv from 'dotenv'
const JWT_SECRET = process.env.JWT_SECRET

// POST phone login
// POST create account
// PUT change profile photo

// GET friend recommendations
// GET activity feed
// GET inbox

// POST send friend request
// POST accept friend request
// POST reject friend request

// POST block user
// DELETE unblock all users

// POST answer poll
// POST skip poll




social.get("/", (req, res) => {
    try {
        res.status(200).json({
            message: `ping`
        })
    } catch (error) {
        res.status(500).json({
            message: `There was an error redirecting: ${error}`,
        })
    }
})

// ******* user information is stored in bearer token, then retrieved from jwt.decode()

social.post("/login", (req, res) => {
    try {

        const phoneNumber = req.body

        if (!phoneNumber) {
            return res.status(400).json({ message: "Phone number is required" })
        }

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

social.post('/signup', verifyToken, async (req, res) => {
    try {
        console.log("signing up phone number", req.user.phone)
        const response = await createAccount()
        res.status(200).json({
            response
        })
    } catch (error) {
        res.status(403).json({
            message: `Error creating account: ${error}`
        })
    }
})

social.get('/verifyToken', verifyToken, (req, res) => {
    try {
        res.status(200).json({ message: `Token verified successfully. Phone number from token: ${req.user.phone}` })
    } catch (error) {
        res.status(500).json({
            message: `There was an error: ${error}`
        })
    }
})

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'No token provided' })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
        console.log(req.user)
        next()
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' })
    }
}

export default social