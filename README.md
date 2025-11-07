# Expense Tracker

A mobile expense tracking application built with React Native and Expo.

## Prerequisites

- **Node.js**: v20.19.4 or higher (v20 LTS recommended)
- **npm**: ≥ 9.0.0
- **Expo CLI**: Use `npx expo` (no global installation required)
- **TypeScript**: ~5.9.2
- **Expo SDK**: ~54.0

## Installation

Install project dependencies:

```bash
npm install
```

## Running the Application

### Development Server

Start the development server with cache cleared:

```bash
npx expo start -c
```

Or simply:

```bash
npm start
```

### Platform-Specific Builds

**Android:**
```bash
npm run android
# or
npx expo start --android
```

**iOS:**
```bash
npm run ios
# or
npx expo start --ios
```

**Web:**
```bash
npm run web
# or
npx expo start --web
```

## Type Checking

Verify TypeScript compilation without emitting files:

```bash
npx tsc --noEmit
```

## Project Structure

- `/app` - Application screens using Expo Router
- `/components` - Reusable UI components
- `/src/api` - API client and endpoints
- `/src/hooks` - Custom React hooks
- `/src/schemas` - Zod validation schemas
- `/src/types` - TypeScript type definitions
- `/src/utils` - Utility functions
- `/constants` - Theme and constants

## Backend API Server

This app requires a backend API server located in `../ExpenseTracker_api/`.

### Quick Start

```bash
# Navigate to API directory
cd ../ExpenseTracker_api

# Install dependencies
npm install --legacy-peer-deps

# Copy environment variables
cp .env.example .env

# Start PostgreSQL database
docker-compose up -d postgres

# Run database migrations
npx prisma migrate dev

# Seed default categories
npm run prisma:seed

# Start API server
npm run start:dev
```

The API will run at `http://localhost:3000` with Swagger docs at `http://localhost:3000/api/docs`.

For detailed API documentation, see [ExpenseTracker_api/README.md](../ExpenseTracker_api/README.md).

## Notes

- Ensure you're using Node.js v20.19.4 or higher to avoid engine compatibility warnings.
- The project uses Expo Router for file-based routing.
- State management is handled via TanStack Query (React Query).
- The backend API must be running for the app to function properly.
