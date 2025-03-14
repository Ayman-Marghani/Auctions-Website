# Auctions Website
This project is a web-based auction platform built with Express.js that allows users to create auction listings, place bids, and manage their listings.

## Features
- Create and manage auction listings with images, descriptions, and end dates
- Real-time countdown timers showing time remaining for each auction
- Place bids on active listings with comments
- Filter listings by category and search terms
- Preview listings with image and description
- Delete listings through API endpoints
- Rate limiting for API requests to prevent abuse

## Technologies Used
### Backend:
- Node.js
- Express.js
- MySQL database
### Frontend:
- JavaScript (vanilla)
- Pug templating engine
- CSS for styling
### Other:
- Cookie-parser for session management
- RESTful API architecture
- SQL for database queries

## Database Schema
The application uses two main tables:
1. auction - Stores listing information including title, description, image, end date, etc.
2. bid - Stores bid information including bidder name, amount, comment, and reference to the auction
   
## API Endpoints
- GET `/` - Main page
- GET `/gallery` - Browse listings with optional filtering
- GET `/listing/:id` - View a specific listing
- POST `/api/create_listing` - Create a new listing
- POST `/api/place_bid` - Place a bid on a listing
- DELETE `/api/delete_listing` - Delete a listing

## Credits
Developed as part of University of Minnesota Internet Programming course
