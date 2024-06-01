import { MongoClient } from 'mongodb';
import { IDeallocateNumberParams } from '../schemas/deallocate_number';

const uri = "mongodb://localhost:27017";

export async function deallocatePhoneNumber(requestBody: IDeallocateNumberParams) {
    const { passport_id } = requestBody;

    const client = new MongoClient(uri);

    try {
        await client.connect();

        const database = client.db('organization_db');
        const usersCollection = database.collection('Users');
        const phoneNumbersCollection = database.collection('PhoneNumbers');

        // Find the user by passport_id
        const user = await usersCollection.findOne({ passport_id });

        if (!user) {
            throw new Error('User not found.');
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