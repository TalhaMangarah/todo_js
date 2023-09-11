const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const fileInput = document.getElementById('fileInput');
const importTasks = document.getElementById('importTasks');
const exportTasks = document.getElementById('exportTasks');
const removeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="task-remove-icon" viewBox="0 0 16 16"><path d="M14,3 C14.5522847,3 15,3.44771525 15,4 C15,4.55228475 14.5522847,5 14,5 L13.846,5 L13.1420511,14.1534404 C13.0618518,15.1954311 12.1930072,16 11.1479,16 L4.85206,16 C3.80698826,16 2.93809469,15.1953857 2.8579545,14.1533833 L2.154,5 L2,5 C1.44771525,5 1,4.55228475 1,4 C1,3.44771525 1.44771525,3 2,3 L5,3 L5,2 C5,0.945642739 5.81588212,0.0818352903 6.85073825,0.00548576453 L7,0 L9,0 C10.0543573,0 10.9181647,0.815882118 10.9945142,1.85073825 L11,2 L11,3 L14,3 Z M11.84,5 L4.159,5 L4.85206449,14.0000111 L11.1479,14.0000111 L11.84,5 Z M9,2 L7,2 L7,3 L9,3 L9,2 Z"/></svg>';
const checkmarkIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="task-checkmark-icon" viewBox="0 0 16 16"><path d="M13.7071,4.29289 C14.0976,4.68342 14.0976,5.31658 13.7071,5.70711 L7.70711,11.7071 C7.31658,12.0976 6.68342,12.0976 6.29289,11.7071 L3.29289,8.70711 C2.90237,8.31658 2.90237,7.68342 3.29289,7.29289 C3.68342,6.90237 4.31658,6.90237 4.70711,7.29289 L7,9.58579 L12.2929,4.29289 C12.6834,3.90237 13.3166,3.90237 13.7071,4.29289 Z"/></svg>';
let taskMap = loadTasksFromLocalStorage();

taskMap.forEach((task, taskId) => {
    addTask(taskId, task);
});

taskInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && taskInput.value.trim() !== '') {
        const taskId = generateUniqueId();
        const taskText = taskInput.value;

        const task = {
            text: taskText,
            completed: false         
        };

        addTask(taskId, task);
        taskInput.value = '';

        taskMap.set(taskId, task);
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

function addTask(taskId, task){
    let taskContainer = document.createElement('div');
    taskContainer.classList.add('task-container');
    taskContainer.setAttribute('data-task-id', taskId);

    let taskItem = document.createElement('span');
    taskItem.classList.add('task-text');
    taskItem.textContent = task.text;

    let taskStatusChecked = document.createElement('input');
    taskStatusChecked.type = 'checkbox';
    taskStatusChecked.classList.add('task-status');
    taskStatusChecked.id = 'taskStatus';
    taskStatusChecked.checked = task.completed;

    let taskStatusCheckmark = document.createElement('span');
    taskStatusCheckmark.classList.add('checkmark');

    let taskStatusLabel = document.createElement('label');
    // taskStatusLabel.htmlFor = 'taskStatus';
    taskStatusLabel.classList.add('checkbox-label');

    taskStatusLabel.appendChild(taskStatusChecked);
    taskStatusLabel.appendChild(taskStatusCheckmark);

    if (task.completed){
        taskContainer.classList.toggle('completed');
        taskStatusCheckmark.innerHTML = checkmarkIcon;
    }

    let taskRemoveButton = document.createElement('button');
    taskRemoveButton.type = 'button';
    taskRemoveButton.id = 'taskRemoveButton';
    taskRemoveButton.innerHTML = removeIcon;

    // taskContainer.appendChild(taskStatusChecked);
    taskContainer.appendChild(taskStatusLabel);
    taskContainer.appendChild(taskItem);
    taskContainer.appendChild(taskRemoveButton);
    taskList.appendChild(taskContainer);


    taskRemoveButton.addEventListener('click', removeTask);
    taskItem.addEventListener('click', updateTask);
    taskStatusChecked.addEventListener('change', toggleCompleted);
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

    const task = taskMap.get(taskId);

    const taskUpdateInput = document.createElement('input');
    taskUpdateInput.value = taskText;

    taskUpdateInput.addEventListener('keydown', (event) => {
        if (event.key == 'Enter' && taskUpdateInput.value.trim() !== ''){
            taskItem.textContent = taskUpdateInput.value;
            task.text = taskItem.textContent;
            taskMap.set(taskId, task);
            saveTasksToLocalStorage(taskMap);
            taskUpdateInput.replaceWith(taskItem);
        }
    });


    taskItem.replaceWith(taskUpdateInput);
    taskUpdateInput.focus();
}

function generateUniqueId(){
    // https://stackoverflow.com/a/53116778
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, 0);
}

