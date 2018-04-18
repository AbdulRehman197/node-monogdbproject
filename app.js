const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const flash  = require('connect-flash');
const session  = require('express-session');
const path     = require('path');
const passport = require('passport');


// Load ideas router
const ideas = require('./router/ideas');

//load user router

const user = require('./router/user');

// Load passport config
require('./config/passport')(passport);
// DB config
const db = require('./config/database')
// mnogoose connect

mongoose.connect(db.mongoURI)
    .then(() => console.log('Mongoose Connected!'))
    .catch(err => console.log('Error', err))



// Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//load public data static folder

app.use(express.static(path.join(__dirname,'public')))


//body parser middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//method  override middleware
app.use(methodOverride('_method'))
 //express-session middleware
 app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    
  }));
  app.use(flash())


  // Passport middlewares
  app.use(passport.initialize());
  app.use(passport.session());
  //goloble veriable
  app.use((req,res,next)=>{
      res.locals.success_mgs = req.flash('success_mgs');
      res.locals.error_mgs = req.flash('error_mgs');
      res.locals.error = req.flash('error');
      res.locals.user = req.user || null
      next();

  })
// Home route
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Welcome'
    });
});


// about route
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'AbdulRehman'
    });
})

 // Use load ideas router
app.use('/ideas', ideas);
  

//  use load user router
app.use('/user',user);



// server port setup
const port  =  process.env.PORT || 3000
app.listen(3000, () => {
    console.log(`Server is start in port ${port}`)
});