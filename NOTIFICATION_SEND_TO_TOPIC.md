# Notification System - Send to Topic Feature

## What Was Done

### Backend Changes ✅

1. **Created Firebase Admin Helper** (`/home/marwan/basma-app/basma-backend/src/controllers/firebase/firebase-admin.js`)
   - Exports a function to get Firebase Admin messaging instance

2. **Added Send-to-Topic Controller** (`notificationController.ts`)
   - New endpoint: `POST /api/v1/notifications/send-to-topic`
   - Accepts: `{ topic, title, body, data? }`
   - Returns: `{ success, messageId }`

3. **Updated Routes** (`notificationRoutes.ts`)
   - Added route for `/send-to-topic`

4. **Registered Routes** (`app.ts`)
   - Enabled `/api/v1/notifications` routes

### Frontend Changes ✅

1. **Updated Types** (`src/types/notifications.ts`)
   - Added `SendToTopicRequest` interface
   - Added `SendToTopicResponse` interface

2. **Added API Function** (`src/apis/notifications.ts`)
   - Created `sendToTopic()` function
   - Calls `POST /api/v1/notifications/send-to-topic`

3. **Added Hook** (`src/hooks/useNotifications.ts`)
   - Created `useSendToTopic()` hook using React Query

4. **Created UI Component** (`send-notification-form.tsx`)
   - Form to send notifications to topics
   - Select topic from dropdown
   - Enter title and body
   - Send button with loading state

5. **Updated Settings Page** (`page.tsx`)
   - Added SendNotificationForm component
   - Displays above topic subscriptions

## How to Use

### 1. Start the Backend
```bash
cd /home/marwan/basma-app/basma-backend
npm run dev
```

### 2. Start the Frontend
```bash
cd /home/marwan/basma-app/basma-admin-dashboard
npm run dev
```

### 3. Send a Notification

1. Navigate to: **Dashboard → Settings → Notifications**
2. Scroll to "إرسال إشعار إلى موضوع" card
3. Select a topic (e.g., "job-hunting")
4. Enter a title (e.g., "وظيفة جديدة")
5. Enter a message (e.g., "تم إضافة وظيفة جديدة في الرياض")
6. Click "إرسال الإشعار"

### 4. Receive the Notification

- All users subscribed to that topic will receive the notification
- The notification appears as a browser notification
- When the app is open, it shows as a toast (using Sonner)

## Available Topics

- `job-hunting` - فرص العمل
- `all-users` - جميع المستخدمين
- `maintenance-updates` - تحديثات الصيانة
- `chat-messages` - رسائل المحادثة
- `announcements` - الإعلانات

## API Endpoints

### Subscribe to Topic
```
POST /api/v1/notifications/subscribe-topic
Body: { token: string, topic: string }
```

### Send to Topic
```
POST /api/v1/notifications/send-to-topic
Body: { topic: string, title: string, body: string, data?: object }
```

## Testing

You can test with curl:

```bash
curl -X POST http://localhost:5000/api/v1/notifications/send-to-topic \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "job-hunting",
    "title": "Test Notification",
    "body": "This is a test message"
  }'
```

## Notes

- Users must first subscribe to a topic to receive notifications
- The NotificationProvider automatically subscribes users to "job-hunting" on load
- Notifications work even when the browser is minimized or app is closed
- Only one console.log remains: the FCM token (as requested)
