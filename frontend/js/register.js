document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const email = document.getElementById('regEmail').value; // Adicione essa linha para capturar o valor do campo de e-mail

    try {
        const response = await fetch('http://localhost:3333/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, email }) // Inclua o campo de e-mail no objeto enviado
        });

        const data = await response.json();
        alert(data.message);
        if (response.ok) {
            // Redirect or do something after successful registration
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
