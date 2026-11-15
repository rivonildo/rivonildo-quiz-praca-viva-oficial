// URL DA SUA API
// Como o Frontend ficará na Vercel e o Backend na HostGator, usamos a URL absoluta da HostGator.
const API_URL = "https://rivonildoazevedo1775507219000.1732015.meusitehostgator.com.br/backend/api.php";

window.addEventListener("DOMContentLoaded", () => {
    // Pega o nome do arquivo atual (ex: "01_boldo.html" vira "01_boldo")
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
        console.error("Erro ao conectar com o banco de dados:", error);
    });
});
