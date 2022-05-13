const userRouter = require('express').Router();
const {
  getUsers, getUser, createUser, updateUser, updateAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.post('/users', createUser);

userRouter.get('/users/:_id', getUser);

userRouter.patch('/users/me', updateUser);

userRouter.patch('/users/me/avatar', updateAvatar);

module.exports = userRouter;
