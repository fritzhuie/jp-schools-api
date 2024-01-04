
import { Compliment, Interaction, User } from '../data/social.js'

// AUTH  ******************************************************************************************************

// POST phone number login
const login = async (phoneNumber) => {
    try {
        const user = await User.exists({phone: phoneNumber})
        return user
    } catch (e) {
        throw `error thrown for ${phoneNumber}: ${e}`
    }
}

// PROFILE ******************************************************************************************************

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

const readProfile = async (phoneNumber) => {
    const user = await User.findOne({ phone: phoneNumber })
    if (user) { return user }
    throw 'user not found'
}


// FRIEND MANAGEMENT *********************************************************************************************

const sendFriendRequest = async (userPhone, friendPhone) => {
    try {
        const subject = await User.findOne({ phone: friendPhone })
        if (!subject) throw new Error('User not found')

        if (!subject.pending.includes(userPhone)) {
            subject.pending.push(userPhone)
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

        subject.pending = subject.pending.filter(phone => phone !== Number(friendPhone))
        await subject.save()

        return subject
    } catch (e) {
        throw e
    }
}

const acceptFriendRequest = async (userPhone, friendPhone) => {
    try {
        const subject = await User.findOne({ phone: userPhone })
        const friend = await User.findOne({ phone: friendPhone })
        if (!subject || !friend) throw new Error('User not found')
    
        const friendRequestIndex = subject.pending.indexOf(friendPhone)
        if (friendRequestIndex !== -1) {
            subject.friends.push(friendPhone)
            friend.friends.push(userPhone)
            subject.pending = subject.pending.filter(phone => phone !== Number(friendPhone))
            friend.pending = friend.pending.filter(phone => phone !== Number(userPhone))
            await subject.save()
            await friend.save()
            return "successfully added friend"
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
        const friend = await User.findOne({ phone: friendPhone })
        if (!subject || !friend) throw new Error('User not found')

        subject.friends = subject.friends.filter(phone => phone !== Number(friendPhone))
        friend.friends = friend.friends.filter(phone => phone !== Number(userPhone))
        await subject.save()
        await friend.save()

        return subject
    } catch (e) {
        throw e
    }
}

// AVATAR ***************************************************************************************************

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