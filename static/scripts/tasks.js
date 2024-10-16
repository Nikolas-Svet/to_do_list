import { saveTasksToLocalStorage, getTasksFromLocalStorage } from './storage.js';
import { updateTaskInDOM, removeTaskFromDOM } from './ui.js';

export async function removeTask(taskElement, taskId) {
    const confirmed = await confirmDeletion();

    if (confirmed) {
        removeTaskFromDOM(taskElement);

        let tasks = getTasksFromLocalStorage();
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasksToLocalStorage(tasks);
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

export function saveTaskChanges(task, taskElement) {
    const newTitle = document.querySelector('input[name="edit_title"]').value;
    const newAbout = document.querySelector('textarea[name="edit_about"]').value;

    task.title = newTitle;
    task.about = newAbout;

    let tasks = getTasksFromLocalStorage();
    const index = tasks.findIndex(t => t.id === task.id);

    if (index !== -1) {
        tasks[index] = task;
    }

    saveTasksToLocalStorage(tasks);

    updateTaskInDOM(taskElement, task);
}
