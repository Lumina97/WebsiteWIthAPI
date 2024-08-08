const itemPropertyContainer = document.getElementById("itemProperty");
const cssRoot = document.querySelector(":root");

function updateFavoriteButtonPositionValue() {
  //Get button position (relative to parent)
  const favButtonRect = modalFavCollectionButton.getBoundingClientRect();
  const collectionButtonRect =
    modalMainCollectionButton.getBoundingClientRect();

  const favLeft = favButtonRect.left - 100;
  const favTop = favButtonRect.top - 150;

  const collectionLeft = collectionButtonRect.left - 100;
  const collectionTop = collectionButtonRect.top - 150;

  //this needed to have px after it to do literally anything...
  //this took me way too long to figure out
  cssRoot.style.setProperty("--favPositionX", `${favLeft}px`);
  cssRoot.style.setProperty("--favPositionY", `${favTop}px`);
  cssRoot.style.setProperty("--collectionPositionX", `${collectionLeft}px`);
  cssRoot.style.setProperty("--collectionPositionY", `${collectionTop}px`);
}

window.addEventListener("resize", () => {
  updateFavoriteButtonPositionValue();
});

window.addEventListener("load", () => {
  updateFavoriteButtonPositionValue();
});
