import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import { parse } from 'csv-parse';

const uri = "mongodb://localhost:27017"; // MongoDB connection string

interface PhoneNumber {
    number: string;
    allocated: boolean;
    created_at: Date;
    updated_at: Date;
}

async function populateDatabase() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('organization_db'); // Replace with your database name
        const phoneNumbersCollection = database.collection('PhoneNumbers');

        // Ensure the collection is created
        await phoneNumbersCollection.createIndex({ number: 1 }, { unique: true });

        const phoneNumbers: PhoneNumber[] = [];

        fs.createReadStream('phone_numbers.csv')
            .pipe(parse({ delimiter: ',', from_line: 1 }))
            .on('data', (row) => {
                const number = row[0];
                if (number) {
                    phoneNumbers.push({
                        number,
                        allocated: false,
                        created_at: new Date(),
                        updated_at: new Date()
                    });
                } else {
                    console.warn('Skipping empty row:', row);
                }
            })
            .on('end', async () => {
                console.log('Finished reading CSV file.');
                try {
                    await phoneNumbersCollection.insertMany(phoneNumbers);
                    console.log('Database populated with phone numbers.');
                } catch (error) {
                    console.error('Error inserting phone numbers:', error);
                } finally {
                    await client.close();
                }
            })
            .on('error', (error) => {
                console.error('Error reading CSV file:', error);
            });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        await client.close();
    }
}

populateDatabase();
