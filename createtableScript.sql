CREATE TABLE IF NOT EXISTS account (
	aid		    BIGINT,
	username	VARCHAR(64) NOT NULL,
	email 		VARCHAR(64) NOT NULL,
	password	VARCHAR(128) NOT NULL,
	friendCode	VARCHAR(128) NOT NULL,
    avatarName  VARCHAR(128),
	PRIMARY KEY (aid),
	UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS administer (
	aid			BIGINT,
	PRIMARY KEY (aid),
	FOREIGN KEY (aid) REFERENCES account (aid)
);

CREATE TABLE IF NOT EXISTS friends (
	friendIDA	BIGINT NOT NULL,
	friendIDB 	BIGINT NOT NULL,
	PRIMARY KEY (friendIDA, friendIDB),
	FOREIGN KEY (friendIDA) REFERENCES account (aid),
	FOREIGN KEY (friendIDA) REFERENCES account (aid)
		ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS preference(
	preID				BIGINT,
	preferPrice			INTEGER DEFAULT NULL,
	preferBedroomNumber	INTEGER DEFAULT NULL,
	preferLocation		VARCHAR(50) DEFAULT NULL,
	aid					BIGINT,
	PRIMARY KEY (preID),
	FOREIGN KEY (aid) REFERENCES account (aid) 
		ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS Notification(
	aid			BIGINT NOT NULL,
	preID		BIGINT NOT NULL,
	PRIMARY KEY (aid, preID),
	FOREIGN KEY (aid) REFERENCES account (aid)
		ON DELETE NO ACTION,
	FOREIGN KEY (preID) REFERENCES  preference(preID)
		ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS Post(
	pid				BIGINT,
	aid				BIGINT NOT NULL,
	postContent		VARCHAR(256) DEFAULT NULL,
	postTitle		VARCHAR(128) NOT NULL,
	postDate		VARCHAR(128) NOT NULL,
	PRIMARY KEY(pid),	
	FOREIGN KEY (aid) REFERENCES account (aid) 
		ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS RentInRequest(
	pid					BIGINT,
	LowerBoundPrice		INTEGER NOT NULL,
	UpperBoundPrice		INTEGER NOT NULL,
	preferBedroomNumber	INTEGER NOT NULL,
	PRIMARY KEY(pid),
	UNIQUE(pid),
	FOREIGN KEY (pid) REFERENCES Post(pid) 
		ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS RentOutPost(
	pid			    BIGINT,
	address		    VARCHAR(128),
	city			VARCHAR(128) NOT NULL,
	province		VARCHAR(128) NOT NULL,
	size			INTEGER DEFAULT NULL,
    price			INTEGER NOT NULL,
	PRIMARY KEY (pid),
	FOREIGN KEY (pid) REFERENCES Post(pid) 
		ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS Image(
	iid			BIGINT,
	pid			BIGINT NOT NULL,
	iname			VARCHAR(30) NOT NULL,
	PRIMARY KEY(iid),
	FOREIGN KEY (pid) REFERENCES Post(pid) 
		ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS Comment(
	cid 				BIGINT,
	pid					BIGINT,
	aid					BIGINT,
	commentDate		    VARCHAR(128) NOT NULL,
	commentContent		VARCHAR(256) NOT NULL,
	PRIMARY KEY (cid,pid,aid),
	FOREIGN KEY (pid) REFERENCES Post(pid)
		ON DELETE NO ACTION,
	FOREIGN KEY (aid) REFERENCES account(aid)
		ON DELETE NO ACTION
);

insert into account values(111111, 'edenlu','zla73@sfu.ca','123', 'HarryPotter', null);
insert into administer values(111111);

insert into post values (1532590474788, 111111, 'You buy then you buy, fuck off other wise', 'My first house', '7/26/2018, 12:34:34 AM');
insert into post values (1532590556905, 111111, 'do you want to taste heaven?', 'Hey can someone rent my townhouse?', '7/26/2018, 12:35:56 AM');
insert into post values (1532590635177, 111111, 'Cheap and nice, me the landlord is an Professional Engineer', 'Super nice room at Burnaby!', '7/26/2018, 12:37:15 AM');

insert into RentOutPost values (1532590474788, '1111 Kingdom', 'richmond', 'bc', 3, 2000);
insert into RentOutPost values (1532590556905, '123 Heaven rd', 'richmond', 'bc', 2, 1000);
insert into RentOutPost values (1532590635177, '999 Garden City', 'burnaby', 'bc', 1, 555);


