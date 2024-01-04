import express, { response } from "express"
import jwt from "jsonwebtoken"
const social = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

import {
    login,
    createAccount,
    readProfile,
    updateAvatar,
    denyFriendRequest,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    getFriendRecommendations,
    refreshPolls,
    polls,
    answerPoll
} from "../controllers/social.js"

// GET activity feed
// GET inbox

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

// Authentication *********************************************************************************************************

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
        const response = await createAccount(req.body)
        if (response) {
            res.status(200).json({
                message: `Account created, please log in`,
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

// PROFILE ACCESS ****************************************************************************************************

social.get("/profile", verifyToken, async (req, res) => {
    try {
        const phoneNumber = req.user.phone
        console.log("pulling self account for: ", phoneNumber)
        const response = await readProfile(phoneNumber)
        if (response) {
            res.status(200).json(response)
        }
    } catch (error) {
        res.status(403).json({
            message: error,
        })
    }
})

social.get("/profile/:phone", verifyToken, async (req, res) => {
    try {
        const phoneNumber = req.params.phone
        console.log("pulling other account for: ", phoneNumber)
        const response = await readProfile(phoneNumber)
        if (response) {
            res.status(200).json(response)
        }
    } catch (error) {
        res.status(403).json({
            message: error,
        })
    }
})

// AVATAR MANAGEMENT *********************************************************************************************************

social.put("/avatar", verifyToken, async (req, res) => {
    try {
        const phoneNumber = req.user.phone
        const url = req.body.url
        console.log(typeof url)
        console.log(url)
        console.log(`changing avatar for ${phoneNumber} to ${url}`)
        const response = await updateAvatar(phoneNumber, url)
        if (response) {
            res.status(200).json(response)
        } else {
            res.status(403).json({
                message: "response was null",
            })
        }
    } catch (error) {
        res.status(403).json({
            message: error,
        })
    }
})

// FRIEND RECOMMENDATION ************************************************************************************************************

social.get("/friend/finder", verifyToken, async (req, res) => {
    try {
        const userPhone = req.user.phone
        if (!userPhone) { throw new Error("user not found") }

        console.log(`getting friend recommendations for ${userPhone}`)

        const response = await getFriendRecommendations(userPhone)

        console.log("resonse", response)

        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(403).json({
            message: error
        })
    }
})


// FRIEND MANAGEMENT *********************************************************************************************************

social.put("/friend/remove", verifyToken, async (req, res) => {
    try {
        const userPhone = req.user.phone
        const target = req.body.phone

        if (userPhone === target) {
            throw new Error("target is self")
        }

        console.log(`removing friend ${target} from ${userPhone}`)
        response = await removeFriend(userPhone, target)

        res.status(200).json(response)
    } catch (error) {
        res.status(403).json({
            message: error
        })
    }
})

social.put("/friend/accept", verifyToken, async (req, res) => {
    try {
        const userPhone = req.user.phone
        const target = req.body.phone

        if (userPhone == target) {
            throw new Error("cannot add yourself as a friend")
        }
        console.log(`accepting friend request from ${target}`)
        response = await acceptFriendRequest(userPhone, target)

        res.status(200).json(response)
    } catch (error) {
        res.status(403).json({
            message: error
        })
    }
})

social.put("/friend/deny", verifyToken, async (req, res) => {
    try {
        const userPhone = req.user.phone
        const target = req.body.phone

        if (userPhone == target) {
            throw new Error("cannot add yourself as a friend")
        }
        console.log(`denying friend request from ${target}`)
        response = await denyFriendRequest(userPhone, target)

        res.status(200).json(response)
    } catch (error) {
        res.status(403).json({
            message: error
        })
    }
})

social.put("/friend/invite", verifyToken, async (req, res) => {
    try {
        const userPhone = req.user.phone
        const target = req.body.phone

        if (userPhone == target) {
            throw new Error("cannot add yourself as a friend")
        }
        console.log(`sending friend invite to ${target} from ${userPhone}`)
        const response = await sendFriendRequest(userPhone, target)

        res.status(200).json(response)
    } catch (error) {
        res.status(403).json({
            message: error
        })
    }
})

// POLLS *********************************************************************************************************

social.get("/polls/refresh", async (req, res) => {
    try {
        const response = await refreshPolls()
        res.status(200).json({
            message: `done seeded polls`,
        })
    } catch (error) {
        res.status(403).json({
            message: `There was an error: ${error}`,
        })
    }
})

social.get("/polls", verifyToken, async (req, res) => {
    try {
        const userPhone = req.user.phone
        const response = await polls(userPhone)
        console.log(response)
        res.status(200).json({
            response
        })
    } catch (error) {
        res.status(403).json({
            message: `There was an error: ${error}`,
        })
    }
})

social.post("/polls/answer", verifyToken, async (req, res) => {
    try {
        const userPhone = req.user.phone
        const poll = req.body.poll
        const chosen = req.body.chosen

        const response = await answerPoll(userPhone, poll, chosen)

        res.status(200).json({
            message: `answered poll successfully`,
        })
    } catch (error) {
        res.status(403).json({
            message: `There was an error: ${error}`,
        })
    }
})


// AUTH **********************************************************************************************************

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
        next()
    } catch (error) {
        res.status(401).json({ message: "Invalid token" })
    }
}

export default social
