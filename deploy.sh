#!/bin/bash

# 🚀 Скрипт автоматического развертывания ЦОДД платформы
# Использование: ./deploy.sh [production|development]

set -e  # Остановка при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Проверка аргументов
ENVIRONMENT=${1:-production}
PROJECT_DIR="/var/www/codd-platform"
BACKUP_DIR="/var/backups/codd-platform"

log "🚀 Начинаем развертывание ЦОДД платформы в режиме: $ENVIRONMENT"

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
    error "Этот скрипт должен запускаться с правами root (sudo)"
fi

# Создание директорий
log "📁 Создание необходимых директорий..."
mkdir -p $PROJECT_DIR
mkdir -p $BACKUP_DIR
mkdir -p /var/log/pm2

# Установка Node.js (если не установлен)
if ! command -v node &> /dev/null; then
    log "📦 Установка Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
else
    log "✅ Node.js уже установлен: $(node --version)"
fi

# Установка PM2 (если не установлен)
if ! command -v pm2 &> /dev/null; then
    log "📦 Установка PM2..."
    npm install -g pm2
else
    log "✅ PM2 уже установлен: $(pm2 --version)"
fi

# Установка Nginx (если не установлен)
if ! command -v nginx &> /dev/null; then
    log "📦 Установка Nginx..."
    apt update
    apt install -y nginx
    systemctl enable nginx
else
    log "✅ Nginx уже установлен"
fi

# Создание резервной копии (если проект уже существует)
if [ -d "$PROJECT_DIR" ] && [ "$(ls -A $PROJECT_DIR)" ]; then
    log "💾 Создание резервной копии..."
    BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
    cp -r $PROJECT_DIR $BACKUP_DIR/$BACKUP_NAME
    log "✅ Резервная копия создана: $BACKUP_DIR/$BACKUP_NAME"
fi

# Остановка приложения (если запущено)
if pm2 list | grep -q "codd-platform"; then
    log "⏹️ Остановка текущего приложения..."
    pm2 stop codd-platform
fi

# Копирование файлов проекта (если они в текущей директории)
if [ -f "server.js" ] && [ -f "package.json" ]; then
    log "📋 Копирование файлов проекта..."
    cp -r . $PROJECT_DIR/
else
    warn "Файлы проекта не найдены в текущей директории"
    warn "Убедитесь, что вы находитесь в корневой папке проекта"
fi

# Переход в директорию проекта
cd $PROJECT_DIR

# Установка зависимостей
log "📦 Установка зависимостей..."
npm install --production

# Создание файла .env (если не существует)
if [ ! -f ".env" ]; then
    log "⚙️ Создание файла .env..."
    cp env.example .env
    warn "⚠️  ОБЯЗАТЕЛЬНО отредактируйте файл .env и измените JWT_SECRET!"
fi

# Настройка прав доступа
log "🔐 Настройка прав доступа..."
chown -R www-data:www-data $PROJECT_DIR
chmod -R 755 $PROJECT_DIR
chmod 666 database.sqlite 2>/dev/null || true
chmod -R 777 uploads 2>/dev/null || true

# Инициализация базы данных
log "🗄️ Инициализация базы данных..."
npm run init-db

# Создание конфигурации Nginx
log "🌐 Настройка Nginx..."
cat > /etc/nginx/sites-available/codd-platform << EOF
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Статические файлы
    location /uploads/ {
        alias $PROJECT_DIR/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Активация сайта
ln -sf /etc/nginx/sites-available/codd-platform /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Проверка конфигурации Nginx
nginx -t

# Перезапуск Nginx
systemctl restart nginx

# Запуск приложения через PM2
log "🚀 Запуск приложения..."
pm2 start ecosystem.config.js --env $ENVIRONMENT

# Сохранение конфигурации PM2
pm2 save

# Настройка автозапуска
pm2 startup

# Настройка файрвола
log "🔥 Настройка файрвола..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# Установка ротации логов
log "📝 Настройка ротации логов..."
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Проверка статуса
log "✅ Проверка статуса развертывания..."
pm2 status
systemctl status nginx

log "🎉 Развертывание завершено успешно!"
log "📱 Приложение доступно по адресу: http://localhost"
log "📊 Мониторинг: pm2 monit"
log "📋 Логи: pm2 logs codd-platform"

# Генерация JWT секрета
JWT_SECRET=$(openssl rand -base64 64)
log "🔑 Сгенерированный JWT_SECRET: $JWT_SECRET"
warn "⚠️  Не забудьте добавить этот ключ в файл .env!"

echo ""
log "📋 Следующие шаги:"
echo "1. Отредактируйте файл .env и установите JWT_SECRET"
echo "2. Настройте SSL сертификат: certbot --nginx -d ваш-домен.com"
echo "3. Проверьте работу: curl http://localhost"
echo "4. Настройте мониторинг: pm2 monit"
