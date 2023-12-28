import mongoose, { mongo } from "mongoose";

const schoolSchema = new mongoose.Schema(
    {
        postcode:   { type:Number, required:true },
        sid:        { type:String, required:true },
        name:       { type:String, required:true },
        address:    { type:String, required:true },
        class:      { type:String, required:true }
    }
)

const locationSchema = new mongoose.Schema(
    {
        postcode:   { type:Number, required:true, unique: true},
        latitude:   { type:Number, required:true },
        longitude:  { type:Number, required:true }
    }
)

const postcodeInfoScema = new mongoose.Schema(
    {
        postcode:   { type:Number, required:true, unique: true },
        prefecture: { type:String, required:true },
        city:       { type:String, required:true },
        ward:       { type:String, required:true }
    }
)

const School = mongoose.model('School', schoolSchema)
const Geolocation = mongoose.model('Location', locationSchema)
const Locale = mongoose.model('Locale', postcodeInfoScema)

export {
    School,
    Geolocation,
    Locale
}