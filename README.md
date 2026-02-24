# 🎬 CineStream

> A personal learning project — A movie streaming web application built with **.NET 9** (backend) and **React 19** (frontend).
> Movie data is fetched from the external [Ophim API](https://ophim1.com) and streamed via a custom HLS video player.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Notes](#notes)

---

## Overview

CineStream is a personal project built to practice end-to-end web development, including:

- A **REST API** serving movie data, user authentication, and watch history
- A **frontend UI** for browsing movies, playing HLS video streams, and managing authentication state

---

## Features

### Backend
- User registration and login with BCrypt password hashing
- JWT Access Token + Refresh Token authentication flow
- Role-based authorization (**Admin / User**)
- Ophim API integration to fetch movies, genres, and countries
- In-memory caching (`IMemoryCache`) for API responses
- Watch history tracking per user per episode
- Image upload to Cloudinary
- Admin Dashboard statistics (User counts, Top movies, Active views)
- Global application settings management
- Clean Architecture (Domain → Application → Infrastructure → API)
- Repository Pattern for data access layer

### Frontend
- Home page with dynamic Hero Section and categorized movie sliders
- Expanding hover card (React Portal) for quick movie previews
- Full cinematic watch page:
  - Server and episode selector
  - Cast sidebar and movie recommendations
  - YouTube trailer fallback for upcoming movies
- Custom HLS video player (video.js):
  - Quality selector (Auto / 720p / 1080p)
  - Playback speed control (0.5x → 2x)
  - Progress bar with buffered track
  - Keyboard shortcuts: `Space/K` Play/Pause · `L/J` Seek · `F` Fullscreen · `M` Mute · `↑↓` Volume
- Advanced movie search with filter panel (Genre, Country, Type, Year)
- Admin Dashboard UI:
  - Overview statistics charts
  - User management table (Role modification, Password reset, Deletion)
- Glassmorphism floating navbar with dynamic Genre, Country, and List dropdowns
- Login / Register with persistent auth state (Zustand + localStorage)

---

## Tech Stack

### Backend

| Component | Technology |
|-----------|-----------|
| Framework | ASP.NET Core 9 |
| ORM | Entity Framework Core 9 |
| Database | MySQL 8 (Pomelo.EntityFrameworkCore.MySql) |
| Authentication | JWT Bearer (System.IdentityModel.Tokens.Jwt) |
| Password Hashing | BCrypt.Net-Next |
| Cloud Storage | CloudinaryDotNet |
| Caching | IMemoryCache |
| Architecture | Clean Architecture + Repository Pattern |

### Frontend

| Component | Technology |
|-----------|-----------|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| State Management | Zustand |
| HTTP Client | Axios |
| Video Player | video.js + videojs-contrib-quality-levels |
| Icons | Lucide React |
| Routing | React Router v7 |

---

## Project Architecture

```
cinestream/
├── backend/
│   └── src/
│       ├── Cinestream.Domain/              # Domain layer — pure entities, no dependencies
│       │   └── Entities/
│       │       ├── User.cs
│       │       ├── WatchHistory.cs
│       │       └── Favorite.cs
│       │
│       ├── Cinestream.Application/         # Application layer — interfaces, DTOs, contracts
│       │   ├── DTOs/
│       │   │   ├── Auth/                   # RegisterRequest, LoginRequest, AuthResponse, RefreshRequest
│       │   │   ├── MovieApi/               # MovieListResponse, MovieDetailResponse, PaginationDto, CategoryDTO...
│       │   │   └── WatchHistory/           # WatchHistoryDto
│       │   └── Interfaces/
│       │       ├── Services/               # IAuthService, IMovieService, IWatchHistoryService, ICloudinaryService
│       │       ├── Repositories/           # IUserRepository, IWatchHistoryRepository, IFavoriteRepository
│       │       └── Common/                 # IJwtTokenGenerator, IPasswordHasher
│       │
│       ├── Cinestream.Infrastructure/      # Infrastructure layer — concrete implementations
│       │   ├── Data/
│       │   │   ├── AppDbContext.cs
│       │   │   └── Migrations/
│       │   ├── Services/                   # AuthService, WatchHistoryService
│       │   ├── Repositories/               # UserRepository, WatchHistoryRepository, FavoriteRepository
│       │   ├── Common/                     # JwtTokenGenerator, PasswordHasher
│       │   └── ExternalServices/           # MovieService (Ophim), CloudinaryService
│       │
│       └── Cinestream.API/                 # API layer — controllers, DI, middleware
│           ├── Controllers/
│           │   ├── AuthController.cs
│           │   ├── MoviesController.cs
│           │   ├── WatchHistoryController.cs
│           │   ├── UploadController.cs
│           │   ├── AdminController.cs      # New: Admin stats and user management
│           │   └── SettingsController.cs   # New: Global app settings
│           ├── appsettings.json            # ⚠️ Not committed — see appsettings.example.json
│           ├── appsettings.example.json
│           └── Program.cs
│
└── frontend/
    └── src/
        ├── app/                            # AppLayout, router config
        ├── components/
        │   ├── common/                     # LoadingSpinner
        │   └── layout/                     # Navbar, NavbarSearch, Footer
        ├── features/
        │   ├── movies/
        │   │   ├── components/             # MovieCard, MovieSlider, HoverDetailPortal
        │   │   ├── pages/                  # HomePage, SearchPage, WatchPage
        │   │   └── services/               # movieService.js
        │   ├── admin/                      # New: Admin feature module
        │   │   ├── components/             # AdminStats, UserTable
        │   │   ├── pages/                  # AdminDashboard, UserManagement
        │   │   └── services/               # adminService.js
        │   └── player/
        │       └── components/             # VideoPlayer.jsx
        ├── store/                          # useAuthStore.js (Zustand)
        └── utils/                          # axiosClient.js
```

---

## Database Schema

The database is **MySQL 8**, managed via Entity Framework Core Migrations.

### `Users`

| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| `Id` | `CHAR(36)` | PRIMARY KEY | Auto-generated GUID |
| `Email` | `VARCHAR(255)` | NOT NULL, UNIQUE | Login email |
| `PasswordHash` | `TEXT` | NOT NULL | BCrypt hash of the user's password |
| `DisplayName` | `VARCHAR(100)` | NOT NULL | Display name |
| `AvatarUrl` | `TEXT` | NULL | Cloudinary image URL |
| `RefreshTokenHash` | `TEXT` | NULL | Current refresh token value |
| `RefreshTokenExpiry` | `DATETIME` | NULL | Expiry date of the refresh token |
| `Role` | `INT` | NOT NULL | User role (0: User, 1: Admin) |
| `CreatedAt` | `DATETIME` | NOT NULL | Account creation timestamp |
| `UpdatedAt` | `DATETIME` | NOT NULL | Last update timestamp |

---

### `AppSettings`

| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| `Key` | `VARCHAR(255)` | PRIMARY KEY | Setting identifier |
| `Value` | `TEXT` | NOT NULL | JSON string of the setting value |
| `UpdatedAt` | `DATETIME` | NOT NULL | Last update timestamp |

---

### `WatchHistories`

| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| `Id` | `INT` | PRIMARY KEY, AUTO_INCREMENT | |
| `UserId` | `CHAR(36)` | FOREIGN KEY → Users.Id | Owner of the history record |
| `MovieId` | `VARCHAR(255)` | NOT NULL | Movie slug from Ophim API |
| `Episode` | `VARCHAR(100)` | NULL | Episode name (null for single movies) |
| `WatchedTimeInSeconds` | `INT` | NOT NULL | Seconds watched |
| `IsCompleted` | `TINYINT(1)` | NOT NULL | Whether the episode was fully watched |
| `LastWatchedAt` | `DATETIME` | NOT NULL | Timestamp of last watch activity |

---

### `Favorites`

| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| `Id` | `INT` | PRIMARY KEY, AUTO_INCREMENT | |
| `UserId` | `CHAR(36)` | FOREIGN KEY → Users.Id | Owner of the favorite record |
| `MovieId` | `VARCHAR(255)` | NOT NULL | Movie slug from Ophim API |
| `AddedAt` | `DATETIME` | NOT NULL | Timestamp when the movie was favorited |

---

### Relationships

```
Users (1) ──────< WatchHistories (N)
Users (1) ──────< Favorites (N)
```

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Request Body | Description | Auth Required |
|--------|----------|--------------|-------------|:---:|
| POST | `/register` | `{ email, password, displayName }` | Register a new account | ❌ |
| POST | `/login` | `{ email, password }` | Login and receive tokens | ❌ |
| POST | `/refresh` | `{ token, refreshToken }` | Refresh the access token | ❌ |

**Example response from `/login`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "base64EncodedRandomBytes...",
  "displayName": "John Doe",
  "avatarUrl": null,
  "email": "john@example.com"
}
```

---

### Movies — `/api/movies`

| Method | Endpoint | Query Params | Description | Auth Required |
|--------|----------|-------------|-------------|:---:|
| GET | `/new` | `page` | Get latest movies | ❌ |
| GET | `/detail/{slug}` | — | Get movie detail + episode list | ❌ |
| GET | `/search` | `keyword`, `page` | Search movies by name | ❌ |
| GET | `/filter` | `type`, `genre`, `country`, `year`, `page` | Filter movies | ❌ |
| GET | `/country/{slug}` | `page` | Movies by country | ❌ |
| GET | `/categories` | — | All genres | ❌ |
| GET | `/countries` | — | All countries | ❌ |

---

### Watch History — `/api/watch-history`

| Method | Endpoint | Request Body | Description | Auth Required |
|--------|----------|--------------|-------------|:---:|
| GET | `/` | — | Get current user's watch history | ✅ JWT |
| POST | `/` | `{ movieId, episode, watchedTimeInSeconds, isCompleted }` | Save watch progress | ✅ JWT |

---

### Admin — `/api/admin`

| Method | Endpoint | Request Body | Description | Auth Required |
|--------|----------|--------------|-------------|:---:|
| GET | `/stats` | — | Get overall application statistics | ✅ Admin |
| GET | `/users` | — | Get all users (admin view) | ✅ Admin |
| PUT | `/users/{id}/role` | `{ role }` | Update user role | ✅ Admin |
| PUT | `/users/{id}/password` | `{ newPassword }` | Admin-forced password reset | ✅ Admin |
| DELETE | `/users/{id}` | — | Delete a user | ✅ Admin |

---

### Settings — `/api/settings`

| Method | Endpoint | Request Body | Description | Auth Required |
|--------|----------|--------------|-------------|:---:|
| GET | `/{key}` | — | Get a global setting value | ❌ |
| PUT | `/{key}` | `object` | Update a global setting | ✅ Admin |

---

### Upload — `/api/upload`

| Method | Endpoint | Request Body | Description | Auth Required |
|--------|----------|--------------|-------------|:---:|
| POST | `/` | `multipart/form-data` | Upload image to Cloudinary | ✅ JWT |

---

## Getting Started

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 20+](https://nodejs.org)
- MySQL 8+
- [Cloudinary](https://cloudinary.com) account (free tier is sufficient)

---

### Backend

```bash
# 1. Navigate to the backend folder
cd cinestream/backend

