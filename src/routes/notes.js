const express = require('express')
const router = express.Router()

const Note = require('../models/Note')

const { isAuthenticated } = require('../helpers/auth')

router.get('/notes/add', isAuthenticated,  (req,res) => {
    res.render('notes/new-note')
})

router.post('/notes/new-note', isAuthenticated,  async (req,res) => {
    const {title, description} = req.body
    const error = []
    if(!title){error.push({Text: 'Please write title'})}
    if(!description){error.push({Text: 'Please write description'})}
    if(error.length > 0){res.render('notes/new-note', {
        error,
        title,
        description
    })}else {
        const newNote = new Note({title,description})
        newNote.user = req.user.id
        await newNote.save()
        req.flash('success_msg', 'Note Added SuccessFully')
        res.redirect('/notes')}
    
})

router.get('/notes', isAuthenticated ,async (req, res) => {
    const notas = await Note.find({user: req.user.id}).sort({date: 'desc'})
    res.render('notes/all-notes', { notas })
})

router.get('/notes/edit/:id', isAuthenticated,async (req,res) => {
    const note = await Note.findById(req.params.id)
    res.render('notes/edit-note', {note})
})

router.put('/notes/edit-note/:id', isAuthenticated ,async (req,res) => {
    const {title, description} = req.body
    await Note.findByIdAndUpdate(req.params.id, {title, description})
    req.flash('success_msg', 'Note Updated SuccessFully.')
    res.redirect('/notes')
})

router.delete('/notes/delete/:id', isAuthenticated ,async (req, res) => {
    await Note.findByIdAndDelete(req.params.id)
    req.flash('success_msg', 'Note Delete SuccessFully.')
    res.redirect('/notes')
})

module.exports = router