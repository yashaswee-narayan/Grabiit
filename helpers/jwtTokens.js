const jwt=require('jsonwebtoken');
const refreshTokenModel=require('../models/refreshTokenModel');

const generateToken=(user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: "24h" })
}
const generateRefreshToken=(user) => {
    const refreshtoken=jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
    const refreshUser=({
        user: user._id,
        token: refreshtoken,
        expires: new Date(Date.now()+7*24*60*60*1000),

    });
    refreshTokenModel.findOneAndUpdate({
        user: user._id,
    }, refreshUser, { upsert: true }, function (err, doc) {
        if (err) return "error";
    });

    return refreshUser
}

module.exports={ generateRefreshToken, generateToken }