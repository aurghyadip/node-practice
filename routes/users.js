const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const bcrypt = require('bcryptjs');

// Define user model
let User = require('../models/user');

// Register user form
router.get('/register', (req, res) => {
  res.render('register');
});

// register user handle form
router.post('/register', [
  check('name', 'Name should not be empty').isLength({min: 3}),
  check('username', 'Username should be valid and at least 5 characters').isLength({min: 5}),
  check('email', 'Email should be valid').isEmail().trim().normalizeEmail(),
  check('password', 'Password should be min 5 chars and contain 1 number').isLength({min: 5}).matches(/\d/),
  check('password2', 'Passwords do not match').equals('password')
], (req, res) => {
  const errors = validationResult(req);
  // console.log(errors.mapped());
  if(!errors.isEmpty()){
    res.render('register', {
      errors: errors.mapped()
    });
  } else {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    
    let newUser = new User({
      name: name,
      username: username,
      email: email,
      password: password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (error, hash) => {
        if(error) {
          console.log(error);
        } else{
          newUser.password = hash;
          newUser.save((error) => {
            if(error){
              console.log(error);
            } else {
              req.flash('success', 'You are now registered, login now!');
              res.redirect('/user/login');
            }
          });
        }
      });
    });
  }
});

router.get('/login', (req, res) => {
  render('login');
});

module.exports = router;