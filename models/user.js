/* eslint-disable no-useless-escape */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: '',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: '',
  },
  avatar: {
    type: String,
    required: false,
    default: '',
  },
});

module.exports = mongoose.model('user', userSchema);
