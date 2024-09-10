const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/notes-db-app')
.then(db => console.log('DB is connect'))
.catch(err => console.error(err))