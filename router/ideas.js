const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');
// Load mongoose model 
require('../models/Idea');
const Idea = mongoose.model('ideas');

// add idea route
router.get('/add', ensureAuthenticated,(req, res) => {
    res.render('ideas/add', {
        title: 'ideas/add'
    });
})


//edite route 
router.get('/edit/:id', ensureAuthenticated,(req, res) => {
    Idea.findOne({
        _id :req.params.id
    }).then((idea)=>{
        if( idea.user != req.user.id){
            req.flash('error_mgs','Not Athorized');
            res.redirect('/ideas')
        }
        res.render('ideas/edit', {
           idea:idea
        });
    })

})
// ideas list route

router.get('/', ensureAuthenticated,(req,res)=>{
    Idea.find({user:req.user.id})
    .sort({date:'desc'})
    .then((idea)=>{
        res.render('ideas/index',{
            idea:idea
        })
    })
})

// process form add idea
router.post('/',ensureAuthenticated, (req, res) => {
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
        const newUser = {
            title:req.body.title,
            details:req.body.details,
            user:req.user.id
        }
        new Idea(newUser).save().then((idea)=>{
            req.flash('success_mgs','Videos idea add');
            res.redirect('/ideas')
        })
    }
})
//edit form  process
router.put('/:id',ensureAuthenticated,(req,res)=>{
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
 router.delete('/:id',ensureAuthenticated,(req,res)=>{
     Idea.remove({
         _id:req.params.id
     }).then(()=>{
         req.flash('success_mgs','Videos idea removed');
         res.redirect('/ideas')
     })

 })
 module.exports = router;