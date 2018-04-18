const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// load user model
require('../models/User');
const User = mongoose.model('user')


// login route

router.get('/login', (req, res) => {
    res.render('user/login')
});


// register route

router.get('/register', (req, res) => {
    res.render('user/register')
});

//login form post route
router.post('/login', (req, res, next) => {
    passport.authenticate('local',{
        successRedirect : '/ideas',
        failureRedirect:'/user/login',
        failureFlash:true
    })(req,res,next)
}
)
// register form post route
router.post('/register', (req, res) => {
    let errors = [];
    if (req.body.password != req.body.password2) {
        errors.push({ text: 'Password does not match' });
    }
    if (req.body.password.length < 4) {
        errors.push({ text: 'Password must be 4 charctors' })
    }
    if (errors.length > 0) {
        res.render('user/register', {
            errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    } else {
        User.findOne({ email: req.body.email }).then(user => {
            if (user) {
                req.flash('error_mgs', 'Email is already registered')
                res.redirect('/user/login');
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err
                        newUser.password = hash;
                        newUser.save().then((user) => {
                            req.flash('success_mgs', 'You are successfuly signup');
                            res.redirect('/user/login')
                        });
                    });
                });
            }
        })
    }
})
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_mgs','You are logged out')
    res.redirect('/user/login');
})
module.exports = router;