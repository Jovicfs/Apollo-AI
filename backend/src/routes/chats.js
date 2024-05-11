const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { text } = require("express");
const Groq = require("groq-sdk");
require('dotenv').config()
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
const { v4: uuidv4 } = require('uuid');

const systemMsg = `You are brazilian  ApolloCat you neeed to speak in portuguese, a helpful virtual assistant. Powered by advanced artificial intelligence, ApolloCat is designed to provide intelligent, logical, and reliable assistance.
With a focus on rationality and accuracy, ApolloCat aims to assist users in managing tasks, providing information, and solving problems efficiently.
Trust in ApolloCat's capabilities is paramount, as it operates based on sound logic and a commitment to delivering precise and reliable assistance.
Users are encouraged to interact with ApolloCat for any assistance they may require.`;

router.post('/ai', async (req, res) => {
    // Extrair o token JWT dos cookies ou do cabeçalho da solicitação
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token de autenticação não fornecido!' });

    const txt = req.body.text;
    let conversationID = req.body.id;
    try {
        // Decodificar o token JWT para obter as informações do usuário, incluindo o nome de usuário
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userID = decodedToken.id;
        // lets get the user message history (different for every user)
        const currentUser = await User.findOne({ _id: userID });
        let userConversations = currentUser.userConversations; // currently it doesn't support multiple history conversations per user - it only supports 1 history per 1 user
        if (userConversations) {
            try {
                userConversations = JSON.parse(userConversations);
            } catch(jsonErr) {}
        }

        // create new conversations:
        if (!userConversations || !userConversations[conversationID]) {
            console.log("conversation not found, creating a new one...", conversationID)
            if (!userConversations) userConversations = {};
            conversationID = uuidv4();
            userConversations[conversationID] = [
                {
                    role: "system",
                    content: systemMsg
                }
            ];
        }
        // add the new user message:
        userConversations[conversationID].push({
            role: "user",
            content: txt
        });
        // then we take the user message history and feed it to groq - ai response
        const aiResponse = await groq.chat.completions.create({
            messages: userConversations[conversationID],
            temperature: 0,
            max_tokens:1000,
            model: "llama3-70b-8192"
        })
        const aiResponseMessage = aiResponse.choices[0].message.content;
        // feed the ai response back into the user message history:
        userConversations[conversationID].push({
            role: "assistant",
            content: aiResponseMessage
        });
        // save it all into the memory:
        const updatedUser = await User.findOneAndUpdate({ _id: userID }, { userConversations: JSON.stringify(userConversations) }, { new: true, upsert: true });
        // and return the ai response:
        const aiOutput = aiResponseMessage;
        res.json({
            text: aiOutput,
            id: conversationID
        })
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
});

router.post('/delete', async (req, res) => { // send a post request to /chats/delete
    // Extrair o token JWT dos cookies ou do cabeçalho da solicitação
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token de autenticação não fornecido!' });

    let conversationID = req.body.id;
    try {
        // Decodificar o token JWT para obter as informações do usuário, incluindo o nome de usuário
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userID = decodedToken.id;
        // lets get the user message history (different for every user)
        const currentUser = await User.findOne({ _id: userID });
        let userConversations = currentUser.userConversations; // currently it doesn't support multiple history conversations per user - it only supports 1 history per 1 user
        if (userConversations) {
            try {
                userConversations = JSON.parse(userConversations);
            } catch(jsonErr) {}
        }
        // create new conversations:
        if (!userConversations || !userConversations[conversationID]) {
            return res.json({ message: 'Conversation not found!' });
        }
        delete userConversations[conversationID];
        // save it all into the memory:
        const updatedUser = await User.findOneAndUpdate({ _id: userID }, { userConversations: JSON.stringify(userConversations) }, { new: true, upsert: true });
        // and return the ai response:
        res.json({ ok: true, deleted: true})
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
});
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
        const userConversations = updatedUser.userConversations;
        if (userConversations) {
            res.json(JSON.parse(userConversations));
        } else {
            res.json({ ok: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;