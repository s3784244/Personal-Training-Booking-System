Personal Training Booking System
Overview
The Personal Training Booking System is a web-based platform designed to connect clients with certified personal trainers. The application allows users to browse trainers, book training sessions, and manage their profiles. Trainers can manage their schedules, qualifications, and client bookings. The system provides a seamless experience for both clients and trainers, ensuring efficient communication and scheduling.

Features
For Clients:
Browse Trainers: Search and filter trainers based on specialization, location, and availability.
Book Sessions: Schedule training sessions with trainers at convenient times.
Profile Management: Update personal details and view booking history.
Trainer Reviews: View reviews and ratings for trainers.
For Trainers:
Profile Management: Add qualifications, experiences, and available time slots.
Manage Bookings: View and manage client bookings.
Approval System: Submit profiles for admin approval before being listed.
General Features:
Authentication: Secure login and registration for clients and trainers.
Responsive Design: Optimized for both desktop and mobile devices.
Virtual Training: Option to book virtual training sessions.
Tech Stack
Frontend:
React.js: For building the user interface.
React Router: For navigation and routing.
Tailwind CSS: For styling and responsive design.
React Toastify: For notifications.
Swiper.js: For carousels and testimonials.
Backend:
Node.js & Express.js: For building the REST API.
MongoDB: For database management.
Mongoose: For object data modeling (ODM).
JWT: For secure authentication.
Installation
Prerequisites:
Node.js and npm installed on your system.
MongoDB database connection string.
Steps:
Clone the repository:

Install dependencies for both frontend and backend:

Set up environment variables:

Create a .env file in the backend directory with the following:
Start the development servers:

Backend:
Frontend:
Open the application in your browser at http://localhost:5173.

Folder Structure
Frontend:
src/components: Reusable UI components (e.g., Header, Footer, Services).
src/pages: Pages for routing (e.g., Home, Login, Signup, Trainer Details).
src/Dashboard: Separate dashboards for trainers and clients.
src/utils: Utility functions (e.g., date formatting, Cloudinary uploads).
src/context: Context API for authentication.
Backend:
models: Mongoose schemas for Users, Trainers, Bookings, and Reviews.
Controllers: Logic for handling API requests.
Routes: API endpoints for authentication, trainers, users, and reviews.
auth: Middleware for authentication and role-based access control.
Key Features in Code
Authentication Context: Located in frontend/src/context/AuthContext.jsx, it manages user authentication and role-based access.
Reusable Components: Components like TrainerCard, ServiceCard, and FaqItem ensure modularity and reusability.
Custom Hooks: useFetchData simplifies API calls and state management.
Protected Routes: ProtectedRoutes.jsx ensures only authorized users can access specific pages.
Screenshots
Include screenshots of key pages like:

Home Page
Trainer Profile
Booking Page
Client Dashboard
Trainer Dashboard
Future Enhancements
Add payment integration for booking sessions.
Implement admin panel for managing trainers and clients.
Add advanced search filters for trainers (e.g., location, price range).
Enable email notifications for bookings and approvals.
Contributors
Kajal Soni - Developer
License
This project is licensed under the MIT License.

You can save this content in a README.md file in the root directory of your project. Let me know if you need further customization!5. Open the application in your browser at http://localhost:5173.

Folder Structure
Frontend:
src/components: Reusable UI components (e.g., Header, Footer, Services).
src/pages: Pages for routing (e.g., Home, Login, Signup, Trainer Details).
src/Dashboard: Separate dashboards for trainers and clients.
src/utils: Utility functions (e.g., date formatting, Cloudinary uploads).
src/context: Context API for authentication.
Backend:
models: Mongoose schemas for Users, Trainers, Bookings, and Reviews.
Controllers: Logic for handling API requests.
Routes: API endpoints for authentication, trainers, users, and reviews.
auth: Middleware for authentication and role-based access control.
Key Features in Code
Authentication Context: Located in frontend/src/context/AuthContext.jsx, it manages user authentication and role-based access.
Reusable Components: Components like TrainerCard, ServiceCard, and FaqItem ensure modularity and reusability.
Custom Hooks: useFetchData simplifies API calls and state management.
Protected Routes: ProtectedRoutes.jsx ensures only authorized users can access specific pages.
Screenshots
Include screenshots of key pages like:

Home Page
Trainer Profile
Booking Page
Client Dashboard
Trainer Dashboard
Future Enhancements
Add payment integration for booking sessions.
Implement admin panel for managing trainers and clients.
Add advanced search filters for trainers (e.g., location, price range).
Enable email notifications for bookings and approvals.
Contributors
Kajal Soni - Developer
License
This project is licensed under the MIT License.