# Parcel Processing Dashboard

## Overview
A full-stack parcel processing and distribution center management system built with React, Express, and MongoDB.

## Project Structure
- **Frontend**: React with Vite, located in `client/` directory
- **Backend**: Express server with CommonJS modules in `server/` directory
- **Database**: MongoDB (local instance managed by startup scripts)
- **Shared**: Common schemas and types in `shared/` directory

## Key Configuration
- The project uses a mixed module system:
  - Root package.json has `"type": "module"` for ES modules (required by vite.config.js)
  - Server and shared directories have their own package.json with `"type": "commonjs"` for CommonJS modules
- MongoDB is started automatically via the `start.sh` script
- Server binds to `0.0.0.0:5000` for Replit's proxy to work correctly
- Vite is configured with `allowedHosts: true` for Replit's iframe preview

## Development
- Run `npm run dev` to start the development server (via the Server workflow)
- The workflow automatically starts MongoDB and the Express server with Vite middleware
- Access the app through Replit's webview on port 5000

## Deployment
- Deployment type: VM (required for MongoDB state persistence)
- Build command: `npm run build`
- Run command: `bash production-start.sh`
- The production script starts MongoDB and runs the built application

## Important Files
- `start.sh`: Development startup script (starts MongoDB + dev server)
- `production-start.sh`: Production startup script (starts MongoDB + production server)
- `vite.config.js`: Vite configuration (ES module format)
- `server/package.json`: Marks server directory as CommonJS
- `shared/package.json`: Marks shared directory as CommonJS

## Recent Changes (2025-09-30)
- Set up for Replit environment
- Configured MongoDB to run locally
- Fixed module system compatibility (mixed ESM/CommonJS)
- Updated vite.config.js to proper ES module format
- Fixed client entry point reference (main.jsx)
- Configured server to bind to 0.0.0.0:5000
- Set up deployment configuration for Replit VM

Tasks :
1.	Unit Testing (Full Stack)
	•	Implement unit tests for both client and server.
	•	Use Jest / Mocha for backend, and React Testing Library for frontend.
	•	Ensure critical APIs and UI components are covered.
	2.	Remove Unnecessary Console Logs
	•	Clean up console.log() statements from both frontend and backend.
	•	Keep only meaningful logs (error handling, important events).
	•	Maintain logging best practices with proper levels (info, warn, error).
	3.	Add Department with Proper UI
	•	Create new Department management UI.
	•	Support CRUD operations (Add, View, Edit, Delete).
	•	Ensure integration with backend APIs.
	•	Follow consistent design with existing UI components.
	4.	Code Quality & Cleanup
	•	Refactor client code for readability and maintainability.
	•	Follow clean code principles (DRY, modularity, naming conventions).
	•	Apply ESLint + Prettier for consistent formatting.
	•	Ensure overall project quality for both client and server.