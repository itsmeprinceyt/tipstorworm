const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const password = encodeURIComponent(process.env.DATABASE_URL_PASSWORD);
const uri = process.env.DATABASE_URL1 + password + process.env.DATABASE_URL2;

mongoose.connect(uri)
    .then(() => {
        console.log("Successfully connected to MongoDB using Mongoose!");
    })
    .catch(err => {
        console.error("Connection error", err);
    });

// Define the schema
const DataSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    photoDescription: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    hyperLinkDescription: {
        type: String,
        required: true,
    },
    hyperLink: {
        type: String,
        required: true,
        match: /^https?:\/\/[^\s$.?#].[^\s]*$/gm,
    },
    category: {
        type: String,
        required: true,
        enum: ['Websites', 'Applications', 'Tips & Tricks', 'Extras'],
    },
}, {
    timestamps: true,
});

// Export the model
module.exports = mongoose.models.Data || mongoose.model('tipstorworm', DataSchema);
