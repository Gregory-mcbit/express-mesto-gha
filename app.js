const express = require('express');

const app = express();
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser } = require('./controllers/users');
const { login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { celebrate, Joi, errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const NotFoundError = require('./errors/not_found_error'); // 404

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Middlewares
app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[a-zA-Z\d\-.]{1,}\.[a-z]{1,6}([/a-z0-9\-._~:?#[\]@!$&'()*+,;=]*)/),
  }),
}), createUser);

app.use(auth);

app.use(errors());

app.use('/', userRouter);
app.use('/', cardsRouter);
// запрос по несуществующему рoуту
app.use('*', () => { throw new NotFoundError('Запрашиваемый ресурс не найден.'); });

// централизованная обработка ошибок приложения
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Упс, похоже на ошибку сервера.' : message,
  });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is run at ${PORT}`);
});
