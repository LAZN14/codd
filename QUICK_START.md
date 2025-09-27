# ⚡ Быстрый старт развертывания

## 🎯 Что у вас есть
- ✅ Фронтенд уже залит на хостинг
- ✅ Домен настроен
- ❓ Нужно запустить бэкенд

## 🚀 Быстрое развертывание (5 минут)

### 1. Подключитесь к серверу
```bash
ssh root@ваш-сервер.com
```

### 2. Загрузите файлы проекта
```bash
# Создайте папку для проекта
mkdir -p /var/www/codd-platform
cd /var/www/codd-platform

# Загрузите все файлы проекта (через FTP/SFTP или Git)
# Убедитесь, что загружены:
# - server.js
# - package.json
# - backend/ папка
# - database.sqlite
# - uploads/ папка
```

### 3. Запустите автоматический скрипт
```bash
# Сделайте скрипт исполняемым
chmod +x deploy.sh

# Запустите развертывание
sudo ./deploy.sh production
```

### 4. Настройте переменные окружения
```bash
# Отредактируйте файл .env
nano .env

# Обязательно измените JWT_SECRET на сложный ключ!
```

### 5. Проверьте работу
```bash
# Проверьте статус
pm2 status

# Проверьте логи
pm2 logs codd-platform

# Проверьте доступность
curl http://localhost:3000
```

## 🔧 Ручное развертывание (если автоматическое не работает)

### 1. Установите Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Установите PM2
```bash
sudo npm install -g pm2
```

### 3. Установите зависимости
```bash
cd /var/www/codd-platform
npm install --production
```

### 4. Создайте .env файл
```bash
nano .env
```
Содержимое:
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=ваш-сложный-ключ-минимум-32-символа
```

### 5. Запустите приложение
```bash
pm2 start server.js --name codd-platform
pm2 save
pm2 startup
```

### 6. Настройте Nginx
```bash
sudo nano /etc/nginx/sites-available/codd-platform
```

Содержимое:
```nginx
server {
    listen 80;
    server_name ваш-домен.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/codd-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔐 Настройка SSL (обязательно для продакшена)

```bash
# Установите Certbot
sudo apt install certbot python3-certbot-nginx -y

# Получите SSL сертификат
sudo certbot --nginx -d ваш-домен.com
```

## 📊 Полезные команды

```bash
# Просмотр статуса
pm2 status

# Перезапуск
pm2 restart codd-platform

# Логи
pm2 logs codd-platform

# Мониторинг
pm2 monit

# Остановка
pm2 stop codd-platform
```

## 🚨 Если что-то не работает

1. **Проверьте логи**: `pm2 logs codd-platform`
2. **Проверьте порт**: `netstat -tlnp | grep :3000`
3. **Проверьте Nginx**: `sudo nginx -t`
4. **Проверьте права**: `ls -la /var/www/codd-platform`

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте, что все файлы загружены
2. Убедитесь, что Node.js установлен
3. Проверьте права доступа к файлам
4. Убедитесь, что порт 3000 свободен

---

**Удачи! 🚀**
