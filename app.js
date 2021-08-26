// Exemple adapté de la mise en route d'Express :
// http://expressjs.com/fr/starter/hello-world.html
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const userRoutes = require('./routes/user.js')
app.use('/auth', userRoutes);


// '/' est la route racine
app.get('/', function (req, res) {
  res.render('pages/index');
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('errors/error500');
});

// rutes at the end, butbefore server listen
// app.use(routes);

app.listen(3000, function () {
  console.log("live sur le port 3000 !");
});
