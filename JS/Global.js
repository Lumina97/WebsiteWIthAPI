const modalMainCollectionButton = document.getElementById(
  "modalMainCollectionButton"
);
const modalFavCollectionButton = document.getElementById(
  "modalFavCollectionButton"
);

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
    //idk why this wasn't in the version that you got but I didn't mean to increase load times I just wanted to show different set of items.
    //and show that the property counter works correctly
    const randomStartIndex =
      Math.floor(Math.random() * (data.length - 0 + 1)) - 50;

    for (let i = randomStartIndex; i < randomStartIndex + 50; i++) {
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

async function executeAPICallAndFillHTML() {
  await getAccountDetails();
  await openMainCollection();
}

executeAPICallAndFillHTML();
