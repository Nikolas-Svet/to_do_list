import { removeTask, saveTaskChanges } from './tasks.js';
import { saveTasksToLocalStorage, getTasksFromLocalStorage } from './storage.js';

export function closeWindows() {
    document.querySelectorAll(".window")[0].style.display = 'none';
    document.querySelectorAll(".window")[1].style.display = 'none';
    document.querySelectorAll(".window")[2].style.display = 'none';
}

export function renderTasks(tasks) {
    const taskList = document.querySelector('.to_do_list__body');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <p>${task.title}</p>
                <p>${task.about}</p>
            </div>
            <span class="cancel">️</span>
        `;
        taskList.appendChild(li);

        const panel = document.createElement('div');
        panel.classList.add('panel_task');
        panel.style.display = 'none';
        panel.innerHTML = `
            <div class="panel_task__content">
                <button class="edit_task_btn"><img src="./static/icons/edit.svg" alt=""></button>
                <button class="share_task_btn"><img src="./static/icons/share.svg" alt=""></button>
                <button><img src="./static/icons/info.svg" alt=""></button>
            </div>
        `;
        taskList.appendChild(panel);

        const cancelButton = li.querySelector('.cancel');
        cancelButton.addEventListener('click', function () {
            removeTask(li, task.title);
        });

        li.addEventListener('click', function () {
            toggleTaskPanel(panel);
        });

        const editButton = panel.querySelector('.edit_task_btn');
        editButton.addEventListener('click', function (event) {
            event.stopPropagation();
            showEditWindow(task);
        });

        const shareButton = panel.querySelector('.share_task_btn');
        if (shareButton) {
            shareButton.addEventListener('click', function (event) {
                event.stopPropagation();
                shareWindow();
            });
        }
    });

    document.querySelector('.no_tasks').style.display = tasks.length === 0 ? 'flex' : 'none';
}

export function toggleTaskPanel(panel) {
    if (panel.style.display === 'flex') {
        panel.style.display = 'none';
    } else {
        panel.style.display = 'flex';
    }
}

export function showEditWindow(task) {
    const editWindow = document.querySelectorAll('.window')[1];
    editWindow.style.display = 'flex';

    document.querySelector('input[name="edit_title"]').value = task.title;
    document.querySelector('textarea[name="edit_about"]').value = task.about;

    const confirmButton = document.querySelector('.edit_confirm_btn');
    const cancelButton = document.querySelector('.edit_cancel_btn');

    confirmButton.onclick = function () {
        saveTaskChanges(task);
        editWindow.style.display = 'none';
    };
    cancelButton.onclick = function () {
        editWindow.style.display = 'none';
    };
}

export function shareWindow() {
    const shareWindow = document.querySelectorAll('.window')[2];
    shareWindow.style.display = 'flex';
}

const add_task_button = document.getElementsByClassName('add_task')[0];
add_task_button.addEventListener('click', function () {
    const inputs = document.getElementsByName('text');
    const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');

    if (allFilled) {
        const title = inputs[0].value.trim();
        const about = inputs[1].value.trim();

        const newTask = { title, about };

        const tasks = getTasksFromLocalStorage();
        tasks.push(newTask);
        saveTasksToLocalStorage(tasks);

        inputs.forEach(input => input.value = '');

        renderTasks(tasks);

        alert('Оба поля заполнены! Задача добавлена.');
    } else {
        alert('Одно или оба поля пусты!');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const tasks = getTasksFromLocalStorage();
    renderTasks(tasks);
});
