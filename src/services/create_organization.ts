import { MongoClient } from 'mongodb';

interface IOrganization {
    ID: string;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export async function createOrganization(ID: string, name: string) {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');

    try {
        await client.connect();

        const database = client.db('organization_db');
        const organizationsCollection = database.collection('Organizations');

        // Create new organization document
        const organizationDoc: IOrganization = {
            ID,
            name,
            created_at: new Date(),
            updated_at: new Date()
        };
        const result = await organizationsCollection.insertOne(organizationDoc);
        console.log(organizationDoc.ID)
        console.log('Organization created successfully with ID:', result.insertedId);
        return result.insertedId;
    } catch (error) {
        console.error('Error creating organization:', error);
        throw error;
    } finally {
        await client.close();
    }
}
