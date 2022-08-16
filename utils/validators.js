const { body } = require('express-validator');
const User = require('../models/user')
module.exports.registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Введите корректрный эмейл ')
        .custom(async (value, {req}) =>{
        try {
            const user = await User.findOne({email: value});
            if (user) {
                return Promise.reject('Пользователь уже существует ')
            }

        } catch (e) {
            console.log(e)
        }
    })
        .normalizeEmail(),
    body('repassword', 'Введите корректрный пароль ')
        .isLength({min: 6, max: 20})
        .isAlphanumeric()
        .trim(),
    body('confirm')
        .custom((value, {req}) =>{
        if (value !== req.body.password) {
            throw new Error('Пароли не совпадают ')
        }
        return true
    })
        .trim(),
    body('name', 'Введите корректрное имя ')
        .isLength({min: 3})
        .trim(),
];

module.exports.courseValidation = [
    body('title')
        .isLength({min: 3})
        .withMessage('Min 3'),
    body('price')
        .isNumeric()
        .withMessage('mast be number'),
    body('img', '').isURL(),
]