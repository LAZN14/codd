# 🚀 Руководство по развертыванию бэкенда на хостинге

## 📋 Что нужно для развертывания

Ваш проект - это Node.js приложение с:
- **Express.js** сервер
- **SQLite** база данных
- **Sequelize ORM**
- **JWT** аутентификация
- **Multer** для загрузки файлов

## 🛠️ Пошаговое развертывание

### 1. Подготовка сервера

#### Установка Node.js
```bash
# Обновите систему
sudo apt update && sudo apt upgrade -y

# Установите Node.js (версия 18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверьте версию
node --version
npm --version
```

#### Установка PM2 (менеджер процессов)
```bash
sudo npm install -g pm2
```

### 2. Загрузка проекта на сервер

#### Вариант A: Через Git
```bash
# Клонируйте репозиторий
git clone <ваш-репозиторий> /var/www/codd-platform
cd /var/www/codd-platform
```

#### Вариант B: Через FTP/SFTP
1. Загрузите все файлы проекта в папку `/var/www/codd-platform/`
2. Убедитесь, что загружены все файлы включая `node_modules/`

### 3. Настройка проекта

#### Установка зависимостей
```bash
cd /var/www/codd-platform
npm install --production
```

#### Создание файла переменных окружения
```bash
nano .env
```

Содержимое файла `.env`:
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=ваш-секретный-ключ-для-jwt
DB_PATH=/var/www/codd-platform/database.sqlite
```

#### Настройка прав доступа
```bash
# Дайте права на запись для базы данных и загрузок
sudo chown -R www-data:www-data /var/www/codd-platform
sudo chmod -R 755 /var/www/codd-platform
sudo chmod 666 /var/www/codd-platform/database.sqlite
sudo chmod -R 777 /var/www/codd-platform/uploads
```

### 4. Настройка PM2

#### Создание конфигурации PM2
```bash
nano ecosystem.config.js
```

#### Запуск через PM2
```bash
# Запуск приложения
pm2 start ecosystem.config.js

# Сохранение конфигурации PM2
pm2 save

# Настройка автозапуска
pm2 startup
```

### 5. Настройка Nginx (веб-сервер)

#### Установка Nginx
```bash
sudo apt install nginx -y
```

#### Создание конфигурации сайта
```bash
sudo nano /etc/nginx/sites-available/codd-platform
```

#### Настройка SSL (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d ваш-домен.com
```

### 6. Настройка файрвола
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 🔧 Управление приложением

### Команды PM2
```bash
# Просмотр статуса
pm2 status

# Перезапуск
pm2 restart codd-platform

# Остановка
pm2 stop codd-platform

# Просмотр логов
pm2 logs codd-platform

# Мониторинг
pm2 monit
```

### Обновление приложения
```bash
# Остановка
pm2 stop codd-platform

# Обновление кода
git pull origin main  # или загрузка новых файлов

# Установка новых зависимостей
npm install --production

# Запуск
pm2 start codd-platform
```

## 🗄️ Работа с базой данных

### Резервное копирование
```bash
# Создание бэкапа
cp database.sqlite database_backup_$(date +%Y%m%d_%H%M%S).sqlite

# Восстановление
cp database_backup_20241201_120000.sqlite database.sqlite
```

### Инициализация базы данных
```bash
# Если нужно пересоздать базу
rm database.sqlite
npm run init-db
```

## 🚨 Решение проблем

### Проверка логов
```bash
# Логи приложения
pm2 logs codd-platform

# Логи Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Системные логи
sudo journalctl -u nginx
```

### Проверка портов
```bash
# Проверка, что приложение слушает порт
netstat -tlnp | grep :3000

# Проверка процессов Node.js
ps aux | grep node
```

### Перезапуск сервисов
```bash
# Перезапуск Nginx
sudo systemctl restart nginx

# Перезапуск PM2
pm2 restart all
```

## 📊 Мониторинг

### Установка мониторинга
```bash
# PM2 мониторинг
pm2 install pm2-logrotate

# Настройка ротации логов
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## 🔐 Безопасность

### Рекомендации по безопасности
1. **Измените JWT_SECRET** на сложный случайный ключ
2. **Настройте файрвол** (уже сделано выше)
3. **Регулярно обновляйте** систему и зависимости
4. **Настройте SSL** (Let's Encrypt)
5. **Ограничьте доступ** к базе данных

### Создание сложного JWT секрета
```bash
# Генерация случайного ключа
openssl rand -base64 64
```

## 📞 Поддержка

Если возникнут проблемы:
1. Проверьте логи: `pm2 logs codd-platform`
2. Проверьте статус: `pm2 status`
3. Проверьте конфигурацию Nginx: `sudo nginx -t`
4. Проверьте доступность порта: `netstat -tlnp | grep :3000`

---

**Удачи с развертыванием! 🚀**
