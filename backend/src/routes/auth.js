const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Rota de Registro
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Verifica se o usuário ou e-mail já existe no banco de dados
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Nome de usuário ou e-mail já existe!' });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria um novo usuário com a senha criptografada
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    res.json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar usuário!' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Senha incorreta!' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set HTTP-only secure cookie
    res.cookie('token', token, { 
        httpOnly: true,
        secure: true, // Cookie will be sent only over HTTPS
        sameSite: 'strict' // Cookie will be sent only for same-site requests
    });

    res.json({ message: 'Login efetuado com sucesso!', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer login!' });
  }
});

module.exports = router;