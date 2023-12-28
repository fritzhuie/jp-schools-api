import { School, Geolocation, Locale } from '../data/schools.js'
import { seedGeolocations, seedLocales, seedSchools } from '../seed/seed.js'

const getSchools = async () => {
    return School.find({})
    .then((response) => { return response })
    .catch((error) => { throw error })
}

const createSchool = async (payload) => {
    return School.insertMany(payload)
    .then((response) => { return response })
    .catch((error) => { throw error })
}

const updateSchool = async (id, payload) => {

    return School.updateOne({ sid: id }, { $set: payload })
    .then((response) => { return response })
    .catch((error) => { 
        console.log(error)
        throw error 
    })
}

const deleteSchool = async (id) => {
    return School.deleteOne({ sid: id })
    .then((response) => { return response })
    .catch((error) => { throw error })
}

const createGeolocation = async (payload) => {
    return Geolocation.insertMany(payload)
    .then((response) => { return response })
    .catch((error) => { throw error })
}

const createLocale = async (payload) => {
    return Locale.insertMany(payload)
    .then((response) => { return response })
    .catch((error) => { throw error })
}

const seedEverything = async () => {
    seedSchools()
    .then(() => { seedLocales()
    .then(() => { seedGeolocations()
    .then(() => { console.log("Seeding complete 🔥") 
    })})}).catch((e) => console.log("error", e))
}

export {
    getSchools,
    createSchool,
    updateSchool,
    deleteSchool,
    createGeolocation,
    createLocale,
    seedEverything
}