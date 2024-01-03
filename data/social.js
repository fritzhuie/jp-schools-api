import mongoose, { Mongoose, mongo } from "mongoose";

const interaction = new mongoose.Schema(
    {
        uid:          { type: String, required: true },
        sender:       { type: String, required: true },
        reciever:     { type: String, required: true },
        message:      { type: String, required: true },
        viewed:       { type: Boolean, default: false },
        senderReveal: { type: Boolean, default: false } //won't use, ice box
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

const Compliment = mongoose.model("Compliment", compliment)

const user = new mongoose.Schema(
    {
        phonenumber:   { type: Number, required: true, unique: true },
        username:      { type: String, required: true, unique: true },
        profileImg:    { type: String },
        gender:        { type: String },
        familyName:    { type: String },
        givenName:     { type: String },
        friends:      [{ type: String }], //userIDs (friend ids)
        blocked:      [{ type: String }], //userIDs (blocked users)
        pending:      [{ type: String }], //userIDs (friend requests)
        inbox:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interaction' }], //your activity
        activity:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interaction' }], //friends activity
        queue:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Compliment'  }]  //queue of daily polls
    },
    { timestamps: true }
)

const User = mongoose.model("User", user)

export { User, Interaction, Compliment }