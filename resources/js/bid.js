const bidBtn = document.querySelector(".bid-btn");
const bidForm = document.querySelector(".bid-form");
const bidFormBtn = document.querySelector(".bid-form-btn");
const bidsBox = document.querySelector(".bids-box");

const bidFormListingId = document.getElementById("listing_id");
const bidFormBidderName = document.getElementById("name");
const bidFormBidAmount = document.getElementById("amount");
const bidFormBidComment = document.getElementById("comment");

async function getData(bid) {
  const response = await fetch("http://localhost:4131/api/place_bid", {
    method: "POST",
    body: JSON.stringify(bid),
    headers: {
      "Content-Type": "application/json",
    }
  });
  
  return response;
}

async function updateBidsList(newBid) {
  const response = await getData(newBid);

  if (response.status === 201) {
    // Render the new bid to the page
    const newBidDiv = document.createElement("div");
    newBidDiv.classList.add("bid");
    bidForm.insertAdjacentElement("afterend", newBidDiv);
    
    const divElem = document.createElement("div");
    newBidDiv.appendChild(divElem);
    // Bidder name
    const bidderSpan = document.createElement("span");
    bidderSpan.classList.add("bidder");
    bidderSpan.innerText = newBid["bidder_name"];
    divElem.appendChild(bidderSpan);
    // Bid amount
    const amountSpan = document.createElement("span");
    amountSpan.classList.add("amount");
    amountSpan.innerText = `$${newBid["bid_amount"].toFixed(2)}`;
    divElem.appendChild(amountSpan);
    // Bid comment
    const commentElem = document.createElement("p");
    commentElem.classList.add("bid-comment");
    commentElem.innerText = newBid["comment"];
    newBidDiv.appendChild(commentElem);
    // Reset the form: clear inputs values
    bidForm.reset();
    bidFormBidAmount.style.border = bidFormBidderName.style.border;
    // Hide the form
    bidBtn.textContent = "Place Bid";
    bidForm.style.display = "none";
  }
  else if (response.status === 409) {
    // Set bid amount field to red border
    bidFormBidAmount.style.border = "0.2rem solid #d62828";
  }
  else if (response.status === 400 || response.status === 500) {
    // Add an alert element
    const alertElem = document.createElement("div");
    alertElem.classList.add("banner");
    alertElem.innerText = "Error!";
    document.body.appendChild(alertElem);
  }
  else if (response.status === 429) {
    let seconds = 3000; // default value
    // Add an alert element
    const alertElem = document.createElement("div");
    alertElem.classList.add("banner");
    alertElem.innerText = "Too many requests!";
    document.body.appendChild(alertElem);
    // Get the value of retry-after header
    response.headers.forEach((val, key) => {
      if (key.toLowerCase() === "retry-after") {
        seconds = parseFloat(val);
      }
    });
    // try again
    setTimeout(() => {
      document.body.removeChild(alertElem);
      updateBidsList(newBid); 
    }, seconds * 1000); 
  }
}

bidBtn.addEventListener("click", () => {
  if (bidBtn.textContent === "Place Bid") {
    bidBtn.textContent = "Cancel Bid";
    bidForm.style.display = "block";
  }
  else {
    bidBtn.textContent = "Place Bid";
    bidForm.style.display = "none";
  }
});

bidFormBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const newBid = {
    "listing_id": parseInt(bidFormListingId.value),
    "bidder_name": bidFormBidderName.value,
    "bid_amount": parseFloat(bidFormBidAmount.value),
    "comment": bidFormBidComment.value
  }
  updateBidsList(newBid);
});