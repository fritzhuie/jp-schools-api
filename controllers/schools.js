import { School, Geolocation, Locale } from '../data/schools.js'

const getSchools = async () => {
    return School.find({})
    .then((response) => { return response })
    .catch((error) => { throw error })
}

const createSchool = async (data) => {
    return School.insertMany(data)
    .then((response) => { return response })
    .catch((error) => { throw error })
}

export {
    getSchools,
    createSchool
}