import { School, Geolocation, Locale } from '../data/schools.js'
import { seedGeolocations } from '../seed/seed.js'

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

    console.log("Updating school with ID:", id)
    console.log("Payload:", payload)

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


export {
    getSchools,
    createSchool,
    updateSchool,
    deleteSchool,
    createGeolocation,
    createLocale
}