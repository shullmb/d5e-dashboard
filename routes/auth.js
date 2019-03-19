const express = require('express');
const router = express.Router();
const User = require('../models/user');
const JWT = require('jsonwebtoken');

// Route for signup
router.post('/signup', (req, res, next) => {
    // see if the email is already in the db
    User.findOne({email: req.body.email}, (err, user) => {
        // if db error, catch it 
        console.log(err)
        if (err) res.json({type: 'error', message: err.message})
        // if email exists, return an error
        if (user) {
            res.status(400).json({type: 'error', message: 'Email already exists'});
        } else {
            // if no, create the user in the db
            let user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            user.save((err, user) => {
                if (err) {
                    console.log(err)
                    res.json({type: 'error', message: 'Database error creating user'})
                } else {
                    // sign a token (this is the login step)
                    var token = JWT.sign(user.toObject(), process.env.JWT_SECRET, {
                        expiresIn: 60 * 30
                    })
                    // return the token
                    res.status(200).json({type: 'success', user: user.toObject, token})
                }
            })
        }
    })
})
// Route for login
router.post('/login', (req, res) => {
    // Find user in db
    // if no user, return error
    // if user, check authentication
    // if authenticated, sign a token (login)
    // return the token
})

// Route for token validation
router.post('/me/from/token', (req, res) => {
    // make sure they sent us a token to check
    // If no token, return error
    // If token, verify it
    // If invalid, return an error
    // If token is valid...
    //   Look up the user in the db
    //   If user doesn't exist, return an error
    //   If user exists, send user and token back to React
})

// Route for logout

module.exports = router;