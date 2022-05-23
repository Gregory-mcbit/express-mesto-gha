/* eslint-disable no-else-return */
/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');

const DataError = require('../errors/data_error'); // 400
const AccessDeniedError = require('../errors/access_denied_error'); // 403
const NotFoundError = require('../errors/not_found_error'); // 404

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Данные карточки не валидны.'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { _id } = req.params;
  Card.findById(_id)
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => {
      if (JSON.stringify(req.user._id) === JSON.stringify(card.owner)) {
        return Card.findByIdAndRemove(_id)
          .then((result) => {
            res.send(result);
          });
      } else {
        throw new AccessDeniedError('Вы не обладаете достаточными правами для удаления карточки.');
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params._id, {
    $addToSet: { likes: req.user._id },
  }, { new: true })
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError('Данные карточки невалидны.'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError('Передаваемые данныые невалидны.'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Передаваемые данныые невалидны.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
