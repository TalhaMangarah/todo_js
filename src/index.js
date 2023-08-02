let taskInput = document.getElementById('taskInput');
let taskList = document.getElementById('taskList');

taskInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter') {
        console.log('Enter pressed');
    }
});