# NestJS Notification Backend

This is a NestJS conversion of the original Express-based notification backend.

## Features
- **NestJS Framework**: Modular and scalable architecture.
- **Vibe Message Integration**: Uses `vibe-message` SDK to send notifications.
- **Validation**: Global `ValidationPipe` with `class-validator` for API requests.
- **Configuration**: Uses `@nestjs/config` for environment variable management.

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Ensure the `.env` file exists in the root of this folder with the following keys:
   - `VIBE_MESSAGE_APP_ID`
   - `VIBE_MESSAGE_SECRET_KEY`
   - `VIBE_MESSAGE_URL`
   - `PORT` (defaults to 5000)

3. **Run the Application**:
   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run start:prod
   ```

## API Endpoints

### GET /
Returns a status message indicating the API is running.

### POST /api/send-notification
Sends a notification via Vibe Message.

**Body Structure:**
```json
{
  "title": "Notification Title",
  "body": "Notification Body",
  "icon": "/optional-icon.png",
  "clickAction": "/",
  "silent": false,
  "externalUsers": ["user1", "user2"],
  "data": { "key": "value" }
}
```
