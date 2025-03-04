document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const tasksContainer = document.getElementById('tasksContainer');
    const errorMsg = document.getElementById('errorMsg');
    const taskStats = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompleted');

    // Initialize tasks array from localStorage
    let tasks = [];
    try {
        const storedTasks = localStorage.getItem('tasks');
        tasks = storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
        console.error('Error loading tasks:', error);
        tasks = [];
    }

    // Save tasks to localStorage
    const saveTasks = () => {
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks));
            updateTaskStats();
        } catch (error) {
            console.error('Error saving tasks:', error);
            showError('Error saving tasks. Please try again.');
        }
    };

    // Show error message
    const showError = (message) => {
        errorMsg.textContent = message;
        errorMsg.classList.remove('hidden');
        setTimeout(() => {
            errorMsg.classList.add('hidden');
        }, 3000);
    };

    // Update task statistics
    const updateTaskStats = () => {
        const remainingTasks = tasks.filter(task => !task.completed).length;
        taskStats.textContent = remainingTasks;
        
        // Show/hide clear completed button
        const hasCompletedTasks = tasks.some(task => task.completed);
        clearCompletedBtn.classList.toggle('hidden', !hasCompletedTasks);
    };

    // Render tasks
    const renderTasks = () => {
        tasksContainer.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'group flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all';
            
            taskElement.innerHTML = `
                <input 
                    type="checkbox" 
                    ${task.completed ? 'checked' : ''} 
                    class="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                >
                <span class="flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}">
                    ${task.text}
                </span>
                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="edit-btn text-blue-600 hover:text-blue-800 transition-colors">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn text-red-600 hover:text-red-800 transition-colors">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;

            // Add event listeners
            const checkbox = taskElement.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => toggleTask(task.id));

            const editBtn = taskElement.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => editTask(task.id));

            const deleteBtn = taskElement.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            tasksContainer.appendChild(taskElement);
        });
        updateTaskStats();
    };

    // Add new task
    const addTask = (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        
        if (!text) {
            showError('Please enter a task');
            return;
        }

        const newTask = {
            id: Date.now(),
            text,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        
        taskInput.value = '';
        taskInput.focus();

        // Show success animation
        const newTaskElement = tasksContainer.lastElementChild;
        newTaskElement.classList.add('animate-fade-in');
    };

    // Toggle task completion
    const toggleTask = (taskId) => {
        tasks = tasks.map(task => 
            task.id === taskId 
                ? { ...task, completed: !task.completed }
                : task
        );
        saveTasks();
        renderTasks();
    };

    // Edit task
    const editTask = (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const newText = prompt('Edit task:', task.text);
        if (newText === null) return; // User cancelled

        const trimmedText = newText.trim();
        if (!trimmedText) {
            showError('Task cannot be empty');
            return;
        }

        tasks = tasks.map(t => 
            t.id === taskId 
                ? { ...t, text: trimmedText }
                : t
        );
        saveTasks();
        renderTasks();
    };

    // Delete task
    const deleteTask = (taskId) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    };

    // Clear completed tasks
    const clearCompleted = () => {
        if (!confirm('Are you sure you want to clear all completed tasks?')) return;

        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    };

    // Event Listeners
    taskForm.addEventListener('submit', addTask);
    clearCompletedBtn.addEventListener('click', clearCompleted);

    // Initial render
    renderTasks();
});
