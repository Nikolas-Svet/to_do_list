function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromLocalStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function renderTasks(tasks) {
    const taskList = document.querySelector('.to_do_list__body');
    taskList.innerHTML = ''; // Очищаем текущий список задач

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

        // Создаем панель задач
        const panel = document.createElement('div');
        panel.classList.add('panel_task');
        panel.style.display = 'none';
        panel.innerHTML = `
            <div class="panel_task__content">
                <button class="edit_task_btn"><img src="./static/icons/edit.svg" alt=""></button>
                <button><img src="./static/icons/share.svg" alt=""></button>
                <button><img src="./static/icons/info.svg" alt=""></button>
            </div>
        `;
        taskList.appendChild(panel); // Добавляем панель под задачей

        // Обработчик на кнопку удаления
        const cancelButton = li.querySelector('.cancel');
        cancelButton.addEventListener('click', function () {
            removeTask(li, task.title);
        });

        // Обработчик клика по li для открытия/закрытия панели
        li.addEventListener('click', function () {
            toggleTaskPanel(panel);
        });

        // Обработчик на кнопку редактирования
        const editButton = panel.querySelector('.edit_task_btn');
        editButton.addEventListener('click', function (event) {
            event.stopPropagation(); // Останавливаем всплытие события
            showEditWindow(task);
        });
    });

    // Показать или скрыть сообщение о том, что задач нет
    document.querySelector('.no_tasks').style.display = tasks.length === 0 ? 'flex' : 'none';
}

// Функция для отображения панели задачи
function toggleTaskPanel(panel) {
    if (panel.style.display === 'flex') {
        panel.style.display = 'none';
    } else {
        panel.style.display = 'flex';
    }
}

// Функция для отображения окна редактирования
function showEditWindow(task) {
    const editWindow = document.querySelectorAll('.window')[1]; // Предполагая, что второе окно — это окно редактирования
    editWindow.style.display = 'flex';

    // Заполнение полей текущими данными задачи
    document.querySelector('input[name="edit_title"]').value = task.title;
    document.querySelector('textarea[name="edit_about"]').value = task.about;

    // Обработка кнопок "Yes" и "No"
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
function saveTaskChanges(task) {
    const newTitle = document.querySelector('input[name="edit_title"]').value;
    const newAbout = document.querySelector('textarea[name="edit_about"]').value;

    console.log("Старое название:", task.title);
    console.log("Новое название:", newTitle);
    console.log("Старое описание:", task.about);
    console.log("Новое описание:", newAbout);

    const oldTitle = task.title;
    task.title = newTitle;
    task.about = newAbout;

    let tasks = getTasksFromLocalStorage();

    const index = tasks.findIndex(t => t.title === oldTitle);

    if (index !== -1) {
        tasks[index] = { title: task.title, about: task.about };
    }

    saveTasksToLocalStorage(tasks);

    renderTasks(tasks);
}



// Функция для удаления задачи
async function removeTask(taskElement, taskTitle) {
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

// Функция для подтверждения удаления
function confirmDeletion() {
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

// Обработчик для добавления задачи
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

// При загрузке страницы загружаем существующие задачи
document.addEventListener('DOMContentLoaded', function () {
    const tasks = getTasksFromLocalStorage();
    renderTasks(tasks);
});