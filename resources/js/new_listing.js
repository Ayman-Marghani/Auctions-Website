const selectElem = document.getElementById("create_category");
const otherCatElem = document.querySelector(".other-cat");

selectElem.addEventListener("change", () => {
  if (selectElem.value === "other") {
    otherCatElem.style.display = "block";
  }
  else {
    otherCatElem.style.display = "none";
  }
});
