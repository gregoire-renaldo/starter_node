// Mise en route Express
const express = require('express');
// Dot env to keep secrets !
require('dotenv').config();
// limit request
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp')
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Global middleware
// security http headers
app.use(helmet())

// limit number of requests
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 *1000,
  message: 'Too many requests from this IP, please try again later'
});
app.use('/user', limiter)


// Cross-origin request -- React Next to come
const cors = require('cors');

// db Mongo
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(cors());

  // Body parserTo parse get post update, reading data from body into req.body
app.use(express.json({
  limit: '10kb'
}));

// data sanitization against NoSql query injection
// filter query, params etc..
app.use(mongoSanitize());
// data sana against XSS
app.use(xss());
// prevent parameter pollution, clear up query string, + specify whitlist
app.use(hpp({
  // fields for a sort query to whitelistfor example, criterias of a boat ?
  // creat a function for whitelist the fields ?
  whitelist: ['duration', ]
}));

app.use(express.urlencoded({ extended: false }))

// serving satic files
app.use(express.static(__dirname + '/public'));
// Setting the views with ejs
app.set('view engine', 'ejs');

// '/' est la route racine
app.get('/', function (req, res) {
  res.render('pages/home');
});


// Routes
// renter boat


// user routes
const userRoutes = require('./routes/userRoutes.js')
app.use('/user', userRoutes);

// owner boat, authentified, can create ,update, delete a boat



app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
})

app.use(globalErrorHandler)

const port = process.env.PORT || 3000
const server = app.listen(port,() => {
  console.log(`live sur le port  ${port}!`);
  console.log(app.get('env'))
});

// handle promise error if no catch
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLER REJECTION  shuting down...');
  // server close let time to the server to finish the requests
  server.close(() => {
    process.exit(1);
    //PROCESS TO RELAUNCH APP !
  })
});
