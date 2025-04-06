# Task Manager Application

A full-stack Task Manager application built with Angular and .NET Core.

## Features

- User Authentication (Login/Register)
- Task Management (CRUD operations)
- Task Priority Levels
- Task Status Tracking
- Responsive UI

## Tech Stack

### Frontend
- Angular 17
- TypeScript
- Bootstrap
- JWT Authentication

### Backend
- .NET Core 7.0
- Entity Framework Core
- SQL Server
- JWT Authentication

## Prerequisites

- Node.js (v18 or later)
- .NET SDK 7.0
- SQL Server
- Visual Studio 2022 or VS Code

## Setup Instructions

### Frontend Setup
1. Navigate to the Angular project directory:
   ```bash
   cd angular
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   ng serve
   ```
4. Access the application at: http://localhost:4200

### Backend Setup
1. Navigate to the API project directory:
   ```bash
   cd TaskManager.API
   ```
2. Update the connection string in appsettings.json
3. Run the application:
   ```bash
   dotnet run
   ```
4. The API will be available at: http://localhost:5001

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Tasks
- GET /api/task - Get all tasks
- GET /api/task/{id} - Get specific task
- POST /api/task - Create new task
- PUT /api/task/{id} - Update task
- DELETE /api/task/{id} - Delete task

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 