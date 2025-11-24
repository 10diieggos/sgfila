# Gemini Project Overview: SGFILA v3

## Project Overview

This project is a queue management system named SGFILA, currently at version 3.0. It's a complete rewrite of a previous system, built with a modern, type-safe stack.

The architecture is a monorepo containing three main parts:
- **Server:** A Node.js backend using TypeScript, Express for the web server, and Socket.IO for real-time communication. It manages the application state, queue logic, and statistics, persisting data to a `dados.json` file.
- **Client:** A Vue 3 single-page application built with Vite and written in TypeScript. It provides the user interface for operators to manage queues, issue tickets, and view statistics.
- **Shared:** A dedicated directory for TypeScript types and interfaces that are shared between the client and server, ensuring type safety across the entire application.
- **E2E:** An end-to-end testing suite using Playwright.

The system is designed to run in an offline, local network environment without internet access.

## Building and Running

### Prerequisites
- Node.js v18+
- npm

### 1. Installation

The project is divided into separate packages for the server, client, and E2E tests, each with its own dependencies.

- **Install Server Dependencies:**
  ```bash
  cd v3/server
  npm install
  ```

- **Install Client Dependencies:**
  ```bash
  cd v3/client
  npm install
  ```

- **Install E2E Test Dependencies:**
  ```bash
  cd v3/e2e
  npm install
  ```

### 2. Running in Development Mode

For development, you need to run the server and the client in separate terminals.

- **Run the Server:**
  ```bash
  cd v3/server
  npm run dev:win
  ```
  The server will start on `http://localhost:3000`.

- **Run the Client:**
  ```bash
  cd v3/client
  npm run dev:win
  ```
  The client development server will start on `http://localhost:5173`. You can access the application by opening this URL in your browser.

### 3. Running Tests

- **Unit/Integration Tests (Server):**
  ```bash
  cd v3/server
  npm test
  ```

- **End-to-End Tests:**
  The E2E tests require both the client and server to be running.
  ```bash
  cd v3/e2e
  npm test
  ```
  To run a specific test file:
  ```bash
  cd v3/e2e
  npm test specs/your-test-file.spec.ts
  ```

### 4. Building for Production

- **Build the Client:**
  ```bash
  cd v3/client
  npm run build
  ```

- **Build the Server:**
  ```bash
  cd v3/server
  npm run build
  ```

- **Run in Production:**
  After building, the server can be started, and it will serve the built client files.
  ```bash
  cd v3/server
  npm start
  ```
  The application will be available at `http://localhost:3000`.

## Development Conventions

- **TypeScript:** The entire project is written in TypeScript, with shared types in `v3/shared` to ensure consistency.
- **Component-Based Architecture:** The Vue client is built with small, single-responsibility components located in `v3/client/src/components`.
- **Composables:** Reusable logic in the client is extracted into composables (e.g., `useSocket.ts`) in `v3/client/src/composables`.
- **Linting & Type-Checking:** The project uses ESLint and `vue-tsc` for code quality and type-checking. Use `npm run lint` and `npm run type-check` in both client and server directories.
- **Testing:** The server has unit tests with Jest. The application as a whole is tested with Playwright for end-to-end scenarios.
- **Modularity:** The server logic is modular, with services for state management (`StateManager.ts`), queue operations (`QueueService.ts`), and statistics (`StatisticsService.ts`).
- **Real-time Communication:** All real-time communication between client and server is handled via Socket.IO, with event handlers clearly defined in `v3/server/src/socket/SocketHandlers.ts`.
