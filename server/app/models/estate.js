var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var estateSchema = new Schema({
    Price: Number,
    LookingFor: String,
    RoomsNumber: Number,
    Area: Number,
    PropertyType: String,
    Desc: String,
    photos: Array
});

module.exports = mongoose.model('estate', estateSchema);
