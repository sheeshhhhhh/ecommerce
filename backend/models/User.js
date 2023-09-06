const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    Userinfo: {
        gmail: {type: String},
        username: {type: String, required: true},
        contactNo: {type: String},
        location: {type: String},
        description: {type: String}  
    }
})

const Item = mongoose.model('User', UserSchema)
module.exports = Item