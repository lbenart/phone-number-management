import {createOrganization} from '../../src/services/create_organization';
import { MongoClient, Db } from 'mongodb';

let client: MongoClient;
let db: Db;

beforeAll(async () => {
  client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
  db = client.db('organization_db');
});

afterEach(async () => {
  await db.collection('Organizations').deleteMany({});
});

afterAll(async () => {
    if (client) {
      await client.close();
    }
});

describe('createOrganization', () => {
    test('creates a new organization successfully', async () => {
      const ID = 'ORG123';
      const name = 'Test Organization';
  
      await createOrganization(ID, name);
  
      // Verify organization is created
      const organization = await db.collection('Organizations').findOne({ ID });
      expect(organization).not.toBeNull();
      expect(organization?.ID).toBe(ID);
      expect(organization?.name).toBe(name);
      expect(organization?.created_at).toBeInstanceOf(Date);
      expect(organization?.updated_at).toBeInstanceOf(Date);
    });

    test('throws an error if organization with the same ID already exists', async () => {
      const ID = 'ORG123';
      const name = 'Test Organization';
  
      // Insert an organization with the same ID
      await db.collection('Organizations').insertOne({ ID, name, created_at: new Date(), updated_at: new Date() });
  
      await expect(createOrganization(ID, name)).rejects.toThrow();
    });
});