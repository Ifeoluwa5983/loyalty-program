# Codebase Documentation

A file-by-file explanation of every file in the Loyalty Program project.

---

## Root

### `.gitignore`
Tells Git which files and folders to exclude from version control. Covers macOS system files (`.DS_Store`), IDE folders (`.idea/`, `.vscode/`), PHP dependencies (`vendor/`), JavaScript dependencies (`node_modules/`), environment files (`.env`), the SQLite database file, compiled frontend assets (`dist/`), and Laravel's bootstrap cache and storage directories. This ensures sensitive configuration and generated files are never committed.

### `README.md`
The project's entry point on GitHub. Describes what the project does, how to install and run both the backend and frontend, documents all API endpoints with example request and response bodies, lists all achievements and badges with their unlock conditions, and explains the event-driven flow that runs when a purchase is recorded.

### `CODEBASE.md`
This file. Explains the purpose of every file in the project.

---

## Backend (`backend/`)

The backend is a Laravel 11 REST API. Laravel follows the MVC pattern and uses an event/listener system to decouple business logic.

### `artisan`
The Laravel command-line entry point. Used to run database migrations, seed data, start the development server, generate application keys, and run any custom Artisan commands. Example: `php artisan serve`.

### `composer.json`
Defines the PHP project's metadata and dependencies. Specifies that the project requires Laravel Framework 11, Laravel Tinker (a REPL for interacting with the app), and development tools like Faker, PHPUnit, and Laravel Pint (a code formatter). Also defines the PSR-4 autoload mappings that tell PHP where to find the application's classes.

### `.env.example`
A template for the application's environment configuration. Contains all required environment variable keys with safe placeholder values. Developers copy this to `.env` and fill in their own values. Covers the application name, debug mode, database connection, queue driver, and the frontend URL used for CORS.

### `public/index.php`
The single entry point for all HTTP requests. Every request to the API passes through this file first. It boots the Composer autoloader, loads the Laravel application from `bootstrap/app.php`, and dispatches the incoming request. Also suppresses PHP 8.5 deprecation notices from vendor code to prevent them from being injected into JSON responses.

---

### `bootstrap/`

#### `bootstrap/app.php`
The application's main configuration file (introduced in Laravel 11). Registers the API, web, and console route files, configures the HTTP middleware stack (including CORS handling), and sets up global exception handling. This file replaces the `Kernel.php` file used in older Laravel versions.

#### `bootstrap/providers.php`
A simple array that lists all service providers the application should load. Currently registers only `AppServiceProvider`, which is where the event-to-listener bindings are wired up.

---

### `config/`

#### `config/database.php`
Configures all supported database connections: SQLite (the default for local development), MySQL, and PostgreSQL. Each connection reads its credentials from the `.env` file. SQLite requires no credentials — it just points to a local file path.

#### `config/cors.php`
Configures Cross-Origin Resource Sharing (CORS) for the API. Allows the React frontend (running on a different port) to make HTTP requests to the Laravel backend. Sets the allowed origins, methods, and headers. Currently set to allow all origins (`*`) for local development.

---

### `routes/`

#### `routes/api.php`
Defines all API routes. Maps HTTP methods and URL patterns to their corresponding controller methods. Contains four routes: listing users, creating a user, fetching a user's achievement summary, and recording a purchase. All routes are automatically prefixed with `/api` by Laravel.

#### `routes/web.php`
Handles web (browser) routes. Contains a single root route (`/`) that returns a JSON confirmation message indicating the API is running. Not used by the frontend.

#### `routes/console.php`
Defines custom Artisan console commands. Contains a built-in `inspire` command that prints a random quote. Not relevant to the application's core functionality.

---

### `app/Providers/`

#### `app/Providers/AppServiceProvider.php`
The application's main service provider. The `boot` method runs after all services are registered and is where the event-to-listener bindings are declared. Wires `UserMadePurchase` to `ProcessAchievements` and `BadgeUnlocked` to `ProcessCashback`, so Laravel knows which listener to call when each event is fired.

---

### `app/Http/Controllers/`

#### `app/Http/Controllers/Controller.php`
The abstract base class that all controllers extend. Empty by default — it exists so that other controllers can inherit from it and gain access to Laravel's controller utilities if needed in the future.