function toggleCompleted(event){
    const taskContainer = event.target.closest('.task-container');
    const taskId = taskContainer.dataset.taskId;
    const taskStatusCheckbox = taskContainer.querySelector('.task-status');
    const taskStatusLabel = taskContainer.querySelector('.checkmark');
    taskContainer.classList.toggle('completed', taskStatusCheckbox.checked);

    const task = taskMap.get(taskId);

    task.completed = !task.completed;
    if(task.completed){
        taskStatusLabel.innerHTML = checkmarkIcon;
    }
    else {
        taskStatusLabel.innerHTML = '';
    }

    taskMap.set(taskId, task);
    saveTasksToLocalStorage(taskMap);
}

// TODO - implement import tasks from file functionality
importTasks.addEventListener('click', () => {
    fileInput.click();
});


// "Keys" here are due to the arr that will be converted to a Map.
function areImportObjectsValid(arr) {
    const seenKeys = new Set();
    for (const subArray of arr) {
        if (subArray.length !== 2) {
            return false;
        }

        const key = subArray[0];
        const obj = subArray[1];

        if (seenKeys.has(key)) {
            return false; // Duplicate key found
        }
        seenKeys.add(key);

        // Check if the object has "text" and "completed" fields
        if (!obj || typeof obj !== 'object' || !('text' in obj) || !('completed' in obj)) {
            return false;
        }

        if (typeof obj.text !== 'string' || obj.text.trim() === '') {
            return false;
        }

        console.log(obj.completed);
        if (typeof obj.completed !== 'boolean'){
            return false;
        }
    }
    return true; // All objects are valid
}


fileInput.addEventListener('change', (event) => {
    const selectedFile = event.target.files[0]; // Get the selected file
    
    if (selectedFile.length == 0) return; 

    let reader = new FileReader();

    reader.onload = (e) => {
        try{
            const file = JSON.parse(e.target.result);
            
            if(!areImportObjectsValid(file)){
                throw new Error('Error with Task object.');
            }

            const importedTasks = new Map(file);
            saveTasksToLocalStorage(importedTasks);
            location.reload();
        }
        catch(error){
            alert('Error with file that was imported.\nPlease confirm formatting.\nE.g. [["unique task ID string",{"text":"Task text 1","completed":true/false}],["unique task ID string",{"text":"Task text 2","completed":true/false}]]');
            return;
        }
    }

    reader.onerror = (e) => alert(e.target.error.name);

    reader.readAsText(selectedFile);

    // if (selectedFile) {
        // Call a function to handle the file import
        // console.log(selectedFile);

        // let reader = new FileReader();

        // reader.onload = (e) => {
        //     const file = e.target.result;
        //     if(file[0] !== '[' || file[file.length-1] !== ']'){
        //         console.log('file not in correct format');
        //         return;
        //     }
        // }

        // reader.onerror = (e) => alert(e.target.error.name);

        // reader.readAsText(selectedFile);

        // (async () => {
        //     const fileContent = await selectedFile.text();
        //     // console.log(fileContent[fileContent.length-1]);
        // })();
        // handleFileImport(selectedFile);
    // }
});

// function handleFileImport(file){

// }

exportTasks.addEventListener('click', (event) => {
    const tasksJSON = localStorage.getItem('tasks');
    if (tasksJSON !== "[]"){
        const timestamp = new Date().toISOString().replace(/[:.]/g, '');
        const fileName = `tasks_${timestamp}.txt`; 
        
        const a = document.createElement('a');
        const blob = new Blob([tasksJSON], {type:'text/plain'});
        const url = URL.createObjectURL(blob);

        a.href = url;
        a.download = fileName;

        document.body.appendChild(a);

        a.click();

        URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
    } else {
        console.log('empty tasks');
    }
});