const express = require('express')
const cookieParser = require('cookie-parser')
const cookie = require("cookie");
const app = express()
const port = 4131

listings = [
  {
  "title": "Limited-Edition Aston Martin DBS Superleggera",
  "img_url": "https://media.autoexpress.co.uk/image/private/s--c22sPFiV--/f_auto,t_content-image-full-desktop@1/v1608208541/autoexpress/2020/12/Aston%20Martin%20DBS%20Concorde.jpg",
  "description": "This Limited-Edition Aston Martin DBS Superleggera represents the pinnacle of British luxury and performance. With its sleek design and powerful V12 engine, this car offers a driving experience that is both exhilarating and refined. This model is one of only 50 ever produced, making it a true collector's item.",
  "category": "Exotic-Cars",
  "id": 1,
  "end_date":"2025-09-24", 
  "bids": [
      {"bidder": "Michael Johnson", "amount": 220000, "comment": "Incredible car, excited to own it!"}, 
      {"bidder": "Sarah Lee", "amount": 215000, "comment": "Astonishing design and performance."}, 
      {"bidder": "David Smith", "amount": 208000, "comment": "Would love to see this beauty in my garage."}, 
  ]},
  {
  "title": "19th Century Bronze Sculpture",
  "img_url": "https://www.charlescheriffgalleries.com/wp-content/uploads/2019/09/6723-1635046444151148159.jpg",
  "description": "This exquisite 19th Century Bronze Sculpture showcases remarkable craftsmanship from a bygone era. Depicting a classical figure, the sculpture is intricately detailed and masterfully cast. A rare find, this piece is perfect for collectors of fine art and antique sculptures.",
  "category": "Antique-Sculptures",
  "id": 2, 
  "end_date":  "2024-11-30", 
  "bids": [
      {"bidder": "Anna Wilson", "amount": 12000, "comment": "A stunning addition to any art collection."},
      {"bidder": "James Roberts", "amount": 11500, "comment": "Beautiful craftsmanship, can't pass this up."},
      {"bidder": "Claire Adams", "amount": 11000, "comment": "This piece is a masterpiece from the 19th century."},
      {"bidder": "Matthew Young", "amount": 10000, "comment": "An incredible work of art, hope to win this."},
      {"bidder": "Sophia Davis", "amount": 9800, "comment": "The detail on this sculpture is exceptional."},
  ]},
  {
  "title": "Antique Mahogany Desk",
  "img_url": "https://ogtstore.com/wp-content/uploads/2022/01/office-furniture-antique-mahogany-writing-desk-q273598.jpg",
  "description": "This beautifully preserved Antique Mahogany Desk features intricate carvings and a timeless design, making it a standout piece in any study or office. Dating back to the late 1800s, the desk is a testament to the craftsmanship of the era, with multiple drawers and brass fittings. A must-have for antique furniture collectors.",
  "category": "Antique-Furniture",
  "id": 3,
  "end_date": "2024-12-05",
  "bids": [
      {"bidder": "Henry Walker", "amount": 12500, "comment": "This is the perfect centerpiece for my study."},
      {"bidder": "Olivia Green", "amount": 12200, "comment": "Absolutely love the craftsmanship on this desk."},
      {"bidder": "William Brooks", "amount": 12000, "comment": "A beautiful antique that will add character to any space."},
      {"bidder": "Emma Carter", "amount": 11800, "comment": "I've been looking for a desk like this for ages."},
      {"bidder": "Nathan Foster", "amount": 11500, "comment": "A unique piece with a lot of history."},
      {"bidder": "Sophia Edwards", "amount": 11300, "comment": ""},
      {"bidder": "Lucas Mitchell", "amount": 11000, "comment": "Looks stunning, and I love the design."},
      {"bidder": "Grace Bell", "amount": 10800, "comment": "Such a rare find, truly a beautiful desk."}
  ]},
  {
  "title": "Rare Diamond Necklace",
  "img_url": "https://www.nektanewyork.com/cdn/shop/files/J107765.jpg",
  "description": "This Rare Diamond Necklace is a breathtaking piece of fine jewelry featuring a stunning array of high-quality diamonds set in platinum. With its elegant design and radiant sparkle, this necklace is perfect for special occasions or as a timeless addition to any luxury jewelry collection. A true one-of-a-kind piece, it has been crafted by renowned artisans.",
  "category": "Luxury-Wearables",
  "id": 4,
  "end_date": "2024-12-03",
  "bids": [
      {"bidder": "Isabella Martin", "amount": 85000, "comment": "A dazzling masterpiece, can’t wait to own it."},
      {"bidder": "Liam Turner", "amount": 82500, "comment": "One of the most stunning necklaces I’ve ever seen."},
      {"bidder": "Benjamin Walker", "amount": 78000, "comment": "Incredible craftsmanship, a true collector’s item."},
      {"bidder": "Charlotte White", "amount": 75500, "comment": "An exquisite piece, hope to add it to my collection."},
      {"bidder": "James Evans", "amount": 74000, "comment": "A rare and beautiful necklace, worth every penny."},
      {"bidder": "Mason Harris", "amount": 70000, "comment": "A timeless piece of jewelry, absolutely breathtaking."}
  ]},
  {
  "title": "Vintage Rolex Submariner Watch",
  "img_url": "https://i.ebayimg.com/images/g/smkAAOSwpJ9llBvr/s-l1600.webp",
  "description": "The Vintage Rolex Submariner Watch is an iconic timepiece known for its timeless design and unmatched craftsmanship. A symbol of luxury and adventure, this particular model has been meticulously preserved, with its original components intact. The Submariner is not just a watch but a piece of history, revered by collectors worldwide.",
  "category": "Luxury-Wearables",
  "id": 5,
  "end_date": "2024-11-15",
  "bids": [
      {"bidder": "Lucas Hill", "amount": 95000, "comment": "A legendary watch, perfect condition for its age."},
      {"bidder": "Olivia Perez", "amount": 92000, "comment": "A classic timepiece, worth every penny."},
      {"bidder": "William Johnson", "amount": 90500, "comment": "A collector’s dream, love this Submariner."},
      {"bidder": "Ava Richardson", "amount": 89000, "comment": "A Rolex that will never go out of style."},
      {"bidder": "Isabella Miller", "amount": 85500, "comment": "A rare find in such excellent condition."},
      {"bidder": "Ethan Campbell", "amount": 83000, "comment": "Perfect watch for both collectors and adventurers."},
      {"bidder": "Mason Wilson", "amount": 81000, "comment": "A Rolex Submariner is always a good idea."}
  ]},
  {
  "title": "Limited-Edition Ferrari 250 GTO Model",
  "img_url": "https://store.ferrari.com/dw/image/v2/BGDG_PRD/on/demandware.static/-/Sites-48/default/dwb0beb5d0/images/zoom/L1127f_15_1.jpg",
  "description": "This Limited-Edition Ferrari 250 GTO Model is a tribute to one of the most valuable and iconic cars in history. Only 36 real 250 GTOs were ever made, and this highly detailed scale model captures the essence of Ferrari's racing spirit and Italian craftsmanship. Perfect for car enthusiasts and collectors alike.",
  "category": "Exotic-Cars",
  "id": 6,
  "end_date": "2024-11-20",
  "bids": [
      {"bidder": "Jackson Wright", "amount": 55000, "comment": "An excellent replica of an iconic Ferrari!"},
      {"bidder": "Emily Scott", "amount": 52500, "comment": "Incredible detail, a must-have for my collection."},
      {"bidder": "Henry Davis", "amount": 51000, "comment": "A masterpiece in model cars, truly amazing."},
      {"bidder": "Amelia Harris", "amount": 50000, "comment": "Would love to own this limited-edition beauty."}
  ]},
  {
  "title": "Rare Louis XVI Antique Cabinet",
  "img_url": "https://img.vntg.com/large/17194789401494/rare-louis-xvi-display-cabinet-in-marquetry-with-light-france-ca-1850.jpg",
  "description": "This Rare Louis XVI Antique Cabinet is an exceptional piece of 18th-century French furniture. Made from high-quality wood with ornate carvings and intricate detailing, this cabinet reflects the elegance and sophistication of the Louis XVI period. A stunning addition to any antique collection.",
  "category": "Antique-Furniture",
  "id": 7,
  "end_date": "2025-2-27",
  "bids": [
      {"bidder": "Charlotte Brown", "amount": 65000, "comment": "A stunning piece of French history, worth every cent."},
      {"bidder": "Michael Evans", "amount": 63000, "comment": "Beautiful craftsmanship, would love to add this to my home."},
      {"bidder": "Liam Carter", "amount": 60500, "comment": "An elegant addition to any antique collection."}
  ]}
]

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
  console.log(`${req.method} ${req.url} ${res.statusCode}, Number of Listings: ${listings.length}`)
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
      // Check listing_id actually exists in the listings
      const lastIdx = listings.length - 1
      if (bid.listing_id >= listings[0].id && bid.listing_id <= listings[lastIdx].id) {
        return true
      }
    }
  }
  return false
}

