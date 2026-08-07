const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Indispensable pour créer le dossier

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Sert le site web
app.use(express.static('.'));

// Autorise l'accès public aux photos du dossier 'uploads'
app.use('/uploads', express.static('uploads'));

// Crée le dossier 'uploads' automatiquement s'il n'existe pas
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Configuration de Multer pour conserver l'extension du fichier
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Route pour recevoir la photo
app.post('/api/upload-photo', upload.single('maPhoto'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Aucun fichier reçu." });
        }
        
        console.log("Photo bien reçue ! Fichier :", req.file.filename);
        console.log("Pour voir : https://dev2-essai.onrender.com/uploads/" + req.file.filename);

        res.json({ 
            success: true, 
            message: "Photo reçue avec succès !",
            urlPhoto: "/uploads/" + req.file.filename
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur prêt sur le port ${PORT}`);
});
