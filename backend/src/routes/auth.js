const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

// Rota de Registro
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verifica se o usuário já existe no banco de dados
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Nome de usuário já existe!' });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria um novo usuário com a senha criptografada
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar usuário!' });
  }
});

// Rota de Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Usuário não encontrado!' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Senha incorreta!' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ message: 'Login efetuado com sucesso!', token });
});

module.exports = router;