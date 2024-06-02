import {allocatePhoneNumber} from '../../src/services/allocate_numbers';
import { MongoClient, Db } from 'mongodb';

let client: MongoClient;
let db: Db;

beforeAll(async () => {
  client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
  db = client.db('organization_db');
});

afterAll(async () => {
  // Ensure client is closed after all tests are run
  if (client) {
    await client.close();
  }
});

beforeEach(async () => {
  // Insert test data into Organizations collection
  await db.collection('Organizations').insertMany([
    { ID: 'AAA' },
    { ID: 'BBB' },
    { ID: 'CCC' }
  ]);

  // Insert available phone numbers
  await db.collection('PhoneNumbers').insertMany([
    { number: '1234567890', allocated: false },
    { number: '9876543210', allocated: false },
  ]);
});

afterEach(async () => {
  // Cleanup the Users and PhoneNumbers collections after each test
  await db.collection('Users').deleteMany({});
  await db.collection('PhoneNumbers').deleteMany({});
  await db.collection('Organizations').deleteMany({});
});

describe('Allocate Number test suite', () => {

    test('allocates a phone number to a new user', async () => {
      const requestBody = {
        passport_id: 'test-passport-id',
        first_name: 'John',
        last_name: 'Doe',
        organization_id: 'AAA'
      };
  
      await allocatePhoneNumber(requestBody);
  
      // Verify user is created and phone number is allocated
      const user = await db.collection('Users').findOne({ passport_id: requestBody.passport_id });
      expect(user).not.toBeNull();
      expect(user?.phone_number).toBe('1234567890');
  
      const phoneNumber = await db.collection('PhoneNumbers').findOne({ number: '1234567890' });
      expect(phoneNumber?.allocated).toBe(true);
      expect(phoneNumber?.user_id).toBe(requestBody.passport_id);
    });
  
    test('throws error if the organization does not exist', async () => {
      const requestBody = {
        passport_id: 'test-passport-id',
        first_name: 'John',
        last_name: 'Doe',
        organization_id: 'ZZZ' // Non-existing organization
      };
  
      await expect(allocatePhoneNumber(requestBody)).rejects.toThrow();
    });
  
    test('throws error if the user already has a phone number', async () => {
      const requestBody = {
        passport_id: 'test-passport-id',
        first_name: 'John',
        last_name: 'Doe',
        organization_id: 'AAA'
      };
  
      await db.collection('Users').insertOne({
        passport_id: 'test-passport-id',
        first_name: 'John',
        last_name: 'Doe',
        organization_id: 'AAA',
        phone_number: '123-456-7890'
      });
  
      await expect(allocatePhoneNumber(requestBody)).rejects.toThrow('User already has a phone number allocated.');
    });
  
    test('throws error if no phone numbers are available', async () => {
      const requestBody = {
        passport_id: 'test-passport-id',
        first_name: 'John',
        last_name: 'Doe',
        organization_id: 'AAA'
      };
  
      // Remove all available phone numbers
      await db.collection('PhoneNumbers').deleteMany({});
  
      await expect(allocatePhoneNumber(requestBody)).rejects.toThrow('No available phone numbers.');
    });

})