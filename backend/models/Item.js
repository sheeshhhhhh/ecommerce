const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    title: {type: String, required: true},
    category: {type: String, required: true},
    url: {type: String, required: true},
    description: {type: String},
    owner: {type: String, required: true},
    ownername: {type: String, required: true}
})

const Item = mongoose.model('Items', ItemSchema)
module.exports = Item