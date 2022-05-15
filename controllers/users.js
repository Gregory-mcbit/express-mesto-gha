/* eslint-disable no-underscore-dangle */
const User = require('../models/user');

const DataError = require('../errors/data_error'); // 400
const NotFoundError = require('../errors/not_found_error'); // 404

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch(next);

const getUser = (req, res, next) => User.findById(req.params._id)
  .orFail(new NotFoundError('Нет пользователя с таким id.'))
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new DataError('Неверный запрос или данные.'));
    } else if (err.message === 'NotFound') {
      next(new NotFoundError('Передаваемые данныые невалидны.'));
    } else {
      next(err);
    }
  });

const createUser = (req, res, next) => {
  const {
    name, about, avatar,
  } = req.body;

  User.create({
    name, about, avatar,
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Неверный запрос или данные.'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new DataError('Неверный запрос или данные.'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new DataError('Данные внесены некорректно или запрос неверный.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar,
};
