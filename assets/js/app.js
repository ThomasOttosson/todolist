// Selectors for the todos
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

// Event Listeners
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('change', filterTodo);

/* Creates a todo element with unique ID */
function createTodoElement(todo) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    // it will create a custom attribute called data-id, and will store ID in DOM element
    todoDiv.dataset.id = todo.id;

    // Create todo text element
    const newTodo = document.createElement('li');
    newTodo.innerText = todo.text;
    newTodo.classList.add('todo-item');
    // appendchild is adding the li html element to the div that is created above
    todoDiv.appendChild(newTodo);

    // Create complete button
    const completedButton = document.createElement('button');
    // innerHTML allows the code to add html content or simple text content just like innerText
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    // appendchild is adding the complete button to the todo element
    todoDiv.appendChild(completedButton);

    // Create delete button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    // Set initial completed state
    // Check from local storage that if the status is already completed, 
    // add a class of completed to it.  
    if (todo.status === "completed") {
        todoDiv.classList.add("completed");
    }

    return todoDiv;
}

/* Adds new todo with unique ID */
function addTodo(event) {
    // preventDefault prevents the defaults behaviour of submitting the form.
    event.preventDefault();
    // The .trim() is a function that removes whitespaces and extra characters.
    const text = todoInput.value.trim();
    
    if (!text) return;

    // Create todo object with unique ID
    const todo = {
        // create an id with current date converted to string
        id: Date.now().toString(),
        text: text,
        status: 'incomplete'
    };

    // Create and append todo element
    const todoDiv = createTodoElement(todo);
    todoList.appendChild(todoDiv);

    // Save to localStorage and clear input
    saveLocalTodos(todo);
    todoInput.value = "";
}

/* Handles delete/complete actions using unique IDs */
function deleteCheck(e) {
    // assign either the complete button or trash button object to the button when it is clicked
    const button = e.target.closest('.complete-btn, .trash-btn');
    if (!button) return;

    // this is selecting the parent element of either the complete or trash button
    const todo = button.parentElement;
    const todoId = todo.dataset.id;

    if (button.classList.contains('trash-btn')) {
        // Animate deletion
        todo.classList.add("fall");
        todo.addEventListener('transitionend', () => todo.remove());
        removeLocalTodos(todoId);
    } 
    else if (button.classList.contains('complete-btn')) {
        // Toggle completion state
        const todos = JSON.parse(localStorage.getItem("todos")) || [];
        const updatedTodos = todos.map(t => {
            if (t.id === todoId) {
                t.status = t.status === "incomplete" ? "completed" : "incomplete";
                todo.classList.toggle("completed", t.status === "completed");
            }
            return t;
        });
        localStorage.setItem("todos", JSON.stringify(updatedTodos));
    }
}

/* Filters todos based on completion status */
 function filterTodo(e) {
    const todos = Array.from(todoList.children);
    const filter = e.target.value;

    todos.forEach(todo => {
        const isCompleted = todo.classList.contains('completed');
        todo.style.display = 
            filter === 'all' ? 'flex' :
            filter === 'completed' && isCompleted ? 'flex' :
            filter === 'uncompleted' && !isCompleted ? 'flex' : 'none';
    });
}

/* Saves todo to localStorage */
function saveLocalTodos(todo) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

/* Loads todos from localStorage */
function getTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        const todoDiv = createTodoElement(todo);
        todoList.appendChild(todoDiv);
    });
}

/* Removes todo from localStorage by ID */
 function removeLocalTodos(todoId) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.filter(t => t.id !== todoId);
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Selector for timer
const display = document.getElementById("display");

// Variables for the timer
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

/* Start function for the timer*/
function start() {

    if(!isRunning) {
        startTime = Date.now() - elapsedTime;
        timer = setInterval(update, 10);
        isRunning = true;
    }
}

/* Stop function for the timer */
function stop() {

    if(isRunning) {
        clearInterval(timer);
        elapsedTime = Date.now() - startTime;
        isRunning = false;
    }
}

/* Reset function for the timer */
function reset() {

    clearInterval(timer);
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;
    display.textContent = "00:00:00:00";
}

/* Updates the timer on a reguarly basis */
function update() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;

    //Variables for the timer
    let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
    let seconds = Math.floor(elapsedTime / 1000 % 60);
    let milliseconds = Math.floor(elapsedTime % 1000 / 10);

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    milliseconds = String(milliseconds).padStart(2, "0");

    display.textContent = `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

/* This function runs the clock */
function clock(){
    
    //Variables for the date in the clock
    const monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ]; 
    const dayNames= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const today = new Date();
    
    //Selector for the date
    document.getElementById('Date').innerHTML = (dayNames[today.getDay()] + " " + 
    today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' +today.getFullYear());

    //Variables for the clock
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    

    h = h<10? '0'+h: h;
    m = m<10? '0'+m: m;
    s = s<10? '0'+s: s;               
    
    //Selectors for the clock(hours, min and sec)
    document.getElementById('hours').innerHTML = h;
    document.getElementById('min').innerHTML = m;
    document.getElementById('sec').innerHTML = s;

} 

// Updates the clock every 400 milliseconds
setInterval(clock,400);