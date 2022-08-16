const {Schema, model} = require('mongoose')

const user = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExp: Date,
    avatarUrl: String,
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    ref: 'Course',
                    type: Schema.Types.ObjectId,
                    required: true,
                }
            }
        ]
    }
})

user.methods.addToCart = function(course) {
    const items = this.cart.items.concat(); // копия массива [...this.cart.items]
    const index = items.findIndex(x => {
        return x.courseId.toString() === course._id.toString();
    });

    if (index >= 0) {
        items[index].count = items[index].count + 1
    } else {
        items.push({
            count: 1,
            courseId: course._id
        })
    }
    // const newCart = { items: items};
    //
    // this.cart = newCart;

    this.cart = {items};

    return this.save();
}

user.methods.removeFromCart = function (id) {
    let items = [...this.cart.items];
    const index = items.findIndex(x => {
        return x.courseId.toString() === id.toString();
    })

    if (items[index].count === 1) {
        items = items.filter(c => c.courseId.toString() !== id.toString())

    } else {
        items[index].count--
    }
    this.cart = {items};
    return this.save();
}

user.methods.clearCart = function () {
    this.cart = {items: []};

    return this.save();
}

module.exports = model('User', user);