# 2. Create your local config from the example
copy src\Cinestream.API\appsettings.example.json src\Cinestream.API\appsettings.json

# 3. Fill in your real values in appsettings.json
#    (see Environment Variables section below)

# 4. Apply database migrations
dotnet ef database update --project src/Cinestream.Infrastructure --startup-project src/Cinestream.API

# 5. Start the API server
dotnet run --project src/Cinestream.API
# API runs at: http://localhost:5210
```

---

### Frontend

```bash
# 1. Navigate to the frontend folder
cd cinestream/frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
# App runs at: http://localhost:5173
```

---

## Environment Variables

### Backend — `appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=cinestream_db;User=YOUR_USER;Password=YOUR_PASSWORD;"
  },
  "JwtSettings": {
    "Secret": "YOUR_JWT_SECRET_MINIMUM_32_CHARACTERS_LONG",
    "Issuer": "CinestreamApp",
    "Audience": "CinestreamUsers",
    "ExpiryDays": 7
  },
  "Cloudinary": {
    "CloudName": "YOUR_CLOUD_NAME",
    "ApiKey": "YOUR_API_KEY",
    "ApiSecret": "YOUR_API_SECRET"
  },
  "MovieApi": {
    "BaseUrl": "https://ophim1.com",
    "ImageBaseUrl": "https://img.ophim.live/uploads/movies"
  }
}
```

> ⚠️ `appsettings.json` is listed in `.gitignore` and must **never** be committed to the repository.

---

## Notes

- All movie data is fetched from a third-party API ([Ophim](https://ophim1.com)). No movie content is stored in this project's database.
- This is a personal learning project and is not intended for commercial use.