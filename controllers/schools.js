import { School, Geolocation, Locale } from "../data/schools.js"
import { seedGeolocations, seedLocales, seedSchools } from "../seed/seed.js"

const getSchools = async (query) => {

    const grade = query.grade
    const latitude = query.latitude
    const longitude = query.longitude
    const limit = query.limit

    const lat = parseFloat(latitude)
    const lon = parseFloat(longitude)
    if (isNaN(lat) || isNaN(lon)) {
        throw "Missing valid latitude and longitude"
    }

    const locations = await Geolocation.find({}).limit(20)
    return schoolsAtLocations(locations, latitude, longitude)
}

async function schoolsAtLocations(locations, latitude, longitude) {
    let postcodesByDistance = []

    for (let location of locations) {
        const dx = location.latitude - latitude
        const dy = location.longitude - longitude
        postcodesByDistance.push({
            distance: Math.sqrt(dx * dx + dy * dy),
            postcode: location.postcode,
        })
    }

    postcodesByDistance.sort((a, b) => a.distance - b.distance)
    postcodesByDistance = postcodesByDistance.slice(0, 100)
    console.log(" top 10 Postcodes: ", postcodesByDistance.slice(0, 10))

    const schoolPromises = postcodesByDistance.map((postcode) => {
        return School.find({ postcode: postcode.postcode })
    })

    const schoolsByDistanceNested = await Promise.all(schoolPromises)
    const schoolsByDistance = schoolsByDistanceNested.flat()
    return schoolsByDistance
}

const createSchool = async (payload) => {
    try {
        return School.insertMany(payload)
    } catch (e) {
        throw e
    }
}

const updateSchool = async (id, payload) => {
    try {
        return School.updateOne({ sid: id }, { $set: payload })
    } catch (e) {
        throw e
    }
}

const deleteSchool = async (id) => {
    try {
        return School.deleteOne({ sid: id })
    } catch (e) {
        throw e
    }
}

const createGeolocation = async (payload) => {
    try {
        return Geolocation.insertMany(payload)
    } catch (e) {
        throw e
    }
}

const createLocale = async (payload) => {
    try {
        return Locale.insertMany(payload)
    } catch (e) {
        throw e
    }
}

const seedEverything = async () => {
    try {
        await seedSchools()
        await seedLocales()
        await seedGeolocations()
        console.log("Seeding complete 🔥")
    } catch (e) {
        console.log("e during seeding:", e)
    }
}

export {
    getSchools,
    createSchool,
    updateSchool,
    deleteSchool,
    createGeolocation,
    createLocale,
    seedEverything,
}

function filterSchools(grade) {
    /* school classifications
    C1(中学校)	Lower 2nd (7-9)
    C2(義務)	Compulsory (7-12?)
    D1(高校)	Upper Secondary (10-12)
    D2(中等)	Secondary (7-9?)
    E1(特支盲)	Upper 2nd (blind) (10-12)
    E1(特支聾)	Upper 2nd (deaf) (10-12)
    E1(養護)	Special Needs
    H1(専修)	Specialization School (10-12+)
    H2(各種)	Foreign / misc
    */

    if (grade < 7 || grade > 12) {
        return []
    }
    if (grade === 7 || grade === 8 || grade === 9) {
        return ["C1", "C2", "D2", "E1", "H2"]
    }
    if (grade === 10 || grade === 11 || grade === 12) {
        return ["C2", "D1", "D2", "E1", "H2"]
    }

    // TODO: screw it, do this later, search all for now
    return ["C1", "C2", "D1", "D2", "E1", "E1", "E1", "H1", "H2"]
}
