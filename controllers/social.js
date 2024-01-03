
import { Compliment, Interaction, User } from "../data/social.js"

// POST phone login
const login = async (phoneNumber) => {
    try {
        const user = await User.exists({phone: phoneNumber})
        return user
    } catch (error) {
        throw `error thrown for ${phoneNumber}: ${error}`
    }
}

// POST create account
const createAccount = async (phone, payload) => {
    try {
        if (!phone) { throw new Error("Missing phoneNumber") }

        const existingUser = await User.findOne({ phone: payload.phonenumber })
        if (existingUser) { return existingUser }

        const newUser = new User(
            {
                phone: phone,
                username: payload.username,
                familyname: payload.familyname,
                givenname: payload.givenname
            }
        )
        await newUser.save()
        return newUser
    } catch (e) {
        throw e
    }
}

// PUT change profile photo
const updateProfileImage = async (newImageUrl) => {
    try {

        phoneNumber = getUserInfoFromToken()

        const result = await User.findOneAndUpdate(
            { phone: phoneNumber },       // find the user by phone number
            { profileimg: newImageUrl },  // update the profileImg field
            { new: true }                 // return the updated document
        )

        return result
    } catch (e) {
        throw e
    }
}

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

const createCompliment = async (payload) => {
    try {
        return Compliment.insertMany(payload)
    } catch (e) {
        throw e
    }
}

export {
    login,
    createCompliment,
    createAccount,
    updateProfileImage
}