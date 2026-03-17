document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------------------------------------
    // ELEMENTOS DA TELA DE LOGIN
    // ---------------------------------------------------------
    const loginForm = document.querySelector('#loginForm');
    const userInput = document.querySelector('#user-id');
    const passwordInput = document.querySelector('#password');
    const togglePassword = document.querySelector('#togglePassword');
    const submitBtn = document.querySelector('#submitBtn');
    
    if (loginForm) {
    
        const btnText = submitBtn.querySelector('.btn-text');
        const loader = submitBtn.querySelector('.loader');
    
        // Máscara de CPF
        userInput.addEventListener('input', (e) => {
    
            let value = e.target.value.replace(/\D/g, '');
    
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
    
            e.target.value = value;
            clearError(userInput, 'user-error');
    
        });
    
        // Mostrar/Ocultar Senha
        const handleTogglePassword = () => {
    
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            togglePassword.classList.toggle('fa-eye-slash');
            togglePassword.classList.toggle('fa-eye');
    
        };
    
        togglePassword.addEventListener('click', handleTogglePassword);
    
        // Login
        loginForm.addEventListener('submit', (e) => {
    
            e.preventDefault();
    
            if (userInput.value.trim().length < 4) {
                showError(userInput, 'user-error');
                return;
            }
    
            setLoading(true);
    
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
    
        });
    
        function setLoading(isLoading) {
    
            if (isLoading) {
                submitBtn.classList.add('loading');
                btnText.style.display = 'none';
                loader.style.display = 'block';
            }
    
        }
    
        function showError(input, errorId) {
    
            input.classList.add('input-error');
            document.getElementById(errorId).style.display = 'block';
    
        }
    
        function clearError(input, errorId) {
    
            input.classList.remove('input-error');
            const err = document.getElementById(errorId);
            if (err) err.style.display = 'none';
    
        }
    
    }
    
    // ---------------------------------------------------------
    // ELEMENTOS DO DASHBOARD
    // ---------------------------------------------------------
    
    const todoForm = document.querySelector('#todoForm');
    const todoInput = document.querySelector('#todoInput');
    const todoList = document.querySelector('#todoList');
    const logoutBtn = document.querySelector('#logoutBtn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabBtns.length > 0) {
    
        // ---------------------------------------------------------
        // ABAS DO DASHBOARD
        // ---------------------------------------------------------
    
        tabBtns.forEach(btn => {
    
            btn.addEventListener('click', () => {
    
                const targetTab = btn.dataset.tab;
    
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
    
                btn.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
    
                if (targetTab === 'home') updateHomeSummary();
    
            });
    
        });
    
        // ---------------------------------------------------------
        // TODO LIST
        // ---------------------------------------------------------
    
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [
            { id: 1, text: 'Estudar para a prova de Matemática', completed: false },
            { id: 2, text: 'Entregar trabalho de História', completed: true }
        ];
    
        const saveTasks = () => {
            localStorage.setItem('tasks', JSON.stringify(tasks));
            updateHomeSummary();
        };
    
        const renderTasks = () => {
    
            if (!todoList) return;
            todoList.innerHTML = '';
    
            tasks.forEach(task => {
    
                const li = document.createElement('li');
                li.className = `todo-item ${task.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                    <span>${task.text}</span>
                    <button class="btn-delete-todo" data-id="${task.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                todoList.appendChild(li);
    
            });
    
        };
    
        if (todoForm) {
    
            todoForm.addEventListener('submit', (e) => {
    
                e.preventDefault();
                const text = todoInput.value.trim();
    
                if (text) {
                    tasks.push({
                        id: Date.now(),
                        text,
                        completed: false
                    });
                    todoInput.value = '';
                    saveTasks();
                    renderTasks();
                }
    
            });
    
        }
    
        if (todoList) {
    
            todoList.addEventListener('click', (e) => {
    
                const id = parseInt(e.target.closest('[data-id]')?.dataset.id);
                if (!id) return;
    
                if (e.target.type === 'checkbox') {
                    const task = tasks.find(t => t.id === id);
                    if (task) {
                        task.completed = e.target.checked;
                        saveTasks();
                        renderTasks();
                    }
                }
                else if (e.target.closest('.btn-delete-todo')) {
                    tasks = tasks.filter(t => t.id !== id);
                    saveTasks();
                    renderTasks();
                }
    
            });
    
        }
    
        // ---------------------------------------------------------
        // CARDÁPIO DO DIA
        // ---------------------------------------------------------
    
        const updateMenuDay = () => {
    
            const now = new Date();
            let dayOfWeek = now.getDay();
            const todayCard = document.querySelector(`.menu-card[data-day="${dayOfWeek}"]`);
    
            if (todayCard) {
                todayCard.classList.add('active');
                if (!todayCard.querySelector('.day').textContent.includes('(Hoje)')) {
                    todayCard.querySelector('.day').textContent += ' (Hoje)';
                }
            }
    
            return todayCard
                ? todayCard.querySelector('.meal').textContent
                : "Sem cardápio para hoje.";
    
        };
    
        // ---------------------------------------------------------
        // RESUMO DA HOME
        // ---------------------------------------------------------
    
        const updateHomeSummary = () => {
    
            const mealToday = updateMenuDay();
            const todayMealText = document.getElementById('todayMealText');
            if (todayMealText)
                todayMealText.textContent = mealToday;
    
            // tarefas pendentes
            const pendingTasks = tasks.filter(t => !t.completed).length;
            const todoCountText = document.getElementById('todoCountText');
            if (todoCountText) {
                todoCountText.textContent = pendingTasks === 0
                    ? "Tudo pronto! Nenhuma tarefa pendente."
                    : `Você tem ${pendingTasks} ${pendingTasks === 1 ? 'tarefa pendente' : 'tarefas pendentes'}.`;
            }
    
            // ---------------------------------------------------------
            // TAXA DE PRESENÇA - Cálculo atualizado
            // ---------------------------------------------------------
            const attendanceText = document.getElementById('attendanceText');
            if (attendanceText) {
                // Dados simulados de presença
                const totalAulas = 100;
                const presencas = 35;
                const faltas = totalAulas - presencas;
                const taxa = Math.round((presencas / totalAulas) * 100);
                
                // Determinar a cor baseada na taxa de presença
                let statusClass = '';
                if (taxa >= 90) statusClass = 'attendance-excellent';
                else if (taxa >= 75) statusClass = 'attendance-good';
                else statusClass = 'attendance-low';
                
                attendanceText.textContent = `${taxa}% de presença (${presencas} de ${totalAulas} aulas)`;
                
                // Adicionar classe de cor
                attendanceText.className = statusClass;
            }
    
        };
    
        // ---------------------------------------------------------
        // LOGOUT
        // ---------------------------------------------------------
    
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
    
        // ---------------------------------------------------------
        // INICIALIZAÇÃO
        // ---------------------------------------------------------
    
        renderTasks();
        updateHomeSummary();
    
    }

});