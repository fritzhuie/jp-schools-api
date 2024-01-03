
import { Compliment, Interaction, User } from "../data/social.js"

// POST phone login

// POST create account
const createAccount = async (payload) => {
    try {
        return User.insertMany(payload)
    } catch (e) {
        throw e
    }
}

// PUT change profile photo
const updateProfileImage = async (newImageUrl) => {
    try {

        phoneNumber = getUserInfoFromToken()

        const result = await User.findOneAndUpdate(
            { phonenumber: phoneNumber }, // find the user by phone number
            { profileImg: newImageUrl },  // update the profileImg field
            { new: true }                 // return the updated document
        );

        return result;
    } catch (e) {
        throw e;
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
    createCompliment
}