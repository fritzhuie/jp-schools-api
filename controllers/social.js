
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
const createAccount = async (payload) => {
    try {
        const userExists = await User.exists({ phone: payload.phone })
        if (userExists) { throw "user exists" }

        const usernameExists = await User.exists({ username: payload.username })
        if (usernameExists) { throw "username taken" }

        const newUser = new User(
            {
                phone: payload.phone,
                username: payload.username,
                familyname: payload.familyname,
                givenname: payload.givenname
            }
        )
        await newUser.save()
        return newUser
    } catch (e) {
        throw `createAccount: ${e}`
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