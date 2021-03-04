let mongoose = require('mongoose');

//creating a model class
let contactModel = mongoose.Schema({
    name: String,
    email: String,
    number: Number
},
{
    collection: "contacts"
});

module.exports = mongoose.model('Contact', contactModel);