import fs from 'fs'
import csv from 'csv-parser'
import path from 'path'
import { fileURLToPath } from 'url';
import { createGeolocation, createSchool, createLocale } from '../controllers/schools.js';
import { createCompliment } from '../controllers/social.js';

async function seedGeolocations() {

    const results = [];

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.join(__dirname, 'locationData.csv');

    fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      results.push(data)
    })
    .on('end', () => {
      seedDatabase(results)
  })
  
  const seedDatabase = async (payload) => {
      try {
          const response = await createGeolocation(payload);
          console.log('Geolocations seeded successfully', response);
      } catch (error) {
          console.error('Error seeding database:', error);
      }
  }   
}

async function seedSchools() {

    const results = [];

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.join(__dirname, 'schoolData.csv');

    fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
    //   console.log(data);
      results.push(data)
    })
    .on('end', () => {
    //   console.log(results)
      seedDatabase(results)
  })
  
  const seedDatabase = async (payload) => {
      try {
          const response = await createSchool(payload);
          console.log('Schools seeded successfully', response);
      } catch (error) {
          console.error('Error seeding database:', error);
      }
  }   
}

async function seedLocales() {

    const results = [];

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.join(__dirname, 'localeData.csv');

    fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
    //   console.log(data);
      results.push(data)
    })
    .on('end', () => {
    //   console.log(results)
      seedDatabase(results)
  })
  
  const seedDatabase = async (payload) => {
      try {
          const response = await createLocale(payload);
          console.log('Locales seeded successfully');
      } catch (error) {
          console.error('Error seeding database:', error);
      }
  }   
}

async function seedCompliments() {

    const results = [];

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.join(__dirname, 'compliments.csv');

    fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      results.push(data)
    })
    .on('end', () => {
      seedDatabase(results)
  })
  
  const seedDatabase = async (payload) => {
      try {
          const response = await createCompliment(payload);
          console.log('Compliments seeded successfully', response);
      } catch (error) {
          console.error('Error seeding database:', error);
      }
  }   
}

const seedSchoolData = async () => {
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
    seedGeolocations,
    seedLocales,
    seedSchools,
    seedCompliments,
    seedSchoolData
}
