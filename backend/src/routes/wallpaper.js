const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.get('/load', async (req, res) => {
    if (!req.cookies) return res.status(401).json({ message: 'wtf where are the cookies!' });
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
        if (backgroundImageUrl) {
            res.json({ backgroundImageUrl });
        } else {
            res.json({ backgroundImageUrl: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/save', async (req, res) => {
      const { imageData } = req.body;
      // Extrair o token JWT dos cookies ou do cabeçalho da solicitação
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Token de autenticação não fornecido!' });
      try {
          // Decodificar o token JWT para obter as informações do usuário, incluindo o nome de usuário
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          const userId = decodedToken.id;
          // Salvar a URL da imagem no banco de dados
          const updatedUser = await User.findOneAndUpdate({ _id: userId }, { backgroundImageUrl: imageData }, { new: true, upsert: true });
          res.json({ message: 'Imagem salva com sucesso no banco de dados' }); // dont give it back all the user data its the client
      } catch (error) {
          res.status(500).json({ error: 'Erro interno do servidor' });
      }
});

module.exports = router;