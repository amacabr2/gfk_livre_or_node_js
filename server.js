//variable
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session');

//moteur de template
app.set('view engine', 'ejs');

//middleware
app.use('/assets', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'aqwzsxedc',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(require('./middleware/flash'));

//routes

app.get('/', (request, response) => {
    let Message = require('./models/message');
    Message.all(function (messages) {
        console.log(messages);
        response.render('pages/index', {messages: messages});
    });
});

app.get('/message/:id', (request, response) => {
    let Message = require('./models/message');
    Message.find(request.params.id, function (message) {
        response.render('pages/message', {message: message});
    });
});

app.post('/', (request, response) => {
    if (request.body.message === undefined || request.body.message === '') {
        request.flash('error', "Vous n'avez pas entré de message ");
        response.redirect('/');
    } else {
        let Message = require('./models/message');
        Message.create(request.body.message, function () {
            request.flash('success', "Merci");
            response.redirect('/');
        });
    }
});

app.listen(8080);
