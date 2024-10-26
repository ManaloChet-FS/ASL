// Load in our Express framework
const express = require(`express`)

// Create a new Express instance called "app"
const app = express()

// Load in our RESTful routers
const routers = require('./routers/index.js')

const fileUpload = require('express-fileupload');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.set('views', __dirname + '/templates/views')
app.set('view engine', 'twig')

app.use(express.static(__dirname + '/public'));


// Home page welcome middleware
app.get('/', (req, res) => {
  const contentType = req.get('Content-Type');
  // Checks if curl is being used to make the request
  if (contentType === "application/json") {
    return res.status(200).json("Welcome to Star Tracker Library");
  }

  res.render('home/home');
})

// Register our RESTful routers with our "app"
app.use(`/planets`, routers.planet)
app.use(`/stars`, routers.star)
app.use(`/galaxies`, routers.galaxy)

// Set our app to listen on port 3000
app.listen(3000)