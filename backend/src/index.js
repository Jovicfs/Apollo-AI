const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const auth = require("./routes/auth.js");
const groq = require("./routes/groq.js");
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error('Error: MONGO_URI environment variable is not defined.');
    process.exit(1);
}
console.log(mongoUri);
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.post('/groq-chat', async (req, res) => {
    const aiOutput = await groq.groqChat(req.body.text);
    res.send(aiOutput.choices[0].message.content)
});

app.use("/auth", auth); // Mount the auth routes
// app.use("/groq", groq) // groq route

app.listen(port, function () {
    console.log('Server is running on port:', port);
});
