document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch('http://localhost:3333/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
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