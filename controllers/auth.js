const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const AppErr = require('../utils/appError');
const catchAsync = require('../middleware/catchAsync');
const path = require('path');



const postLogin = catchAsync(async (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password
    if (!email || !password) {
        const error = new AppErr('Email and password must be provided', httpStatusText.FAIL, 401);
        return next(error);
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
        const error = new AppErr('User not found', httpStatusText.FAIL, 404);
        return next(error);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        const error = new AppErr('Wrong email or password', httpStatusText.FAIL, 401);
        return next(error);
    }

    const token = jwt.sign({
        email: user.email,
        userId: user.id
    }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ status: httpStatusText.SUCCESS, token: token, user: user });
})

const postSignup = catchAsync(async (req, res, next) => {

    const email = req.body.email
    const password = req.body.password;
    const username = req.body.username;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessage = errors.errors[0].msg;
        const error = new AppErr(errorMessage, httpStatusText.FAIL, 400);
        return next(error);
    }

    let user = await User.findOne({ where: { email: email } });
    if (user) {
        const error = new AppErr('This email already used, try another one', httpStatusText.FAIL, 400);
        return next(error);
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
        email: email,
        password: hashedPassword,
        username: username,
    })
    res.status(201).json({ stats: httpStatusText.SUCCESS, data: user });

})

const postLogout = catchAsync(async (req, res, next) => {
    res.status(200).json({ stats: httpStatusText.SUCCESS, data: { message: 'Logged out successfully' } });
})

module.exports = {
    postLogin,
    postSignup,
    postLogout,
}