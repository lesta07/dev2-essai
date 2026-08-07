const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Sert à afficher votre fichier index.html automatiquement
app.use(express.static('.'));

// Autorise l'accès public aux photos dans le dossier 'uploads'
app.use('/uploads', express.static('uploads'));

// Configuration de Multer pour stocker temporairement les photos
const upload = multer({ dest: 'uploads/' });

// Route pour recevoir la photo
app.post('/api/upload-photo', upload.single('maPhoto'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Aucun fichier reçu." });
        }
        
        // Affiche les infos dans les logs Render
        console.log("Photo bien reçue ! Nom du fichier :", req.file.filename);
        console.log("URL pour voir la photo : https://dev2-essai.onrender.com/uploads/" + req.file.filename);

        res.json({ 
            success: true, 
            message: "Photo reçue avec succès !",
            nomFichier: req.file.filename,
            urlPhoto: "/uploads/" + req.file.filename
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur prêt sur le port ${PORT}`);
});
