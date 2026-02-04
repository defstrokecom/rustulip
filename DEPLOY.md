# 🚀 Развёртывание РусТюльпан на Ubuntu Server

## Требования

- Ubuntu 20.04 / 22.04 / 24.04 LTS
- Минимум 1GB RAM, 1 CPU
- Доменное имя (опционально, для SSL)

---

## 1. Подготовка сервера

### Обновление системы

```bash
sudo apt update && sudo apt upgrade -y
```

### Установка Node.js 20.x

```bash
# Установка через NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Проверка версии
node -v  # v20.x.x
npm -v   # 10.x.x
```

### Установка Git

```bash
sudo apt install -y git
```

---

## 2. Клонирование проекта

```bash
# Переход в домашнюю директорию
cd ~

# Клонирование репозитория (с токеном для авторизации)
git clone https://YOUR_GITHUB_TOKEN@github.com/defstrokecom/rustulip.git

# Или без токена (для публичного репозитория)
git clone https://github.com/defstrokecom/rustulip.git

# Переход в директорию проекта
cd rustulip
```

---

## 3. Установка зависимостей

```bash
npm install
```

---

## 4. Настройка переменных окружения

### Создание файла .env

```bash
nano .env
```

### Содержимое .env

```env
# База данных (SQLite)
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-super-secret-key-change-this"

# Для production генерируем случайный ключ:
# openssl rand -base64 32

# URL приложения (для ссылок в email)
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

Сохраните: `Ctrl+O`, `Enter`, затем `Ctrl+X`

### Генерация секретного ключа

```bash
openssl rand -base64 32
# Скопируйте результат в NEXTAUTH_SECRET
```

---

## 5. Настройка базы данных

### Генерация Prisma Client

```bash
npx prisma generate
```

### Создание базы данных и таблиц

```bash
npx prisma db push
```

### Заполнение тестовыми данными

```bash
npm run db:seed
```

> ⚠️ Это создаст тестового админа: `admin@rustulip.ru` / `admin123`

---

## 6. Сборка проекта

```bash
npm run build
```

---

## 7. Запуск приложения

### Тестовый запуск

```bash
npm run start
# Приложение будет доступно на http://localhost:3000
```

### Production запуск с PM2

```bash
# Установка PM2 глобально
sudo npm install -g pm2

# Запуск приложения
pm2 start npm --name "rustulip" -- start

# Автозапуск при перезагрузке сервера
pm2 startup
pm2 save

# Полезные команды PM2
pm2 status          # Статус приложений
pm2 logs rustulip   # Логи
pm2 restart rustulip # Перезапуск
pm2 stop rustulip   # Остановка
```

---

## 8. Настройка Nginx (Reverse Proxy)

### Установка Nginx

```bash
sudo apt install -y nginx
```

### Создание конфигурации

```bash
sudo nano /etc/nginx/sites-available/rustulip
```

### Содержимое конфигурации

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
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

### Активация конфигурации

```bash
# Создание символической ссылки
sudo ln -s /etc/nginx/sites-available/rustulip /etc/nginx/sites-enabled/

# Удаление дефолтного сайта
sudo rm /etc/nginx/sites-enabled/default

# Проверка конфигурации
sudo nginx -t

# Перезапуск Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## 9. SSL сертификат (Let's Encrypt)

### Установка Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Получение сертификата

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Автообновление сертификата

```bash
# Тест автообновления
sudo certbot renew --dry-run

# Certbot автоматически добавляет cron задачу
```

---

## 10. Настройка Firewall

```bash
# Разрешить SSH, HTTP, HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'

# Включить firewall
sudo ufw enable

# Проверка статуса
sudo ufw status
```

---

## 🔄 Обновление проекта

```bash
cd ~/rustulip

# Получение обновлений
git pull origin main

# Установка новых зависимостей
npm install

# Обновление базы данных (если были изменения)
npx prisma generate
npx prisma db push

# Пересборка
npm run build

# Перезапуск
pm2 restart rustulip
```

---

## 📋 Чеклист после развёртывания

- [ ] Сайт открывается по адресу https://yourdomain.com
- [ ] Админ-панель доступна: https://yourdomain.com/admin/login
- [ ] Вход по `admin@rustulip.ru` / `admin123` работает
- [ ] **Смените пароль администратора!** (Настройки → Изменить пароль)
- [ ] Настройте email рассылку (Рассылка → Email рассылка)
- [ ] SSL сертификат активен (замочек в браузере)

---

## 🔧 Решение проблем

### Приложение не запускается

```bash
# Проверка логов
pm2 logs rustulip --lines 50

# Проверка порта
sudo lsof -i :3000
```

### Ошибка базы данных

```bash
# Пересоздание базы
rm prisma/dev.db
npx prisma db push
npm run db:seed
```

### Nginx 502 Bad Gateway

```bash
# Проверка, что приложение запущено
pm2 status

# Проверка логов Nginx
sudo tail -f /var/log/nginx/error.log
```

### Нет прав на папку

```bash
# Установка владельца
sudo chown -R $USER:$USER ~/rustulip
```

---

## 📊 Мониторинг

### Просмотр ресурсов

```bash
htop
```

### Логи приложения

```bash
pm2 logs rustulip --lines 100
```

### Логи Nginx

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🗄️ Резервное копирование

### Бэкап базы данных

```bash
cp ~/rustulip/prisma/dev.db ~/backups/rustulip-$(date +%Y%m%d).db
```

### Автоматический бэкап (cron)

```bash
crontab -e

# Добавить строку (бэкап каждый день в 3:00)
0 3 * * * cp ~/rustulip/prisma/dev.db ~/backups/rustulip-$(date +\%Y\%m\%d).db
```

---

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи: `pm2 logs rustulip`
2. Проверьте статус: `pm2 status`
3. Перезапустите: `pm2 restart rustulip`

---

**Готово! 🌷 Ваш магазин РусТюльпан развёрнут и работает.**
