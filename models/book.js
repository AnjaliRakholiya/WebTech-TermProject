/******************************************************************************
***
* Term Project
* Group - Anjali Rakhoiya, Ayush Singh, Dashmeet Kaur, Mishita Sankala, Parampreet Kaur, Tarun Dutt
*
******************************************************************************
**/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

BookSchema = new Schema({
    _id: Number,
    title : String,
    isbn : String,
    pageCount : Number,
    publishedDate : Date,
    thumbnailUrl : String,
    shortDescription : String,
    longDescription : String,
    status : String,
    authors : [String],
    categories : [String],
});

module.exports = mongoose.model('Book', BookSchema, 'books');