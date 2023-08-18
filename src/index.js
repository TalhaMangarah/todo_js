const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const importTasks = document.getElementById('importTasks');
const exportTasks = document.getElementById('exportTasks');
let taskMap = loadTasksFromLocalStorage();

taskMap.forEach((taskText, taskId) => {
    addTask(taskId, taskText)
});

taskInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && taskInput.value.trim() !== '') {
        const taskId = generateUniqueId();
        const taskText = taskInput.value;
        addTask(taskId, taskText);
        taskInput.value = '';

        taskMap.set(taskId, taskText);
        saveTasksToLocalStorage(taskMap);
    }
});

function loadTasksFromLocalStorage(){
    const tasksJSON = localStorage.getItem('tasks');
    return tasksJSON ? new Map(JSON.parse(tasksJSON)) : new Map();
}

function saveTasksToLocalStorage(tasks){
    localStorage.setItem('tasks', JSON.stringify([...tasks]));
}

function addTask(taskId, taskText){
    let taskContainer = document.createElement('div');
    taskContainer.classList.add('task-container');
    taskContainer.setAttribute('data-task-id', taskId);

    let taskItem = document.createElement('span');
    taskItem.classList.add('task-text');
    taskItem.textContent = taskText;

    let taskStatus = document.createElement('input');
    taskStatus.type = 'checkbox';

    let taskRemoveButton = document.createElement('button');
    taskRemoveButton.type = 'button';
    taskRemoveButton.id = 'taskRemoveButton';
    taskRemoveButton.textContent = 'X';

    taskContainer.appendChild(taskStatus);
    taskContainer.appendChild(taskItem);
    taskContainer.appendChild(taskRemoveButton);
    taskList.appendChild(taskContainer);


    taskRemoveButton.addEventListener('click', removeTask);
    taskItem.addEventListener('dblclick', updateTask);
    taskStatus.addEventListener('change', toggleCompleted);
}

function removeTask(event){
    const taskContainer = event.target.closest('.task-container');
    const taskId = taskContainer.dataset.taskId;

    taskContainer.remove();
    taskMap.delete(taskId);

    saveTasksToLocalStorage(taskMap);
}

function updateTask(event){
    const taskItem = event.target;
    const taskText = taskItem.textContent;
    const taskId = taskItem.closest('.task-container').dataset.taskId;

    const taskUpdateInput = document.createElement('input');
    taskUpdateInput.value = taskText;

    taskUpdateInput.addEventListener('keydown', (event) => {
        if (event.key == 'Enter' && taskUpdateInput.value.trim !== ''){
            taskItem.textContent = taskUpdateInput.value;
            taskMap.set(taskId, taskItem.textContent);
            saveTasksToLocalStorage(taskMap);
            taskUpdateInput.replaceWith(taskItem);
        }
    });


    taskItem.replaceWith(taskUpdateInput);
    taskUpdateInput.focus();
}

function generateUniqueId(){
    // https://stackoverflow.com/a/53116778
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, 0)
}

function toggleCompleted(event){
    const taskContainer = event.target.closest('.task-container');
    taskContainer.classList.toggle('completed', event.target.checked);
}

// TODO - implement import tasks from file functionality
importTasks.addEventListener('click', (event) => {
});

// TODO - implement export tasks from file functionality
exportTasks.addEventListener('click', (event) => {
});