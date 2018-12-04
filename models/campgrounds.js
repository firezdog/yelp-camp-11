var mongoose = require("mongoose")

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: { type: Number, get: getPrice, set: setPrice },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Comment"
        }
    ],
    author: {
        id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        username: String
    }
});

function getPrice(num) {
    return (num/100).toFixed(2);
}

function setPrice(num) {
    return num*100;
}

module.exports = mongoose.model("Campground", campgroundSchema);