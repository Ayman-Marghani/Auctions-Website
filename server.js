const express = require('express')
const cookieParser = require('cookie-parser')
const cookie = require("cookie")
const data = require('./data.js')
const app = express()
const port = 4131

app.set("views", "templates")
app.set("view engine", "pug")

// Middlewares
app.use("/", express.static("resources/"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) 
app.use(cookieParser())
app.use((req, res, next) => {
  // Check api rate limit
  if (req.url.includes("api")) {
    const rateLimitResult = checkRateLimit();
    if (!rateLimitResult.passed) {
      res.set("Retry-After", rateLimitResult.retryAfter)
      res.status(429).send()
      return
    }
    if (!req.body || req.get("Content-Type") !== "application/json") {
      res.status(400).render("create_fail.pug")
      return
    }
  }
  next()
  // request information
  console.log(`${req.method} ${req.url} ${res.statusCode}`)
})

// Rate limiting setup
let rateLimitStore = [];
const RATE_LIMIT = 3; // requests per second
const RATE_LIMIT_WINDOW = 10; // seconds
// Helper Functions
const checkRateLimit = () => {
  const now = new Date();
  rateLimitStore = rateLimitStore.filter(time =>
    (now - time) <= RATE_LIMIT_WINDOW * 1000
  );

  if (rateLimitStore.length >= RATE_LIMIT) {
    const oldestRequest = rateLimitStore[0];
    const retryAfter = RATE_LIMIT_WINDOW - ((now - oldestRequest) / 1000);
    return { passed: false, retryAfter };
  }

  rateLimitStore.push(now);
  return { passed: true };
};

function checkBidData(bid) {
  // Check that all the necessary properties exist in body_data
  if ("listing_id" in bid && "bidder_name" in bid && "bid_amount" in bid && "comment" in bid) {
    // Check properties types
    if (typeof bid.listing_id === "number" && typeof bid.bidder_name === "string" && typeof bid.bid_amount === "number") {
      return true
    }
  }
  return false
}

// Functions
function renderMainPage(req, res) {
  res.status(200).render("mainpage.pug")
}

async function renderGalleryPage(req, res) {
  titleQuery = req.query.query
  catQuery = req.query.category

  if (!titleQuery) titleQuery = ""
  if (!catQuery) catQuery = ""

  const listings = await data.getGallery(titleQuery, catQuery)

  res.status(200).render("gallery.pug", {listings})
}

async function renderListingPage(req, res) {
  const id = req.params.id
  if (!isNaN(id)) {
    const [listing, queryResult] = await data.getListing(parseInt(id))
    if (queryResult) {
      res.status(200).render("listing.pug", {listing, bidder_name: req.cookies.bidder_name})
      return
    }
  }
  res.status(404).render("404.pug")
}

function renderCreateListingPage(req, res) {
  res.status(200).render("create.pug")
}

async function createNewListing(req, res) {
  const input = {
    title: req.body.title,
    image: req.body.img_url, 
    description: req.body.desc, 
    category: req.body.create_category, 
    other_category: req.body.other_category, 
    sale_date: req.body.sale_date
  }
  const queryResId = await data.addListing(input)
  if (queryResId === -1) {
    res.status(400).render("create_fail.pug")
  }
  else {
    // Send the response
    res.location(`http://localhost:4131/listing/${queryResId}`)
    res.status(303).send()
  }
}

async function APICreateNewBid(req, res) {
  if (checkBidData(req.body)) {
    // Get the value of bidder_name cookie if it exists
    let bidder_name = req.body.bidder_name
    if (req.cookies.bidder_name) {
      bidder_name = req.cookies.bidder_name
    }
    // set bidder_name cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("bidder_name", bidder_name, {
        path: "/",
        maxAge: 60 * 60 * 24 // 1 day
      })
    )

    const input = {
      listing_id: req.body.listing_id, 
      bidder: bidder_name, 
      amount: req.body.bid_amount, 
      comment: req.body.comment
    }
    const statusCode = await data.placeBid(input)
    // if listing is missing
    if (statusCode === 404) {
      res.status(404).render("404.pug")
    }
    else {
      const queryBidsRes = await data.getBids(req.body.listing_id)
      res.status(statusCode).send(queryBidsRes)
    }
  }
  else {
    res.status(400).render("create_fail.pug")
  }
}

async function APIDeleteListing(req, res) {
  // Check that "listing_id" is in req.body
  if ("listing_id" in req.body) {
    const queryRes = await data.deleteListing(req.body.listing_id)
    if (queryRes) {
      res.status(204).send()
    }
    else {
      res.status(404).render("404.pug")
    }
  }
  else {
    res.status(400).send()
  }
}

// GET requests
app.get(['/', '/main'], renderMainPage)
app.get('/gallery', renderGalleryPage)
app.get('/listing/:id', renderListingPage)
app.get('/create', renderCreateListingPage)

// POST requests
app.post('/create', createNewListing)

// API requests
app.post('/api/place_bid', APICreateNewBid)
app.delete('/api/delete_listing', APIDeleteListing)

// Default route (404)
app.use((req, res) => {
  res.status(404).render("404.pug")
});

app.listen(port, () => {
  console.log(`Premier Auctions Server listening on port ${port}`) 
})