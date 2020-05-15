const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const app = express();

//Passport config
require('./config/passport')(passport)

//DATABASE CONFIG
const db = require('./config/keys').MongoURI;

//Connecting Mongodb
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));


//EJS SETUP
app.use(expressLayouts);
app.set('view engine', 'ejs');

//bodyParser
app.use(express.urlencoded({ extended: false}));

// Express Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  }))

  app.use(passport.initialize());
  app.use(passport.session());

  //Connect Flash
  app.use(flash());

  //Global Variables
  app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next()
  });

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));



const PORT = process.env.PORT||5000
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});