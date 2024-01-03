import mongoose, { Mongoose, mongo } from "mongoose";

const interaction = new mongoose.Schema(
    {
        uid:          { type: String, required: true },
        sender:       { type: String, required: true },
        reciever:     { type: String, required: true },
        message:      { type: String, required: true },
        viewed:       { type: Boolean, required: true, default: false },
        senderReveal: { type: Boolean, required: true, default: false }
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
        phonenumber:  { type: String, required: true, unique: true },
        username:     { type: String, required: true, unique: true },
        profileImg:   { type: String },
        gender:       { type: String },
        familyName:   { type: String },
        givenName:    { type: String },
        friends:      [{ type: String }], //userIDs (friend ids)
        blocked:      [{ type: String }], //userIDs (blocked users)
        pending:      [{ type: String }], //userIDs (friend requests)
        inbox:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interaction' }],
        activity:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interaction' }],
        queue:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Compliment'}]
    },
    { timestamps: true }
)

const User = mongoose.model("User", user)

export { User, Interaction, Compliment }