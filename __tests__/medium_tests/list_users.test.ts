import { MongoClient, Db } from 'mongodb';
import { listUsersWithAllocatedNumbers } from '../../src/services/list_users';

let client: MongoClient;
let db: Db;

beforeAll(async () => {
    client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    db = client.db('organization_db');
});

afterAll(async () => {
    if (client) {
        await client.close();
    }
});

beforeEach(async () => {
    // Insert test data into Organizations collection
    await db.collection('Organizations').insertMany([
      { ID: 'AAA', name: 'Test Organization AAA' },
      { ID: 'BBB', name: 'Test Organization BBB' },
      { ID: 'CCC', name: 'Test Organization CCC' }
    ]);
});

afterEach(async () => {
    // Cleanup
    await db.collection('Users').deleteMany({});
    await db.collection('Organizations').deleteMany({});
});

describe('listUsersWithAllocatedNumbers', () => {

    test('returns users with allocated phone numbers for a specified organization', async () => {
        const organizationId = 'AAA'; // Specify a valid organization ID for testing

        // Insert test data into the Users collection
        const usersCollection = db.collection('Users');
        await usersCollection.insertMany([
            { passport_id: 'user1', first_name: 'John', last_name: 'Doe', organization_id: organizationId, phone_number: '1234567890' },
            { passport_id: 'user2', first_name: 'Jane', last_name: 'Smith', organization_id: organizationId, phone_number: '9876543210' },
        ]);

        // Call the function under test
        const users = await listUsersWithAllocatedNumbers(organizationId);

        // Assertions
        expect(users).toHaveLength(2); // Ensure correct number of users are returned
        expect(users[0]).toEqual(expect.objectContaining({
            passport_id: expect.any(String),
            first_name: expect.any(String),
            last_name: expect.any(String),
            phone_number: expect.any(String)
        }));
    });

    test('returns an empty array when there are no users with allocated phone numbers', async () => {
        const organizationId = 'BBB'; // Provide a valid organization ID for testing

        const usersCollection = db.collection('Users');
        await usersCollection.deleteMany({ organization_id: organizationId });
    
        // Call the function under test
        const users = await listUsersWithAllocatedNumbers(organizationId);
    
        // Assertions
        expect(users).toHaveLength(0); // Ensure an empty array is returned
    });

});
