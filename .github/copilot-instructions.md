# Wedding Table Organizer - Project Instructions

Modern responsive wedding table organizer with aviation theme.

## Project Structure

- **frontend/**: React + Vite responsive web app
- **backend/**: Express.js API server
- **Database**: MongoDB (MongoDB Atlas for online access)

## Setup Instructions

1. **Frontend Setup**
   - Navigate to `frontend/`
   - Run `npm install`
   - Run `npm run dev`

2. **Backend Setup**
   - Navigate to `backend/`
   - Create `.env` file with MongoDB URI
   - Run `npm install`
   - Run `npm start`

3. **MongoDB Setup**
   - Use MongoDB Atlas (free tier available)
   - Create a cluster and get connection string
   - Add to backend `.env` as `MONGODB_URI`

## Features

- User enters name and sees assigned table
- Modern responsive design (aviation theme)
- Dark mode support
- Admin panel to manage tables and guests
- Real-time database synchronization
