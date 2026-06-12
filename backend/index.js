import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import guestRoutes from './routes/guests.js';
import tableRoutes from './routes/tables.js';

dotenv.config();

const app = express();

// Middleware de bază
app.use(cors());
app.use(express.json());

// Starea conexiunii pentru Serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    // Folosește direct variabila din Vercel; dacă nu există, fallback pe localhost
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wedding-organizer';
    
    const conn = await mongoose.connect(dbUri);
    isConnected = conn.connections[0].readyState;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error la conectarea bazei de date: ${error.message}`);
    // NU punem process.exit(1) pe Vercel, altfel prăbușim instanța serverless
  }
};

// Middleware care garantează conexiunea la DB înainte de a rula rutele
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use('/api/guests', guestRoutes);
app.use('/api/tables', tableRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    database: isConnected ? 'Connected' : 'Disconnected' 
  });
});

// Pornire server clasic DOAR dacă rulăm local (nu pe Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
  });
}

// Exportul obligatoriu pentru ca Vercel să poată mapa rutele
export default app;