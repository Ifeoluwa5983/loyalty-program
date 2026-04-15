# Loyalty Program

A full-stack e-commerce loyalty program where customers unlock achievements and earn badges as they make purchases.

## Overview

### Achievements (unlocked by purchase count)
| Achievement | Required Purchases |
|---|---|
| First Purchase | 1 |
| 5 Purchases | 5 |
| 10 Purchases | 10 |
| 25 Purchases | 25 |
| 50 Purchases | 50 |

### Badges (unlocked by achievements earned)
| Badge | Required Achievements | Cashback |
|---|---|---|
| Beginner | 0 | ₦300 |
| Bronze | 1 | ₦300 |
| Silver | 3 | ₦300 |
| Gold | 5 | ₦300 |

Each time a new badge is unlocked a **₦300 cashback** is triggered (mocked via application logs).

---

## Tech Stack

- **Backend**: Laravel 11 (PHP 8.2+), SQLite (default)
- **Frontend**: React 18 + Vite

---

## Setup

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- npm

---

### Backend

```bash
cd backend

# 1. Install PHP dependencies
composer install

# 2. Set up environment
cp .env.example .env
php artisan key:generate

# 3. Create the SQLite database file
touch database/database.sqlite

# 4. Run migrations and seed data
php artisan migrate --seed

# 5. Start the development server (runs on port 8000)
php artisan serve
```

The API will be available at `http://localhost:8000`.

#### Using MySQL instead of SQLite

Edit `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=loyalty_program
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

Then run `php artisan migrate --seed`.

---

### Frontend

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env

# 3. Start the development server (runs on port 5173)
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## API Reference

### `GET /api/users/{user}/achievements`

Returns the loyalty summary for a user.

**Response:**
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

Records a purchase and triggers the achievement/badge pipeline.

**Request body:**
```json
{ "amount": 1500, "description": "Order #1234" }
```

### `GET /api/users`

Lists all users (for demo/testing).

### `POST /api/users`

Creates a new user.

**Request body:**
```json
{ "name": "Jane Doe", "email": "jane@example.com" }
```

---

## Event Flow

```
POST /api/users/{user}/purchases
         │
         ▼
  UserMadePurchase event fired
         │
         ▼
  ProcessAchievements listener
    ├─ checks purchase count against achievement thresholds
    ├─ attaches newly eligible achievements to user
    ├─ fires AchievementUnlocked event for each new achievement
    ├─ checks achievement count against badge thresholds
    ├─ attaches newly eligible badges to user
    └─ fires BadgeUnlocked event for each new badge
              │
              ▼
       ProcessCashback listener
         └─ logs ₦300 cashback payment (mock provider)
```

---

## Demo

After setup, two demo users are seeded:

| Name | Email |
|---|---|
| Alice Johnson | alice@example.com |
| Bob Smith | bob@example.com |

Use the **"Simulate Purchase"** button on the dashboard to trigger purchases and watch achievements and badges unlock in real time.

To observe cashback logs:
```bash
# In the backend directory
tail -f storage/logs/laravel.log
```

---

## Project Structure

```
loyalty-program/
├── backend/                        # Laravel API
│   ├── app/
│   │   ├── Events/
│   │   │   ├── UserMadePurchase.php
│   │   │   ├── AchievementUnlocked.php
│   │   │   └── BadgeUnlocked.php
│   │   ├── Listeners/
│   │   │   ├── ProcessAchievements.php  # handles UserMadePurchase
│   │   │   └── ProcessCashback.php      # handles BadgeUnlocked
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Purchase.php
│   │   │   ├── Achievement.php
│   │   │   └── Badge.php
│   │   ├── Services/
│   │   │   └── AchievementService.php   # core business logic
│   │   └── Http/Controllers/Api/
│   │       ├── AchievementController.php
│   │       ├── PurchaseController.php
│   │       └── UserController.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
└── frontend/                       # React + Vite
    └── src/
        ├── api/achievements.js
        ├── components/
        │   ├── BadgeCard.jsx
        │   ├── AchievementGrid.jsx
        │   ├── ProgressBar.jsx
        │   └── LoadingSpinner.jsx
        └── pages/Dashboard.jsx
```
