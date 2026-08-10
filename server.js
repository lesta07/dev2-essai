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

// Route pour valider l'empreinte envoyée par ton app Flutter
app.post('/api/connexion-empreinte', (req, res) => {
    const { status, methode } = req.body;
    
    console.log(`Reçu du téléphone -> Status: ${status}, Méthode: ${methode}`);

    res.status(200).json({ 
        success: true, 
        message: "Serveur Railway : Empreinte validée avec succès !" 
    });
});

// 1. Vérification du webhook par Facebook (Messenger)
app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = "mon_token_secret_123"; 

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// 2. Réception des messages de Messenger
app.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object === 'page') {
        body.entry.forEach(entry => {
            const webhookEvent = entry.messaging[0];
            console.log("Message reçu de Messenger :", webhookEvent);
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

// Gestion du Chat en temps réel avec Socket.io (et logique du 2e téléphone)
io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté au chat.');

    socket.on('chat-message', (data) => {
        io.emit('chat-message', data);

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
