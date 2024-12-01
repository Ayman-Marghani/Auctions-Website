// this package behaves just like the mysql one, but uses async await instead of callbacks.
const mysql = require(`mysql-await`); // npm install mysql-await

// first -- I want a connection pool: https://www.npmjs.com/package/mysql#pooling-connections
// this is used a bit differently, but I think it's just better -- especially if server is doing heavy work.
var connPool = mysql.createPool({
  connectionLimit: 5, // it's a shared resource, let's not go nuts.
  host: "127.0.0.1",// this will work
  user: "your username",
  database: "your database",
  password: "your password", // we really shouldn't be saving this here long-term -- and I probably shouldn't be sharing it with you...
});

// later you can use connPool.awaitQuery(query, data) -- it will return a promise for the query results.


async function addListing(data) {
  // you CAN change the parameters for this function.
    const { title, image, description, category, sale_date, end_time } = data;
    
}

async function deleteListing(id) {
    
}

async function getListing(id) {

}

async function getGallery(query, category ) {

}

async function placeBid(data) {
  // you CAN change the parameters for this function.
    const { listing_id, bidder, amount, comment } = data;
    
}

async function getBids(listing_id) {

}

async function getHighestBid(listing_id) {

}

module.exports = {
    addListing,
    deleteListing,
    getListing,
    getGallery,
    placeBid,
    getBids,
    getHighestBid
};