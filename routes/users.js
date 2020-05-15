const express = require('express');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('login')
});

router.get('/register', (req, res) => {
    res.render('register')
});

const User = require('../model/User');

//Register Posting
router.post('/register', (req, res) => {
    const {name, email, password, password2} = req.body;
    let errors = []


    // Validating all Fields Required
    if (!name || !email || !password || !password2) {
        errors.push({msg: 'Please fill in all fields'})
    }

    // Validating the Passwords
    if (password !== password2) {
        errors.push({msg: 'Passwords do not match'})
    }
    //Validating Password length
    if (password < 6) {
        errors.push({msg: 'password should be at least 6 characters'})
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2,

        })
    } else {
        User.findOne({email: email})
        .then(user => {
            if (user) {
                //If users exist
                errors.push({msg: 'Email is already registered!'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
        
                });
            }
        else{
            const newUser = new User({
                name,
                email,
                password
            });
            // Hashing the password
            bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                    throw err;
                }

                newUser.password = hash;
                newUser.save()
                .then(user => {
                    req.flash('success_msg', 'You are now registered! and can login')
                    res.redirect('/users/login')
                })
                .catch(err => console.log(err));
            }))
        }
        })
    }
});

//Login Handling

router.post('/login', (req, res, next) => {
    passport.authenticate('local',  {
       
          successRedirect: '/dashboard',
          failureRedirect: '/users/login',
          failureFlash: true

       
     })(req, res, next);
})


//Logout handling
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out!');
    res.redirect('/users/login')
});


module.exports = router;