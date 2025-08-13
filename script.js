const inputBox = document.getElementById("todo-input");
const listContainer = document.getElementById("todo-list");
const allButton = document.getElementById('all-tasks')
const activeButton = document.getElementById('active-tasks')
const completedButton = document.getElementById('completed-tasks')
const completeAllBtn = document.getElementById("complete-all-btn");
const deleteAllBtn = document.getElementById("delete-all-btn");
const noTasksMessage = document.getElementById("no-tasks-message");

let currentFilter = 'all'

function addTask() {
    if (inputBox.value === '') {
        return alert('Add a Task')
    } else {
        let li = document.createElement("li")
        li.innerHTML = inputBox.value
        listContainer.appendChild(li)

        let span = document.createElement("span")
        span.innerHTML = "\u00d7" // unicode for 'X' character
        li.appendChild(span)
    }
    inputBox.value = "" // Clear the input field
    saveData() // save the updated list to local storage
    filterTasks() // apply the current filter to the new tasks

}

listContainer.addEventListener('click', function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked")
        saveData()
        filterTasks()
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove()
        saveData()
        filterTasks()
    }
}, false)

function filterTasks() {
    const listItems = listContainer.getElementsByTagName("li")
    let visibleTasksCount = 0
    for (let task of listItems) {
        switch (currentFilter) {
            case 'all':
                task.style.display = 'flex'
                visibleTasksCount++
                break;
            case 'active':
                if (task.classList.contains('checked')) {
                    task.style.display = 'none'
                } else {
                    task.style.display = 'flex'
                    visibleTasksCount++
                }
                break;
            case 'completed':
                if (task.classList.contains('checked')) {
                    task.style.display = 'flex'
                    visibleTasksCount++
                } else{
                    task.style.display = 'none'
                }
                break
        }
    }

    if (visibleTasksCount === 0 && currentFilter !== 'all') {
        if (currentFilter === 'active') {
            noTasksMessage.textContent = 'You have no pending tasks. Great job!';
        } else if (currentFilter === 'completed') {
            noTasksMessage.textContent = 'You have not completed any tasks yet.';
        }
        noTasksMessage.style.display = 'block';
    } else {
        noTasksMessage.style.display = 'none';
    }
}

allButton.addEventListener('click', () => {
    currentFilter = 'all';
    updateFilterButtons()
    filterTasks()
})
activeButton.addEventListener('click', () => {
    currentFilter = 'active';
    updateFilterButtons()
    filterTasks()
})
completedButton.addEventListener('click', () => {
    currentFilter = 'completed';
    updateFilterButtons()
    filterTasks()
})

completeAllBtn.addEventListener("click", () => {
    const listItems = listContainer.getElementsByTagName("li");
    const allCompleted = [...listItems].every(item => item.classList.contains('checked'));
    
    for (let item of listItems) {
        if (allCompleted) {
            item.classList.remove("checked");
        } else {
            item.classList.add("checked");
        }
    }
    saveData();
    filterTasks();
});

deleteAllBtn.addEventListener("click", () => {
    listContainer.innerHTML = "";
    saveData();
    filterTasks();
});

function updateFilterButtons() {
    allButton.classList.remove('active')
    activeButton.classList.remove('active')
    completedButton.classList.remove('active')
    
    switch (currentFilter) {
        case 'all':
            allButton.classList.add('active')
            break;
        case 'active':
            activeButton.classList.add('active')
            break;
        case 'completed':
            completedButton.classList.add('active')
            break;
    }

}

// Function to save the list to the browser's local storage
function saveData() {
    localStorage.setItem("data", listContainer.innerHTML)
}

// Function to display the saved list from local storage
function showTask() {
    listContainer.innerHTML = localStorage.getItem("data")
    filterTasks()
}

// load the tasks when page loads
window.onload = showTask