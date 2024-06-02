import { MongoClient, Db } from 'mongodb';
import { deallocatePhoneNumber } from '../../src/services/deallocate_number';
import { createOrganization } from '../../src/services/create_organization'
import { IDeallocateNumberParams } from '../../src/schemas/deallocate_number';

let client: MongoClient;

beforeAll(async () => {
    client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    await client.connect();
});

afterAll(async () => {
    if (client) {
        await client.close();
    }
});

describe('deallocatePhoneNumber', () => {
    let db: Db;

    beforeEach(async () => {
        db = client.db('organization_db');
    });

    afterEach(async () => {
        // Clean the collections after each test
        await db.collection('Users').deleteMany({});
        await db.collection('PhoneNumbers').deleteMany({});
        await db.collection('Organizations').deleteMany({});
    });

    test('successfully deallocates a phone number for a valid user and organization', async () => {
        const requestBody: IDeallocateNumberParams = { passport_id: 'user1' };
        // Insert test data
        const orgApiKey = await createOrganization('org1', 'Test Organization 1');
        await db.collection('PhoneNumbers').insertOne({ number: '1234567890', allocated: true, user_id: 'user1' });
        await db.collection('Users').insertOne({ passport_id: 'user1', organization_id: 'org1', phone_number: '1234567890' });

        await deallocatePhoneNumber(requestBody, orgApiKey);

        const user = await db.collection('Users').findOne({ passport_id: 'user1' });
        const phoneNumber = await db.collection('PhoneNumbers').findOne({ number: '1234567890' });

        expect(user).toBeNull(); // User should be removed
        expect(phoneNumber?.allocated).toBe(false); // Phone number should be marked as available
        expect(phoneNumber?.user_id).toBeNull(); // Phone number should not be linked to any user
    });

    test('throws an error when an invalid API key is provided', async () => {
        const requestBody: IDeallocateNumberParams = { passport_id: 'user1' };
        const orgApiKey = 'invalid_api_key';

        await expect(deallocatePhoneNumber(requestBody, orgApiKey)).rejects.toThrow('Invalid API key.');
    });

    test('throws an error when the user does not belong to the organization', async () => {
        const orgApiKey = await createOrganization('org1', 'Test Organization 1');
        await db.collection('Users').insertOne({ passport_id: 'user1', organization_id: 'org1', phone_number: '1234567890' });
        await db.collection('PhoneNumbers').insertOne({ number: '1234567890', allocated: true, user_id: 'user1' });
        const requestBody: IDeallocateNumberParams = { passport_id: 'user2' }; // User not in organization
        await expect(deallocatePhoneNumber(requestBody, orgApiKey)).rejects.toThrow('User not found in the organization.');
    });
});
