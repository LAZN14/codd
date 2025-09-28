const { sequelize } = require('../backend/config/database');
const User = require('../backend/models/User');

async function fixDatabase() {
  try {
    console.log('🔄 Подключение к базе данных...');
    await sequelize.authenticate();
    console.log('✅ Подключение установлено');

    console.log('🔄 Синхронизация моделей...');
    await sequelize.sync({ force: true });
    console.log('✅ Модели синхронизированы');

    console.log('🔄 Создание тестовых пользователей...');
    
    // Создаем админа
    await User.create({
      username: 'admin',
      email: 'admin@codd.smolensk.ru',
      password: 'admin123',
      fullName: 'Администратор системы',
      role: 'admin',
      isActive: true,
      phone: '+7 (4812) 123-456',
      department: 'ИТ отдел',
      position: 'Системный администратор'
    });

    // Создаем редактора
    await User.create({
      username: 'editor',
      email: 'editor@codd.smolensk.ru',
      password: 'editor123',
      fullName: 'Редактор контента',
      role: 'operator',
      isActive: true,
      phone: '+7 (4812) 123-457',
      department: 'Контент отдел',
      position: 'Редактор'
    });

    console.log('✅ Тестовые пользователи созданы');
    console.log('🎉 База данных исправлена!');
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await sequelize.close();
  }
}

fixDatabase();
