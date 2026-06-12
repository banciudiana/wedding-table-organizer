# 🎉 Wedding Table Organizer - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: MongoDB Setup
Choose one option:

**Option A: MongoDB Atlas (Recommended - Online)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/wedding-organizer`
5. Add to `backend/.env` as `MONGODB_URI`

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Use: `mongodb://localhost:27017/wedding-organizer`

### Step 2: Start Backend
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

### Step 3: Start Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

## 📱 How to Use

### For Guests:
1. Visit http://localhost:5173
2. Enter their name
3. Click "Spune-mi la ce masă sunt"
4. See their table and other guests

### For Admin:
1. Go to http://localhost:5173/admin
2. **Create Tables**: Click "+ Masă nouă"
3. **Add Guests**: Enter guest info in each table
4. **Remove Guests**: Click "Șterge" button

## 🎨 Customization

### Change Colors
Edit `frontend/src/styles/global.css`:
- `--primary-green: #2d8659` (main color)
- `--primary-white: #ffffff` (background)

### Add Venue Map
Add image to Table.jsx:
```jsx
<img src="/map-table-1.png" alt="Table 1 Map" style={{ maxWidth: '100%' }} />
```

## 🌙 Dark Mode
Automatically detects system preference - no setup needed!

## 📝 Database Schema

**Table**
- tableNumber (unique number)
- capacity (max guests)
- guests (list with name, dietary, notes)
- location (optional)
- special (boolean)

**Guest**
- name (unique)
- tableNumber (reference)
- dietaryRestrictions
- notes

## 🆘 Troubleshooting

**Backend won't start**: Check MongoDB connection string in .env

**Frontend can't connect to API**: Ensure backend is running on port 5000

**Dark mode not working**: Check browser settings for dark mode support

## 📦 Deployment

**Frontend** → Vercel, Netlify, or any static host
**Backend** → Heroku, Railway, or any Node.js host
**Database** → MongoDB Atlas (free tier available)
