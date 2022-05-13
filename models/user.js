/* eslint-disable no-useless-escape */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Егоров Григорий',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Гений, миллиардер, филантроп',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://storage.carsmile.pl/uploads/2018/07/36.jpg',
  },
});

module.exports = mongoose.model('user', userSchema);
