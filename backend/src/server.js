import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

// Support pour Alwaysdata et développement local
const PORT = process.env.ALWAYSDATA_HTTPD_PORT || process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur ${PORT}`);
  console.log(`CORS_ORIGIN configuré: ${process.env.CORS_ORIGIN || '*'}`);
});
