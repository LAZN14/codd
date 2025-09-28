// Admin Login Script
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const notifications = document.getElementById('notifications');

    // Check if user is already logged in
    const token = localStorage.getItem('adminToken');
    const userRole = localStorage.getItem('userRole');
    
    if (token && userRole && (userRole === 'admin' || userRole === 'operator')) {
        console.log('✅ Пользователь уже авторизован, перенаправляем в дашборд');
        window.location.href = 'admin-dashboard.html';
        return;
    }

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            showNotification('Пожалуйста, заполните все поля', 'error');
            return;
        }

        try {
            showLoading(true);
            
            // ПРИНУДИТЕЛЬНО используем Railway URL
            const baseUrl = 'https://codd-production.up.railway.app';
            const response = await fetch(`${baseUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Save token and user data
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('userRole', data.user.role);
                localStorage.setItem('userName', data.user.fullName || data.user.username);
                showNotification('Успешный вход в систему!', 'success');
                
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 1000);
            } else {
                showNotification(data.error || 'Ошибка входа в систему', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showNotification('Ошибка подключения к серверу', 'error');
        } finally {
            showLoading(false);
        }
    });

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notifications.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    function showLoading(show) {
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        if (show) {
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ Вход...';
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = '🚀 Войти в панель';
        }
    }
});
