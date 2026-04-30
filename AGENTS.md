# Repository Guidelines

## Project Structure & Module Organization
This is a full-stack Next.js 14 application using the App Router.
- **`app/`**: Contains all routes and API endpoints. Follows Next.js file-based routing.
- **`lib/`**: Houses singleton clients for third-party services like **Prisma**, **Stripe**, and **Supabase**, as well as core utility functions.
- **`prisma/`**: Defines the database schema (`schema.prisma`) and contains the data seeder.
- **`components/`**: Reusable UI components, organized by feature or layout.
- **`styles/`**: Global styles using Tailwind CSS.

## Build, Test, and Development Commands
The project uses `npm` for dependency management and scripts.
- **`npm run dev`**: Start the development server.
- **`npm run build`**: Create a production build.
- **`npm run lint`**: Run ESLint checks via Next.js.
- **`npm run db:generate`**: Generate the Prisma client.
- **`npm run db:push`**: Push schema changes to the Supabase database.
- **`npm run db:seed`**: Populate the database with demo data.
- **`npm run db:studio`**: Open Prisma Studio to browse data.

## Coding Style & Naming Conventions
- **TypeScript**: Strict mode is enabled. Use explicit types where possible.
- **Path Aliases**: Use `@/*` to reference the project root (e.g., `import { prisma } from "@/lib/prisma"`).
- **Styling**: Use **Tailwind CSS** for all styling. Follow the existing patterns in `styles/globals.css`.
- **API Routes**: Implement API logic within `app/api/` using Next.js Route Handlers.

## Testing Guidelines
There is currently no testing framework configured in this repository.

## Commit & Pull Request Guidelines
This repository is not initialized as a Git repository. If Git is added, follow standard descriptive commit messages (e.g., "feat: add user profile page").
