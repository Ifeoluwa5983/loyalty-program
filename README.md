# Loyalty Program

A full-stack e-commerce loyalty system where customers earn achievements and badges based on their purchase history. Built with Laravel 11 (REST API) and React + Vite (customer dashboard).

---

## Features

- Achievements — automatically unlocked as a customer hits purchase milestones (1, 5, 10, 25, 50 purchases)
- Badges — tier upgrades (Beginner → Bronze → Silver → Gold) granted as achievements accumulate
- Cashback rewards — every badge unlock triggers a ₦300 cashback payment (mocked via logs, ready for a real provider like Paystack or Flutterwave)
- Event-driven architecture — purchases fire a `UserMadePurchase` event; listeners handle achievements, badges, and cashback independently
- REST API — a single endpoint returns a user's full loyalty summary
- Live dashboard — React frontend displays current badge, achievement progress, and a simulate-purchase button for demo purposes

---

## Tech Stack

- Backend — Laravel 11, PHP 8.2+
- Frontend — React 18, Vite, Axios
- Database — SQLite by default (MySQL and PostgreSQL also supported)

---

## Getting Started

### Requirements
- PHP 8.2+ and Composer
- Node.js 18+ and npm

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve
```

> MySQL / PostgreSQL? Update `DB_CONNECTION`, `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` in `.env`, then run `php artisan migrate --seed`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`.

---

## API Reference

### `GET /api/users/{user}/achievements`

Returns the full loyalty summary for a given user.

```json
{
  "user": { "id": 1, "name": "Alice Johnson" },
  "unlocked_achievements": ["First Purchase", "5 Purchases"],
  "next_available_achievements": ["10 Purchases", "25 Purchases", "50 Purchases"],
  "current_badge": "Bronze",
  "next_badge": "Silver",
  "remaining_to_unlock_next_badge": 1
}
```

### `POST /api/users/{user}/purchases`

Records a purchase and triggers the achievements/badges pipeline.

```json
{ "amount": 1500, "description": "Order #1234" }
```

### `GET /api/users`

Lists all users.

### `POST /api/users`

Creates a new user.

```json
{ "name": "Jane Doe", "email": "jane@example.com" }
```

---

## Achievement & Badge Definitions

### Achievements

Achievements are unlocked based on cumulative purchase count:

- First Purchase — 1 purchase
- 5 Purchases — 5 purchases
- 10 Purchases — 10 purchases
- 25 Purchases — 25 purchases
- 50 Purchases — 50 purchases

### Badges

Badges are granted based on the number of achievements earned. Each badge unlock triggers a ₦300 cashback payment:

- Beginner — 0 achievements
- Bronze — 1 achievement
- Silver — 3 achievements
- Gold — 5 achievements (all)

---

## Event Flow

1. A purchase is recorded via `POST /api/users/{user}/purchases`
2. A `UserMadePurchase` event is fired
3. The `ProcessAchievements` listener handles the event — it checks the user's purchase count against all achievement thresholds and attaches any newly eligible achievements, firing an `AchievementUnlocked` event for each one
4. It then checks the updated achievement count against badge thresholds and attaches any newly eligible badges, firing a `BadgeUnlocked` event for each one
5. The `ProcessCashback` listener handles each `BadgeUnlocked` event and logs a ₦300 cashback payment with a unique transaction reference

---

## Demo

Two users are seeded automatically: Alice Johnson (`alice@example.com`) and Bob Smith (`bob@example.com`).

Select a user in the dashboard dropdown and click Simulate Purchase to trigger the achievement pipeline in real time.

To watch cashback payments being logged:
```bash
tail -f backend/storage/logs/laravel.log
```
