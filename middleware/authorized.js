const AppErr = require('../utils/appError')

module.exports = (...roles) => {
    return async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            const error = new AppErr('Not Authorized, you do not have the required permissions', httpStatusText.FAIL, 403);
            return next(error);
        }
        next();
    }
}