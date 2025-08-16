const path = require("path");
const fs = require("fs");

// Charge tous les articles une seule fois au demarr du server  (lecture synchrone simple)
const dataPath = path.join(__dirname, "..", "articles.json");
let articles = [];
try {
  const file = fs.readFileSync(dataPath, "utf-8");
  articles = JSON.parse(file);
} catch (err) {
  console.error("Erreur de chargement du fichier articles.json:", err.message);
}

// Controllers

//  Obtenir tous les articles
exports.getAllArticles = (req, res) => {
    const sorted = [...articles].sort((a, b) => b.id - a.id);
    res.json(sorted);
};

// Ajouter un nouvel article
exports.createArticle = (req, res) => {
  const { title, content, imageUrl } = req.body || {};

  //   DEBUG
//   console.log("Données reçues au frontend:", { title, content, image });

  // Validation minimale .. Security breach
  if (!title || !content) {
    return res.status(400).json({ message: "Champs title et content requis" });
  }

  // Générer un nouvel id (max id existant increment + 1)
  const newId = articles.length
    ? Math.max(...articles.map((a) => a.id)) + 1
    : 1;
  const article = {
    id: newId,
    title: String(title).trim(),
    content: String(content).trim(),
    image: imageUrl
      ? String(imageUrl).trim()
      : `https://picsum.photos/seed/art${newId}/800/450`,
  };

  articles.push(article);

  // Persister dans le fichier
  try {
    fs.writeFileSync(dataPath, JSON.stringify(articles, null, 4), "utf-8");
    return res.status(201).json({ message: "Article créé", article });
  } catch (err) {
    // Si l'écriture échoue, retirer l'article de la mémoire pour rester cohérent
    articles = articles.filter((a) => a.id !== newId);
    return res
      .status(500)
      .json({ message: "Erreur d'enregistrement", error: err.message });
  }
};

exports.reloadArticles = (req, res) => {
  try {
    const file = fs.readFileSync(dataPath, "utf-8");
    articles = JSON.parse(file);
    res.json({ message: "Articles rechargés", count: articles.length });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur de rechargement", error: err.message });
  }
};
