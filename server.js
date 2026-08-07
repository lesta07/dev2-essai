const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Sert le site web
app.use(express.static('.'));

// Autorise l'accès public aux photos/fichiers du dossier 'uploads'
app.use('/uploads', express.static('uploads'));

// Crée le dossier 'uploads' automatiquement s'il n'existe pas
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Configuration de Multer
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

// Route pour l'envoi de photos
app.post('/api/upload-photo', upload.single('maPhoto'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Aucun fichier reçu." });
        }
        res.json({ 
            success: true, 
            message: "Photo reçue avec succès !",
            urlPhoto: "/uploads/" + req.file.filename
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
});

// Gestion du Chat en temps réel avec Socket.io (et logique du 2e téléphone)
io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté au chat.');

    socket.on('chat-message', (data) => {
        io.emit('chat-message', data);

        // Réaction automatique du "deuxième téléphone" (serveur)
        if (data.text.toLowerCase() === "connect") {
            setTimeout(() => {
                io.emit('chat-message', { 
                    user: "Agent-Service", 
                    text: "Empreinte biométrique validée. Connexion à distance autorisée." 
                });
            }, 1500);
        }
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté du chat.');
    });
});

server.listen(PORT, () => {
    console.log(`Serveur prêt sur le port ${PORT}`);
});
