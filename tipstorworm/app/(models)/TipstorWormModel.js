const mongoose = require("mongoose");
const {Schema} = mongoose;


const tipstorworm = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photo_description: {
        type: String,
        required: true
    },
    photo: {
        type: Buffer,
        required: true
    },
    hyperlink_description: {
        type: String,
        required: true
    },
    hyperlink: {
        type: String,
        required: true,
        match: /^(ftp|http|https):\/\/[^ "]+$/
    },
    category: {
        type: String,
        enum: ['Websites', 'Applications', 'Tips&Tricks', 'Extras'],
        required: true
    },
    color: {
        type: String,
        required: true
    }
    },
    {
        timestamps: true,
    }
);

const Tipstor = mongoose.models.Tipstor || mongoose.model("tipstorworm",tipstorworm);
module.exports = Tipstor;