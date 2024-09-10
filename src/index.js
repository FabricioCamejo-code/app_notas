const express = require('express')
const path = require('path')//modulo de node path.
//desestructuración de JavaScript para extraer solo la propiedad engine del objeto exportado. engine es la función que necesitas para configurar el motor de plantillas en Express.
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')//middleware nos sirve para enviar otros tipos de metodos ademas de get y post.
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

//Inicializaciones
const app = express()
require('./database')
require('./config/passport')

//Settings
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))//requerimos  del modulo path el metodo join une directorios y en join hay una constante  __dirname y se le puede concatenar una carpeta.
app.engine('.hbs', engine({
    //Propiedades
    //main archivo/plantilla principal del hbs o html
    defaultLayout: 'main.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true},
    layoutsDir: path.join(app.get('views'), 'layouts'),//concatenamos  'views' y 'layouts'.
    partialsDir:path.join(app.get('views'), 'partials'),//partes de codigo para reutilizar.
    extname: '.hbs' //archivos de extencion.

}))
app.set('view engine', '.hbs')//configurar motor de plantillas/vistas



//Middlewares
app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'))//nos sirve para enviar otros tipos de metodos ademas de get y post. como ej put y delete
app.use(session({
    secret:'secretapp',
    resave: true,
    saveUninitialized: true
}))//este middleware lo config como un objeto.
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Routes
app.use(require('./routes/index'))
app.use(require('./routes/notes'))
app.use(require('./routes/users'))


//Static Files
app.use(express.static(path.join(__dirname, 'public')))

//Server Init
app.listen(app.get('port'), () => {
    console.log('Server escuchando en el puerto: ', app.get('port'))
})
