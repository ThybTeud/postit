import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

// Support pour Alwaysdata et développement local
const PORT = process.env.ALWAYSDATA_HTTPD_PORT || process.env.PORT || 3000;
const HOST = process.env.ALWAYSDATA_HTTPD_IP || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`Serveur démarré sur ${HOST}:${PORT}`);
});
