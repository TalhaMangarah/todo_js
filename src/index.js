const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

taskInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && taskInput.value.trim() !== '') {
        // taskList.append(taskInput.value);
        addTask(taskInput.value);
        taskInput.value = '';
    }
});

function addTask(taskText){
    let taskItem = document.createElement('li');
    taskItem.textContent = taskText;
    taskList.appendChild(taskItem);
};