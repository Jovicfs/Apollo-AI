let currentGlobalConversationID; // Variável para armazenar o ID da conversa atual
let allConversations = {}; // Objeto para armazenar todas as conversas

document.getElementById('userMsg').focus(); // Foca o campo de mensagem do usuário ao carregar a página

function createConversationButton(conversation, conversationID, createFromTop = false) {
    const conversations = document.getElementById('conversations'); // Obtém o elemento que contém a lista de conversas
    const btnConversation = document.createElement('p'); // Cria um elemento de parágrafo para a nova conversa
    btnConversation.classList.add('conversation-message'); // Adiciona a classe CSS para estilização

    const conversationSubject = document.createElement('span'); // Cria um span para o assunto da conversa
    const lastMessage = conversation.length > 0 ? conversation[conversation.length - 1].content : 'Nova Conversa'; // Obtém a última mensagem da conversa
    conversationSubject.textContent = lastMessage; // Define o texto do span como a última mensagem
    btnConversation.append(conversationSubject); // Adiciona o span ao parágrafo

    const deleteConversationBtn = document.createElement('span'); // Cria um span para o botão de excluir
    deleteConversationBtn.classList.add('trash-icon'); // Adiciona a classe CSS para o ícone de lixo
    deleteConversationBtn.textContent = '🗑️'; // Define o texto do botão de excluir como um ícone de lixo
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
                btnConversation.remove(); // Remove o botão da conversa da lista
                if (conversationID === currentGlobalConversationID) {
                    document.getElementById('currentConversation').innerHTML = ''; // Limpa a conversa atual
                }
                delete allConversations[conversationID]; // Remove a conversa do objeto allConversations
                document.getElementById('userMsg').focus(); // Foca o campo de mensagem do usuário
            } else {
                alert("Error while deleting..."); // Alerta em caso de erro
            }
        } catch (err) {
            console.error(err); // Loga o erro no console
        }
    });
    btnConversation.append(deleteConversationBtn); // Adiciona o botão de excluir ao parágrafo
    allConversations[conversationID] = conversation; // Adiciona a conversa ao objeto allConversations
    if (createFromTop) {
        conversations.prepend(btnConversation); // Adiciona a conversa ao topo da lista
    } else {
        conversations.append(btnConversation); // Adiciona a conversa ao final da lista
    }
    conversationSubject.addEventListener('click', function () {
        document.getElementById('userMsg').disabled = true; // Desabilita o campo de mensagem do usuário
        document.getElementById('sendmsg').disabled = true; // Desabilita o botão de enviar mensagem
        currentGlobalConversationID = conversationID; // Define a conversa atual
        document.getElementById('currentConversation').innerHTML = ''; // Limpa a conversa atual
        for (const msg of allConversations[conversationID]) { // Itera sobre todas as mensagens da conversa
            if (msg.role !== 'system') { // Ignora mensagens do sistema
                if (msg.role === 'user') {
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
                } else if (msg.role === 'assistant') {
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
        document.getElementById('userMsg').disabled = false; // Habilita o campo de mensagem do usuário
        document.getElementById('sendmsg').disabled = false; // Habilita o botão de enviar mensagem
        document.getElementById('userMsg').focus(); // Foca o campo de mensagem do usuário
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

    document.getElementById('userMsg').disabled = true; // Desabilita o campo de mensagem do usuário
    document.getElementById('sendmsg').disabled = true; // Desabilita o botão de enviar mensagem
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

    if (!allConversations[outputJson.id]) {
        allConversations[outputJson.id] = [];
        createConversationButton(allConversations[outputJson.id], outputJson.id, true);
    }

    allConversations[outputJson.id].push({
        role: 'user',
        content: text,
    });
    allConversations[outputJson.id].push({
        role: 'assistant',
        content: outputJson.text,
    });

    // Atualizando o texto do botão da conversa para a última mensagem do usuário
    const conversationButton = Array.from(document.querySelectorAll('.conversation-message')).find(
        el => el.textContent.includes(currentGlobalConversationID)
    );
    if (conversationButton) {
        conversationButton.querySelector('span').textContent = text;
    }

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

    document.getElementById('userMsg').disabled = false; // Habilita o campo de mensagem do usuário
    document.getElementById('sendmsg').disabled = false; // Habilita o botão de enviar mensagem
    document.getElementById('userMsg').focus(); // Foca o campo de mensagem do usuário
    // Rolando para baixo para exibir a última mensagem
    document.getElementById('currentConversation').scrollTop = document.getElementById('currentConversation').scrollHeight;
}

const msgForm = document.getElementById('msgForm');
// Adiciona um ouvinte de eventos ao botão de enviar mensagem
document.getElementById('sendmsg').addEventListener('click', (e) => {
    e.preventDefault();
    sendMessage();
    msgForm.reset();
});

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
    for (const conversationID of Object.keys(outputJson.userConversations).reverse()) {
        const conversation = outputJson.userConversations[conversationID];
        createConversationButton(conversation, conversationID);
    }
    // console.log(outputJson.username, outputJson.email)
    document.getElementById('my-user').textContent = outputJson.username;
}
fetchConversationHistory();

// Função para checar se o click foi fora do menu
const menuButton = document.getElementById('menuButton');
const menu = document.querySelector('.conversation-container');
let isMenuVisible = false;

// Fecha o menu quando o usuário clica no botão 'X'
document.getElementById('menuButtonX').addEventListener('click', function() {
    isMenuVisible = false;
    menu.classList.remove('menu-visible');
    menu.classList.remove('menu-fixed');
});

// Ouvinte de eventos para o botão do menu
menuButton.addEventListener('click', function(event) {
    isMenuVisible = !isMenuVisible;
    menu.classList.toggle('menu-visible', isMenuVisible);
    menu.classList.toggle('menu-fixed', isMenuVisible);
});
const menuCustomize = document.querySelector('.customize-menu')
// Ouvinte de eventos para cliques no documento
document.addEventListener('click', function(event){
    const target = event.target;
    if (!menu.contains(target) && target !==  menuButton && isMenuVisible && !menuCustomize.contains(target)) {
        menu.classList.remove('menu-visible');
        menu.classList.remove('menu-fixed');
        menuCustomize.style.display = 'none' 
    }
});

// Outros ouvintes de eventos permanecem inalterados
document.getElementById('my-user').addEventListener('click', function() {
    document.getElementById('user-menu').classList.toggle('show-menu');
    menuCustomize.style.display = 'none' 
});
