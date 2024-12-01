const banner = document.querySelector(".banner");
function updateDisplay() {
  if (banner.style.display === "none") {
    banner.style.display = "block";
  }
  else {
    banner.style.display = "none";
  }
}

setInterval(updateDisplay, 1000);
