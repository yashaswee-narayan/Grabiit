const express=require('express');
const { signIn, register }=require('../controllers/auth');
const { generateToken, generateRefreshToken }=require('../helpers/jwtTokens');
const refreshTokenModel=require('../models/refreshTokenModel');
const AuthRoute=express.Router();

AuthRoute
    .get("/login", async (req, res) => {
        if (req.headers.referer&&req.headers.referer.match("/login")===null) {
            res.cookie('redirect', req.headers.referer, { maxAge: 50000, httpOnly: true });
        }
        if (req.cookies&&req.cookies.token&&req.cookies.refreshToken) {
            const findtoken=await refreshTokenModel.findOne({ token: req.cookies.refreshToken })
            if (!findtoken) {
                return res.render('auth', {
                    title: 'Sign-In',
                });
            }
            if (findtoken.isExpired) {
                return res.render('auth', {
                    title: 'Sign-In',
                });
            }
            let user={
                _id: findtoken.user
            }
            token=generateToken(user);
            refreshToken=generateRefreshToken(user);

            res.cookie('refreshToken', refreshToken.token)
            res.cookie('token', token)
            return res.redirect('/dashboard')
        }
        return res.render('auth', {
            title: 'Sign-In',
        });
    })
    .post("/login", (req, res) => {
        let email=req.body.email
        let password=req.body.password
        var redirectionUrl=req.cookies.redirect||req.headers.referer||'/dashboard';
        if (req.headers.referer.match("/login")===null||redirectionUrl==="http://localhost:3000/"||redirectionUrl==="/"||redirectionUrl.match("reset-password")!=null) {
            redirectionUrl='/dashboard';
        }
        signIn(email, password)
            .then(async (user) => {
                if (user._id) {
                    const token=await generateToken(user);
                    const refreshToken=await generateRefreshToken(user);
                    res.cookie('refreshToken', refreshToken.token);
                    res.cookie('token', token);
                    res.cookie('name', user.name);
                    res.cookie('avatar', user.avatar);

                    // // POSTMAN
                    // return res.header('auth-token', token).json({
                    //     token, refreshToken: refreshToken.token
                    // });
                    return res.redirect(redirectionUrl)
                }
                return res.send("Unknown error occoured!")
            })
            .catch((err) => {
                console.log(err)
                return res.send(err)
            })
    })
    .post("/postmanlogin", async (req, res) => {
        if (req.cookies&&req.cookies.token&&req.cookies.refreshToken) {
            const findtoken=await refreshTokenModel.findOne({ token: req.cookies.refreshToken })
            if (!findtoken) {
                return res.render('auth', {
                    title: 'Sign-In',
                });
            }
            if (findtoken.isExpired) {
                return res.render('auth', {
                    title: 'Sign-In',
                });
            }
            let user={
                _id: findtoken.user
            }
            token=generateToken(user);
            refreshToken=generateRefreshToken(user);
        }
        return res.json({ token, refreshToken });
    })

AuthRoute
    .get("/signup", (req, res) => {
        res.render('auth', {
            title: 'Sign-Up',
        });
    })
    .post("/signup", (req, res) => {
        let data=req.body

        register(data)
            .then((value) => {
                console.log(value)
                return res.status(200).redirect('/login')
            })
            .catch((err) => {
                console.log(err)
                return res.status(400).send(err)
            })

    })

AuthRoute
    .post("/refreshtoken", async (req, res) => {
        let token=req.body.token;
        let refreshToken=''
        const findtoken=await refreshTokenModel.findOne({ token: token })

        if (!findtoken) {
            return res.status(400).json("Invalid Token")
        }
        if (findtoken.isExpired) {
            return res.status(401).json("Login again!")
        }
        let user={
            _id: findtoken.user
        }
        token=await generateToken(user);
        refreshToken=await generateRefreshToken(user);

        res.cookie('refreshToken', refreshToken.token)
        res.cookie('token', token)
        return;
        // return res.header('auth-token', token).json({
        //     token, refreshToken: refreshToken.token
        // });
    })
AuthRoute
    .get('/logout', function (req, res) {
        res.clearCookie('token', { path: '/' })
        res.clearCookie('refreshToken', { path: '/' });
        res.clearCookie('name', { path: '/' });
        res.clearCookie('avatar', { path: '/' });
        return res.redirect('/')
    });


module.exports=AuthRoute;