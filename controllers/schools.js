import { School, Geolocation, Locale } from '../data/schools.js'

const getSchools = async () => {
    return School.find({})
    .then((response) => { return response })
    .catch((error) => { throw error })
}

const createSchool = async (payload) => {
    const data = {
        postcode: 1234567890,
        sid: "65rftyg",
        name: "namey-name",
        address: "address-of-school",
        class: "C1"
    }
    return School.insertMany(data)
    .then((response) => { return response })
    .catch((error) => { throw error })
}

export {
    getSchools,
    createSchool
}