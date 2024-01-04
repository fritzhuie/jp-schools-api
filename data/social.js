import mongoose, { Mongoose, mongo } from 'mongoose'

const interaction = new mongoose.Schema(
    {
        uid:          { type: String, required: true },
        sender:       { type: String, required: true },
        reciever:     { type: String, required: true },
        message:      { type: String, required: true },
        viewed:       { type: Boolean, default: false },
        reveal:       { type: Boolean, default: false } //won't use, ice box
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

const user = new mongoose.Schema(
    {
        phone:         { type: Number, required: true, unique: true },
        username:      { type: String, required: true, unique: true },
        avatar:        { type: String, default: null },
        familyname:    { type: String, default: null },
        givenname:     { type: String, default: null  },
        friends:      [{ type: Number }], //userIDs (friend ids)
        blocked:      [{ type: Number }], //userIDs (blocked users)
        pending:      [{ type: Number }], //userIDs (friend requests)
        inbox:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interaction' }], //your activity
        queue:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Compliment'  }]  //queue of daily polls
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

export { User, Interaction, Compliment }