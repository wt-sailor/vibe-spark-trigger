# Notification Demo Project

This repository contains a full-stack notification demonstration project, featuring multiple backend implementations and a modern React-based frontend. It showcases the integration of the `vibe-message` SDK for sending and receiving notifications.

## Project Structure

The project is divided into three main subfolders:

| Folder | Description | Tech Stack |
| :--- | :--- | :--- |
| [**`frontend-react`**](./frontend-react) | Modern web interface for managing and triggering notifications. | React, Vite, Tailwind CSS |
| [**`backend-nest`**](./backend-nest) | Current primary backend implementation. | NestJS, TypeScript, class-validator |
| [**`backend`**](./backend) | Original legacy backend implementation. | Node.js, Express, TypeScript |

---

## Subfolder Details

### 1. [Frontend (React)](./frontend-react)
A fast, responsive web application built with Vite and React.
- **Key Features**:
  - Integration with `vibe-message` SDK.
  - Real-time notification triggering and status display.
  - Styled with Tailwind CSS for a premium look and feel.
- **Setup**:
  ```bash
  cd frontend-react
  npm install
  npm run dev
  ```

### 2. [Backend (NestJS)](./backend-nest)
The recommended backend implementation, converted from the original Express version for better scalability and maintainability.
- **Key Features**:
  - Modular architecture.
  - Automated request validation using `class-validator`.
  - Robust environment configuration management.
- **Setup**:
  ```bash
  cd backend-nest
  npm install
  npm run start:dev
  ```

### 3. [Backend (Express - Legacy)](./backend)
The initial prototype backend using Express.
- **Key Features**:
  - Simple and lightweight.
  - Direct integration with `vibe-message`.
- **Setup**:
  ```bash
  cd backend
  npm install
  npm run dev
  ```

---

## Prerequisites

- **Node.js**: v18 or higher recommended.
- **npm**: v9 or higher.
- **Vibe Message Account**: You will need an App ID and Secret Key from the Vibe Message platform.

## Getting Started

1. Clone the repository.
2. Choose a backend implementation (`backend-nest` is recommended).
3. Set up the `.env` file in your chosen backend folder (refer to the folder's specific README).
4. Start the backend server.
5. Start the frontend application.

---

*This project was developed to demonstrate best practices in notification systems integration.*
