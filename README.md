# KyperdyAI MVP

MVP Telegram Mini App + Bot + API + локальный TTS (CosyVoice) в виде монорепозитория.

## Что внутри
- `apps/api`: Fastify API + Prisma (SQLite)
- `apps/bot`: Telegraf бот
- `apps/web`: Vite + React + Tailwind (Telegram Mini App)
- `services/tts`: FastAPI + CosyVoice (локальная TTS)

## Требования
- Docker + Docker Compose
- Telegram Bot Token
- DeepSeek API key

## Быстрый старт
1) Скопируйте `.env.example` в `.env` и заполните переменные.
2) Запустите сервисы:

```bash
docker compose up -d --build
```

## UI
- Web UI доступен на `http://localhost:5173`.
- Основные экраны: главная (“Купердай”), мастер создания, библиотека, экран истории с плеером и профиль.

## Smoke test
1) Запуск сервисов:
```
docker compose up -d --build
```
2) Проверка здоровья API:
```
curl http://localhost:8080/health
```
3) Создание истории (после авторизации Telegram WebApp):
```
curl -X POST http://localhost:8080/api/stories \\
  -H \"Authorization: Bearer <JWT_TOKEN>\" \\
  -H \"Content-Type: application/json\" \\
  -d '{\"theme\":\"Космическое приключение\",\"ageGroup\":\"6-8\",\"style\":\"Сказка\",\"duration\":\"5\",\"narrator\":\"klaus\",\"ending\":\"Счастливый финал\"}'
```
4) Получение аудио:
```
curl -L http://localhost:8080/api/stories/<STORY_ID>/audio \\
  -H \"Authorization: Bearer <JWT_TOKEN>\" \\
  -o story.mp3
```

## Админ Premium
Включение premium для пользователя через бота:
```
/admin_premium <telegramId> <days>
```

## Примечания по CosyVoice
TTS сервис использует `modelscope` для скачивания модели CosyVoice при первом старте в volume `/models`.
По умолчанию используется модель `iic/CosyVoice-300M`. При необходимости задайте переменную окружения:
```
COSYVOICE_MODEL_ID=iic/CosyVoice-300M
```
