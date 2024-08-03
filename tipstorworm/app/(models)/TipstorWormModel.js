const mongoose = require("mongoose");
const {Schema} = mongoose;


const tipstorworm = new Schema({
    title:String,
    description: String,
    photo_description: String,
    photo: String,
    hyperlink_description: String,
    hyperlink: String,
    category: String,
    color: String,
    },
    {
        timestamps: true,
    }
);

const Tipstor = mongoose.models.Tipstor || mongoose.model('Tipstor', tipstorworm);

module.exports = Tipstor;