// Functions
function renderMainPage(req, res) {
  res.render("mainpage.pug")
}

function renderGalleryPage(req, res) {
  titleQuery = req.query.query
  catQuery = req.query.category
  
  res.render("gallery.pug", {listings, titleQuery, catQuery})
}

function renderListingPage(req, res) {
  const id = req.params.id
  if (!isNaN(id)) {
    for (listing of listings) {
      if (listing.id === parseInt(id)) {
        res.render("listing.pug", {listing, bidder_name: req.cookies.bidder_name})
        return
      }
    }
  }
  res.status(404).render("404.pug")
}

function renderCreateListingPage(req, res) {
  res.render("create.pug")
}

function createNewListing(req, res) {
  // Image validation
  if (!(req.body.img_url.includes(".jpg") || req.body.img_url.includes(".png") || req.body.img_url.includes(".webp"))) {
    res.status(400).render("create_fail.pug")
    return
  }
  // Category validation
  if (req.body.create_category === "other" && req.body.other_category === "") {
    res.status(400).render("create_fail.pug")
    return
  }
  // Date Validation
  // parse to date object
  let sale_date = new Date();
  sale_date =  Date.parse(req.body.sale_date);
  // subtract from now date
  const diff = sale_date - Date.now();
  // Auction ended case
  if (diff <= 0) {
    res.status(400).render("create_fail.pug")
    return
  }
  // If all is good, add the new listing to listings dictionary
  let new_listing = {}
  new_listing.title = req.body.title
  new_listing.img_url = req.body.img_url
  new_listing.description = req.body.desc
  new_listing.category = req.body.create_category === "other" ? req.body.other_category : req.body.create_category
  const lastIdx = listings.length - 1
  new_listing.id = listings[lastIdx].id + 1 
  new_listing.end_date = req.body.sale_date
  new_listing.bids = []
  listings.push(new_listing) 
  // Send the response
  res.location(`http://localhost:4131/listing/${new_listing.id}`)
  res.status(303).send()
}

