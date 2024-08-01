
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();
const password = encodeURIComponent(process.env.DATABASE_URL_PASSWORD); //if the password contains special characters it needs to be decoded. so this will decode the password and then it will store the decoded password in that variable
const uri = process.env.DATABASE_URL1+password+process.env.DATABASE_URL2; // using mongoDB connection string along with login credentials to connect to mongoDB atlas

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
