// Простая версия админ-панели
class SimpleAdminDashboard {
    constructor() {
        this.apiBase = '';
        this.init();
    }

    init() {
        console.log('🚀 Simple Admin Dashboard init');
        
        // Проверяем аутентификацию
        const token = localStorage.getItem('adminToken');
        const userRole = localStorage.getItem('userRole');
        
        if (!token || !userRole) {
            console.log('❌ Нет токена, перенаправляем на логин');
            window.location.href = 'admin.html';
            return;
        }
        
        if (userRole !== 'admin' && userRole !== 'operator') {
            console.log('❌ Недостаточно прав');
            window.location.href = 'admin.html';
            return;
        }
        
        console.log('✅ Аутентификация успешна');
        this.setupUI();
    }

    setupUI() {
        // Простой интерфейс
        document.body.innerHTML = `
            <div style="padding: 20px; font-family: Arial, sans-serif;">
                <h1>🎉 Админ-панель работает!</h1>
                <p>Добро пожаловать, ${localStorage.getItem('userName') || 'Администратор'}!</p>
                <p>Роль: ${localStorage.getItem('userRole')}</p>
                <button onclick="this.logout()" style="background: #dc3545; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
                    Выйти
                </button>
            </div>
        `;
    }

    logout() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        window.location.href = 'admin.html';
    }
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM загружен, запускаем админ-панель');
    new SimpleAdminDashboard();
});
