// Mise en route Express
const express = require('express');
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
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

app.use(cors());
  // To parse get post update
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Setting the views with ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// '/' est la route racine
app.get('/', function (req, res) {
  res.render('pages/home');
});

// renter boat


// user routes
const userRoutes = require('./routes/userRoutes.js')
app.use('', userRoutes);

// owner boat, authentified, can create ,update, delete a boat



app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
})

app.use(globalErrorHandler)

const port = 3000
const server = app.listen(port,() => {
  console.log(`live sur le port  ${port}!`);
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
