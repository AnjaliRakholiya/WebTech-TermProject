var mongoose = require('mongoose');

var adminSchema = new mongoose.Schema({
    id:{type:Number},
    username:{type:String},
    password:{type:String}
});

module.exports = mongoose.model('Admin',adminSchema, 'admins');
