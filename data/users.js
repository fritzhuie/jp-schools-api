import mongoose, { mongo } from "mongoose";

const user = new mongoose.Schema(
    {
        phonenumber:    { type:String, required:true, unique:true },
        schoolid:       { type:String, required:false },
        grade:          { type:Number, required:false },
        profileImg:     { type:String, required:false },
        gender:         { type:String, required:false },
        username:       { type:String, required:true },
        familyName:     { type:String, required:true },
        givenName:      { type:String, required:false }
    }
)

const User = mongoose.model('User', user)

export {
    User
}