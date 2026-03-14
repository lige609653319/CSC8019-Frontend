# React Management Dashboard - Running Documentation

This is a premium management dashboard built using Vite, React, TypeScript, and Ant Design.

## Features
- ✨ **Enterprise UI**: Standard professional UI styles powered by Ant Design.
- 📊 **Dynamic Dashboard**: Overview of key metrics using Statistic cards and responsive grid.
- 👥 **User Management**: A feature-rich table for managing users with status tags and actions.
- 🧭 **Standard Layout**: Professional fixed Sider and sticky Header architecture.

## Requirements
- **Node.js**: v16.0.0 or higher is recommended.
- **npm**: v7.0.0 or higher is recommended.

## Quick Start

### 1. Project Directory
Ensure you are in the project root directory: `/Users/lige2333/IdeaProjects/csc8019-staff`.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Once started, you can access the dashboard via the URL shown in your console (typically `http://localhost:5173`).

### 4. Build for Production
```bash
npm run build
```
The production-ready files will be generated in the `dist` directory.

## Project Structure
- `src/components`: UI Views and components (Sidebar, Header, Dashboard, UsersTable).
- `src/App.tsx`: Main application shell, theme configuration, and navigation logic.
- `src/index.css`: Global base styles and Ant Design theme overrides.

## API requests (authentication)

Login and authentication are enabled. For any HTTP request to the backend:

- **Use the shared client**: `import request from '@/utils/request';` (or the correct relative path, e.g. `'../../utils/request'`).
- Use `request.get()`, `request.post()`, etc. Do not create a new axios instance for API calls.
- The **Authorization** (JWT) header is already set in `src/utils/request.ts` when a token exists in `localStorage`, so you do not need to add it manually.

## Tech Stack
- **React 18**
- **TypeScript**
- **Vite**
- **Ant Design** (UI Framework)
- **Ant Design Icons**
