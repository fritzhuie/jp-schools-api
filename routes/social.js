import express from "express"
import jwt from "jsonwebtoken"
const social = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

import { login, createAccount } from "../controllers/social.js"

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
            message: `ping`,
        })
    } catch (error) {
        res.status(500).json({
            message: `There was an error redirecting: ${error}`,
        })
    }
})

// ******* user information is stored in bearer token, then retrieved from jwt.decode()

social.post("/login", async (req, res) => {
    try {
        const phoneNumber = req.body.phone
        if (!phoneNumber) {
            return res.status(400).json({ message: "Phone number is required" })
        }

        const profile = await login(phoneNumber)
        if (profile) {
            const token = jwt.sign({ phone: phoneNumber }, JWT_SECRET, {
                expiresIn: "24h",
            })
            res.status(200).json({
                token: token,
                profile: profile
            })
        } else {
            res.status(403).json({
                message: `No profile found for ${phoneNumber}`,
            })
        }
    } catch (error) {
        res.status(500).json({
            message: `There was an error logging in: ${error}`,
        })
    }
})

social.post("/signup", async (req, res) => {
    try {
        const profile = await createAccount(req.body)
        if (profile) {
            const token = jwt.sign({ phone: req.body.phone }, JWT_SECRET, {
                expiresIn: "24h",
            })
            res.status(200).json({
                token: token,
                profile: profile
            })
        } else {
            res.status(403).json({
                message: `No profile found for ${phoneNumber}`,
            })
        }
    } catch (error) {
        res.status(403).json({
            message: `Error creating account: ${error}`,
        })
    }
})

social.get("/verifyToken", verifyToken, (req, res) => {
    try {
        res.status(200).json({
            message: `Token verified successfully. Phone number from token: ${req.user.phone}`,
        })
    } catch (error) {
        res.status(500).json({
            message: `There was an error: ${error}`,
        })
    }
})

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: "No token provided" })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
        console.log(req.user)
        next()
    } catch (error) {
        res.status(401).json({ message: "Invalid token" })
    }
}

export default social
