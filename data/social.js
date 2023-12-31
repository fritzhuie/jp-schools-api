import mongoose, { Mongoose, mongo } from 'mongoose'

const interaction = new mongoose.Schema(
    {
        sender:       { type: String, required: true },
        message:      { type: String, required: true },
        emoji:        { type: String, required: true },
        color:        { type: String, required: true },
        viewed:       { type: Boolean, default: false }
    },
    { timestamps: true }
)

const Interaction = mongoose.model('Interaction', interaction)

const compliment = new mongoose.Schema(
    {
        emoji:        { type: String, required: true },
        color:        { type: String, required: true },
        message:      { type: String, required: true, unique: true }
    }
)

const Compliment = mongoose.model('Compliment', compliment)

const poll = new mongoose.Schema(
    {
        emoji:        { type: String, required: true },
        color:        { type: String, required: true },
        message:      { type: String, required: true },
        choices:      [{ type: String }]
    },
    { timestamps: true }
)

const Poll = mongoose.model('Poll', poll)

const user = new mongoose.Schema(
    {
        phone:         { type: Number, required: true, unique: true },
        username:      { type: String, required: true, unique: true },
        avatar:        { type: String, default: "img/portrait-0.png" },
        familyname:    { type: String, default: null },
        givenname:     { type: String, default: null },
        friends:      [{ type: Number }], //userIDs (friend ids)
        blocked:      [{ type: Number }], //userIDs (blocked users)
        pending:      [{ type: Number }], //userIDs (friend requests)
        inbox:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interaction' }], //your activity
        queue:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Poll'  }]  //queue of polls
    },
    { timestamps: true }
)

user.pre('save', function(next) {
    this.friends = Array.from(new Set(this.friends))
    this.blocked = Array.from(new Set(this.blocked))
    this.pending = Array.from(new Set(this.pending))
    next()
})

const User = mongoose.model('User', user)

export { User, Interaction, Compliment, Poll }