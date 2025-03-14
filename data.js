// this package behaves just like the mysql one, but uses async await instead of callbacks.
const mysql = require(`mysql-await`); // npm install mysql-await

// first -- I want a connection pool: https://www.npmjs.com/package/mysql#pooling-connections
// this is used a bit differently, but I think it's just better -- especially if server is doing heavy work.
var connPool = mysql.createPool({
  connectionLimit: 5, 
  host: "127.0.0.1",
  user: "C4131F24U81",
  database: "C4131F24U81",
  password: "", 
});

// Input: data object {title, image, description, category, other_category, sale_date}
// Output: the id of new listing or -1 if creation failed
async function addListing(data) {
  const { title, image, description, category, other_category, sale_date } = data;
  // Image validation
  if (!(image.includes(".jpg") || image.includes(".png") || image.includes(".webp"))) {
    return -1;
  }
  // Category validation
  if (category === "other" && other_category === "") {
    if (other_category === "") {
      return -1;
    }
    else {
      category = other_category;
    }
  }
  // Date Validation
  // parse to date object
  let parsed_sale_date = new Date();
  parsed_sale_date =  Date.parse(sale_date);
  // subtract from now date
  const diff = parsed_sale_date - Date.now();
  // Auction ended case
  if (diff <= 0) {
    return -1;
  }
  const res = await connPool.awaitQuery("INSERT INTO auction (title, img_url, description, category, end_date) VALUES (?, ?, ?, ?, ?);", [title, image, description, category, sale_date]);
  return res.insertId;
}

// Input: id (int)
// Output: true if deleted, false otherwise
async function deleteListing(id) {
  // Delete all bids associated with this listing
  await deleteBids(id);
  const res = await connPool.awaitQuery("DELETE FROM auction WHERE id = ?", [id]);
  if (res.affectedRows === 0) {
    return false;
  }
  return true;
}

// Input: id (int)
// Output: [listing, true if found, false otherwise]
// If found listing will contain bids list
async function getListing(id) {
  const listing = await connPool.awaitQuery("SELECT * FROM auction WHERE id = ?", [id]);
  if (listing.length === 0) {
    return [listing, false];
  }
  const bids = await getBids(id);
  let new_listing = {
    "id" : listing[0].id,
    "title": listing[0].title,
    "img_url": listing[0].img_url,
    "description": listing[0].description,
    "category": listing[0].category,
    "end_date": new Date(listing[0].end_date),
    "bids": bids
  };

  return [new_listing, true];
}

// Input: query, category | string, if null then put ""
// Output: listings with max_bid and bids_len keys
async function getGallery(query, category) {
  let listings = [];
  if (category === "All-Categories" || category === "") {
    listings = await connPool.awaitQuery("SELECT * FROM auction WHERE title LIKE ?", ['%' + query + '%']);
  }
  else {
    listings = await connPool.awaitQuery("SELECT * FROM auction WHERE title LIKE ? AND category = ?", ['%' + query + '%', category]);
  }
  // add highest bid amount to each listing in the result
  for (let listing of listings) {
    listing.max_bid = await getHighestBid(listing.id);
    listing.bids_len = await getBidsLen(listing.id);
  }
  return listings;
}

// Input: data object { listing_id, bidder, amount, comment }
// Output: status code
async function placeBid(data) {
  const { listing_id, bidder, amount, comment } = data;
  // Find the listing
  const [curListing, res] = await getListing(listing_id);
  // if listing is missing
  if (!res) {
    return 404;
  }
  // if bid amount is not bigger than the current top bid
  if (curListing.bids.length > 0 && amount <= curListing.bids[0].amount) {
    return 409;
  }
  await connPool.awaitQuery("INSERT INTO bid (listing_id, bidder, amount, comment) VALUES (?, ?, ?, ?)", [listing_id, bidder, amount, comment]);
  return 201;
}

async function getBids(listing_id) {
  const bids = await connPool.awaitQuery("SELECT bidder, amount, comment FROM bid WHERE listing_id = ? ORDER BY amount DESC;", [listing_id]);
  return bids;
}

// Helper functions
async function getHighestBid(listing_id) {
  const res = await connPool.awaitQuery("SELECT MAX(amount) AS max FROM bid WHERE listing_id = ?", [listing_id]);
  return res[0].max;
}

async function getBidsLen(listing_id) {
  const res = await connPool.awaitQuery("SELECT COUNT(*) AS count FROM bid WHERE listing_id = ?", [listing_id]);
  return res[0].count;
}

async function deleteBids(listing_id) {
  await connPool.awaitQuery("DELETE FROM bid WHERE listing_id = ?", [listing_id]);
}

module.exports = {
    addListing,
    deleteListing,
    getListing,
    getGallery,
    placeBid,
    getBids
};