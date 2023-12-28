import { mongo } from "mongoose";

const schoolSchema = new mongoose.Schema(
    {
        sid: {type:String, required:true},
        name: {type:String, required:true},
        address: {type:String, required:true},
        prefecture: {type:String, required:true},
        schooltype: {type:String, required:true}
    }
)

const locationSchema = new mongoose.Schema(
    {
        sid: {type:String, required:true},
        latitude: {type:Number, required:true},
        longitude: {type:Number, required:true}
    }
)

const School = mongoose.model('School', schoolSchema)
const Location = mongoose.model('Location', schoolSchema)

export {
    School,
    Location
}