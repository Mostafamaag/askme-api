const User = require('../models/user');
const jwt = require('jsonwebtoken');
const AppErr = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText')

module.exports = async (req, res, next) => {
    const authHeader = req.get('Authorization') || req.get('authorization');
    if (!authHeader) {
        const error = new AppErr('No Token Provided', httpStatusText.FAIL, 401);
        return next(error);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findByPk(decodedToken.userId);
        req.user = user;
    }
    catch (err) {
        const error = new AppErr('Invalid token', httpStatusText.FAIL, 401);
        return next(error)
    }
    next()
}