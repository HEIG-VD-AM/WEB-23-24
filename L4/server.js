import express, {response} from 'express';
import sqlite3 from "sqlite3";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure express
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
const db = new sqlite3.Database('./dictons.sqlite', (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        console.log("Server connected to database");
    }
});

// GET /
// Displays a random dicton in HTML.
// Example: <q>random dicton</q>
app.get('/', function(req, res) {
    db.get(`SELECT dicton FROM dictons WHERE id = (ABS(RANDOM()) % (SELECT (SELECT MAX(id) FROM dictons) + 1)) OR id = (SELECT MAX(id) FROM dictons) ORDER BY id LIMIT 1`, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
        } else {
            res.render('index', {
                dicton: row.dicton
            });
        }
    });
});


// GET /list
// Displays all the dictons ordered by id in HTML
// Example: <ul><li><a href="/1">dicton 1</a></li></ul> 
app.get('/list', function(req, res) {
    db.all(`SELECT * FROM dictons ORDER BY id`, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
        } else {
            res.render('list', {
                dictons: rows
            });
        }
    });
});



// GET /create
// Displays a HTML form for creating new dictons with POST requests.
// Example: <form method=POST><input type='text' name='dicton'></input><button>Nouveau dicton</button></form>
app.get('/create', function(req, res) {
    res.render('create');
});

// POST /create
// Inserts a new dicton in the database and redirect the user to its url
// Example: 301 /list
app.post('/create', (req, res) => {
    db.run("INSERT INTO dictons(dicton) VALUES (?)", req.body.dicton, function (error) {
        if (error) {
            res.status(400).json({ "error": error.message });
        } else {
            // Redirect to a URL with the max ID as a URL parameter
            res.redirect(`/${this.lastID}`);
        }
    });
});

// GET /:id
// Returns a dicton by its id.
app.get('/:id', function(req, res) {
    db.get(`SELECT dicton FROM dictons WHERE id = ?`, req.params.id, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
        } else if(row) {
            res.render('index', {
                dicton: row.dicton
            });
        } else {
            res.status(404).send("This id doesn't exist");
        }
    });
});


export default app;