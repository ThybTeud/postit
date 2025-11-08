import express from 'express';
import cors from 'cors';
import notesRoutes from './routes/notes.js';

const app = express();

// Configuration CORS plus permissive pour le développement
const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (comme Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',')
      : ['*'];
    
    if (allowedOrigins.includes('*') || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/notes', notesRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    cors_origin: process.env.CORS_ORIGIN || '*'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Une erreur est survenue' });
});

export default app;