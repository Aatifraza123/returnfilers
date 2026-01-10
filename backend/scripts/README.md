# Backend Scripts

## Clean Duplicate Notifications

This script removes duplicate notifications from the database.

### Usage

```bash
cd backend
npm run clean:notifications
```

### What it does

1. Connects to your MongoDB database
2. Finds all notifications with a `relatedId`
3. Groups them by unique key: `type + relatedId + recipient + recipientId`
4. Keeps the oldest notification for each unique combination
5. Deletes all duplicate notifications

### When to run

- If you notice duplicate notifications appearing in the user dashboard
- After upgrading to the new notification system with duplicate prevention
- As a one-time cleanup after the fix is deployed

### Prevention

The system now prevents duplicates in two ways:

1. **Application Level**: Before creating a notification, it checks if one already exists for the same entity
2. **Database Level**: A unique compound index prevents duplicate notifications at the database level

This ensures no duplicate notifications will be created in the future.
