import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

// Support pour Alwaysdata et développement local
const PORT = process.env.ALWAYSDATA_HTTPD_PORT || process.env.PORT || 8000;
// const HOST = process.env.ALWAYSDATA_HTTPD_IP || 'localhost';

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur ${PORT}`);
});
