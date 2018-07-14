// Modules
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

// App inform
var app = express();
var port = 8080;
console.log("The port is set at: " + port);

// Database connection
var con = mysql.createConnection({
	//Maximum 100 concurrent query
	connectLimit: 100,
	host: "localhost",
	user: "root",
	password: "root",
	database: "rent_cmpt354"
});

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'this-is-secret-token',
    cookie: {
        expires: 600000
    }
}));

// Send all static files like images or css files to browser when requested
app.use(express.static('Client'))

// initialize body-parser to parse incoming parameters requests to req.body
// parse only json object
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

/********************************
*			   API				*
*********************************/
// Search
app.get("/search", (req, res) => {
	res.sendFile(__dirname + '/Client/Search/RentalHome.html');
});

app.post("/search", (req, res) => {
	/*TODO*/
});

// Login
app.post('/login', function (req, res) {
	let user = req.body;
	let sql = `SELECT * FROM account where username = '${user.username}' and password = '${user.password}'`;
	con.query(sql, function (err, result) {
		if (err) throw err;
		if (result.length === 1) {
			// If user exist then set to session
			req.session.user = result[0].aid;
			res.send(result[0]);
		} else {
			// Send back error
			res.send("Wrong user credentials");
		}
	});
});

app.get('/logout', (req, res) => {
	if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/search');
    }
});

// Check user session to see if already login
app.get("/checkSession", (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
		let sql = `SELECT * FROM account where aid = '${req.session.user}'`;
		con.query(sql, function (err, result) {
			if (err) throw err;
			if (result.length === 1) {
				// If user exist then set to session
				res.send(result[0]);
			}
		});
    } else {
		res.send("Not login yet!");
    }
});

// Register
app.post("/register", (req, res) => {
	/*TODO*/
});

// Listen to the port 8080 (infinite loop)
app.listen(port);