document.getElementById('sendmsg').addEventListener('click', async function () {
    const text = document.getElementById('userMsg').value;
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
   
    const output = await fetch('http://localhost:3333/groq-chat', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text
        })
    });
    const outputJson = await output.text();
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
    document.getElementById('chatHistory').scrollTop = document.getElementById('chatHistory').scrollHeight;
})