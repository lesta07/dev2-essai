const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Cette ligne sert à afficher votre fichier index.html automatiquement
app.use(express.static('.'));

// Configuration de Multer pour stocker temporairement les photos
const upload = multer({ dest: 'uploads/' });

// Route pour recevoir la photo
app.post('/api/upload-photo', upload.single('maPhoto'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Aucun fichier reçu." });
        }
        console.log("Photo bien reçue :", req.file.filename);
        res.json({ 
            success: true, 
            message: "Photo reçue avec succès !",
            nomFichier: req.file.filename 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur prêt sur le port ${PORT}`);
});
