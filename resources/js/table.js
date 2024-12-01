const endDateCells = document.querySelectorAll("td.end-date-cell");
const saleDateCells = document.querySelectorAll(".sale-date-cell");

const tableRows = document.querySelectorAll(".listing-row");

const previewImg = document.querySelector(".preview .listing-img");
const previewDesc = document.querySelector(".preview .listing-desc");

const deleteBtns = document.querySelectorAll(".delete-listing-btn");

function updateTable() {
  for (let i = 0; i < saleDateCells.length; i++) {
    // parse to date object
    let sale_date = new Date();
    sale_date =  Date.parse(saleDateCells[i].textContent);
    // subtract from now date
    const diff = sale_date - Date.now();
    // Auction ended case
    if (diff <= 0) {
      endDateCells[i].textContent = "Auction ended"
    }
    // otherwise print how much time is left
    else {
      const total_seconds = parseInt(diff / 1000);
      const days = parseInt(total_seconds / (24 * 60 * 60));
      const hours = parseInt(total_seconds % (24 * 60 * 60) / (60 * 60));
      const minutes = parseInt(total_seconds % (60 * 60) / 60);
      const seconds = parseInt(total_seconds % 60);
      endDateCells[i].textContent = `${days}d ${hours}h: ${minutes}m ${seconds}s`
    }
  }
}

function updatePreview(src, alt, description) {
  // Update image
  previewImg.setAttribute("src", src);
  previewImg.setAttribute("alt", alt);
  // Update description
  previewDesc.textContent = description;
}

async function sendDeleteReq(listingId) {
  let response = await fetch("http://localhost:4131/api/delete_listing", {
    method: "DELETE",
    body: JSON.stringify({"listing_id": listingId}),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

async function updateListingsList(listingId, tableRowElem) {
  let response = await sendDeleteReq(listingId);
  if (response.status == 204 || response.status == 404) {
    tableRowElem.remove();
  }
  else if (response.status == 400 || response.status == 500) {
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
      updateListingsList(listingId, tableRowElem);
    }, seconds * 1000); 
  }
}

deleteBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const listingId = parseInt(btn.getAttribute("data-listing-id"));
    // send listing_id and table row element for the listing
    updateListingsList(listingId, btn.parentNode.parentNode);
  });
});

tableRows.forEach((row) => {
  row.addEventListener("mouseenter", () => {
    const src = row.getAttribute("data-img-src");
    const alt = row.getAttribute("data-img-alt");
    const description = row.getAttribute("data-desc");
    updatePreview(src, alt, description);
  });
});

updateTable();
setInterval(updateTable, 1000);
