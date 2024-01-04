
import { Compliment, Interaction, User } from '../data/social.js'

// AUTH  ******************************************************************************************************

const login = async (phoneNumber) => {
    try {
        const user = await User.exists({phone: phoneNumber})
        return user
    } catch (e) {
        throw `error thrown for ${phoneNumber}: ${e}`
    }
}

// PROFILE ******************************************************************************************************

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

const getFriendRecommendations = async (userPhone) => {
    try {
        const user = await User.findOne({ phone: userPhone })
        if (!user) throw new Error('User not found')

        const allUsers = await User.find({ phone: { $ne: userPhone } }, 'phone -_id')
        const allPhoneNumbers = allUsers.map(user => user.phone)

        const recommendations = allPhoneNumbers.filter(phoneNumber => 
            !user.friends.includes(phoneNumber)
        )

        const profiles = await Promise.all(
            recommendations.map(phone => User.findOne({ phone }, 'username givenname familyname avatar -_id'))
        )

        console.log("profiles", profiles)

        return profiles
    } catch (e) {
        console.log(`something went wrong: ${e}`)
        throw `something went wrong: ${e}`
    }
}


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

// INTERACTIONS *************************************************************************************************

const handlePollInteraction = async (user, payload) => {
    // remove poll from current user
    // send interaction to chosen user
    //return 200
}

const refreshPolls = async () => {
    // add 10 random polls to user
    //return 200
}

const getInbox = async (user) => {
    // return User.inbox
    //return 200
}

const activity = async (user) => {
    // pull friends list from user
    // for each friend, pull inbox, flat()
    // sort by created date
    // return array of interactions
}

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
    removeFriend,
    getFriendRecommendations
}

// GET activity feed
// GET inbox

// POST block user
// DELETE unblock all users