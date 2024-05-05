const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Rota de Registro

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const user = new User({ username, password });
  try {
    await user.save();
    res.json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Nome de usuário já existe!' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Erro ao registrar usuário!' });
    }
  }
});

// Rota de Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Usuário não encontrado!' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Senha incorreta!' });
  }

  // TODO: Gerar e enviar token de autenticação

  res.json({ message: 'Login efetuado com sucesso!' });
});

module.exports = router;