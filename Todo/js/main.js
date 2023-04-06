let elForm = elSelector(".form");
let elInput = elSelector(".input__main");
let elList = elSelector(".list");
let elTemplate = elSelector(".template").content;
let elCount = elSelector(".count");

let data = JSON.parse(localStorage.getItem("allTodo"));
let allTodo = data ? data : [];

let onEdit = (event) => {
  allTodo.forEach((todo) => {
    if (todo.id === event.target.dataset.id - 0) {
      let editedTask = prompt("Edit Todo", todo.task);
      todo.task = editedTask;
    }
    onRender(allTodo);
    localStorage.setItem("allTodo", JSON.stringify(allTodo));
  });
};

let onDelete = (event) => {
  let arr = [];
  allTodo.forEach((todo) => {
    if (todo.id !== event.target.dataset.id - 0) {
      arr.push(todo);
    }
  });
  allTodo = arr;
  onRender(arr);
  localStorage.setItem("allTodo", JSON.stringify(arr));
};

let onRender = (arr) => {
  elList.innerHTML = null;
  elCount.textContent = arr.length;
  arr.forEach((item) => {
    let todo = elTemplate.cloneNode(true);
    todo.querySelector(".span").textContent = item.task;

    let btnEdit = todo.querySelector(".btn__edit");
    btnEdit.dataset.id = item.id;
    btnEdit.addEventListener("click", onEdit);

    let btnDelete = todo.querySelector(".btn__delete");
    btnDelete.dataset.id = item.id;
    btnDelete.addEventListener("click", onDelete);
    elList.appendChild(todo);
  });
};

let onSumbit = (event) => {
  event.preventDefault();

  let inputValue = elInput.value.trim();

  if (!inputValue) {
    alert("Add Todo");
  }

  let newTodo = {
    id: allTodo.at(0) ? allTodo.at(0)?.id + 1 : 1,
    task: inputValue,
    isCompleted: false,
  };

  allTodo.unshift(newTodo);

  elInput.value = null;
  onRender(allTodo);
  localStorage.setItem("allTodo", JSON.stringify(allTodo));
};
onRender(allTodo);
elForm.addEventListener("submit", onSumbit);