#### `app/Http/Controllers/Api/AchievementController.php`
Handles the `GET /api/users/{user}/achievements` endpoint. Receives a `User` model (automatically resolved from the route parameter by Laravel's route model binding) and delegates to `AchievementService` to build the loyalty summary. Returns the result as a JSON response.

#### `app/Http/Controllers/Api/PurchaseController.php`
Handles the `POST /api/users/{user}/purchases` endpoint. Validates the request (requires a numeric `amount`), creates a new `Purchase` record for the user, then fires the `UserMadePurchase` event to kick off the achievement and badge pipeline. Returns the new purchase and the user's updated total purchase count.

#### `app/Http/Controllers/Api/UserController.php`
Handles user listing (`GET /api/users`) and user creation (`POST /api/users`). Used by the frontend to populate the user selector dropdown and to create new demo users for testing.

---

### `app/Events/`

Events are plain data-carrier classes. They hold the information relevant to something that just happened and are fired into Laravel's event system using the `event()` helper.

#### `app/Events/UserMadePurchase.php`
Fired immediately after a purchase is saved to the database. Carries the `User` and `Purchase` instances so listeners have all the context they need to process achievements.

#### `app/Events/AchievementUnlocked.php`
Fired once for each achievement a user newly qualifies for after a purchase. Carries the `User` and `Achievement` instances. Can be used by any listener that needs to react to an achievement being unlocked (e.g. sending a notification).

#### `app/Events/BadgeUnlocked.php`
Fired once for each badge a user newly qualifies for after their achievements are updated. Carries the `User` and `Badge` instances. Listened to by `ProcessCashback` to trigger the cashback payment.

---

### `app/Listeners/`

Listeners contain the logic that runs in response to an event. They receive the event object and act on its data.

#### `app/Listeners/ProcessAchievements.php`
Listens for `UserMadePurchase`. When triggered, it delegates to `AchievementService::processUserPurchase()` which checks purchase and achievement thresholds and fires the appropriate `AchievementUnlocked` and `BadgeUnlocked` events. Implements `ShouldQueue` so it can be processed asynchronously when a queue worker is running.

#### `app/Listeners/ProcessCashback.php`
Listens for `BadgeUnlocked`. Simulates a ₦300 cashback payment to the user by writing a structured log entry to `storage/logs/laravel.log`. The log entry includes the user's details, the badge name, the amount, a unique transaction reference, and a success status. In a production system this is where the integration with Paystack, Flutterwave, or another payment provider would live.

---

### `app/Services/`

#### `app/Services/AchievementService.php`
The core business logic class for the loyalty program. Contains three methods:

- `processUserPurchase` : orchestrates the full achievement and badge check after a purchase
- `checkAndUnlockAchievements` : queries all achievements whose `required_purchases` threshold the user has met, filters out ones already unlocked, attaches new ones to the user, and fires `AchievementUnlocked` for each
- `checkAndUnlockBadges` : same logic but for badges, comparing the user's achievement count against each badge's `required_achievements` threshold
- `getUserAchievementsData` : builds the API response payload — lists unlocked achievement names, not-yet-unlocked achievement names, the user's current and next badge, and how many more achievements are needed to reach the next badge

---

### `app/Models/`

Models represent database tables and define how the application interacts with them. They also define relationships between tables.

#### `app/Models/User.php`
Represents the `users` table. Defines three relationships: `hasMany` purchases (a user can have many purchases), `belongsToMany` achievements through the `user_achievements` pivot table, and `belongsToMany` badges through the `user_badges` pivot table. Both pivot relationships include the `unlocked_at` timestamp column.

#### `app/Models/Purchase.php`
Represents the `purchases` table. Each record stores a user ID, a purchase amount, and an optional description. Belongs to a `User`. The `amount` column is cast to a decimal.

#### `app/Models/Achievement.php`
Represents the `achievements` table. Each record has a name, description, and `required_purchases` integer that defines how many purchases a user needs to unlock it. Has a `belongsToMany` relationship back to users through the pivot table.

#### `app/Models/Badge.php`
Represents the `badges` table. Each record has a name, description, and `required_achievements` integer that defines how many achievements a user needs to earn the badge. Has a `belongsToMany` relationship back to users through the pivot table.

---

### `database/migrations/`

Migrations are version-controlled database schema definitions. Running `php artisan migrate` executes them in chronological order to build the database structure.

#### `0001_01_01_000000_create_users_table.php`
Creates the `users` table with columns for name, email (unique), password, email verification timestamp, and a remember token for session management.

#### `2024_01_01_000001_create_purchases_table.php`
Creates the `purchases` table with a foreign key to `users`, a decimal `amount` column, and an optional `description` string.

#### `2024_01_01_000002_create_achievements_table.php`
Creates the `achievements` table with a unique `name`, a `description`, and an unsigned integer `required_purchases` threshold.

#### `2024_01_01_000003_create_badges_table.php`
Creates the `badges` table with a unique `name`, a `description`, and an unsigned integer `required_achievements` threshold.

#### `2024_01_01_000004_create_user_achievements_table.php`
Creates the `user_achievements` pivot table linking users to achievements. Stores the `unlocked_at` timestamp and enforces a unique constraint on the user/achievement pair to prevent duplicate entries.

#### `2024_01_01_000005_create_user_badges_table.php`
Creates the `user_badges` pivot table linking users to badges. Same structure as `user_achievements` — stores `unlocked_at` and enforces uniqueness per user/badge pair.

---

### `database/seeders/`

Seeders populate the database with initial or test data by running `php artisan db:seed`.

#### `database/seeders/DatabaseSeeder.php`
The root seeder that Laravel calls when `php artisan migrate --seed` or `php artisan db:seed` is run. Calls `AchievementSeeder` and `BadgeSeeder` in order, then creates two demo users (Alice Johnson and Bob Smith) using `firstOrCreate` so re-running the seeder does not create duplicates.

#### `database/seeders/AchievementSeeder.php`
Inserts the five achievement definitions into the `achievements` table: First Purchase (1), 5 Purchases (5), 10 Purchases (10), 25 Purchases (25), and 50 Purchases (50). Uses `firstOrCreate` so it is safe to run multiple times.

#### `database/seeders/BadgeSeeder.php`
Inserts the four badge definitions into the `badges` table: Beginner (0 achievements), Bronze (1), Silver (3), and Gold (5). Uses `firstOrCreate` for idempotency.

---

## Frontend (`frontend/`)

The frontend is a React 18 single-page application built with Vite. It fetches data from the Laravel API and renders the customer loyalty dashboard.

### `package.json`
Defines the frontend project's metadata and dependencies. Runtime dependencies are React, React DOM, and Axios (for HTTP requests). Dev dependencies include Vite and the React Vite plugin for the build toolchain.

### `vite.config.js`
Configures the Vite development server. Registers the React plugin for JSX support and sets up a proxy so any request to `/api` during development is forwarded to `http://localhost:8000`, avoiding CORS issues in the browser.

### `index.html`
The single HTML page served for all routes. Contains a `<div id="root">` element where React mounts the application, loads the Inter font from Google Fonts, and includes the `src/main.jsx` entry script.

### `.env.example`
Template for the frontend's environment variables. Contains `VITE_API_URL` which sets the base URL for all API requests. Vite exposes variables prefixed with `VITE_` to the client-side code.

---

### `src/main.jsx`
The JavaScript entry point. Creates the React root, wraps the app in `StrictMode` for development warnings, and renders the `App` component into the `#root` div.

### `src/App.jsx`
The root component. Currently renders the `Dashboard` page directly. Acts as the top-level component where routing or layout wrappers would be added if the app grows.

### `src/index.css`
Global stylesheet. Defines CSS custom properties (variables) for the colour palette, border radius, and shadows used across the app. Sets base styles for `body`, the scrollbar, and a screen-reader utility class.

---

### `src/api/achievements.js`
Centralises all HTTP communication with the backend. Creates a pre-configured Axios instance pointing to the API base URL (read from `VITE_API_URL` or defaulting to `http://localhost:8000/api`). Exports three functions:

- `fetchUsers` : calls `GET /api/users`
- `fetchUserAchievements` : calls `GET /api/users/{id}/achievements`
- `recordPurchase` : calls `POST /api/users/{id}/purchases`

---

### `src/components/`

Reusable UI components. Each is a pure presentational component that receives props and renders HTML.

#### `src/components/BadgeCard.jsx`
Displays the user's current badge. Shows a large emoji icon, the badge name styled in the badge's colour, and a line indicating the next badge and how many achievements away it is. If the user has reached the highest badge (Gold), it shows a completion message instead. Each badge has a configured colour and glow effect defined in a local `BADGE_CONFIG` map.

#### `src/components/AchievementGrid.jsx`
Renders all achievements (both unlocked and locked) in a responsive grid. Unlocked achievements are highlighted with a purple border and a coloured icon; locked ones are dimmed and greyscaled. Each achievement has a mapped emoji icon defined in a local `ACHIEVEMENT_ICONS` map. Shows a counter of how many achievements the user has unlocked out of the total.

#### `src/components/ProgressBar.jsx`
Shows the user's progress from their current badge threshold to the next badge's threshold as an animated horizontal bar. Calculates the fill percentage based on the number of achievements earned within the current tier's range. When the user has reached the maximum badge, the bar fills gold and shows a completion message.

#### `src/components/LoadingSpinner.jsx`
A simple full-page centred spinner shown while API data is loading. Renders a CSS-animated circle and an optional message string passed as a prop.

---

### `src/pages/`

#### `src/pages/Dashboard.jsx`
The main (and only) page of the application. Manages all state and data fetching logic. On mount it fetches the user list and selects the first user by default. When the selected user changes, it fetches that user's achievement data. Renders the header with a user selector dropdown, the `BadgeCard`, `ProgressBar`, and `AchievementGrid` components, an error banner for API failures, and a demo panel with a Simulate Purchase button that posts a purchase to the API and refreshes the dashboard in real time. Also manages a toast notification system for purchase confirmations and errors.
