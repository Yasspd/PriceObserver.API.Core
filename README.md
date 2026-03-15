# PriceObserver.API.Core

1. Auth Module

Что делает:

регистрация

логин

refresh token

роли

2. Users Module

Что делает:

профиль

настройки уведомлений

тарифы/лимиты

3. Products Module

Что делает:

создание товаров

нормализация ссылок

хранение текущего состояния товара

4. WatchRules Module

Что делает:

создание правил отслеживания

валидация лимитов

активация/деактивация

expiration/cooldown/max-notifications

5. Pricing Module

Что делает:

получение свежей цены

сравнение с предыдущей

запись snapshots

выявление изменений

6. Monitoring Module

Что делает:

планирование проверок

постановка задач в очередь

retry/backoff

lock механизмы

Backoff — увеличение паузы между повторными попытками после ошибки.

7. Notifications Module

Что делает:

создание notification events

отправка email/telegram/webhook

защита от дублей

история уведомлений

8. Billing/Plans Module

Что делает:

тарифные ограничения

лимиты подписок

приоритет правил

Даже без реальной оплаты модуль уже будет полезен.

9. Admin Module

Что делает:

ручной просмотр ошибок

принудительный recheck товара

статистика по jobs и уведомлениям

Технический стек

Я бы собрал так:

NestJS — framework для модульного backend

PostgreSQL — основная БД

Redis — кэш, locks, очереди

BullMQ — очередь фоновых задач

Prisma или TypeORM — ORM для работы с БД

Swagger — документация API

Docker — контейнеризация

Jest — unit/e2e тесты
