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
