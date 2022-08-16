const keys = require('../keys/index')
module.exports = (email) => {
    return  {
        from: keys.EMAIL_FORM,
        to: email,
        subject: 'Sending Email using Node.js',
        html: `
            <h1>Hi</h1>
            <p>Your account was created</p>
            <p>email: ${email}</p>
            <hr />
            <a href="${keys.BASE_URL}">link</a>
        `
    };
}