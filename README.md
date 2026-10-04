# Inktale

Inktale is a fully responsive blog application built with Express, MongoDB, and EJS. It features a mobile-first design, user authentication, and a variety of functionalities for managing blogs and user profiles.

- **Live Demo**: [inktale-blog.onrender.com](https://inktale-blog.onrender.com)

## Troubleshooting

- **Server Not Responding**: The Render free tier may cause slower response times if the server has been idle. Refresh the page or wait a few moments for it to start.

## Features

- **Responsive Design**: Designed with a mobile-first approach to ensure optimal viewing across all devices.

- **User Authentication**: Register and log in using sessions.

- **Blog Management**: Create, update, and delete blogs.

- **Dashboard**: View total visits, reactions, and published articles. Manage your blogs with options to edit or delete.

- **Blog Interaction**: See likes and bookmarks on each blog. Like and bookmark blogs.

- **Bookmark Page**: View and manage all the blogs you have bookmarked.

- **Settings Page**: Edit basic info including profile photo, full name, username, email, and short bio. Change your password or delete your account.

- **Markdown Support**: Create blogs with banner images and write content in Markdown format.

## Tech Stack

- **Runtime**: Node.js 20.8+
- **Language**: TypeScript 7 (strict mode) + ESM (`"type": "module"`)
- **Framework**: Express 5
- **Database**: MongoDB via Mongoose 9
- **Templating**: EJS 6
- **Sessions**: `express-session` + `connect-mongo` (MongoDB-backed store)
- **Auth**: bcrypt 6 password hashing
- **Validation**: server-side image size checks via `multer` 2 + a custom `image-config`
- **Uploads**: multipart file handling via `multer` 2, assets hosted on Cloudinary
- **Markdown**: `markdown-it` 15 + `highlight.js`
- **Security**: `cors`, `express-rate-limit` 8 (per-IP window limiting)
- **Compression**: `compression` middleware (gzip/deflate/brotli)
- **Dev toolchain**: `tsx` (ESM-native TS runner), `tsc` (build), `pnpm`

## Requirements

- **Node.js** >= 20.8
- **pnpm** >= 9 (`npm install -g pnpm`)
- A MongoDB instance (local or Atlas)
- A Cloudinary account (free tier is fine)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/billalben/inktale-blog.git
   ```

2. Navigate to the project directory:
   ```bash
   cd inktale-blog
   ```

3. Install dependencies with pnpm:
   ```bash
   pnpm install
   ```

4. Create a `.env` file in the project root and add the required environment variables:
   ```bash
   PORT=3000

   MONGO_CONNECTION_URI=your_mongodb_connection_string

   CORS_ORIGIN=http://localhost:3000

   SESSION_SECRET=a_long_random_string
   SESSION_MAX_AGE=604800000

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   `SESSION_MAX_AGE` is in milliseconds (the default above is 7 days).

5. Run the application:

   ```bash
   pnpm dev          # development with hot reload (tsx watch)
   pnpm build        # compile TypeScript → dist/
   pnpm start        # run compiled production build (node dist/server.js)
   pnpm typecheck    # type-check without emitting
   ```

6. Open your browser and navigate to `http://localhost:3000`.

## Project Structure

The codebase follows a **feature-module** layout. Each module owns its routes, controllers, services, models, and types. Cross-cutting concerns live under `shared/`.

```
src/
├── app.ts                      # Express wiring (middleware → routes → error)
├── server.ts                   # Entry point: dotenv → connect DB → listen
│
├── shared/
│   ├── config/
│   │   ├── env.ts              # Typed env loader (fails fast on missing vars)
│   │   ├── mongoose.ts         # connectDB / disconnectDB
│   │   ├── cloudinary.ts       # uploadToCloudinary / deleteFromCloudinary
│   │   ├── markdown.ts         # MarkdownIt instance + highlight.js
│   │   └── image-config.ts     # Banner / profile photo size limits
│   ├── middlewares/
│   │   ├── error.ts            # Global error handler
│   │   ├── rate-limiter.ts     # express-rate-limit instance
│   │   ├── session.ts          # express-session + connect-mongo store
│   │   └── upload.ts           # multer disk-storage factory
│   ├── types/
│   │   └── express.d.ts        # Module augmentation for SessionData.user
│   └── utils/
│       ├── pagination.ts       # getPagination()
│       ├── reading-time.ts     # getReadingTime()
│       └── username.ts         # generateUsername()
│
└── modules/
    ├── auth/                   # Register, login, logout, requireAuth
    │   ├── auth.routes.ts
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── auth.middleware.ts
    │   ├── auth.types.ts
    │   └── index.ts            # Barrel: { authRouter, requireAuth }
    │
    ├── user/                   # Profile, dashboard, settings, User model
    │   ├── user.model.ts
    │   ├── user.routes.ts
    │   ├── user.controller.ts
    │   ├── user.service.ts
    │   ├── user.types.ts
    │   └── index.ts
    │
    └── blog/                   # Home, detail, CRUD, reactions, reading-list, visits, Blog model
        ├── blog.model.ts
        ├── blog.routes.ts
        ├── blog.controller.ts
        ├── blog.service.ts
        ├── blog.types.ts
        ├── reaction.routes.ts
        ├── reaction.controller.ts
        ├── reaction.service.ts
        ├── reading-list.routes.ts
        ├── reading-list.controller.ts
        ├── reading-list.service.ts
        ├── visit.routes.ts
        ├── visit.controller.ts
        ├── visit.service.ts
        └── index.ts

views/                          # EJS templates (layouts, pages, partials)
public/                         # Static assets (css, images, js)
```

## Architecture Notes

- **Thin controllers**: HTTP shape only (parse request, call service, format response).
- **Services**: Own business logic and return either a typed result or a discriminated-union error.
- **Strict TypeScript**: `strict: true` + `noUncheckedIndexedAccess` + `verbatimModuleSyntax`. No `any` casts.
- **ESM imports** throughout (`import`/`export`, no `require`).
- **Discriminated error unions**: service errors are tagged unions (e.g. `{ code: "not_found" }` | `{ code: "banner_too_large"; message: string }`), narrowed with `switch`.
- **Auth-gated routes** apply `requireAuth` at the router level (no global auth middleware).

## Scripts

| Script              | What it does                                                |
|---------------------|-------------------------------------------------------------|
| `pnpm dev`          | Run with hot reload via `tsx watch src/server.ts`           |
| `pnpm build`        | `tsc` → `dist/`, then copy EJS views into `dist/views/`     |
| `pnpm start`        | Run the compiled build (`node dist/server.js`)              |
| `pnpm typecheck`    | `tsc --noEmit` — type-check without producing output        |

## Contributing

Feel free to fork the repository and submit pull requests. Contributions are welcome!
