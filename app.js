class TODOItem {
  constructor(text, status) {
    this.text = text;
    this.status = status;
  }
}

// Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

const UNCOMPLETED = 'UNCOMPLETED';
const COMPLETED = 'COMPLETED';

// Event Listeners
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);

// Functions
function deleteCheck(e) {
  const item = e.target;
  // DELETE TODO
  if (item.classList[0] === 'trash-btn') {
    const todo = item.parentElement;
    // Animation
    todo.classList.add('fall');
    removeLocalTodos(todo.children[0].innerText);
    todo.addEventListener('transitionend', function () {
      todo.remove();
    });
  }

  // CHECK MARK
  if (item.classList[0] === 'complete-btn') {
    const todo = item.parentElement;
    todo.classList.toggle('completed');
    // also save the status to local storage
    saveLocalTodos(new TODOItem(todo.children[0].innerText, COMPLETED));
  }
}

function addTodo(event) {
  // prevent form from submitting
  event.preventDefault();
  // create Todo DIV
  const todoDiv = document.createElement('div');
  todoDiv.classList.add('todo');
  // create list item
  const newTodo = document.createElement('li');
  newTodo.innerText = todoInput.value;
  newTodo.classList.add('todo-item');
  todoDiv.appendChild(newTodo);
  // add todo to local storage
  saveLocalTodos(new TODOItem(todoInput.value, UNCOMPLETED));

  // create mark complete button
  const completedButton = document.createElement('button');
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add('complete-btn');
  todoDiv.appendChild(completedButton);
  // create trash button
  const trashButton = document.createElement('button');
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add('trash-btn');
  todoDiv.appendChild(trashButton);

  // append the todo-div to the list
  todoList.appendChild(todoDiv);

  //clear todo input value
  todoInput.value = '';
}

function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    switch (e.target.value) {
      case 'all':
        todo.style.display = 'flex';
        break;
      case 'completed':
        if (todo.classList.contains('completed')) {
          todo.style.display = 'flex';
        } else {
          todo.style.display = 'none';
        }
        break;
      case 'uncompleted':
        if (!todo.classList.contains('completed')) {
          todo.style.display = 'flex';
        } else {
          todo.style.display = 'none';
        }
        break;
    }
  });
}

function saveLocalTodos(todo) {
  // check if already data exists
  let todos;
  if (localStorage.getItem('todos') === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
  }

  const itemIndex = todos.findIndex((element, index) => {
    if (element.text === todo.text) {
      return true;
    }
  });
  if (itemIndex == -1) {
    todos.push(todo);
  } else {
    if (todos[itemIndex].status === COMPLETED) {
      todo.status = UNCOMPLETED;
    } else if (todos[itemIndex].status === UNCOMPLETED) {
      todo.status = COMPLETED;
    }
    todos[itemIndex] = todo;
  }
  localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
  // check if already data exists
  let todos;
  if (localStorage.getItem('todos') === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
  }
  todos.forEach((todo) => createTodoItem(todo));
}

function createTodoItem(todo) {
  // create Todo DIV
  const todoDiv = document.createElement('div');
  todoDiv.classList.add('todo');
  // create list item
  const newTodo = document.createElement('li');
  newTodo.innerText = todo.text;
  newTodo.classList.add('todo-item');
  if (todo.status === COMPLETED) {
    todoDiv.classList.toggle('completed');
  }
  todoDiv.appendChild(newTodo);

  // create mark complete button
  const completedButton = document.createElement('button');
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add('complete-btn');
  todoDiv.appendChild(completedButton);
  // create trash button
  const trashButton = document.createElement('button');
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add('trash-btn');
  todoDiv.appendChild(trashButton);

  // append the todo-div to the list
  todoList.appendChild(todoDiv);
}

function removeLocalTodos(todoText) {
  let todos;
  if (localStorage.getItem('todos') === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
  }
  const itemIndex = todos.findIndex((element, index) => {
    if (element.text === todoText) {
      return true;
    }
  });

  if (itemIndex != -1) {
    todos.splice(itemIndex, 1);
  }
  localStorage.setItem('todos', JSON.stringify(todos));
}
