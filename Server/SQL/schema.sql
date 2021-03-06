DROP DATABASE IF EXISTS Cue;
CREATE DATABASE Cue;
USE Cue;


CREATE TABLE IF NOT EXISTS User
(
    uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    fb_user_id VARCHAR(36) NOT NULL UNIQUE,
    access_token VARCHAR(160) NOT NULL,
    name VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS Deck
(
    uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    last_update TIMESTAMP NULL,
    name VARCHAR(255) NOT NULL,
    owner VARCHAR(36) NOT NULL,
    rating INTEGER NOT NULL DEFAULT 0,
    public BOOLEAN NOT NULL DEFAULT FALSE,
    tags_delimited VARCHAR(500),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version INTEGER NOT NULL DEFAULT 0,
    share_code VARCHAR(8) UNIQUE,

    FULLTEXT(name, tags_delimited),
    FOREIGN KEY (owner) REFERENCES User(uuid)
);


CREATE TABLE IF NOT EXISTS Card
(
    uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    deck_id VARCHAR(36) NOT NULL,
    front VARCHAR(255) NOT NULL,
    back VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL,

    FOREIGN KEY (deck_id) REFERENCES Deck(uuid) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS NeedReview
(
    card_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,

    PRIMARY KEY (card_id, user_id),
    FOREIGN KEY (card_id) REFERENCES Card(uuid) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(uuid)
);


CREATE TABLE IF NOT EXISTS Library
(
    user_id VARCHAR(36) NOT NULL,
    deck_id VARCHAR(36) NOT NULL,
    version INTEGER NOT NULL DEFAULT 0,
    last_update_device VARCHAR(255),

    PRIMARY KEY (user_id, deck_id),
    FOREIGN KEY (user_id) REFERENCES User(uuid),
    FOREIGN KEY (deck_id) REFERENCES Deck(uuid)
);


CREATE TABLE IF NOT EXISTS Rating
(
    user_id VARCHAR(36) NOT NULL,
    deck_id VARCHAR(36) NOT NULL,
    rating INTEGER NOT NULL,

    PRIMARY KEY (user_id, deck_id),
    FOREIGN KEY (user_id) REFERENCES User(uuid),
    FOREIGN KEY (deck_id) REFERENCES Deck(uuid) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS Tag
(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tag VARCHAR(255) NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS DeckTag
(
    tag_id INTEGER NOT NULL,
    deck_id VARCHAR(36) NOT NULL,

    PRIMARY KEY (tag_id, deck_id),
    FOREIGN KEY (tag_id) REFERENCES Tag(id),
    FOREIGN KEY (deck_id) REFERENCES Deck(uuid) ON DELETE CASCADE
);
