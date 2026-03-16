# Tutor Finder

A modern web application for finding and connecting with tutors. Built with React on the frontend and Node.js/Express on the backend, featuring user authentication, tutor profiles, an AI-powered chatbot using Google's Gemini API, and a responsive dashboard.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Tutor Discovery**: Browse and search for tutors by subject and availability
- **Tutor Profiles**: Detailed profiles with ratings and reviews
- **AI Chatbot**: Integrated chatbot powered by Google Gemini for assistance
- **Dashboard**: Personalized dashboard for students and tutors
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Frontend
- React 19
- Vite (build tool)
- React Router (navigation)
- Recharts (data visualization)
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (authentication)
- bcryptjs (password hashing)
- CORS

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- Google Gemini API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tutor-finder
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Setup**
   - Create a `.env` file in the root directory
   - Add your MongoDB connection string and Gemini API key:
     ```
     MONGODB_URI=mongodb://localhost:27017/tutor-finder
     VITE_GEMINI_API_KEY=your_gemini_api_key_here
     PORT=5000
     JWT_SECRET=your_jwt_secret_here
     ```

5. **Seed the database (optional)**
   ```bash
   cd server
   node seed.js
   cd ..
   ```

## Running the Application

1. **Start the backend server**
   ```bash
   cd server
   node server.js
   ```
   The server will run on http://localhost:5000

2. **Start the frontend (in a new terminal)**
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:5173

## Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
tutor-finder/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/             # Page components
│   ├── context/           # React context providers
│   ├── data/              # Mock data and utilities
│   └── assets/            # Images and styles
├── server/
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   └── seed.js            # Database seeding script
├── .env                   # Environment variables (not committed)
├── .gitignore             # Git ignore rules
└── package.json           # Frontend dependencies and scripts
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/health` - Health check

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Submit a pull request

## License

This project is licensed under the ISC License.
