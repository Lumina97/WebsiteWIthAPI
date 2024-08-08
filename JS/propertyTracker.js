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
