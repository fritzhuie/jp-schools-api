
import { Compliment, Interaction, User, Poll } from '../data/social.js'
import _ from 'lodash'
import mongoose from 'mongoose'

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
            recommendations.map(phone => User.findOne({ phone }, 'username givenname familyname avatar phone -_id'))
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
            { phone: phone }, //find this
            { avatar: newImageUrl }, // update this
            { new: true } // return the updated document
        )
        return result
    } catch (e) {
        throw e
    }
}

// INTERACTIONS *************************************************************************************************

const polls = async (userPhone) => {
    try {
        const user = await User.findOne({ phone: userPhone })
        let polls = []
        for(const  pollId of user.queue) {
            const p = await Poll.findOne({ _id: pollId })
            if(p) {
                polls.push(p)
            }
        }
        console.log("returning: ", polls)
        return polls
    } catch (e) {
        throw e
    }
}

const answerPoll = async (userPhone, poll, chosen) => {

    try {
        const user = await User.findOne({ phone: userPhone })
        const target = await User.findOne({ phone: chosen })

        const pollObjectId = new mongoose.Types.ObjectId(poll)
        console.log( pollObjectId )
        console.log( user.queue)

        const pollIndex = user.queue.indexOf(pollObjectId)
        if (pollIndex === -1) {
            throw new Error(`Poll not found in user's queue`)
        }

        const pollData = await Poll.findOne({ _id: poll})

        const interaction = new Interaction({
            sender: userPhone,
            message: pollData.message,
            emoji: pollData.emoji,
            color: pollData.color,
            viewed: false
        })
        await interaction.save()
        
        await User.updateOne({ _id: user._id }, { $pull: { queue: poll } })
        await User.updateOne({ _id: target._id }, { $push: { inbox: interaction._id } })

        return 200
    } catch (e) {
        console.error('Error answering poll:', e)
        throw e
    }
}

const refreshPolls = async () => {
    try {
      const compliments = await Compliment.find()
  
      const users = await User.find()
  
      for (const user of users) {
        const randomCompliments = _.sampleSize(compliments, 3)
        const polls = []

        for(let compliment of randomCompliments) {
            const randomUsers = _.sampleSize(users, 4)
            const choices = randomUsers.map(user => user.phone) 

            const newPoll = new Poll(
                {
                    emoji: compliment.emoji,
                    message: compliment.message,
                    color: compliment.color,
                    choices: choices
                }
            )
            console.log(newPoll)
            await newPoll.save()
            polls.push(newPoll)
        }
  
        await User.updateOne({ _id: user._id }, { $set: { queue: [] } })

        await User.updateOne(
          { _id: user._id },
          { $push: { queue: { $each: polls.map(c => c._id) } } }
        )
      }
  
      return 200
    } catch (e) {
      console.error('Error refreshing polls:', e)
      throw e
    }
}

const inbox = async (userphone) => {
    try {
        const user = await User.findOne({ phone: userphone })
        if (!user) { throw new Error('User not found') }

        let inbox = []

        for(const objectId of user.inbox) {
            const interaction = await Interaction.findOne({_id: objectId})
            console.log(interaction)
            const sender = await User.findOne({phone: interaction.sender })
            console.log(sender)
            const update = {
                sender: sender.phone,
                message: interaction.message,
                emoji: interaction.emoji
            }
            console.log(update)
            inbox.push(update)
        }
        return inbox
    } catch (e) {
        console.error('Error getting inbox:', e)
        throw e
    }
}

const activityFeed = async (userphone) => {
    // STRETCH GOAL
    // pull friends list from user
    const user = await User.findOne({phone: userphone})
    const updates = await Promise.all(
        user.friends.map(phone => User.findOne({ phone: phone }, 'inbox -_id'))
    )
    const updatesSorted = updates.sort((a,b) => {
        //sort by Interaction.createdAt
    })
    // sort by created date
    // return array of interactions
}

// SEEDING **************************************************************************************************

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
    getFriendRecommendations,
    inbox,
    activityFeed,
    polls,
    refreshPolls,
    answerPoll
}