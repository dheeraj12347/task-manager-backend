📌 Task Manager Backend

A simple Task Manager App backend built with Node.js, Express, and MySQL, featuring user authentication (JWT) and task management (CRUD).
This project was built as part of a short assignment requirement.

🚀 Features

User Authentication

Register new users

Login with JWT-based authentication

Task Management

Add new tasks

Edit and update tasks

Delete tasks

Toggle task status (Pending/Completed)

Database Integration

MySQL for persistent storage

Deployment

Deployed on Railway

🛠 Tech Stack

Backend: Node.js, Express

Authentication: JWT (JSON Web Token), bcryptjs

Database: MySQL (mysql2 driver)

Deployment: Railway

📂 Project Structure
backend/
│── middleware/
│   └── auth.js          # Middleware for JWT authentication
│── routes/
│   ├── auth.mjs         # User authentication routes
│   └── tasks.mjs        # Task CRUD routes
│── db.mjs               # Database connection (MySQL)
│── server.mjs           # Main Express server
│── package.json         # Dependencies and scripts
│── .env                 # Environment variables

⚙️ Installation & Setup

Clone the repository:

git clone https://github.com/dheeraj12347/task-manager-backend.git
cd task-manager-backend


Install dependencies:

npm install


Configure environment variables in .env:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=task_manager_db
JWT_SECRET=your_jwt_secret
PORT=5000


Start the server:

npm start

🗄 Database Schema
Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Tasks Table
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

📌 API Endpoints
Auth Routes

POST /api/auth/register → Register a new user

POST /api/auth/login → Login and receive JWT

Task Routes (Protected)

GET /api/tasks → Get all tasks for logged-in user

POST /api/tasks → Create a new task

PUT /api/tasks/:id → Update a task

DELETE /api/tasks/:id → Delete a task



Toggling status

Deployment link + GitHub repo
