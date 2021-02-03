const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

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
    required: true,
    unique: true
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

UserSchema.plugin(uniqueValidator)
const User = mongoose.model('user', UserSchema)

module.exports = User