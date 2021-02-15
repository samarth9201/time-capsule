const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true
  },
  LastName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true
  },
  ContractAddress: {
    type: String,
    required: true
  },
  Reminded:{
    type: String,
    default: false
  }
}, {
  timestamps: true
})

const User = mongoose.model('user', UserSchema)

module.exports = User