function APICreateNewBid(req, res) {
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
    // Find the listing
    let curListing = null
    for (item of listings) {
      if (req.body.listing_id === item.id) {
        curListing = item
      }
    }
    // if listing is missing
    if (!curListing) {
      res.status(404).render("404.pug")
      return
    }
    // if bid amount is not bigger than the current top bid
    if (curListing.bids.length > 0 && req.body.bid_amount <= curListing.bids[0].amount) {
      res.status(409).send(curListing.bids)
      return
    }
    // If all is good, create a new bid and add it to bids dictionary
    let new_bid = {}
    new_bid.bidder = bidder_name
    new_bid.amount = req.body.bid_amount
    new_bid.comment = req.body.comment
    // put the new bid in the front of the list
    curListing.bids.unshift(new_bid)
    res.status(201).send(curListing.bids)
  }
  else {
    res.status(400).render("create_fail.pug")
  }
}

function APIDeleteListing(req, res) {
  // Check that "listing_id" is in req.body
  if ("listing_id" in req.body) {
    let idx = -1
    // Find the listing
    for (let i = 0; i < listings.length; i++) {
      if (req.body.listing_id === listings[i].id) {
        idx = i
        break
      }
    }
    // Delete the listing if found
    if (idx !== -1) {
      listings.splice(idx, 1)
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