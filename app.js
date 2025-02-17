const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

// Set view engine
app.set('view engine', 'ejs');

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// CSRF protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Session setup
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      '0c8eccddb63bb2f42b14de61ef1e5962e0a6699671cb3cccf6514eb4f477d675a69e6a4933ea29054bf27959ff91c7fe31f9381897d4472574b829c8ab9efc21',
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to make username available to all views
app.use((req, res, next) => {
  res.locals.username = req.session.username || null;
  next();
});

// Middleware to expose CSRF token to all views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Routes
app.use('/', authRoutes);
app.use('/', jobRoutes);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});