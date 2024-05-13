
function displayWelcomeMessage() {
    const welcomeMessageContainer = document.querySelector('.welcome-message');
    const welcomeMessageHTML = `
        <h1>Welcome to ApolloAICat! 🚀🌟</h1>
        <p>Hello there! 👋 Welcome to ApolloAI, your trusted AI companion! Whether you're here to explore, learn, or seek assistance, I'm here to help you navigate through your queries and tasks seamlessly.</p>
        <p>Here are a few tips to get you started:</p>
        <ol>
            <li><strong>Ask Away:</strong> Don't hesitate to ask me anything! From general inquiries to specific tasks, I'm here to assist you 24/7.</li>
            <li><strong>Be Specific:</strong> The more details you provide in your questions, the better I can assist you. Clear and concise queries help me understand your needs more accurately.</li>
            <li><strong>Explore Features:</strong> Take your time to explore all the features ApolloAI has to offer. From answering questions to setting reminders, there's a lot I can do to make your life easier.</li>
            <li><strong>Feedback Matters:</strong> Your feedback helps me improve and tailor my responses to better suit your needs. Feel free to share your thoughts anytime!</li>
        </ol>
        <p>Thank you for choosing ApolloAI once again. Let's pick up where we left off and make your experience even better than before!</p>
        <p>Welcome back and let's continue this journey together! 🌌</p>
        <p>If you already have an account, <span class="register-link">click here</span> to Login.</p>
    `;
    welcomeMessageContainer.innerHTML = welcomeMessageHTML;

    const LoginLink = document.querySelector('.register-link');
    LoginLink.addEventListener('click', function() {
        window.location.href = '/login';
    });
}

displayWelcomeMessage();

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const email = document.getElementById('regEmail').value;   // Adicione essa linha para capturar o valor do campo de e-mail

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, email }) // Inclua o campo de e-mail no objeto enviado
        });

        const data = await response.json();
        alert(data.message)
        if (response.ok) {
           window.location.href = '/login'
        }
    } catch (error) {
        console.error('Error:', error);
    }
});


