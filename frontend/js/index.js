let currentGlobalConversationID;
let allConversations = {};

document.getElementById('userMsg').focus();

function createConversationButton(conversation, conversationID, createFromTop = false) {
    const conversations = document.getElementById('conversations');
    const btnConversation = document.createElement('p');
    btnConversation.classList.add('conversation-message');
    const conversationSubject = document.createElement('span');
    conversationSubject.textContent = conversationID;
    btnConversation.append(conversationSubject);
    const deleteConversationBtn = document.createElement('span');
    deleteConversationBtn.classList.add('trash-icon');
    deleteConversationBtn.textContent = '🗑️';
    deleteConversationBtn.addEventListener('click', async function () {
        try {
            const response = await fetch('/chats/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: conversationID
                })
            });
            const outputJson = await response.json();
            if (outputJson.ok) {
                btnConversation.remove();
                if (conversationID === currentGlobalConversationID) {
                    document.getElementById('currentConversation').innerHTML = '';
                }
                delete allConversations[conversationID];
                document.getElementById('userMsg').focus();
            } else {
                alert("Error while deleting...");
            }
        } catch (err) {
            console.error(err);
        }
    });
    btnConversation.append(deleteConversationBtn);
    allConversations[conversationID] = conversation;
    if (createFromTop) {
        conversations.prepend(btnConversation);
    } else {
        conversations.append(btnConversation);
    }
    conversationSubject.addEventListener('click', function () {
        document.getElementById('userMsg').disabled = true;
        document.getElementById('sendmsg').disabled = true;
        currentGlobalConversationID = conversationID;
        document.getElementById('currentConversation').innerHTML = '';
        for (const msg of allConversations[conversationID]) {
            if (msg.role != 'system') {
                if (msg.role == 'user') {
                    document.getElementById('currentConversation').innerHTML += `
                    <div class="single-msg">
                        <div class="msg-img you"></div>
                        <div class="msg-container-you">
                            <div class="msg-txt">
                                ${msg.content}
                            </div>
                        </div>
                    </div>
                    `;
                } else if (msg.role == 'assistant') {
                    document.getElementById('currentConversation').innerHTML += `
                    <div class="single-msg">
                        <div class="msg-img ai"></div>
                        <div class="msg-container-ai">
                            <div class="msg-txt">
                                ${msg.content}
                            </div>
                        </div>
                    </div>
                    `;
                }
            }
        }
        document.getElementById('userMsg').disabled = false;
        document.getElementById('sendmsg').disabled = false;
        document.getElementById('userMsg').focus();
        // Rolando para baixo para exibir a última mensagem
        document.getElementById('currentConversation').scrollTop = document.getElementById('currentConversation').scrollHeight;
    });
}

// Função para enviar uma mensagem
async function sendMessage() {
    // Obtém o texto digitado pelo usuário
    const text = document.getElementById('userMsg').value.trim();

    // Validação do texto inserido pelo usuário
    if (!text) {
        alert('Por favor, insira uma mensagem.');
        return;
    }

    document.getElementById('userMsg').disabled = true;
    document.getElementById('sendmsg').disabled = true;
    // Exibindo a mensagem do usuário no histórico de bate-papo
    document.getElementById('currentConversation').innerHTML += `
    <div class="single-msg">
        <div class="msg-img you"></div>
        <div class="msg-container-you">
            <div class="msg-txt">
                ${text}
            </div>
        </div>
    </div>
    `;

    // Limpa o campo de entrada após o envio da mensagem
    document.getElementById('userMsg').value = '';
    document.getElementById('userMsg').disabled = false;
    document.getElementById('sendmsg').disabled = false;

    // Enviando a mensagem para o servidor
    const response = await fetch('/chats/ai', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text,
            id: currentGlobalConversationID
        })
    });

    // Processando a resposta do servidor
    const outputJson = await response.json();

    // document.title = outputJson.id;
    if (!allConversations[outputJson.id]) {
        allConversations[outputJson.id] = [];
        createConversationButton(allConversations[outputJson.id], outputJson.id, true)
    }
    allConversations[outputJson.id].push({
        role: 'user',
        content: text,
    });
    allConversations[outputJson.id].push({
        role: 'assistant',
        content: outputJson.text,
    });

    // Exibindo a resposta do servidor no histórico de bate-papo
    document.getElementById('currentConversation').innerHTML += `
    <div class="single-msg">
        <div class="msg-img ai"></div>
        <div class="msg-container-ai">
            <div class="msg-txt">
                ${outputJson.text}
            </div>
        </div>
    </div>
    `;

    // Rolando para baixo para exibir a última mensagem
    document.getElementById('currentConversation').scrollTop = document.getElementById('currentConversation').scrollHeight;
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

document.getElementById('clearChat').addEventListener('click', function () {
    document.getElementById('currentConversation').innerHTML = '';
    currentGlobalConversationID = undefined;
});

async function fetchConversationHistory() {
    const response = await fetch('/chats/load', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const outputJson = await response.json();
    if (outputJson.error) {
        window.location.href = '/auth/logout';
        return;
    }
    for (const conversationID of Object.keys(outputJson).reverse()) {
        const conversation = outputJson[conversationID];
        createConversationButton(conversation, conversationID);
    }
}
fetchConversationHistory();