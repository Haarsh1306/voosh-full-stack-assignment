# Task Manager Application - Full-Stack Developer Challenge

This project is a task management application similar to Trello, built for the Full-Stack Developer Challenge. Users can sign in/sign up (including via Google), create, update, and manage tasks, and move tasks between different columns using drag-and-drop functionality.

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Installation](#installation)
- [Routes](#routes)
- [Live Link](#live-link)


## Project Overview

The application frontend is built using React, Tailwind CSS, while the backend is powered by Node.js with Express. It provides a user-friendly interface for managing tasks with drag-and-drop functionality, allowing users to seamlessly organize tasks within columns.

## Key Features

- User authentication (sign in / sign up) with email and Google
- Create, update, and manage tasks
- Drag-and-drop tasks between columns
- View tasks in a categorized manner across different columns
- Functionality to update task details
- Error handling and validation on client and server-side

## Installation

To get started with the project, follow these steps:

1. Clone the Repository
   ```bash
   git clone https://github.com/Haarsh1306/voosh-full-stack-assignment.git
   ```
2. Start frontend development server
   ```cd frontend
   npm install
   npm run dev
   ```
3. Start backend development server
   ``` cd backend
   npm install
   node app.js

# Application Routes

## Authentication

- **`/login`**: Endpoint for existing users to log in.

- **`/signup`**: Endpoint for new users to register.

## Task Management

- **`/dashboard`**: Dashboard to manage todos

# Live Link 
https://voosh-full-stack-assignment-frontend.vercel.app

