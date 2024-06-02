import { MongoClient } from 'mongodb';
import crypto from 'crypto';

interface IOrganization {
    ID: string;
    name: string;
    api_key: string;
    created_at: Date;
    updated_at: Date;
}

export async function createOrganization(ID: string, name: string) {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');

    try {
        await client.connect();

        const database = client.db('organization_db');
        const organizationsCollection = database.collection('Organizations');
        
        // Generate API key
        const apiKey = crypto.randomBytes(32).toString('hex');
        
        // Create new organization document
        const organizationDoc: IOrganization = {
            ID,
            name,
            api_key: apiKey,
            created_at: new Date(),
            updated_at: new Date()
        };
        await organizationsCollection.insertOne(organizationDoc);
        return { 'X-API-Key': apiKey };
    } catch (error: any) {
        if (error.code === 11000) {  // Duplicate key error code
            throw new Error('Organization with this ID already exists');
        }
        console.error('Error creating organization:', error);
        throw error;
    } finally {
        await client.close();
    }
}
