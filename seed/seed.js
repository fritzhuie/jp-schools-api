import fs from 'fs'
import csv from 'csv-parser'
import path from 'path'
import { fileURLToPath } from 'url';
import { createGeolocation, createSchool, createLocale } from '../controllers/schools.js';

async function seedGeolocations() {

    const results = [];

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.join(__dirname, 'locationData.csv');

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
          const response = await createGeolocation(payload);
          console.log('Database seeded successfully', response);
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
          console.log('Database seeded successfully', response);
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
          console.log('Database seeded successfully');
      } catch (error) {
          console.error('Error seeding database:', error);
      }
  }   
}

export {
    seedGeolocations,
    seedLocales,
    seedSchools
}
