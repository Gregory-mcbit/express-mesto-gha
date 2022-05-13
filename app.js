const express = require('express');

const app = express();
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser } = require('./controllers/users');

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

app.use((req, res, next) => {
  req.user = {
    _id: 'd76dbc61d64cfa22a69d8075',
  };

  next();
});

app.post('/signup', createUser);

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
