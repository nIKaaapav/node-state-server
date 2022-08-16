const {Router} = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {body, query, check, validationResult} = require('express-validator/check');
const sgTransport = require('nodemailer-sendgrid-transport');
const User = require("../models/user");
const keys = require("../keys/index");
const regEmail = require("../email/registretion");
const resetEmail = require("../email/reset");
const {registerValidation} = require('../utils/validators')
const router = Router();

// const transporter = nodemailer.createTransport(sgTransport({
//     auth: {
//         api_key: keys.SENDGRID_API_KEY
//     }
// }));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nikapavlenko20.np@gmail.com',
        pass: keys.SENDGRID_API_KEY
    }
});

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'login',
        isLogin: true,
        error: req.flash('error')
    })
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const candidate = await User.findOne({email })
        if (candidate) {
            req.flash('error', 'this email is exist')
            const areSame = await bcrypt.compare(password, candidate.password);
            if (areSame) {
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        throw err;
                    } else {
                        res.redirect('/');
                    }
                });
            } else {
                res.redirect('/auth/login#login')
            }
        }   else {
            res.redirect('/auth/login#login')
        }

        // const user = await User.findById('62f7f73232af8f645edfde73');
        // req.session.user = user;
        // req.session.isAuthenticated = true;
        // req.session.save(err => {
        //     if (err) {
        //         throw err;
        //     } else {
        //         res.redirect('/');
        //     }
        // });

    } catch (e) {
        console.log(e);
    }
})

router.get('/logout', async (req, res) => {
    // req.session.isAuthenticated = false;
    req.session.destroy(()=> {
        res.redirect('/auth/login#login');
    })
})

router.post('/register', registerValidation, async (req, res) => {
    try {
        const {email, repassword, name} = req.body;

        // const candidate = await User.findOne({email});

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register');
        }

        // if (candidate) {
        //     res.redirect('/auth/login#register')
        // } else {
            const hashPassword = await bcrypt.hash(repassword, 10)
            const user = new User({
                password: hashPassword,
                email,
                name,
                cart: {items: []}
            })

            await user.save();
            res.redirect('/auth/login#login')
            await transporter.sendMail(regEmail(email))
        // }

    } catch (e) {
        console.log(e)
    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset',{
     title: 'forgot pass',
     error: req.flash('error')
    })
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (error, buffer) => {
            if(error) {
                req.flash('error', 'somethings going wrong')
                return res.redirect('/auth/reset')
            }
            const {email} = req.body;

            const token = buffer.toString('hex');

            const candidate = await User.findOne({email: email});

            if (candidate) {
                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                await candidate.save();
                await transporter.sendMail(resetEmail(email, token))
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'didnt find email');
                res.redirect('/auth/reset')
            }
        })
    } catch (e) {
        console.log(e)
    }

})

router.get('/password/:token', async (req, res) => {
    try {
        const {token} = req.params;
        if (!token) {
            return res.redirect('/auth/login')
        }

        const user = await User.findOne({
            resetToken: token.toString(),
            resetTokenExp: {$gt: Date.now()}
        })

        if (!user) {
            return res.redirect('/auth/login')
        } else {
            res.render('auth/passwords',{
                title: 'Reestablish passwords',
                error: req.flash('error'),
                userId: user._id.toString(),
                token
            })
        }


    } catch (e) {
        console.log(e)
    }

})

router.post('/password', async (req, res) => {
    try {
        const {userId, token} = req.body;

        const user = await User.findOne({
            _id: userId,
            resetToken: token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (user){
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            await user.save();
            res.redirect('/auth/login')
        } else {
            req.flash('loginError', 'Время жизни истекло')
            res.redirect('/auth/login')
        }
    } catch (e) {

    }
})

module.exports = router