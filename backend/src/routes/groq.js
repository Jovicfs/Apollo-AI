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
                content: "You  are Apollo helpful assistant!"
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

// delete chat history
// get chat history

const messageHistory = {};
async function groqChat(txt, userID) {
    // lets get the user message history (different for every user)
    let userMessages = messageHistory[userID]; // currently it doesn't support multiple history conversations per user - it only supports 1 history per 1 user
    if (!userMessages) {
        userMessages = [
            {
                role: "system",
                content: "You are ChatBot helpful assistant!"
            }
        ]
    }
    // add the new user message:
    userMessages.push({
        role: "user",
        content: txt
    });
    // then we take the user message history and feed it to groq - ai response
    const aiResponse = await groq.chat.completions.create({
        messages: userMessages,
        temperature: 0,
        max_tokens:1000,
        model: "llama3-70b-8192"
    })
    const aiResponseMessage = aiResponse.choices[0].message.content;
    // feed the ai response back into the user message history:
    userMessages.push({
        role: "assistant",
        content: aiResponseMessage
    });
    // save it all into the memory:
    messageHistory[userID] = userMessages;
    // and return the ai response:
    return aiResponseMessage;
}
module.exports = {
    main,
    getGroqChatCompletion,
    groqChat
};