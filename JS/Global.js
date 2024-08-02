const collectionModal = document.getElementById("ImageDisplayModal");
const imagePreview = document.getElementById("itemPreview");
const modalMainCollectionButton = document.getElementById(
  "modalMainCollectionButton"
);
const modalFavCollectionButton = document.getElementById(
  "modalFavCollectionButton"
);
const itemPropertyContainer = document.getElementById("itemProperty");
const sortSelect = document.getElementById("sort");

const collectionData = [];
const favoriteCollectionData = [];
let wasFavoritesOpen = false;

sortSelect.addEventListener("change", function (event) {
  const selectedValue = event.target.value;
  selectedValue === "sizeAscending"
    ? sortCollection(true)
    : sortCollection(false);
});

class ItemPropertyCounter {
  constructor() {
    this.propertyCount = {};
  }

  setSizeCount(propertyCount) {
    this.propertyCount = propertyCount;
  }

  addProperty(property) {
    if (this.propertyCount[property]) {
      this.propertyCount[property]++;
    } else {
      this.propertyCount[property] = 1;
    }
  }

  removeProperty(property) {
    if (this.propertyCount[property]) {
      if (this.propertyCount[property] > 1) {
        this.propertyCount[property]--;
      } else {
        delete this.propertyCount[property];
      }
    }
  }

  getCounts() {
    return this.propertyCount;
  }
}
let collectionCounter = new ItemPropertyCounter();
let favoriteCollectionCounter = new ItemPropertyCounter();

async function getAccountDetails() {
  const endpoint = "https://api.guildwars2.com/v2/items";

  try {
    const response = await fetch(endpoint, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    //get a random index within the data array length
    //to get random elements on reload and will increase load times over getting the same few items over and over again
    const randomStartIndex =
      Math.floor(Math.random() * (data.length - 0 + 1)) - 100;

    for (let i = 0; i < 50; i++) {
      const idEndpoint = endpoint + "/" + data[i];
      const response = await fetch(idEndpoint, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const item = await response.json();
      collectionData.push(item);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function executeAPICallAndFillHTML() {
  await getAccountDetails();
  await openMainCollection();
}

executeAPICallAndFillHTML();

async function createCollectionHTMLItems(collectionList) {
  return new Promise((res) => {
    const collectionItemContainer = document.getElementById(
      "modalContentContainer"
    );
    collectionItemContainer.innerHTML = "";

    collectionList.forEach((item) => {
      const element = createHTMLImageElement(item);
      addCollectionItemOnClick(element, item);
      collectionItemContainer.appendChild(element);
      wasFavoritesOpen
        ? favoriteCollectionCounter.addProperty(item.type)
        : collectionCounter.addProperty(item.type);
    });
    res();
  });
}

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

function addCollectionItemOnClick(htmlElement, item) {
  htmlElement
    .querySelector(".modalItemFav")
    .addEventListener("click", function () {
      if (favoriteCollectionData.includes(item)) {
        removeItemFromFavorites(item);
        addItemToMainCollection(item);
        this.classList.remove("fa-solid");
        this.classList.add("fa-regular");
      } else {
        removeItemFromMainCollection(item);
        addItemToFavorites(item);
        this.classList.remove("fa-regular");
        this.classList.add("fa-solid");
      }
      reloadCollection();
    });
}

function addItemToFavorites(item) {
  if (favoriteCollectionData.indexOf(item) === -1) {
    favoriteCollectionData.push(item);
    favoriteCollectionCounter.addProperty(item.type);
  }
}

function removeItemFromFavorites(item) {
  const index = favoriteCollectionData.indexOf(item);
  index !== -1 && favoriteCollectionData.splice(index, 1);

  favoriteCollectionCounter.removeProperty(item.type);
}

function addItemToMainCollection(item) {
  if (collectionData.indexOf(item) === -1) {
    collectionData.push(item);
    collectionCounter.addProperty(item.type);
  }
}

function removeItemFromMainCollection(item) {
  const index = collectionData.indexOf(item);
  index !== -1 && collectionData.splice(index, 1);

  collectionCounter.removeProperty(item.type);
}

/*------------------------SORTING */

function sortCollection(bFilterAscending) {
  const sortFunction = bFilterAscending
    ? (a, b) => a.name.localeCompare(b.name)
    : (a, b) => b.name.localeCompare(a.name);

  wasFavoritesOpen
    ? favoriteCollectionData.sort(sortFunction)
    : collectionData.sort(sortFunction);

  reloadCollection();
}

async function reloadCollection() {
  favoriteCollectionCounter = new ItemPropertyCounter();
  collectionCounter = new ItemPropertyCounter();
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
