const express = require('express');
const router = express.Router();
const User = require('../models/user');
const JWT = require('jsonwebtoken');

// Route for signup
router.post('/signup', (req, res, next) => {
    console.log('POST /signup', req.body)
    // see if the email is already in the db
    User.findOne({email: req.body.email}, (err, user) => {
        // if db error, catch it 
        console.log('signup err', err)
        if (err) res.json({type: 'error', message: err.message})
        // if email exists, return an error
        if (user) {
            res.status(400).json({type: 'error', message: 'Email already exists'});
        } else {
            // if no, create the user in the db
            // User.create({
            //     name: req.body.name,
            //     email: req.body.email,
            //     password: req.body.password
            // }, (newUser, err) => {
            //     console.log('response from User.create', newUser, err)
            //     if (!err) {
            //         res.status(500).json({type: 'error', message: 'Database error creating user'})
            //     } else {
            //         res.json({type: 'success', message: `Successful signup for user ${user.name}`, user: newUser.toObject, token})
            //     }
            // })
            
            let user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            user.password = req.body.password
            console.log('user instance', user)
            user.save((err, newUser) => {
                if (err) {
                    console.log('save err', err)
                    res.json({type: 'error', message: 'Database error creating user'})
                } else {
                    console.log('created user', newUser)
                    // sign a token (this is the login step)
                    var token = JWT.sign(user.toObject(), process.env.JWT_SECRET, {
                        expiresIn: 60 * 30
                    })
                    // return the token
                    res.status(200).json({type: 'success', user: newUser.toObject, token})
                }
            })
        }
    })
})
// Route for login
router.post('/login', (req, res) => {
    console.log('POST /login', req.body)
    // Find user in db
    User.findOne({ email: req.body.email }, (err, user) => {
        console.log('findOne user:', {err, user})
        if (!user) {
            // if no user, return error
            res.json({type: 'error', message: 'Account not found'})
        } else {
            // if user, check authentication
            if (!err) {
                // if authenticated, sign a token (login)
                console.log('no err, found user,', user,err)
                if (user.authenticated(req.body.password)) {
                    var token = JWT.sign( user.toObject(), process.env.JWT_SECRET, {
                        // expiresIn uses zeit/ms to parse timestrings
                        expiresIn: "30 minutes"
                    })
                    // return the token
                    res.json({ type: 'success', message: 'Login successful', user: user.toObject(), token })
                } else {
                    res.status(401).json({ type: 'error', message: 'Incorrect password. Please try again' })
                }
            } else {
                res.status(500).json(err)
            }
        }
    })
})
// Route for token validation
router.post('/me/from/token', ( req, res ) => {
    console.log('POST /me/from/token', req.originalUrl, req.body)
    // make sure they sent us a token to check
    let token = req.body.token
    if ( !token ) {
        // If no token, return error
        res.json( { type: 'error', message: 'You must pass a valid token!' } )
    } else {
        // If token, verify it
        JWT.verify( token, process.env.JWT_SECRET, (err, user) => {
            if ( err ) {
                // If invalid, return an error
                res.json( { type: 'error', message: 'Invalid token. Please log in again'} )
            } else {
                // If token is valid...
                //   Look up the user in the db
                User.findById(user._id, (err, user) => {
                    //   If user doesn't exist, return an error
                    if (err) {
                        res.json( { type: 'error', message: 'Database error during validation' } )
                    } else {
                        //   If user exists, send user and token back to React
                        res.json({ type: 'success', message: 'Valid token', user: user.toObject})
                    }
                })
            }
        })
    }
})

// Route for logout

module.exports = router;