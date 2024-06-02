import { MongoClient } from 'mongodb';
import { IDeallocateNumberParams } from '../schemas/deallocate_number';


export async function deallocatePhoneNumber(requestBody: IDeallocateNumberParams, orgApiKey: string) {
    const { passport_id } = requestBody;

    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');

    try {
        await client.connect();

        const database = client.db('organization_db');
        const usersCollection = database.collection('Users');
        const phoneNumbersCollection = database.collection('PhoneNumbers');
        const organizationsCollection = database.collection('Organizations');

        // Find the organization by API key
        const organization = await organizationsCollection.findOne({ api_key: orgApiKey });

        if (!organization) {
            throw new Error('Invalid API key.');
        }

        // Check if the user belongs to the organization
        const user = await usersCollection.findOne({ passport_id, organization_id: organization._id });

        if (!user) {
            throw new Error('User not found in the organization.');
        }

        const phoneNumber = user.phone_number;

        // Remove the user document
        await usersCollection.deleteOne({ passport_id });

        // Update the phone number document to mark it as available
        await phoneNumbersCollection.updateOne(
            { number: phoneNumber },
            {
                $set: {
                    allocated: false,
                    user_id: null,
                    updated_at: new Date()
                }
            }
        );
        console.log('Phone number deallocated successfully.');
    } catch (error) {
        console.error('Error deallocating phone number:', error);
        throw error;
    } finally {
        await client.close();
    }
}