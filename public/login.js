// Login Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.querySelector('.login-btn');

    // Учетные данные (проверяются на сервере)
    // Здесь только базовая валидация, основная проверка на сервере

    // Проверяем, если пользователь уже вошел
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = '/admin';
        return;
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!email || !password) {
            showMessage('Пожалуйста, заполните все поля', 'error');
            return;
        }
        
        // Отправляем данные на сервер для проверки
        setLoadingState(true);
        
        fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login: email, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Успешный вход
                showMessage('Успешный вход! Перенаправляем...', 'success');
                
                // Сохраняем состояние входа
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                
                // Перенаправляем на админ панель
                setTimeout(() => {
                    window.location.href = '/admin';
                }, 1500);
            } else {
                // Неверные учетные данные
                showMessage(data.error || 'Неверный логин или пароль', 'error');
                
                // Очищаем поле пароля
                passwordInput.value = '';
                passwordInput.focus();
                
                // Добавляем эффект тряски
                loginForm.classList.add('shake');
                setTimeout(() => {
                    loginForm.classList.remove('shake');
                }, 500);
                
                setLoadingState(false);
            }
        })
        .catch(error => {
            console.error('Ошибка входа:', error);
            showMessage('Ошибка соединения с сервером', 'error');
            setLoadingState(false);
        });
    });

    // Функция показа сообщений
    function showMessage(text, type) {
        // Удаляем существующие сообщения
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Создаем новое сообщение
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        // Вставляем перед формой
        loginForm.insertBefore(message, loginForm.firstChild);
        
        // Автоматически убираем через 5 секунд
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    // Функция установки состояния загрузки
    function setLoadingState(loading) {
        if (loading) {
            loginBtn.innerHTML = '<span class="loading"></span> Вход...';
            loginBtn.disabled = true;
        } else {
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Войти';
            loginBtn.disabled = false;
        }
    }

    // Добавляем анимацию при фокусе на полях
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Добавляем эффект нажатия клавиши Enter
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loginForm.dispatchEvent(new Event('submit'));
            }
        });
    });

    // Демо подсказка убрана - используются реальные учетные данные
});

// Добавляем CSS для анимации тряски
const style = document.createElement('style');
style.textContent = `
    .shake {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .form-group.focused label {
        color: var(--primary-color);
        transform: translateY(-2px);
    }
    
    .form-group.focused input {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }
`;
document.head.appendChild(style); 