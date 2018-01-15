const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

// article model
let Article = require('../models/article');

//add route
router.get('/add', function(req, res){
  res.render('add_article',{
    title:"Add Articles"
  });
});


//Add submit post route
router.post('/add', [
  check('title','Title should not be empty').isLength({min: 1}),
  check('author','Author should not be empty').isLength({min: 1}),
  check('body','Body should not be empty').isLength({min: 1})
], function(req, res){
  // console.log(req.body);
  //get errors
  const errors = validationResult(req);
  // console.log(errors.mapped());
  if(!errors.isEmpty()){
    console.log({errors: errors.array()});
    res.render('add_article', {
      title: "Add Article",
      errors: errors.mapped()
    })
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
      if(err) {
        console.log(err);
        return
      } else {
        req.flash('success', 'Articles Added');
        res.redirect('/');
      }
    });
  }
});

// article edit page
router.get('/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article',{
      title: 'Edit Article',
      article: article
    });
  });
});

// edit article and submit
router.post('/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id};

  Article.update(query, article, function(err){
    if(err) {
      console.log(err);
      return
    } else {
      req.flash('warning', 'Articles Updated');
      res.redirect('/');
    }
  });
});

//delete article
router.delete('/:id', function(req, res){
  let query = {_id: req.params.id};
  Article.remove(query, function(err){
    if(err) {
      console.log(err);
    } else {
      res.send('Success');
    }
  });
});

// get single article
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('article',{
      article:article
    });
  });
});

module.exports = router;