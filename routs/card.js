const { Router } = require('express');
const Card  = require('../models/card');
const Course  = require('../models/course');
const auth = require('../middleware/auth')

function mapCartItems(cart) {
    return cart.items.map(c => ({
         ...c.courseId._doc,
        id: c.courseId._id,
        count: c.count
    }))
}

function conculetePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count;
    }, 0)
}

const router = Router();

router.post('/add', auth, async (req, res)=>{
    const course = await Course.findById(req.body.id);


    // await Card.add(course)

    await req.user.addToCart(course);

    res.redirect('/card');
})

router.get('/', auth, async (req, res)=>{
    // const card = await Card.fetch()
    const user = await req.user
        .populate('cart.items.courseId');

    const courses = mapCartItems(user.cart);

    res.render('card', {
        title: 'card',
        courses: courses,
        price: conculetePrice(courses)
    });
})


router.delete('/:id',auth, async (req, res)=>{
    // const card = await Card.remove(req.params.id)
    await req.user.removeFromCart(req.params.id);

    const user = await req.user.populate('cart.items.courseId');

    const courses = mapCartItems(user.cart);
    const cart = {
        courses, price: conculetePrice(courses)
    }

    res.status(200).json(cart);
})


module.exports = router;
