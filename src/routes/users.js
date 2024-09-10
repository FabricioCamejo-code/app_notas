const express = require('express')

const router = express.Router()
const User = require('../models/User')

const passport = require('passport')

router.get('/users/signin', (req, res) => {
    res.render('users/signin')
})

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}))


router.get('/users/signup', (req, res) => {
    res.render('users/signup')
})


router.post('/users/signup', async (req, res) => {
    const {name, email, password, confirm_password} = req.body
    const errores = []
    if(name.length <= 0){
        errores.push({text: 'Please comple'})
    }
    if(email.length <= 0){
        errores.push({text: 'Please comple'})
    }
    if(password.length <= 0){
        errores.push({text: 'Please comple'})
    }
    if(confirm_password.length <= 0){
        errores.push({text: 'Please comple'})
    }
    if(password != confirm_password){
        errores.push({text: 'Error password do not macht'})
    }
    if(password.length < 4){
        errores.push({text: 'Error password must be at least 4 characters'})
    }
    if(errores.length > 0){
        res.render('users/signup', {errores, name, email, password, confirm_password})
    }else{
        const emailUser = await User.findOne({email: email})
        if(emailUser){
             req.flash('error_msg','The Email is already in use')
             return res.redirect('/users/signup')
        }
         const newUser = new User({name, email, password})
         newUser.password = await newUser.encryptPassword(password)
         await newUser.save()
         req.flash('success_msg', 'You are registered')
         res.redirect('/users/signin')
    }
    
})

//router.get('/users/logout', (req, res) => {
//    req.logout()
//    res.redirect('/')
//})
router.get('/users/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});



module.exports = router