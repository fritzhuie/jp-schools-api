import fs from 'fs'
import csv from 'csv-parser'
import path from 'path'
import { fileURLToPath } from 'url';
import { seedGeolocationData, seedLocaleData, seedSchoolData } from '../controllers/schools.js';

async function seedGeolocations() {

    const results = [];

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.join(__dirname, 'locationData.csv');

    fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      console.log(data);
      results.push(data)
    })
    .on('end', () => {
      console.log(results)
      seedDatabase(results)
  })
  
  const seedDatabase = async (localData) => {
      try {
          const response = await seedGeolocationData(localData);
          console.log('Database seeded successfully', response);
      } catch (error) {
          console.error('Error seeding database:', error);
      }
  }   
}

export {
    seedGeolocations
}