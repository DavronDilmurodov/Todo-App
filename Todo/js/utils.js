// select dom elements
let elSelector = (selector, parent = document) => {
  return parent.querySelector(selector);
};

// Create DOM elements
let elCreator = (creator, parent = document) => {
  return parent.createElement(creator);
};
