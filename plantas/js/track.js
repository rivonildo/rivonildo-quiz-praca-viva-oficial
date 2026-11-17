// URL DA SUA API (Mantida intacta conforme planejado para a HostGator)
const API_URL = "https://rivonildoazevedo1775507219000.1732015.meusitehostgator.com.br/backend/api.php";

window.addEventListener("DOMContentLoaded", () => {
    // 1. Rastreamento de Métricas (HostGator)
    let urlPath = window.location.pathname;
    let filename = urlPath.substring(urlPath.lastIndexOf('/') + 1);
    let plantaId = filename.replace('.html', '');

    if (!plantaId) plantaId = "desconhecida";

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            acao: "registrar_visualizacao",
            planta_id: plantaId
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Métrica registrada:", data);
    })
    .catch(error => {
        console.warn("Aviso de conexão com o banco de métricas:", error);
    });

    // 2. Acessibilidade de Voz: Narração Nativa da Planta (Web Speech API)
    inicializarNarradorPlanta();
});

function inicializarNarradorPlanta() {
    if (!('speechSynthesis' in window)) return;

    const cabecalho = document.querySelector('.cabecalho');
    if (!cabecalho) return;

    // Criar botão de áudio moderno e acessível
    const audioContainer = document.createElement('div');
    audioContainer.style.margin = '15px auto';
    audioContainer.style.textAlign = 'center';

    const btnAudio = document.createElement('button');
    btnAudio.id = 'btn-ouvir-planta';
    btnAudio.innerHTML = '🔊 Ouvir sobre esta planta';
    btnAudio.style.backgroundColor = '#2e7d32';
    btnAudio.style.color = '#ffffff';
    btnAudio.style.border = 'none';
    btnAudio.style.padding = '12px 20px';
    btnAudio.style.borderRadius = '25px';
    btnAudio.style.fontSize = '1rem';
    btnAudio.style.fontWeight = 'bold';
    btnAudio.style.cursor = 'pointer';
    btnAudio.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
    btnAudio.style.transition = 'all 0.3s ease';

    btnAudio.onmouseover = () => { btnAudio.style.backgroundColor = '#1b5e20'; };
    btnAudio.onmouseout = () => { if (!window.speechSynthesis.speaking) btnAudio.style.backgroundColor = '#2e7d32'; };

    let falando = false;

    btnAudio.onclick = () => {
        if (falando) {
            window.speechSynthesis.cancel();
            falando = false;
            btnAudio.innerHTML = '🔊 Ouvir sobre esta planta';
            btnAudio.style.backgroundColor = '#2e7d32';
            return;
        }

        // Extrair texto relevante sem emojis
        const titulo = document.querySelector('.cabecalho h1') ? document.querySelector('.cabecalho h1').innerText : '';
        const blocos = Array.from(document.querySelectorAll('.info-bloco, .destaque, .mensagem')).map(b => b.innerText).join('. ');
        const textoCompleto = `${titulo}. ${blocos}`.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2702}-\u{27B0}\u{24C2}-\u{1F251}🌿💚🍵📌✅⚠️🌍🔄💬—]/gu, '');

        const utterance = new SpeechSynthesisUtterance(textoCompleto);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.0;

        utterance.onstart = () => {
            falando = true;
            btnAudio.innerHTML = '⏹️ Parar narração';
            btnAudio.style.backgroundColor = '#d32f2f';
        };

        utterance.onend = () => {
            falando = false;
            btnAudio.innerHTML = '🔊 Ouvir sobre esta planta';
            btnAudio.style.backgroundColor = '#2e7d32';
        };

        utterance.onerror = () => {
            falando = false;
            btnAudio.innerHTML = '🔊 Ouvir sobre esta planta';
            btnAudio.style.backgroundColor = '#2e7d32';
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    audioContainer.appendChild(btnAudio);
    cabecalho.parentNode.insertBefore(audioContainer, cabecalho.nextSibling);
}
