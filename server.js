const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Route principale pour afficher un message quand on va sur le lien web
app.get('/', (req, res) => {
    res.send('Mon serveur dev2 fonctionne !');
});

// Route pour recevoir l'appel de votre téléphone
app.post('/api/verifier', (req, res) => {
    console.log("Requête reçue du téléphone !");
    // Le serveur valide l'action
    res.json({ success: true, message: "OK depuis Render" });
});

app.listen(PORT, () => {
    console.log(`Serveur dev2 en écoute sur le port ${PORT}`);
});
