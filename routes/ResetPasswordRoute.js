const express = require('express');
const resetRoute = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const sendMail = require('../controllers/sendMail')
const bcrypt = require('bcrypt');

const jwt_secret = process.env.jwt_secret;

// forgot password
resetRoute
    .post('/forgot-password', async (req, res) => {
        try {

            let user = await User.findOne({ email: req.body.email })

            // User exists
            if (user) {
                // One time link for 15 min
                const secret = jwt_secret + user.password;
                const payLoad = {
                    email: user.email,
                    id: user.id
                }
                const token = jwt.sign(payLoad, secret, { expiresIn: '6m' });
                const link = `http://localhost:3000/reset-password/${user.id}/${token}`
                console.log(link);
                sendMail.sendEmail(req.body.email, user.name, link);

                return res.end(`
                <div style="font-family:'Poppins';">
                    <p>Reset password link has been sent to your email</p>
                    <p>Kindly check, <b>it is valid only for 6 minutes</b></p>
                </div>
                `);
            }
            // Invalid user
            else {
                console.log('User not found')
                res.redirect('back');
                return;
            }

        } catch (error) {
            console.log(error.message);
            res.redirect('back');
            return;
        }

    })

// reset password
resetRoute
    .get('/reset-password/:id/:token', async (req, res) => {
        const { id, token } = req.params;

        // Checking if id in DB or not
        let user = await User.findOne({ _id: id });
        if (!user) {
            console.log(user);
            res.send('Invalid user');
        }
        else {
            const secret = jwt_secret + user.password;
            try {

                const payLoad = jwt.verify(token, secret);
                // token verified
                res.render('reset_password', {
                    email: user.email
                })

            } catch (error) {
                res.send(error.message);
            }
        }
    })


    .post('/reset-password/:id/:token', async function (req, res) {
        const { id, token } = req.params;

        // Checking if id in DB or not
        let user = await User.findOne({ _id: id });
        if (!user) {
            console.log(user);
            res.send('Invalid user');
        }
        else {
            const secret = jwt_secret + user.password;
            try {

                const payLoad = jwt.verify(token, secret);
                // token verified
                const { password, confirm_password } = req.body;
                // validation
                if (password === confirm_password) {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);
                    await User.findByIdAndUpdate(id, {

                        password: hashedPassword
                    })
                }

                return res.redirect('/login');

            } catch (error) {
                res.send(error.message);
            }
        }
    })

module.exports = resetRoute;