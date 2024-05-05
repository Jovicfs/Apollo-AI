"use strict";
const { text } = require("express");
const Groq = require("groq-sdk");
require('dotenv').config()
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
async function main() {
    const chatCompletion = await getGroqChatCompletion();
    // Print the completion returned by the LLM.
    process.stdout.write(chatCompletion.choices[0]?.message?.content || "");
}
async function getGroqChatCompletion() {
    return groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You  are ChatBot helpful assistant!"
            },
            {
                role: "user",
                content: "Explain the importance of fast language models"
            }
        ],
        temperature: 0,
        model: "llama3-70b-8192"
    });
}
async function groqChat(txt) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You  are ChatBot helpful assistant!"
            },
            {
                role: "user",
                content: txt
            }
        ],
        temperature: 0,
        max_tokens:1000,
        model: "llama3-70b-8192"
    });
}
module.exports = {
    main,
    getGroqChatCompletion,
    groqChat
};