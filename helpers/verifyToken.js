const expressJwt=require('express-jwt')
const User=require('../models/userModel')


// exports.isSignedIn = expressJwt({
//     secret: process.env.TOKEN_SECRET,
//     algorithms: ['HS256']
// })

exports.isSignedIn=expressJwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ['HS256'],
    getToken: function fromHeaderOrQuerystring(req) {
        if (req.headers.authorization&&req.headers.authorization.split(' ')[0]==='Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.cookies&&req.cookies.token) {
            return req.cookies.token;
        } else if (req.query&&req.query.token) {
            return req.query.token;
        }

        return null;
    }
});




exports.isAdmin=async function (req, res, next) {
    let { role }=await User.findOne({
        _id: req.user.id
    })
    if (!role) {
        return res.status(401).json("not authorized!")
    }
    next()
}