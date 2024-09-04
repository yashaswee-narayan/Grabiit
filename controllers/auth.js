const User = require("../models/userModel");
const bcrypt = require('bcrypt');


const register = (data) => {
    return new Promise(async (resolve, reject) => {
        // Check if this user already exisits
        let checkEmail = await User.findOne({ email: data.email });
        let checkUsername = await User.findOne({ username: data.username });
        if (checkEmail) {
            return reject("That Email already exisits!");
        } else if (checkUsername) {
            return reject("Username already in use, please choose new one.");
        } else {
            bcrypt.genSalt(10, function async(err, salt) {
                bcrypt.hash(data.password, salt, function async(err, hash) {
                    if (err) throw err;
                    const user = new User({
                        name: data.name,
                        username: data.username,
                        email: data.email,
                        password: hash
                    });
                    user.save();
                    return resolve(user);
                });
            });

        }
    });
}
const signIn = (email, password) => {
    return new Promise(async (resolve, reject) => {
        let user = await User.findOne({ email: email });
        if (!user) {
            return reject("That user does not exisits!");
        }
        const validPass = await bcrypt.compare(password, user.password)
        if (!validPass) {
            return reject("Invalid Password");
        } else {
            return resolve(user)
        }
    });
}

module.exports = { register, signIn }

