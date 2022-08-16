const {Schema, model} = require('mongoose')

const course = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    img: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

course.method('toClient', function() {
    const course = this.toObject();
    course.id = course._id;
    delete course._id;

    return course;
})

module.exports = model('Course', course)

// const uuid = require('uuid');
// const fs = require('fs');
// const path = require('path');
//
// class Course {
//     constructor(title, price, img) {
//         this.title = title
//         this.price = price
//         this.img = img
//         this.id = uuid.v4();
//     }
//
//     toJson() {
//         return JSON.stringify({
//             title: this.title,
//             price: this.price,
//             img: this.img,
//             id: this.id,
//         })
//     }
//
//     async save() {
//         const courses = await Course.getAll();
//         courses.push(this)
//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//             path.join(__dirname, '..','databese', 'courses.json'),
//             JSON.stringify(courses),
//             (err) => {
//                 if (err){
//                     reject(err);
//                 } else {
//                     resolve(err);
//                 }
//             }
//         )}
//         )
//     }
//
//     static getAll() {
//         return new Promise((res, rej) =>{
//             fs.readFile(
//                 path.join(__dirname, '..', 'databese', 'courses.json'),
//                 'utf-8',
//                 (err, content) => {
//                     if (err) {
//                         rej(err);
//                     } else {
//                         res(JSON.parse(content))
//                     }
//                 }
//             )
//         })
//     }
//     static async get(id) {
//         const courses = await this.getAll();
//         return  courses.find(c => c.id === id);
//     }
//
//
//     static async update(course) {
//         const courses = await this.getAll();
//         const index = courses.findIndex(c => c.id === course.id);
//         courses[index] = course;
//
//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..','databese', 'courses.json'),
//                 JSON.stringify(courses),
//                 (err) => {
//                     if (err){
//                         reject(err);
//                     } else {
//                         resolve(err);
//                     }
//                 }
//             )}
//         )
//     }
// }
// module.exports = Course;

