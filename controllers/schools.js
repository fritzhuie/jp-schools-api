import { School, Geolocation, Locale } from '../data/schools.js'
import { seedGeolocations, seedLocales, seedSchools } from '../seed/seed.js'

function filterSchools(grade) {
        // C1(中学校)	Lower 2nd (7-9)
        // C2(義務)	Compulsory (7-12?)
        // D1(高校)	Upper Secondary (10-12)
        // D2(中等)	Secondary (7-9?)
        // E1(特支盲)	Upper 2nd (blind) (10-12)
        // E1(特支聾)	Upper 2nd (deaf) (10-12)
        // E1(養護)	Special Needs
        // H1(専修)	Specialization School (10-12+)
        // H2(各種)	Foreign / misc

    // if (grade < 7 || grade > 12 ) { return [] }
    // if (grade === 7 || grade === 8 || grade === 9) {
    //     return ["C1", "C2", "D2", "E1", "H2"]
    // }
    // if (grade === 10 || grade === 11 || grade === 12) {
    //     return ["C2", "D1", "D2", "E1", "H2"]
    // }

    // screw it, do this later, search all for now
    return ["C1","C2","D1","D2","E1","E1","E1","H1","H2"]
}

const getSchools = async (grade, latitude, longitude) => {

    const lat = parseFloat(latitude)
    const lon = parseFloat(longitude)
    if (isNaN(lat) || isNaN(lon)) { 
        throw "Missing valid latitude and longitude"
    }

    async function processLocations(response) {
        let postcodesByDistance = []
            for(let location of response) {
                const dx = location.latitude - latitude
                const dy = location.longitude - longitude
                postcodesByDistance.push({distance: Math.sqrt(dx * dx + dy * dy), postcode: location.postcode})
            }
    
            postcodesByDistance.sort((a, b) => a.distance - b.distance)
            postcodesByDistance = postcodesByDistance.slice(0, 100)
            console.log(postcodesByDistance.slice(0, 10))
    
            const schoolPromises = postcodesByDistance.map(postcode => {
                return School.find({ postcode: postcode.postcode })
            });
    
            const schoolsByDistanceNested = await Promise.all(schoolPromises)
            const schoolsByDistance = schoolsByDistanceNested.flat()
            console.log(schoolsByDistance)
            return schoolsByDistance.slice(0, 10)
    }

    const locations = Geolocation.find({}).limit(20)
    .then(response => { 
        processLocations(response)
        return response
    })
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