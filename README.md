# Anchor Customs - Premium Photo Magazine Business

A full-stack React application for a custom photo magazine business.

## Features
- **Modern UI**: Premium design with Playfair Display and Inter typography.
- **Customization Flow**: Step-by-step selection of templates and page counts (10/12 pages).
- **Multi-Image Upload**: Drag-and-drop up to 50 photos with upload progress.
- **Firebase Backend**: 
  - Authentication (Email/Password)
  - Firestore (Orders, User Data)
  - Storage (Photo Uploads)
- **Razorpay Integration**: Seamless payment for Indian customers.
- **User Dashboard**: Order history and status tracking.
- **Admin Dashboard**: View all orders, update status, and export to CSV.

## Getting Started

1. **Clone the repo** and run `npm install`.
2. **Setup Firebase**:
   - Create a project on [Firebase Console](https://console.firebase.google.com/).
   - Enable Authentication (Email/Password).
   - Create a Firestore Database and a Storage bucket.
   - Copy your config to `.env` (use `.env.example` as a template).
3. **Setup Razorpay**:
   - Get your Test/Live Key ID from [Razorpay Dashboard](https://dashboard.razorpay.com/).
   - Add it to your `.env` file.
4. **Admin Access**:
   - To access the admin dashboard, create a user with the email `admin@anchorcustoms.com` (as per the logic in `AuthContext.jsx`) or update the logic in the context file.
5. **Run Locally**:
   ```bash
   npm run dev
   ```

## Folder Structure
- `src/components`: Reusable UI elements.
- `src/pages`: Main application screens.
- `src/firebase`: Firebase configuration and utilities.
- `src/context`: Auth and Cart state management.
- `src/styles`: Global CSS and design system.
- `src/utils`: Helper functions and static data.

## Note on Razorpay
This MVP uses the standard frontend Razorpay integration. For production, it is highly recommended to implement server-side order creation using a Node.js/Express backend to ensure payment security.
