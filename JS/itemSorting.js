const sortSelect = document.getElementById("sort");

sortSelect.addEventListener("change", function (event) {
  const selectedValue = event.target.value;
  selectedValue === "A-Z" ? sortCollection(true) : sortCollection(false);
});

function sortCollection(bFilterAscending) {
  const sortFunction = bFilterAscending
    ? (a, b) => a.name.localeCompare(b.name)
    : (a, b) => b.name.localeCompare(a.name);

  favoriteCollectionData.sort(sortFunction);
  collectionData.sort(sortFunction);

  reloadCollection();
}

function resetSelect() {
  sortSelect.selectedIndex = 0;
}
