const { Router } = require('express');
const { validationResult } = require('express-validator');
const Course = require('../models/course');
const auth = require('../middleware/auth')
const {courseValidation} = require('../utils/validators')
const router = Router();

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'add page',
        isAdd: true
    })
})

router.post('/', auth, courseValidation, async (req, res) => {
    // const course = new Course(req.body.title, req.body.price, req.body.img);
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).render('add', {
            title: 'add page',
            isAdd: true,
            error: errors.array()[0].msg
        })
    }

    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        // userId: req.user._id, можем так сделать, но мангус делает и с userId: req.user потому что мы добавили ObjectId
        userId: req.user,
    });
    try {
        await course.save();
    } catch (err) {
        console.log(err);
    }

    res.redirect('/courses');
})

module.exports = router;