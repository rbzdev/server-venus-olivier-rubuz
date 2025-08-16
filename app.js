const express = require('express');
const path = require('path');
const app = express();

// AUTORISER L'ACCES CORS à tous les domaines .. Pour acceder facilement en LocalHost
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

// Middlewares de base
app.use(express.json());

// Routes Utils
const articlesRouter = require('./routes/articlesRoutes');
app.use('/api/articles', articlesRouter);

// 404 .. Dans le cas d'une route inexistante 
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Démarrage serveur sur le PORT 3000 ou
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;
