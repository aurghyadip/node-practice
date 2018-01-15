const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');


//init app
const app = express();

//bring in the models
let Article = require('./models/article');

// Connect mongoose
mongoose.connect('mongodb://localhost/simplenode', { useMongoClient: true });
let db = mongoose.connection;

// error check
db.on('error', console.error.bind(console, 'connection error:'));

// log if connected 
db.once('open', function() {
  console.log('Connected');
});

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//express session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// express messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//home route
app.get('/', function(req, res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title: "Articles",
        articles: articles
      });
    }
  });
});

// Article Router
let articleRouter = require('./routes/article');
app.use('/articles', articleRouter);

// User router
let userRouter = require('./routes/users');
app.use('/users', userRouter);

//start server
app.listen(3000, function(){
  console.log('Server started on http://localhost:3000');
});