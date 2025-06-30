# Personal Training Booking System

## Overview
The Personal Training Booking System is a comprehensive web-based platform designed to connect clients with certified personal trainers. The application allows users to browse trainers, book training sessions with integrated payment processing, and manage their profiles. Trainers can manage their schedules, qualifications, and client bookings. The system provides a seamless experience for both clients and trainers, ensuring efficient communication and scheduling.

![Personal Training Booking System](https://personal-trainer-booking.vercel.app/)

## Features

### For Clients:
- **Browse Trainers**: Search and filter trainers based on specialisation, location, and availability
- **Book Sessions**: Schedule training sessions with trainers at convenient times
- **Secure Payments**: Integrated Stripe payment processing for session bookings
- **Profile Management**: Update personal details, profile photos, and view booking history
- **Trainer Reviews**: View and submit reviews and ratings for trainers
- **Authentication**: Secure login/signup with JWT-based authentication
- **Dashboard**: Personal dashboard to manage bookings and profile settings

### For Trainers:
- **Profile Management**: Add qualifications, experiences, profile photos, and available time slots
- **Manage Bookings**: View and manage client bookings with real-time updates
- **Approval System**: Submit profiles for admin approval before being listed
- **Pricing Management**: Set and update session ticket prices
- **Rating System**: Receive and display client reviews and ratings
- **Dashboard**: Comprehensive dashboard with overview, bookings, and profile management

### General Features:
- **Authentication**: Secure login and registration for clients and trainers with role-based access
- **Responsive Design**: Optimised for both desktop and mobile devices
- **Payment Integration**: Stripe Checkout for secure payment processing
- **Review System**: Complete review and rating system for trainers
- **Image Upload**: Cloudinary integration for profile photo uploads
- **Protected Routes**: Role-based route protection for enhanced security
- **Real-time Updates**: Dynamic content updates without page refresh


## 🧪 How to Test the App Features

You can explore the platform as either a **Client** or a **Trainer**. Use the demo accounts below or register a new user.

### 1. Access the Application

- Open [http://localhost:5173](http://localhost:5173) in your browser after starting both frontend and backend servers.

---

### 2. Login or Register

#### Demo Accounts

- **Client Login:**  
  - Email: `client1@gmail.com`  
  - Password: `test`
- **Trainer Login:**  
  - Email: `trainer1@gmail.com`  
  - Password: `test`

#### Or Register a New Account

- Click **Sign Up** and choose either "Client" or "Trainer" role.
- Fill in the required details and submit the form.

---

### 3. Client Features to Test

1. **Browse Trainers:**  
   - Go to "Find a Trainer" to view all available trainers.
   - Use search and filters to find trainers by specialisation.

2. **View Trainer Profiles:**  
   - Click on any trainer card to see detailed profile, qualifications, and reviews.

3. **Book a Session:**  
   - On a trainer’s profile, select a time slot and date.
   - Click "Book Now" and complete the Stripe payment process.

4. **View & Manage Bookings:**  
   - Go to "My Profile" > "My Bookings" to see all your session bookings.

5. **Leave Feedback:**  
   - After booking, go to a trainer’s profile and submit a review and rating.

6. **Edit Profile:**  
   - Update your personal info and profile photo in "Profile Settings".

7. **Logout:**  
   - Use the logout button in the header or sidebar.

---

### 4. Trainer Features to Test

1. **Login as Trainer** (use demo or register as trainer).

2. **View Dashboard:**  
   - See an overview of your profile, ratings, and certifications.

3. **Manage Bookings:**  
   - Go to the "Bookings" tab to view all client appointments.

4. **Edit Profile:**  
   - Update your qualifications, experiences, time slots, pricing, and profile photo.

5. **View Feedback:**  
   - Check client reviews and ratings in the "Feedback" tab.

6. **Logout:**  
   - Use the logout button in the header or sidebar.

---

### 5. Additional Tips

- You can register multiple clients or trainers to test interactions.
- Try deleting your account or updating your profile photo to test those features.
- All payments are in test mode using Stripe. You can use **Card Number:** `4242 4242 4242 4242` and any **Expiry Date:** and **CVC:** value to test the payment


## Tech Stack

### Frontend:
- **React.js**: For building the user interface
- **React Router**: For navigation and routing
- **Tailwind CSS**: For styling and responsive design
- **React Toastify**: For notifications and alerts
- **Swiper.js**: For carousels and testimonials
- **React Context API**: For state management and authentication
- **React Hooks**: Custom hooks for data fetching and API calls

### Backend:
- **Node.js & Express.js**: For building the REST API
- **MongoDB**: For database management
- **Mongoose**: For object data modeling (ODM)
- **JWT**: For secure authentication and authorisation
- **Stripe**: For payment processing
- **Cloudinary**: For image upload and management
- **bcrypt**: For password hashing and security

## Installation

### Prerequisites:
- Node.js and npm installed on your system
- MongoDB database connection string
- Stripe account for payment processing
- Cloudinary account for image uploads

### Steps:

1. **Clone the repository:**
```bash
git clone <repository-url>
cd personal-training-booking-system
```

2. **Install dependencies for both frontend and backend:**
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the backend directory with the following:
```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_SUCCESS_URL=http://localhost:5173
```

Create a `.env` file in the frontend directory with the following:
```env
VITE_CLOUD_NAME=your_cloudinary_cloud_name
VITE_UPLOAD_PRESET=your_cloudinary_upload_preset
```

4. **Start the development servers:**

Backend:
```bash
cd backend
npm run start-dev
```

Frontend:
```bash
cd frontend
npm run dev
```

5. **Open the application in your browser at `http://localhost:5173`**

## API Endpoints

### Authentication:
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### Users:
- `GET /api/v1/users/profile/me` - Get user profile
- `PUT /api/v1/users/:id` - Update user profile
- `GET /api/v1/users/bookings/my-bookings` - Get user bookings

### Trainers:
- `GET /api/v1/trainers` - Get all approved trainers
- `GET /api/v1/trainers/:id` - Get specific trainer
- `GET /api/v1/trainers/profile/me` - Get trainer profile
- `PUT /api/v1/trainers/:id` - Update trainer profile

### Bookings:
- `POST /api/v1/bookings/checkout-session/:trainerId` - Create payment session
- `GET /api/v1/bookings` - Get bookings (trainer)

### Reviews:
- `POST /api/v1/trainers/:trainerId/reviews` - Create review
- `GET /api/v1/trainers/:trainerId/reviews` - Get trainer reviews

## Folder Structure

### Frontend:
```
src/
├── components/          # Reusable UI components
│   ├── Header/         # Navigation header
│   ├── Footer/         # Footer component
│   ├── Services/       # Service cards
│   └── ...
├── pages/              # Main application pages
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # Login page
│   ├── Signup.jsx      # Registration page
│   ├── Trainer/        # Trainer-related pages
│   └── ...
├── Dashboard/          # User dashboards
│   ├── trainer-account/ # Trainer dashboard
│   └── user-account/   # Client dashboard
├── utils/              # Utility functions
├── context/            # React Context API
├── hooks/              # Custom React hooks
└── assets/             # Static assets
```

### Backend:
```
├── models/             # Mongoose schemas
│   ├── UserSchema.js   # User model
│   ├── TrainerSchema.js # Trainer model
│   ├── BookingSchema.js # Booking model
│   └── ReviewSchema.js # Review model
├── Controllers/        # API logic
├── Routes/             # API endpoints
├── auth/               # Authentication middleware
└── index.js           # Server entry point
```

## Key Features in Code

- **Authentication Context**: Located in `frontend/src/context/AuthContext.jsx`, manages user authentication and role-based access
- **Reusable Components**: Components like `TrainerCard`, `ServiceCard`, and `FaqItem` ensure modularity and reusability
- **Custom Hooks**: `useFetchData` simplifies API calls and state management
- **Protected Routes**: `ProtectedRoutes.jsx` ensures only authorised users can access specific pages
- **Payment Integration**: Stripe Checkout sessions for secure payment processing
- **Image Upload**: Cloudinary integration for profile photo management
- **Review System**: Complete rating and review functionality for trainers

## Payment Processing

The application integrates Stripe for secure payment processing:
- Clients can book sessions with real-time payment
- Secure checkout sessions with success/cancel redirects
- Payment confirmation and booking creation
- Support for multiple currencies (AUD by default)

## Security Features

- JWT-based authentication with secure token storage
- Password hashing using bcrypt
- Role-based access control (client/trainer)
- Protected API endpoints with authentication middleware
- Input validation and sanitisation

## Future Enhancements

- [ ] Admin panel for managing trainers and clients
- [ ] Advanced search filters for trainers (location, price range, ratings)
- [ ] Email notifications for bookings and approvals
- [ ] Real-time chat between clients and trainers
- [ ] Calendar integration for session scheduling
- [ ] Mobile app development
- [ ] Video call integration for virtual sessions
- [ ] Subscription-based pricing models
- [ ] Multi-language support


## Contributors

**Kajal Soni** - Full Stack Developer