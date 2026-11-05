require('dotenv').config();
const app = require('./app');

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`✅ API Aprende Jugando escuchando en http://localhost:${PORT}`);
  console.log(`   CORS permitido para: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});
