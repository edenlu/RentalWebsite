CREATE TABLE IF NOT EXISTS account (
	aid		INTEGER,
	username	VARCHAR(64) NOT NULL,
	email 		VARCHAR(64) NOT NULL,
	password	VARCHAR(128) NOT NULL,
	friendCode	VARCHAR(123) NOT NULL,
	PRIMARY KEY (aid),
	UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS administer (
	aid			INTEGER,
	PRIMARY KEY (aid),
	FOREIGN KEY (aid) REFERENCES account (aid)
);

CREATE TABLE IF NOT EXISTS friends (
	friendIDA	INTEGER NOT NULL,
	friendIDB 	INTEGER NOT NULL,
	PRIMARY KEY (friendIDA, friendIDB),
	FOREIGN KEY (friendIDA) REFERENCES account (aid),
	FOREIGN KEY (friendIDA) REFERENCES account (aid)
		ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS preference(
	preID				INTEGER,
	preferPrice			INTEGER DEFAULT NULL,
	preferBedroomNumber	INTEGER DEFAULT NULL,
	preferLocation		VARCHAR(50) DEFAULT NULL,
	aid					INTEGER,
	PRIMARY KEY (preID),
	FOREIGN KEY (aid) REFERENCES account (aid) 
		ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS Notification(
	aid			INTEGER NOT NULL,
	preID		INTEGER NOT NULL,
	PRIMARY KEY (aid, preID),
	FOREIGN KEY (aid) REFERENCES account (aid)
		ON DELETE NO ACTION,
	FOREIGN KEY (preID) REFERENCES  preference(preID)
		ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS Post(
	pid				INTEGER,
	aid				INTEGER NOT NULL,
	postContent		VARCHAR(256) DEFAULT NULL,
	postTitle		VARCHAR(128) NOT NULL,
	postDate		date,
	PRIMARY KEY(pid),	
	FOREIGN KEY (aid) REFERENCES account (aid) 
		ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS RentInRequest(
	pid					INTEGER,
	LowerBoundPrice		INTEGER NOT NULL,
	UpperBoundPrice		INTEGER NOT NULL,
	preferBedroomNumber	INTEGER NOT NULL,
	PRIMARY KEY(pid),
	UNIQUE(pid),
	FOREIGN KEY (pid) REFERENCES Post(pid) 
		ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS RentUnit(
	address		VARCHAR(128),
	city			VARCHAR(128) NOT NULL,
	province		VARCHAR(128) NOT NULL,
	size			VARCHAR(20) DEFAULT NULL,
	price			INTEGER NOT NULL,
	PRIMARY KEY(address)
);

CREATE TABLE IF NOT EXISTS RentOutPost(
	pid			INTEGER,
	address		VARCHAR(128) NOT NULL,
	PRIMARY KEY(pid),
	FOREIGN KEY (pid) REFERENCES Post(pid) 
		ON DELETE NO ACTION,
	FOREIGN KEY (address) REFERENCES RentUnit(address) 
		ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Image(
	iid			INTEGER,
	pid			INTEGER NOT NULL,
	iname			VARCHAR(30) NOT NULL,
	PRIMARY KEY(iid),
	FOREIGN KEY (pid) REFERENCES Post(pid) 
		ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS Comment(
	cid 				INTEGER,
	pid					INTEGER,
	aid					INTEGER NOT NULL,
	commentDate		VARCHAR(128) NOT NULL,
	commentContent		VARCHAR(256) NOT NULL,
	PRIMARY KEY (pid,aid),
	FOREIGN KEY (pid) REFERENCES Post(pid)
		ON DELETE NO ACTION,
	FOREIGN KEY (pid) REFERENCES account(aid)
		ON DELETE NO ACTION
);

insert into account values(111111, 'edenlu','zla73@sfu.ca','123', 'HarryPotter');
insert into administer values(111111);

