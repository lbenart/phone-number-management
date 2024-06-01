import { MongoClient, ObjectId } from 'mongodb';

const uri = "mongodb://localhost:27017";

export async function listUsersWithAllocatedNumbers(organization_id: string) {
    const client = new MongoClient(uri);

    try {
        await client.connect();

        const database = client.db('organization_db');
        const usersCollection = database.collection('Users');

        // Find users with allocated phone numbers in the specified organization
        const users = await usersCollection.find({
            organization_id: organization_id,
            phone_number: { $exists: true, $ne: null }
        }).toArray();

        // Return the list of users
        return users.map(user => ({
            passport_id: user.passport_id,
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: user.phone_number
        }));
    } catch (error) {
        console.error('Error listing users with allocated phone numbers:', error);
        throw error;
    } finally {
        await client.close();
    }
}
