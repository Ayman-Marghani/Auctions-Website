CREATE TABLE auction (
  id INT NOT NULL auto_increment,
  title VARCHAR(100),
  img_url TEXT,
  description TEXT,
  category VARCHAR(20),
  end_date DATETIME,
  PRIMARY KEY (id)
);

CREATE TABLE bid (
  id INT NOT NULL auto_increment,
  listing_id INT NOT NULL,
  bidder VARCHAR(50),
  amount DECIMAL(10, 2),
  comment VARCHAR(100),
  PRIMARY KEY (id),
  FOREIGN KEY (listing_id) REFERENCES auction(id)
);