// Modules
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
// session for store user login info
var session = require('express-session');
// File uploading module
var multer = require('multer');
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'public/images')
	},
	filename: function (req, file, cb) {
	  cb(null, "Image" + Date.now() + file.originalname)
	}
  })
var upload = multer({ storage: storage});

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
app.use(express.static('Client'));
app.use(express.static('public'));

// initialize body-parser to parse incoming parameters requests to req.body
// parse json object
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

//ejs
app.set("view engine", "ejs");


/********************************
*			   API				*
*********************************/
// Search
app.get("/search", (req, res) => {
	res.sendFile(__dirname + '/Client/Search/RentalHome.html');
});

app.post("/search", (req, res) => {
	let data = req.body;
	let type = 'rentoutpost';
	let orderBy = '';
	let sql =  `select * from post p, rentoutpost r where p.pid = r.pid`;
	if (data.city) {
		sql += ` and r.city = "${data.city.toLowerCase()}"`;
	}
	if (data.size && !isNaN(data.size)) {
		sql += ` and r.size <= ${data.size}`;
		orderBy = 'r.size';
	}
	if (data.price && !isNaN(data.price)) {
		sql += ` and r.price <= ${data.price}`;
		orderBy = 'r.price';
	}
	if (orderBy) {
		sql += ` order by ${orderBy}`;
	}

	// limit to top 10
	sql += ' limit 10';
	con.query(sql, function (err, result) {
		if (err) throw err;
		res.send(result);
	});

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
			res.send(200, result[0]);
		} else {
			// check what type of error
			sql = `SELECT * FROM account where username = '${user.username}'`;
			con.query(sql, function (err, result) {
				let data = {
					error: ""
				};
				// username exists that means password is wrong
				if (result.length === 1) {
					data.error = "Incorrect password";
				} else {
					data.error = "User not exists";
				}
				res.send(200, data);
			});
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
		let sql =  `SELECT username, email, friendCode, avatarName FROM account where aid = '${req.session.user}'`;
		con.query(sql, function (err, result) {
			if (err) throw err;
			if (result.length === 1) {
				// If user exist then set to session
				if (!(result[0].avatarName)) {
					result[0].avatarName = 'default.png';
				}
				res.send(200, result[0]);
			}
		});
    } else {
		res.send(200, {msg: "Not login yet!"});
    }
});

// Profile
app.get("/profile", (req, res) => {
	res.sendFile(__dirname + '/Client/Profile/Profile.html');
});

// Change profile
app.post("/changeProfile", (req, res) => {
	let key = req.body.key;
	let value = req.body.value;
	if (req.session.user && req.cookies.user_sid) {
		let sql = `UPDATE account set ${key} = '${value}' where aid = '${req.session.user}'`;
		con.query(sql, function (err, result) {
			if (err) throw err;
			console.log(result);
			res.send(200, result.message);
		});
	}
});

// Upload Image
app.post("/uploadUserAvatar", upload.single('userIcon'), (req, res) => {
	if (req.session.user && req.cookies.user_sid) {
		let sql = `UPDATE account set avatarName = '${req.file.filename}'where aid = '${req.session.user}'`;
		con.query(sql, function (err, result) {
			if (err) throw err;
			res.send(200, result[0]);
		});
    }
	res.send(200);
});

// Register
app.get("/registeration", (req, res) => {
	res.sendFile(__dirname + '/Client/Registeration/Registeration.html');
});

// Register
app.post("/register", (req, res) => {
	let user = req.body;
	let data={error:""}
	let sql=`SELECT * FROM account where username = '${user.username}'`;
	con.query(sql,function(err,result){
		if (result.length === 1){
			data.error="user already exist"
			res.send(200, data);			
		} else {
			sql=`SELECT * FROM account where email = '${user.email}'`;
			con.query(sql,function(err,result){
				if(result.length===1){
					data.error="E-mail already been used"
					res.send(200, data);	
				} else {
                    sql=`SELECT aid FROM account`;
                    con.query(sql,function(err,result){
                        let rnumber = Date.now();
                        while (result.indexOf(rnumber) != -1) {
                            rnumber = Date.now();
                        }
                        sql = `insert into account values('${rnumber}','${user.username}','${user.email}','${user.password}','', null)`;
                        con.query(sql, function (err, result) {
							if (err) throw err;
							// Keep registered user login
							req.session.user = rnumber;
							res.send({redirect: '/search'});
                        });
					});
				}
			});
		}
	});
});

app.get("/createPost", (req, res) => {
	res.sendFile(__dirname + '/Client/CreatePost/CreatePost.html');
});

app.post("/createPost", (req, res) => {
	if (!req.session.user || !req.cookies.user_sid) {
		res.send(400, "Not login yet");
		return;
	}
	else {
		let pid = Date.now();
		let aid = req.session.user;
		let postDate = new Date().toLocaleString();
		let postInfo = req.body;
		let sql_post = `INSERT INTO post VALUES (${pid}, ${aid}, '${postInfo.data.postContent}', '${postInfo.data.title}', '${postDate}')`;
		con.query(sql_post, function(err, result){
			if (err) throw err;
			if (postInfo.type == "rentIn") {
				let sql_rentIn = `INSERT INTO rentinrequest VALUES (${pid},${postInfo.data.LowerBoundPrice},${postInfo.data.UpperBoundPrice},${postInfo.data.preferBedroomNumber})`;
				con.query(sql_rentIn, function(err, result) {
					if (err) throw err;
					res.send(200, "ok");
				});
			} else {
				let sql_rentOut = `INSERT INTO rentoutpost VALUES (${pid},'${postInfo.data.address}', '${postInfo.data.city.toLowerCase()}', '${postInfo.data.province.toLowerCase()}', '${postInfo.data.size}', ${postInfo.data.price})`;
				con.query(sql_rentOut, function(err, result){
					if (err) throw err;
					res.send(200, "ok");
				});
			}
		});
	}
});


app.get("/posts/:id", (req, res) => {
	let pid = req.params.id;
	let sql = `SELECT * FROM Post where pid = '${pid}'`;
  
	con.query(sql, function(err, post) {
		if (err) throw err;
		let aid = post[0].aid;
		sql = `SELECT username FROM Account WHERE aid = '${aid}'`;
		con.query(sql, function(err, username) {
			if (err) throw err;
			sql = `SELECT * FROM Comment WHERE pid = '${pid}' ORDER BY commentDate`;
			con.query(sql, function(err, comments) {
				if (err) throw err;
				sql = `SELECT * FROM RentOutPost WHERE pid = '${pid}'`;
				con.query(sql, function(err, RentOutPost) {
					console.log(RentOutPost[0]);
					if (err) throw err;
					res.render("post", {
						post: post[0],
						username: username[0],
						comments: comments,
						RentOutPost: RentOutPost
					});
				});
			});
		});
	});
});
  
app.post("/posts/:id", (req, res) => {
	if (!req.session.user || !req.cookies.user_sid) {
		res.send(400, {error: "Not login yet!"});
		return;
	}

	let cid = Date.now();
	let timestamp = new Date();
	let date = timestamp.toLocaleString();
	let pid = req.params.id;
	let aid = req.session.user;
	let commentContent = req.body.commentContent;

	let sql = `INSERT INTO Comment VALUES ('${cid}', '${pid}', '${aid}', '${date}', '${commentContent}')`;
	con.query(sql, function(err, post) {
		let data = {
			error: "",
			success: ""
		};
		if (err) {
			data.error = err;
		} else {
			data.success = "success";
			res.send(200, data);
		}
	});
});

// Listen to the port 8080 (infinite loop)
app.listen(port);