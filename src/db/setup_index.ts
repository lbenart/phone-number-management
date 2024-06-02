import { MongoClient } from 'mongodb';


async function createUniqueIndex() {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    try {
        await client.connect();
        const database = client.db('organization_db');
        const organizationsCollection = database.collection('Organizations');
        
        await organizationsCollection.createIndex({ ID: 1 }, { unique: true });
        console.log('Unique index on Organization ID created.');
    } catch (error) {
        console.error('Error creating unique index:', error);
        throw error;
    } finally {
        await client.close();
    }
}

// Call this function during application startup
createUniqueIndex().catch(console.error);
