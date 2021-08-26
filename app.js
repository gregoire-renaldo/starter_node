// Mise en route Express
const express = require('express');
const app = express();
// Cross-origin requete -- React Next to come
const cors = require('cors');
// Dot env to keep secrets !
require('dotenv').config()

// db Mongo
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  // To parse get post update
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors());

// Setting the views with ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// renter boat
const boatRenterRoutes = require('./routes/boatRenter.js')
app.use('', boatRenterRoutes);

// routes
const userRoutes = require('./routes/user.js')
app.use('/auth', userRoutes);

// owner boat, authentified, can create a boat
const boatOwnerRoutes = require('./routes/boatOwner.js')
app.use('auth', boatOwnerRoutes);



// '/' est la route racine
app.get('/', function (req, res) {
  res.render('pages/home');
});


// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('errors/error500', {error: error});
  res.status(err.status || 500);
});

// routes at the end, but before server listen
// app.use(routes);

app.listen(3000, function () {
  console.log("live sur le port 3000 !");
});
