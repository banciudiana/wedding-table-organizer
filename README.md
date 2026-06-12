# Wedding Table Organizer

A modern, responsive wedding guest table assignment system with aviation theme.

## Features

- **Guest Name Search**: Guests enter their name to see their assigned table
- **Responsive Design**: Optimized for mobile and desktop
- **Dark Mode Support**: Automatically adapts to system theme
- **Aviation Theme**: Beautiful design with airplanes and parachute decorations
- **Admin Panel**: Manage tables and guests easily
- **MongoDB Database**: Scalable, cloud-ready database

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Styling**: CSS with handwriting fonts

## Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file with:
```
MONGODB_URI=mongodb://localhost:27017/wedding-organizer
PORT=5000
```

For MongoDB Atlas, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wedding-organizer
```

Then run:
```bash
npm start
```

Backend runs on `http://localhost:5000`

## Usage

1. **For Guests**: Visit home page, enter your name, see your table assignment
2. **For Admin**: Go to `/admin` panel to:
   - Create tables
   - Add/remove guests
   - Manage table capacity

## Database Schema

### Table
```
{
  tableNumber: Number (unique),
  capacity: Number,
  guests: [{
    name: String,
    dietary: String,
    notes: String
  }],
  location: String,
  special: Boolean
}
```

### Guest
```
{
  name: String (unique),
  tableNumber: Number,
  dietaryRestrictions: String,
  plus_one: Boolean,
  notes: String
}
```

## Color Scheme

- Primary: White (#ffffff)
- Accent: Green (#2d8659, #4aa073)
- Dark mode background: #0f1419
- Elegant handwriting font: Caveat

## Future Enhancements

- Add venue map with table highlights
- Seat assignments within tables
- RSVP tracking
- Multiple language support
- Email notifications

## License

MIT
