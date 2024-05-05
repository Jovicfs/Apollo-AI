// Função para enviar uma mensagem
async function sendMessage() {
    // Obtém o texto digitado pelo usuário
    const text = document.getElementById('userMsg').value.trim();

    // Validação do texto inserido pelo usuário
    if (!text) {
        alert('Por favor, insira uma mensagem.');
        return;
    }

    // Exibindo a mensagem do usuário no histórico de bate-papo
    document.getElementById('chatHistory').innerHTML += `
    <div class="single-msg">
        <div class="msg-img you"></div>
        <div class="msg-container-you">
            <div class="msg-txt">
                ${text}
            </div>
        </div>
    </div>
    `;

    // Enviando a mensagem para o servidor
    const response = await fetch('http://localhost:3333/groq-chat', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text
        })
    });

    // Processando a resposta do servidor
    const outputJson = await response.text();

    // Exibindo a resposta do servidor no histórico de bate-papo
    document.getElementById('chatHistory').innerHTML += `
    <div class="single-msg">
        <div class="msg-img ai"></div>
        <div class="msg-container-ai">
            <div class="msg-txt">
                ${outputJson}
            </div>
        </div>
    </div>
    `;

    // Limpa o campo de entrada após o envio da mensagem
    document.getElementById('userMsg').value = '';

    // Rolando para baixo para exibir a última mensagem
    document.getElementById('chatHistory').scrollTop = document.getElementById('chatHistory').scrollHeight;
}

// Adiciona um ouvinte de eventos ao botão de enviar mensagem
document.getElementById('sendmsg').addEventListener('click', sendMessage);

// Adiciona um ouvinte de eventos ao campo de entrada de texto
document.getElementById('userMsg').addEventListener('keypress', function (e) {
    // Verifica se a tecla pressionada é "Enter" (código 13)
    if (e.key === 'Enter') {
        // Evita que o formulário seja enviado (evita recarregar a página)
        e.preventDefault();
        // Chama a função para enviar a mensagem
        sendMessage();
    }
});