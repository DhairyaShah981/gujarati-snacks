import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, '../../.env') });

const LOCAL_DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gujarati_snacks';
const ATLAS_URI = process.env.MONGODB_ATLAS_URI; // You'll need to add this to your .env file

if (!ATLAS_URI) {
  console.error('Please set MONGODB_ATLAS_URI in your .env file');
  process.exit(1);
}

async function migrateData() {
  let localClient, atlasClient;

  try {
    // Connect to both databases
    console.log('Connecting to local database...');
    localClient = await MongoClient.connect(LOCAL_DB_URI);
    console.log('Connected to local database');

    console.log('Connecting to Atlas...');
    atlasClient = await MongoClient.connect(ATLAS_URI);
    console.log('Connected to Atlas');

    const localDb = localClient.db();
    const atlasDb = atlasClient.db();

    // Get all collections from local database
    const collections = await localDb.listCollections().toArray();
    console.log(`Found ${collections.length} collections to migrate`);

    // Migrate each collection
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`\nMigrating collection: ${collectionName}`);

      // Get all documents from local collection
      const documents = await localDb.collection(collectionName).find({}).toArray();
      console.log(`Found ${documents.length} documents in ${collectionName}`);

      if (documents.length > 0) {
        // Drop the collection in Atlas if it exists
        await atlasDb.collection(collectionName).drop().catch(() => {
          console.log(`Collection ${collectionName} does not exist in Atlas, creating new`);
        });

        // Insert all documents into Atlas
        const result = await atlasDb.collection(collectionName).insertMany(documents);
        console.log(`Successfully migrated ${result.insertedCount} documents to ${collectionName}`);
      } else {
        console.log(`No documents found in ${collectionName}`);
      }
    }

    console.log('\nMigration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close connections
    if (localClient) await localClient.close();
    if (atlasClient) await atlasClient.close();
  }
}

// Run the migration
migrateData(); 