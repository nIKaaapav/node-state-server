const keys = require("../keys");
module.exports = function (email, token) {
    return  {
        from: keys.EMAIL_FORM,
        to: email,
        subject: 'Sending Email for reset password',
        html: `
            <h1>Hi</h1>
            <p>Click here for reset password</p>
            <p><a href="${keys.BASE_URL}/auth/password/${token}">create new password</a></p>
            <hr />
            <a href="${keys.BASE_URL}">link</a>
        `
    };
}