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
        <p>If you don't have an account yet, <span class="register-link">click here</span> to register.</p>
    `;
    welcomeMessageContainer.innerHTML = welcomeMessageHTML;

    const registerLink = document.querySelector('.register-link');
    registerLink.addEventListener('click', function() {
        window.location.href = './register.html';
    });
}

// Call the function to display the welcome message
displayWelcomeMessage();

// Add event listener to the login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3333/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

      const data = await response.json();
         alert(data.message)
        if (response.ok) {
             window.location.href = './index.html';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
