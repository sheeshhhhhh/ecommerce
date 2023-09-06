const mongoose = require('mongoose')

const Scheduleschema = new mongoose.Schema({
  ownerid: {type: String, required: true},
  date: {type: String, required: true},
  time: {type: String, required: true},
  visitor: {type: String, required: true},
})

const Schedule = mongoose.model('Schedule', Scheduleschema)
module.exports = Schedule