# Notification System - Database Integration

## ✅ What Was Updated

### Backend Changes

**Updated `notificationController.ts`** to save tokens and subscriptions to database:

1. **Subscribe to Topic** (`POST /api/v1/notifications/subscribe-topic`)
   - Subscribes token to Firebase topic (existing)
   - **NEW**: Saves FCM token to `fcm_device_tokens` table
   - **NEW**: Saves subscription to `fcm_topic_subscriptions` table
   - Uses `upsert` to avoid duplicates
   - Requires authenticated user (`req.user.id`)

2. **Send to Topic** (`POST /api/v1/notifications/send-to-topic`)
   - Sends notification to all subscribers of a topic
   - No database changes needed (Firebase handles delivery)

### Database Schema (Already Exists!)

#### `fcm_device_tokens` Table
```prisma
model fcm_device_tokens {
  id         String   @id
  token      String   @unique @db.VarChar(500)
  platform   String   // "WEB", "IOS", "ANDROID"
  deviceId   String?
  appVersion String?
  isActive   Boolean  @default(true)
  lastUsedAt DateTime?
  createdAt  DateTime @default(now())
  updatedAt  DateTime
  userId     String
  users      user     @relation(...)
  fcm_topic_subscriptions fcm_topic_subscriptions[]
}
```

#### `fcm_topic_subscriptions` Table
```prisma
model fcm_topic_subscriptions {
  id        String   @id
  topic     String   @db.VarChar(100)
  createdAt DateTime @default(now())
  tokenId   String
  fcm_device_tokens fcm_device_tokens @relation(...)
  
  @@unique([tokenId, topic])
}
```

### Frontend Changes

**Updated `topic-subscriptions.tsx`**:
- Removed `userRole` prop
- Removed role-based subscription logic
- Only topic-based subscriptions now

## How It Works Now

### 1. User Subscribes to Topic

**Frontend Flow:**
1. User clicks "اشتراك" button
2. Calls `POST /api/v1/notifications/subscribe-topic`
3. Sends: `{ token: "fcm-token-here", topic: "job-hunting" }`

**Backend Flow:**
1. Validates user is authenticated
2. Subscribes token to Firebase topic via Admin SDK
3. **Saves token to database** (`fcm_device_tokens`)
4. **Saves subscription to database** (`fcm_topic_subscriptions`)
5. Returns success

### 2. Admin Sends Notification

**Frontend Flow:**
1. Admin fills form in "إرسال إشعار إلى موضوع"
2. Selects topic, enters title/body
3. Calls `POST /api/v1/notifications/send-to-topic`

**Backend Flow:**
1. Validates request
2. Sends notification via Firebase Admin SDK
3. Firebase delivers to all subscribed tokens
4. Returns messageId

### 3. User Receives Notification

- Browser shows notification (even when app closed)
- If app is open, shows toast via Sonner
- Clicking notification opens the app

## Database Benefits

Now you can:
- ✅ Track which users are subscribed to which topics
- ✅ See all FCM tokens per user
- ✅ Query subscriptions: `SELECT * FROM fcm_topic_subscriptions WHERE topic = 'job-hunting'`
- ✅ Manage inactive tokens
- ✅ Audit subscription history
- ✅ Build admin dashboard to view subscriptions

## Example Queries

### Get all users subscribed to a topic
```sql
SELECT u.name, u.email, fts.topic, fts.createdAt
FROM fcm_topic_subscriptions fts
JOIN fcm_device_tokens fdt ON fts.tokenId = fdt.id
JOIN users u ON fdt.userId = u.id
WHERE fts.topic = 'job-hunting';
```

### Get all topics a user is subscribed to
```sql
SELECT fts.topic, fts.createdAt
FROM fcm_topic_subscriptions fts
JOIN fcm_device_tokens fdt ON fts.tokenId = fdt.id
WHERE fdt.userId = 'user-id-here';
```

### Get active tokens count
```sql
SELECT COUNT(*) as active_tokens
FROM fcm_device_tokens
WHERE isActive = true;
```

## Important Notes

⚠️ **Authentication Required**: The subscribe endpoint now requires `req.user.id`
- Make sure your auth middleware is applied to `/api/v1/notifications` routes
- User must be logged in to subscribe to topics

✅ **Auto-subscription**: "job-hunting" is still auto-subscribed on app load
✅ **No role-based subscriptions**: Removed from UI and logic
✅ **Database sync**: Every subscription is now tracked in the database
