import mongoose from 'mongoose';

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
        match: /^https?:\/\/[^\s$.?#].[^\s]*$/gm, // URL validation
    },
    category: {
        type: String,
        required: true,
        enum: ['Websites', 'Applications', 'Tips & Tricks', 'Extras'], // Replace with actual category names
    },
}, {
    timestamps: true,
});

export default mongoose.models.Data || mongoose.model('tipstorworm', DataSchema);
