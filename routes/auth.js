
const express = require('express');
const authController = require('../controllers/auth');
const { body } = require('express-validator');

const router = express.Router()


router.post('/login',
    [
        body('email')
            .isEmail()
            .normalizeEmail(),
        body('password',)
            .isLength({ min: 3 })
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin)

router.post('/signup',
    [
        body('email', 'Please enter a valid email')
            .isEmail()
            .normalizeEmail(),
        body('password', 'Enter a valid password')
            .isLength({ min: 3 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Password have to match');
                }
                return true;
            })
    ]
    , authController.postSignup);

router.post('/logout', authController.postLogout)

module.exports = router