import { ErrorResponse404 } from '../custom_responses';
import { IAllocateNumberParams } from '../schemas/allocate_number';
import { MongoClient } from 'mongodb';


export async function allocatePhoneNumber(requestBody: IAllocateNumberParams) {
    
    const { passport_id, first_name, last_name, organization_id} = requestBody;
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');

    try {
        await client.connect();

        const database = client.db('organization_db');
        const usersCollection = database.collection('Users');
        const phoneNumbersCollection = database.collection('PhoneNumbers');
        const organizationsCollection = database.collection('Organizations');

        // Check if the organization exists
        const organization = await organizationsCollection.findOne({ ID: organization_id });

        if (!organization) {
            throw new ErrorResponse404('Not found', 'Organization not found.');
        }

        // Check if the user already exists and has a phone number allocated
        const existingUser = await usersCollection.findOne({ passport_id });

        if (existingUser && existingUser.phone_number) {
            throw new Error('User already has a phone number allocated.');
        }

        // Find the first available phone number
        const phoneNumberDoc = await phoneNumbersCollection.findOne({ 
            allocated: false 
        });

        if (!phoneNumberDoc) {
            throw new ErrorResponse404('Not found', 'No available phone numbers.');
        }

        // Create new user document if not exists
        const userDoc = {
            passport_id,
            first_name,
            last_name,
            organization_id: organization_id,
            phone_number: phoneNumberDoc.number,
            created_at: new Date(),
            updated_at: new Date()
        };
        await usersCollection.insertOne(userDoc);

        // Update phone number document to mark it as allocated and link to the user
        await phoneNumbersCollection.updateOne(
            { _id: phoneNumberDoc._id },
            {
                $set: {
                    allocated: true,
                    user_id: userDoc.passport_id,
                    updated_at: new Date()
                }
            }
        );
        console.log('Phone number allocated successfully.');
    } catch (error) {
        console.error('Error allocating phone number:', error);
        throw error;
    } finally {
        await client.close();
    }
}