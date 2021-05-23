const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport')
require('dotenv').config();
const mongoose = require('mongoose');



const app = express();
const cors = require('cors');


// Load routes
const tasks = require('./routes/tasks');
const users = require('./routes/users');


// Passport Config
require('./config/passport')(passport);

//Map global promise -get rid of warning
mongoose.Promise = global.Promise;

const dbURL = "mongodb+srv://todochores:todochores@todocluster.lt7am.mongodb.net/tasks?retryWrites=true&w=majority"
    //Connect to mongoose
mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGODB Connected");
        // app.listen(PORT, () => {
        //     console.log('the server is working')
        // });
    })
    .catch(err => console.log(err));

// let tasks = [{
//     id: 1,
//     name: 'Read',
//     category: 'Work',
//     description: 'Read a chapter on express routes',
//     deadline: '2021-04-12',
//     completed: 'false'
// }, {
//     id: 2,
//     name: 'Presentation',
//     category: 'Work',
//     description: 'App Presentation',
//     deadline: '2021-06-01',
//     completed: 'false'
// }, {
//     id: 3,
//     name: 'Movie',
//     category: 'Personal',
//     description: 'Watch Movie with friends',
//     deadline: '2021-04-06',
//     completed: 'true'
// }, ];

// Load Idea Model
require('./models/Task');
const Task = mongoose.model('tasks');

// Ha
//ejs Middleware
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// Static folder
app.use(express.static(path.join(__dirname, 'public')));


//Method override midlleware
app.use(methodOverride('_method'));


//session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true

}));


// // Passport middleware
app.use(passport.initialize());

app.use(passport.session());


//flash middleware
app.use(flash());

//global variables
app.use(function(req, res, next) {

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})


//Handlebars Middleware
//const exphbs = require('express-handlebars')
// app.engine('handlebars', exphbs({
//     defaultLayout: 'main'
// }));
//app.set('view engine', 'handlebars');


//app.get when using Handle bars Middleware
// app.get('/', (request, response) => {
//     const title = 'WELCOME TO THE TODOLIST APP';
//     response.render('pages/index', {
//         title: title
//     });
//     // response.send('index');
// });


// index page
app.get('/', (req, res) => {
    res.render('pages/home');
});

// about page

app.get('/about', (req, res) => {
    res.render('pages/about');
});


//lists all the tasks stored in the database
// about page
app.get('/lists', (req, res) => {
    Task.find({ completed: false },

        function(error, tasks) {
            if (error) {
                console.log('Error in fetching tasks from db');
                return;
            }
            const tagline = "CRUD PROGRAMMING IS HARD";

            res.render('pages/lists', {
                tagline: tagline,
                tasks: tasks || []
            });
        });
});


// Use routes
app.use('/tasks', tasks);
// app.use('/lists', lists);
// app.use('/status', status);
app.use('/users', users);



const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Server started on port ${PORT}')
});