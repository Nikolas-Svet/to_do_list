import {saveTasksToLocalStorage, getTasksFromLocalStorage} from './storage.js';
import {renderTasks} from './ui.js';

export async function removeTask(taskElement, taskTitle) {
    const confirmed = await confirmDeletion();

    if (confirmed) {
        taskElement.remove();

        let tasks = getTasksFromLocalStorage();
        tasks = tasks.filter(task => task.title !== taskTitle);
        saveTasksToLocalStorage(tasks);
        renderTasks(tasks);
    } else {
        console.log("Удаление отменено");
    }
}

export function confirmDeletion() {
    return new Promise((resolve) => {
        const deleteWindow = document.querySelector('.window');
        deleteWindow.style.display = 'flex';

        const yesButton = deleteWindow.querySelector('button:nth-child(1)');
        const noButton = deleteWindow.querySelector('button:nth-child(2)');

        yesButton.onclick = function () {
            deleteWindow.style.display = 'none';
            resolve(true);
        };
        noButton.onclick = function () {
            deleteWindow.style.display = 'none';
            resolve(false);
        };
    });
}

export function saveTaskChanges(task) {
    const newTitle = document.querySelector('input[name="edit_title"]').value;
    const newAbout = document.querySelector('textarea[name="edit_about"]').value;

    const oldTitle = task.title;
    task.title = newTitle;
    task.about = newAbout;

    let tasks = getTasksFromLocalStorage();
    const index = tasks.findIndex(t => t.title === oldTitle);

    if (index !== -1) {
        tasks[index] = {title: task.title, about: task.about};
    }

    saveTasksToLocalStorage(tasks);
    renderTasks(tasks);
}
