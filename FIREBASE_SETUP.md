# Firebase Setup Guide

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "argelne-app")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Set up Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## 3. Get Firebase Configuration

1. In your Firebase project, click the gear icon → "Project settings"
2. Scroll down to "Your apps" section
3. Click the web icon `</>`
4. Register your app with a nickname (e.g., "argelne-web")
5. Copy the `firebaseConfig` object

## 4. Update Your App Configuration

Replace the placeholder values in `config/firebase.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

## 5. Seed Initial Data (Optional)

To add some initial products to your Firestore database, you can run the seed function:

1. In your app, temporarily add this to any component:
```typescript
import { seedProducts } from '@/services/firebase';

// Call this once to populate your database
seedProducts();
```

2. Run your app and the products will be added to Firestore
3. Remove the seed function call after running it once

## 6. Firestore Security Rules (For Production)

When you're ready for production, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to products for everyone
    match /products/{document} {
      allow read: if true;
      allow write: if false; // Only allow writes through admin interface
    }
    
    // Allow users to read/write their own orders
    match /orders/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 7. Test Your Integration

1. Start your app: `npx expo start`
2. The home screen should now load products from Firebase
3. Add items to cart and complete checkout
4. Check your Firestore console to see the orders being created

## What's Integrated

✅ **Products**: Loaded from Firestore instead of mock data  
✅ **Orders**: Saved to Firestore when checkout is completed  
✅ **Loading States**: Shows loading indicators while fetching data  
✅ **Error Handling**: Displays errors and retry options  
✅ **Redux Integration**: Firebase data is managed through Redux store  

## Next Steps

- Add user authentication
- Implement real-time order status updates
- Add admin panel for managing products
- Set up push notifications for order updates 