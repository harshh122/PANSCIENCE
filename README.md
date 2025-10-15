# PANSCIENCE - Task Manager (Full-stack)

A full-stack task management application built with React (frontend), Node.js & Express (backend), and MongoDB (database). This project allows users to register, log in, manage tasks, and view task details with authentication.

---

## Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Design Decisions](#design-decisions)

---

## Features
- User authentication (register/login)
- Create, read, update, and delete tasks
- Task details view
- JWT-based authorization
- File upload support (PDF)
- Local or cloud-based storage

---

## Requirements
- Node.js v18+
- MongoDB (local or Atlas)
- Docker & Docker Compose (optional)

---

## Setup Instructions

### Using Node.js
1. Clone the repository:
```bash
git clone https://github.com/harshh122/PANSCIENCE.git
cd PANSCIENCE
```
   
2. Install dependencies for server and client:
```bash
cd server
npm install
cd ../client
npm install
```


3. Create .env files in server/ and client/ directories:
```bash
# server/.env
PORT=5000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>


# client/.env
VITE_API_URL=http://localhost:5000/api
```


4. Run the application:
```bash
# Start backend
cd server
npm run dev
# Start frontend
cd ../client
npm run dev
```


5. Open the app at http://localhost:5173

# Using Docker

1. Copy .env files as above.

2. Run:
```bash
docker-compose up
```
---
# Project Structure
```bash
PANSCIENCE/
├─ client/             # React frontend
│  ├─ src/
│  │  ├─ pages/
│  │  ├─ components/
│  │  ├─ services/
│  │  └─ App.jsx
├─ server/             # Node.js + Express backend
│  ├─ controllers/
│  ├─ models/
│  ├─ routes/
│  ├─ middleware/
│  └─ server.js
├─ docker-compose.yml
└─ README.md
```
### Client: Handles UI, API requests, and routing.

### Server: Handles authentication, task management, and file uploads.

### Design decision: Separation of frontend and backend improves scalability and maintainability.
---
# API Documentation

API endpoints are documented using Postman.
Download Postman Collection
 (replace with actual link if uploaded)

Key endpoints:

- POST /api/auth/register - Register user

- POST /api/auth/login - Login user

- GET /api/tasks - Get all tasks

- POST /api/tasks - Create new task

- GET /api/tasks/:id - Get task details

- PUT /api/tasks/:id - Update task

- DELETE /api/tasks/:id - Delete task

  ---
 # Design Decisions

- React + Vite: Fast frontend build and modern hooks-based architecture.

- JWT Auth: Secure stateless authentication.

- MongoDB: Flexible schema for tasks and user data.

- Docker support: Simplifies deployment in different environments.

  ---
  
  



