//import express module 
var express = require('express');
//create an express app
var app = express();
//require express middleware body-parser
var bodyParser = require('body-parser');
//require express session
var session = require('express-session');
var cookieParser = require('cookie-parser');
//set the view engine to ejs
app.set('view engine', 'ejs');
//set the directory of views
app.set('views', './views');
//specify the path of static directory
app.use(express.static(__dirname + '/public'));

//use body parser to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//use cookie parser to parse request headers
app.use(cookieParser());
//use session to store user data between HTTP requests
app.use(session({
    secret: 'cmpe_273_secure_string',
    resave: false,
    saveUninitialized: true
}));

//Only user allowed is admin
var Users = [{
    "username": "admin",
    "password": "admin"
}];
//By Default we have 3 books
var books = [
    { "BookID": "1", "Title": "Book 1", "Author": "Author 1" },
    { "BookID": "2", "Title": "Book 2", "Author": "Author 2" },
    { "BookID": "3", "Title": "Book 3", "Author": "Author 3" }
]

if (typeof window !== 'undefined') {
    localStorage.setItem('booksVar',JSON.stringify(books));
    let booksvar = localStorage.getItem('booksVar');
    alert(booksvar);
}


//route to root
app.get('/', function (req, res) {
    //check if user session exits
    if (req.session.user) {
        res.render('/home');
    } else
        res.render('login',{books: books});
});
app.get('/logout', function(req, res) {
    // remove the req.user property and clear the login session
    //req.logout();
    req.session.destroy()  
    // destroy session data
    //req.session = null;
  
    // redirect to homepage
    res.redirect('/');
  });
app.post('/login', function (req, res) {
    if (req.session.user) {
        res.render('/home');
    } else {
        console.log("Req Body : ", req.body);
        Users.filter(user => {
            if (user.username === req.body.username && user.password === req.body.password) {
                req.session.user = user;
                res.redirect('/home');
            }else{
                res.send("<script>alert('Invalid credentials'); window.location.replace('/');</script>");
            }
        });
    }

});



app.get('/home', function (req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        console.log("Session data : ", req.session);
        res.render('home', {
            books: books
        });
    }
});

app.get('/create', function (req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('create', {
            books: books
            }
        );
    }
});

app.post('/create', function (req, res) {
    // add your code
    if (req.session.user) {
        res.render('/home');
    } else {
        console.log("Req Body : ", req.body);
        Users.filter(user => {
            if (user.username === req.body.username && user.password === req.body.password) {
                req.session.user = user;
                res.redirect('/home');
            }
        });
    }
});

app.get('/delete', function (req, res) {
    //console.log("Session Data : ", req.session.user);
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('delete', {
            books:books
        });
    }
});

app.post('/delete', function (req, res) {
    // add your code here
})

var server = app.listen(3000, function () {
    console.log("Server listening on port 3000");
});