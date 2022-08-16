const express = require('express');
const path = require('path');
const csurf = require('csurf');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const connectFlash = require('connect-flash');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const session = require('express-session')
const helmet = require('helmet')
const compression = require('compression')
const MongoStore = require('connect-mongodb-session')(session)
const homeRouts = require('./routs/home')
const addRouts = require('./routs/add')
const coursesRouts = require('./routs/courses')
const cradRouts = require('./routs/card')
const ordersRouts = require('./routs/orders')
const authRouts = require('./routs/auth')
const profileRouts = require('./routs/profile')
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const errorMiddleware = require('./middleware/error');
const fileMiddleware = require('./middleware/file');
const keys = require('./keys/index');

const app = express();
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URL
})

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: require('./utils/hbs-helpers')
});

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

// app.use(async (req, res, next) => {
//     try {
//         const user = await User.findById('62f7f73232af8f645edfde73');
//         req.user = user;
//         next();
//     } catch (e) {
//         console.log(e);
//     }
// })

app.use(express.static('public'))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
}))

app.use(fileMiddleware.single('avatar'));
app.use(csurf())
app.use(helmet())
app.use(connectFlash())
app.use(compression())

app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRouts)
app.use('/add', addRouts)
app.use('/courses', coursesRouts)
app.use('/card', cradRouts)
app.use('/orders', ordersRouts)
app.use('/auth', authRouts)
app.use('/profile', profileRouts)

app.use(errorMiddleware)


const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URL, {
            useNewUrlParser: true,
        });

        // const candidate = await User.findOne();
        //
        // if (!candidate) {
        //     const user = new User({
        //         email: 'nika@gamil.com',
        //         name: 'nika',
        //         cart: {
        //             items: []
        //         }
        //     })
        //
        //     await user.save();
        // }

        app.listen(PORT, () => {
            console.log('listen on ' + PORT)
        })
    } catch (err) {
        console.log(err)
    }
}

start();

