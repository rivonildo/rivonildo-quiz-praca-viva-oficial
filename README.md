# 🌿 Praça Viva - Quiz e Catálogo Digital

**Praça Viva** é um projeto comunitário focado em unir tecnologia, educação ambiental e engajamento social. Desenvolvido como Projeto de Extensão do curso de Engenharia de Software (Universidade Anhanguera), a aplicação funciona como uma ponte interativa entre os moradores e a Praça Inteligente Santa Marta.

O sistema conta com um **Quiz Gamificado** sobre conscientização ambiental e um **Catálogo de Plantas (Medicinais e Frutíferas)** presentes na praça, promovendo o conhecimento popular e científico.

---

## 🎯 Objetivos
- Engajar crianças, jovens e adultos no cuidado com o meio ambiente.
- Preservar o conhecimento tradicional sobre plantas medicinais e frutíferas.
- Auxiliar no desenvolvimento cognitivo infantil por meio de contato guiado com a natureza.
- Transformar espaços públicos em ambientes educativos e de convivência.

---

## ✨ Funcionalidades

### 🎮 Quiz Gamificado
- **50 Perguntas Interativas:** Divididas em 5 níveis de dificuldade (Sabedoria, Infância, Descobertas, União, Futuro).
- **Acessibilidade Inclusiva (Narração):** Funcionalidade Text-to-Speech nativa com opção de escolher as vozes do navegador e controle de velocidade, permitindo que pessoas com dificuldade de leitura ou visão escutem o conteúdo.
- **Feedback Imediato:** Explicações claras a cada resposta, destacando "O que acontece se nada mudar" e "Como isso afeta a nossa praça".
- **Sistema de Pontuação e Progresso:** Barra de progresso visual e medalhas de desempenho ao finalizar o quiz.

### 📚 Catálogo Digital de Plantas
Catálogo acessível diretamente pelo portal principal com fichas detalhadas de 16 plantas da praça.
- **Plantas Medicinais:** Boldo, Hortelã, Erva-Cidreira, Capim-Santo, Babosa, Alecrim, Mastruz, Alfavaca.
- **Plantas Frutíferas:** Acerola, Goiaba, Pitanga, Jabuticaba, Limão, Laranja, Banana, Mamão.
- Fichas informativas contendo: benefícios, como consumir/usar, cuidados necessários e recados afetuosos da própria comunidade.

### 🌍 Outras Funcionalidades
- **Suporte Bilíngue:** Tradução instantânea de toda a interface entre Português e Inglês.
- **Compartilhamento Social:** Integração para divulgar resultados e a plataforma diretamente via WhatsApp e Facebook.
- **Pronto para Offline (PWA):** Suporte nativo à instalação no celular e navegação sem uso de internet (cache via Service Worker).

---

## 🛠️ Tecnologias Utilizadas
O projeto foi desenvolvido focando em leveza, acessibilidade e compatibilidade para rodar na maioria dos dispositivos móveis:
- **HTML5 (Semântico)**
- **CSS3 (Vanilla)** - CSS Grid, Flexbox e Design Responsivo.
- **JavaScript (ES6+)** - Lógica do quiz, narração inteligente (SpeechSynthesis API) e manipulação do DOM.
- **FontAwesome** para iconografia.

---

## 🌎 Alinhamento com a ONU (ODS)
Este projeto atende aos seguintes **Objetivos de Desenvolvimento Sustentável**:
- **ODS 3:** Saúde e Bem-Estar (benefícios das áreas verdes e plantas medicinais).
- **ODS 4:** Educação de Qualidade (quiz interativo e cartilhas das plantas).
- **ODS 11:** Cidades e Comunidades Sustentáveis (preservação do espaço público).
- **ODS 13:** Ação Contra a Mudança Global do Clima (conscientização e plantio de árvores).
- **ODS 15:** Vida Terrestre (proteção da flora local e atração de pássaros).

---

## 🚀 Como rodar o projeto localmente

Por ser um projeto puramente estático (Vanilla HTML/CSS/JS), não é necessário instalar dependências complexas.

1. Clone o repositório:
```bash
git clone https://github.com/rivonildo/rivonildo-quiz-praca-viva-oficial.git
```
2. Abra a pasta do projeto:
```bash
cd rivonildo-quiz-praca-viva-oficial-main
```
3. Abra o arquivo `index.html` em qualquer navegador web moderno.
*(Para testar funcionalidades avançadas como o Service Worker, recomenda-se abrir usando um servidor local simples, como a extensão "Live Server" no VSCode ou `npx serve`)*.

---

## 👨‍💻 Autor

**Rivonildo Azevedo**  
*Projeto de Extensão - Engenharia de Software*  
*Universidade Anhanguera*

## 🏗️ Arquitetura v2.0 (Modernização & DevSecOps)
Este projeto foi refatorado para operar como um sistema distribuído (Microsserviços), adotando as melhores práticas do mercado em engenharia de software e segurança:

### 🚀 Stack Tecnológica Atualizada
*   **Frontend (Vercel):** Hospedado em infraestrutura Edge (pracaviva.vml10.xyz), garantindo carregamento ultrarrápido (CDN) para acesso via QR Code.
*   **Backend (HostGator):** API REST em PHP 8+ com PDO seguro, servindo como ponte centralizada para banco de dados relacional.
*   **Database:** MySQL Server hospedando arquitetura de rastreamento com 3 tabelas (plantas_metricas, cessos_log, 
ate_limit_log).

### 🛡️ Segurança Aplicada (OWASP & LGPD)
*   **WAF (Web Application Firewall):** Módulo PHP nativo bloqueando injeções (XSS, Code Injection) e ofuscadores (ase64).
*   **Rate Limiting Anti-DDoS:** Sistema de contenção bloqueia automaticamente requisições após o limite de picos em menos de 1 minuto (status 429).
*   **Conformidade LGPD:** Em vez de salvar endereços IP puros dos usuários, aplica algoritmos de hash em tempo real (SHA-256) garantindo privacidade total aos cidadãos.
*   **Segurança no Banco (Blind SQLi):** Consultas rigidamente preparadas via PDO (Prepared Statements) e desligamento de emulações.

### 📊 Sistema de Rastreamento (Analytics Global)
*   **Captura de Geolocation:** Integração com APIs externas (ip-api.com) para obter Cidade, Fuso Horário e Estado do visitante.
*   **Hardware/Software Fingerprinting:** Detecção nativa do Sistema Operacional (iOS, Android, Windows) e Navegador do usuário para métricas de engajamento comunitário.

### ⚙️ CI/CD (Integração Contínua)
*   Deploy automatizado construído via **GitHub Actions** (.github/workflows/devsecops.yml), prevendo etapas de verificação estática de código e entrega na Vercel a cada *commit* na branch principal.
