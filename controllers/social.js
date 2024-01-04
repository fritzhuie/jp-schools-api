
import { Compliment, Interaction, User } from '../data/social.js'

// POST phone number login
const login = async (phoneNumber) => {
    try {
        const user = await User.exists({phone: phoneNumber})
        return user
    } catch (e) {
        throw `error thrown for ${phoneNumber}: ${e}`
    }
}

// POST create account
const createAccount = async (payload) => {
    try {
        const userExists = await User.exists({ phone: payload.phone })
        if (userExists) { throw 'user exists' }

        const usernameExists = await User.exists({ username: payload.username })
        if (usernameExists) { throw 'username taken' }

        const newUser = new User(
            {
                phone: payload.phone,
                username: payload.username,
                familyname: payload.familyname,
                givenname: payload.givenname
            }
        )
        await newUser.save()
        return `account created for phone number: ${payload.phone}`
    } catch (e) {
        throw `createAccount: ${e}`
    }
}

// view self profile
const readProfile = async (phoneNumber) => {
    const user = await User.findOne({ phone: phoneNumber })
    if (user) { return user }
    throw 'user not found'
}

const sendFriendRequest = async (userPhone, friendPhone) => {
    try {
        const subject = await User.findOne({ phone: userPhone })
        if (!subject) throw new Error('User not found')

        if (!subject.friends.includes(friendPhone)) {
            subject.friends.push(friendPhone)
            await subject.save()
        }

        return subject
    } catch (e) {
        throw e
    }
}

const denyFriendRequest = async (userPhone, friendPhone) => {
    try {
        const subject = await User.findOne({ phone: userPhone })
        if (!subject) throw new Error('User not found')

        // Check if friend's request is pending
        if (subject.pending.includes(friendPhone)) {
            subject.pending = subject.pending.filter(phone => phone !== friendPhone)
            await subject.save()
        }

        return subject
    } catch (e) {
        throw e
    }
}

const acceptFriendRequest = async (userPhone, friendPhone) => {
    try {
        const subject = await User.findOne({ phone: userPhone })
        if (!subject) throw new Error('User not found')
    
        if (subject.pending.includes(friendPhone)) {
            subject.friends.push(friendPhone)
            subject.pending = subject.pending.filter(phone => phone !== friendPhone)
            await subject.save()
        } else {
            throw new Error('friend request not found')
        }
    } catch (e) {
        throw e
    }
}

const removeFriend = async (userPhone, friendPhone) => {
    try {
        const subject = await User.findOne({ phone: userPhone })
        if (!subject) throw new Error('User not found')

        subject.friends = subject.friends.filter(phone => phone !== friendPhone)
        await subject.save()

        return subject
    } catch (e) {
        throw e
    }
}



// PUT change profile photo
const updateAvatar = async (phone, newImageUrl) => {
    try {
        const result = await User.findOneAndUpdate(
            { phone: phone },     // find the user by phone number
            { avatar: newImageUrl },    // update the profileImg field
            { new: true }               // return the updated document
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
    readProfile,
    updateAvatar,
    sendFriendRequest,
    denyFriendRequest,
    acceptFriendRequest,
    removeFriend
}