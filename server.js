const express = require('express');
const multer = require('multer'); // Outil pour gérer les fichiers reçus
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configuration de Multer pour stocker temporairement la photo reçue
const upload = multer({ dest: 'uploads/' });

// Route d'accueil
app.get('/', (req, res) => {
    res.send('Mon serveur dev2 fonctionne !');
});

// Route pour recevoir la photo (champ nommé "maPhoto")
app.post('/api/upload-photo', upload.single('maPhoto'), (req, res) => {
    try {
        console.log("Photo bien reçue !");
        console.log(req.file); // Contient toutes les infos sur le fichier (nom, taille, etc.)

        res.json({ 
            success: true, 
            message: "Photo reçue avec succès par Render !",
            nomFichier: req.file.filename 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur lors de l'envoi" });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur dev2 en écoute sur le port ${PORT}`);
});
