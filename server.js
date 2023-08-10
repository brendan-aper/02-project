const path = require('path');
const express = require('express');
const expbs = require('express-handlebars');


const app = express();
const PORT = process.env.PORT || 3001;

app.engine('handlebars', expbs.engine());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('home');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up cookie session
const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // expires after 1 day
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};
// Use session
app.use(session(sess));

// Use routes
app.use(routes);

// Run server after sequelize sets up database
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Server now listening on ${PORT}...`));
});
