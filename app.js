const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const flash  = require('connect-flash');
const session  = require('express-session');


// mnogoose connect

mongoose.connect('mongodb://localhost:27017/NodeProject')
    .then(() => console.log('Mongoose Connected!'))
    .catch(err => console.log('Error', err))

// Load mongoose model 
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

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
  //goloble veriable
  app.use((req,res,next)=>{
      res.locals.success_mgs = req.flash('success_mgs');
      res.locals.error_mgs = req.flash('error_mgs');
      res.locals.error = req.flash('error');
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

// add idea route
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add', {
        title: 'ideas/add'
    });
})


//edite route 
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id :req.params.id
    }).then((idea)=>{
        res.render('ideas/edit', {
           idea:idea
        });
    })
  debugger
})
// ideas list route

app.get('/ideas',(req,res)=>{
    Idea.find({})
    .sort({date:'desc'})
    .then((idea)=>{
        res.render('ideas/index',{
            idea:idea
        })
    })
})

// process form add idea
app.post('/ideas', (req, res) => {
    const errors = [];
    if (!req.body.title) {
        errors.push({ text: 'Please enter the title' })
    }
    if (!req.body.details) {
        errors.push({ text: 'Please enter the details' })
    }
    if(errors.length >0){
        res.render('ideas/add',{
            errors,
            title:req.body.title,
            details:req.body.details
        })
    }else{
        const newUser ={
            title:req.body.title,
            details:req.body.details
        }
        new Idea(newUser).save().then((idea)=>{
            req.flash('success_mgs','Videos idea add');
            res.redirect('/ideas')
        })
    }
})
//edit form  process
app.put('/ideas/:id',(req,res)=>{
   Idea.findOne({
       _id:req.params.id 
   }).then((idea)=>{
       idea.title = req.body.title;
       idea.details = req.body.details;
       idea.save().then((idea)=>{
        req.flash('success_mgs','Videos idea updated');
           res.redirect('/ideas')
       })
   })

})
 // Delete idea prcess
 app.delete('/ideas/:id',(req,res)=>{
     Idea.remove({
         _id:req.params.id
     }).then(()=>{
         req.flash('success_mgs','Videos idea removed');
         res.redirect('/ideas')
     })

 })
// server port setup

app.listen(3000, () => {
    console.log(`Server is start in port ${3000}`)
});