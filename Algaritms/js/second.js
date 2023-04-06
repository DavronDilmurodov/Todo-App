function startOz(str) {
  if (str.slice(0, 2) === "oz") {
    return "oz";
  } else if (str.slice(1, 2) === "z") {
    return "z";
  } else if (str.slice(0, 1) === "o") {
    return "o";
  }
  return "";
}
