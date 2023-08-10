const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const button = document.querySelector("button");

taskInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && taskInput.value.trim() !== '') {
        addTask(taskInput.value);
        taskInput.value = '';
    }
});

function addTask(taskText){
    let taskContainer = document.createElement('div');
    taskContainer.classList.add('task-container');

    let taskItem = document.createElement('span');
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
    event.target.closest('.task-container').remove();
}

function updateTask(event){
    const taskItem = event.target;
    const taskText = taskItem.textContent;

    const taskUpdateInput = document.createElement('input');
    taskUpdateInput.value = taskText;

    taskUpdateInput.addEventListener('keydown', (event) => {
        if (event.key == 'Enter' && taskUpdateInput.value.trim !== ''){
            taskItem.textContent = taskUpdateInput.value;
            taskUpdateInput.replaceWith(taskItem);
        }
    });

    taskItem.replaceWith(taskUpdateInput);
    taskUpdateInput.focus();
}

function toggleCompleted(event){
    const taskContainer = event.target.closest('.task-container');
    taskContainer.classList.toggle('completed', event.target.checked);
}