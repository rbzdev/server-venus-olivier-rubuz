const express = require('express');
const router = express.Router();
const {
  getAllArticles,
  createArticle,
  reloadArticles
} = require('../controllers/articlesController');

// GET /api/articles 
router.get('/', getAllArticles);

// POST /api/articles  (AJouter un article depuis le frontend)
router.post('/create', createArticle);


// POST /api/articles/reload (pour recharger le fichier en mémoire du serveur ave fs)
router.post('/reload', reloadArticles);

module.exports = router;
