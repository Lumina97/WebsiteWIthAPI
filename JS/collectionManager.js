const collectionModal = document.getElementById("ImageDisplayModal");
const collectionData = [];
const favoriteCollectionData = [];
let wasFavoritesOpen = false;

function createHTMLImageElement(item) {
  //create HTML Item
  const itemElement = document.createElement("div");
  itemElement.classList.add("modalItem");
  var newContent = `
        <div class="imageContainer">
          <img src='${item.icon}'/>
        </div>
        <div class="descriptionContainer">
          <span>Name :</span> <span> ${item.name}</span>
          <span>ID : </span> <span>${item.id}</span>
          <span>Type : </span> <span> ${item.type}</span>
        </div>
        <div class="modalItemButtons">
          <i class="fa-regular fa-heart modalItemFav"></i>
        </div>
  `;
  itemElement.innerHTML = newContent;
  if (favoriteCollectionData.includes(item)) {
    const favItem = itemElement.querySelector(".modalItemFav");
    favItem.classList.remove("fa-regular");
    favItem.classList.add("fa-solid");
  }
  return itemElement;
}

function updateModalItemAbsolutePositionValues(htmlElement) {
  const itemRect = htmlElement.getBoundingClientRect();
  const left = itemRect.left;
  const top = itemRect.top;
  cssRoot.style.setProperty("--modalItemInitialPositionX", `${left}px`);
  cssRoot.style.setProperty("--modalItemInitialPositionY", `${top}px`);
}

function addAnimationToModalItem(HTMLitem, item, animationName) {
  updateModalItemAbsolutePositionValues(HTMLitem);
  //I use a temporary Item so I can instantly update the collection itself
  //and also update the values at the bottom of the screen without having to
  // worry about the animating item being destroyed to early
  const tempItem = createHTMLImageElement(item);
  document.body.appendChild(tempItem);
  tempItem.classList.add(animationName);
  //this would have to be updated when changing the animation time
  //idk if there is a better way without having to get css rules etc
  //works for now
  setTimeout(function () {
    tempItem.remove();
  }, 1000);
}

//this will not trigger for every item movement if you spam move items from collections
//I know why just not sure how to make it that it'll trigger for every element
function triggerButtonAnimation(button) {
  button.classList.add("buttonWiggleAnimation");
  setTimeout(function () {
    button.classList.remove("buttonWiggleAnimation");
  }, 1200);
}

function addCollectionItemOnClick(htmlElement, item) {
  htmlElement
    .querySelector(".modalItemFav")
    .addEventListener("click", function () {
      const fav = favoriteCollectionData.includes(item);
      const options = {
        removeCollection: fav ? favoriteCollectionData : collectionData,
        addCollection: fav ? collectionData : favoriteCollectionData,
        button: fav ? modalMainCollectionButton : modalFavCollectionButton,
        animation: fav
          ? "addToMainCollectionAnimation"
          : "addToFavoriteAnimation",
        classToRemove: fav ? "fa-solid" : "fa-regular",
        classToAdd: fav ? "fa-regular" : "fa-solid",
      };

      this.classList.remove(options.classToRemove);
      this.classList.add(options.classToAdd);
      addAnimationToModalItem(htmlElement, item, options.animation);
      triggerButtonAnimation(options.button);
      removeItemFromCollection(item, options.removeCollection);
      addItemToCollection(item, options.addCollection);
      reloadCollection();
    });
}

function removeItemFromCollection(item, collection) {
  const index = collection.indexOf(item);
  index !== -1 && collection.splice(index, 1);

  if (collection === favoriteCollectionData)
    favoriteCollectionCounter.removeProperty(item.type);
  else collectionCounter.removeProperty(item.type);
}

function addItemToCollection(item, collection) {
  if (collection.indexOf(item) === -1) {
    collection.push(item);
    if (collection === favoriteCollectionData)
      favoriteCollectionCounter.addProperty(item.type);
    else collectionCounter.addProperty(item.type);
  }
}

async function reloadCollection() {
  favoriteCollectionCounter = new ItemPropertyCounter();
  collectionCounter = new ItemPropertyCounter();
  resetSelect();
  const result = (await wasFavoritesOpen)
    ? createCollectionHTMLItems(favoriteCollectionData)
    : createCollectionHTMLItems(collectionData);
  result.then(() => {
    itemPropertyContainer.innerHTML = " ";

    const collection = wasFavoritesOpen
      ? favoriteCollectionCounter.getCounts()
      : collectionCounter.getCounts();

    for (const [size, count] of Object.entries(collection)) {
      const div = document.createElement("div");
      div.innerText = `${count} | ${size}`;
      itemPropertyContainer.appendChild(div);
    }
  });
}

function openMainCollection() {
  wasFavoritesOpen = false;
  modalMainCollectionButton.classList.add("activeBtn");
  modalFavCollectionButton.classList.remove("activeBtn");
  reloadCollection();
}

function openFavoritesCollection() {
  wasFavoritesOpen = true;
  modalMainCollectionButton.classList.remove("activeBtn");
  modalFavCollectionButton.classList.add("activeBtn");
  reloadCollection();
}
