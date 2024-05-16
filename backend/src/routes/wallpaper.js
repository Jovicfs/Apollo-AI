const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { json } = require('body-parser');

router.get('/load', async (req, res) => {
    if (!req.cookies) return res.status(401).json({ message: 'Token não iniciado' });
    // Extrair o token JWT dos cookies ou do cabeçalho da solicitação
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token de autenticação não fornecido!' });
    try {
        // Decodificar o token JWT para obter as informações do usuário, incluindo o nome de usuário
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;
        // Salvar a URL da imagem no banco de dados
        const updatedUser = await User.findOne({ _id: userId });
        const backgroundImageUrl = updatedUser.backgroundImageUrl;
        const profileImageUrl = updatedUser.profileImageUrl;

        res.json({ backgroundImageUrl, profileImageUrl });
    
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/save', async (req, res) => {
    const { imageBackground } = req.body;
    const { imageProfile } = req.body;
    // Extrair o token JWT dos cookies ou do cabeçalho da solicitação
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token de autenticação não fornecido!' });
    try {
        // Decodificar o token JWT para obter as informações do usuário, incluindo o nome de usuário
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;
        // Salvar as URL de imagem no banco de dados
        const updatedUser = await User.findOneAndUpdate({ _id: userId },
            { backgroundImageUrl: imageBackground },
            { profileImageUrl: imageProfile },
            { new: true, upsert: true });
        res.json({ message: 'Imagem salva com sucesso no banco de dados' }); // dont give it back all the user data its the client
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;