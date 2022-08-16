const { Router } =require('express');
const Course = require('../models/course')
const auth = require('../middleware/auth')
const {courseValidation} = require('../utils/validators')
const {validationResult} = require("express-validator");

const router = Router();

function isOwner(course,req) {
   return course.userId.toString() === req.user._id.toString()
}


router.get('/',async (req, res) =>{
    try {
        const courses = await Course.find()
            .populate('userId', 'name email') // второй параметр select
            .select('img title price');
        // populate дает join и дает возможно получить избранные елементы с таблицы  Course и User/ select поля которые необходимы

        res.render('courses', {
            title: 'courses page',
            isCourses: true,
            userId: req.user ? req.user._id : null,
            courses
        })
    } catch (e) {
        console.log(e);
    }

})

router.get('/:id',async (req, res)=>{
    try {
        const course = await Course.findById(req.params.id);

        res.render('course', {
            title: 'course page',
            isCourses: true,
            course
        })
    } catch (e) {
        console.log(e)
    }
})

router.get('/:id/edit',auth, async (req, res) => {
    if (!req.query.allow) {
        res.redirect('/')
    }
    try {
        const course = await Course.findById(req.params.id);

        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }

        res.render('course-edit', {
            title: 'edit',
            course
        })
    } catch (e) {
        console.log(e)
    }

})

router.post('/edit',courseValidation, async (req, res) => {
    try {
        const errors = validationResult(req)
        const {id} = req.body;

        if (!errors.isEmpty()) {
            return res.status(422).render('add', {
                title: 'add page',
                isAdd: true,
                error: errors.array()[0].msg
            })
        }

        delete req.body.id;
        const course = await Course.findById(id);
        if (!isOwner(course,req)) {
            return res.redirect('/courses')
        }
        Object.assign(course, req.body);

        await course.save();
        // same
        // await Course.findByIdAndUpdate(id, req.body);

        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }

})

router.post('/remove',auth, async (req, res) => {
    try{
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        })

        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }

})

module.exports = router;