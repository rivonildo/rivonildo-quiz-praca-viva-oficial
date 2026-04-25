// ==================== PWA - SERVICE WORKER ====================
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                // Tenta registrar o service worker, mas não cria o arquivo automaticamente
                navigator.serviceWorker.register('service-worker.js').then(function(registration) {
                    console.log('ServiceWorker registrado com sucesso:', registration.scope);
                }, function(err) {
                    console.log('ServiceWorker não encontrado. O app funcionará normalmente, mas sem recursos offline.');
                });
            });
        }

        // ==================== OFFLINE DETECTION ====================
        const offlineIndicator = document.getElementById('offlineIndicator');
        
        function updateOnlineStatus() {
            if (navigator.onLine) {
                offlineIndicator.classList.remove('show');
            } else {
                offlineIndicator.classList.add('show');
            }
        }

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        updateOnlineStatus();

        // ==================== PWA INSTALL PROMPT ====================
        let deferredPrompt;
        const installPrompt = document.getElementById('installPrompt');
        const installBtn = document.getElementById('installBtn');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installPrompt.classList.add('show');
        });

        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('Usuário aceitou instalar o app');
                installPrompt.classList.remove('show');
            }
            deferredPrompt = null;
        });

        window.addEventListener('appinstalled', () => {
            console.log('App instalado com sucesso!');
            installPrompt.classList.remove('show');
        });

        // ==================== DICIONÁRIO DE TRADUÇÃO ====================
        let currentLang = 'pt';
        const translateBtn = document.getElementById('translateBtn');
        const translateText = document.getElementById('translateText');

        const translations = {
            '.main-title': { pt: 'QUIZ DA PRAÇA VIVA', en: 'LIVING SQUARE QUIZ' },
            '.indicator-text': { pt: 'Role a página para começar o quiz!', en: 'Scroll down to start the quiz!' },
            '.badge-text': [
                { pt: '50 perguntas', en: '50 questions' },
                { pt: 'Crianças', en: 'Children' },
                { pt: 'Comunidade', en: 'Community' },
                { pt: 'Natureza', en: 'Nature' }
            ],
            '.intro-question': { pt: 'Você já parou pra pensar no poder que uma simples praça tem?', en: 'Have you ever stopped to think about the power a simple square has?' },
            '.intro-paragraph': { pt: '🌱 Vamos fazer desse espaço casa de passarinhos, sorriso de crianças, encontro de vizinhos e esperança de um futuro melhor. Vem com a gente?', en: '🌱 Let\'s make this space a home for birds, children\'s smiles, neighbor gatherings, and hope for a better future. Come with us?' },
            '.stat-label': [
                { pt: 'PERGUNTAS', en: 'QUESTIONS' },
                { pt: 'ACERTOS', en: 'SCORE' },
                { pt: 'NÍVEL', en: 'LEVEL' }
            ],
            '.level-text': [
                { pt: 'Sabedoria', en: 'Wisdom' },
                { pt: 'Infância', en: 'Childhood' },
                { pt: 'Descobertas', en: 'Discoveries' },
                { pt: 'União', en: 'Unity' },
                { pt: 'Futuro', en: 'Future' }
            ],
            '.shuffle-text': { pt: 'Misturar', en: 'Shuffle' },
            '.reset-text': { pt: 'Original', en: 'Original' },
            '.share-text': { pt: 'Compartilhar', en: 'Share' },
            '.ods-text': { pt: '11 (Cidades), 4 (Educação), 15 (Vida) e 3 (Saúde)', en: '11 (Cities), 4 (Education), 15 (Life) and 3 (Health)' },
            '.status-text': [
                { pt: 'Narrador 1', en: 'Narrator 1' },
                { pt: 'Narrador 2', en: 'Narrator 2' }
            ],
            '.prev-text': { pt: 'Voltar', en: 'Back' },
            '.next-text': { pt: 'Próxima', en: 'Next' },
            '.learn-title': { pt: 'A NATUREZA FAZ BEM', en: 'NATURE DOES GOOD' },
            '.concept-title': [
                { pt: 'Cérebro feliz', en: 'Happy brain' },
                { pt: 'Passarinhos', en: 'Little birds' },
                { pt: 'Gente unida', en: 'United people' },
                { pt: 'Fresquinho', en: 'Freshness' }
            ],
            '.concept-text': [
                { pt: 'Crianças que brincam em praças têm mais facilidade para aprender e menos estresse.', en: 'Children who play in squares find it easier to learn and have less stress.' },
                { pt: 'Com as árvores frutíferas, os pássaros estão voltando! Eles enchem a praça de música.', en: 'With fruit trees, birds are returning! They fill the square with music.' },
                { pt: 'Crianças brincam, idosos conversam, jovens se encontram. A solidão tem menos espaço.', en: 'Children play, seniors talk, young people meet. Loneliness has less space.' },
                { pt: 'Uma árvore adulta refresca como 5 ar-condicionados ligados! E de graça.', en: 'A mature tree cools like 5 air conditioners on! And for free.' }
            ],
            '.tip-text': { pt: 'crianças perto de áreas verdes têm menos problemas.', en: 'children near green areas have fewer problems.' },
            '.whatsapp-text': { pt: 'Grupo da comunidade', en: 'Community group' },
            '.share-footer-text': { pt: 'Compartilhe', en: 'Share' },
            '.footer-text': { pt: 'Tecnologia que aproxima pessoas e natureza', en: 'Technology that brings people and nature together' },
            '.modal-title': { pt: 'Compartilhe', en: 'Share' },
            '.modal-text': { pt: 'Chame mais gente para aprender com a gente!', en: 'Call more people to learn with us!' },
            '.close-text': { pt: 'Fechar', en: 'Close' },
            '.offline-text': { pt: 'Modo offline - Você pode continuar aprendendo!', en: 'Offline mode - You can keep learning!' },
            'translateBtnText': { pt: 'Traduzir para Inglês', en: 'Translate to Portuguese' },
            'questionCountPrefix': { pt: 'QUESTÃO', en: 'QUESTION' }
        };

        function translatePage() {
            translateText.textContent = translations['translateBtnText'][currentLang];
            
            document.querySelectorAll('.badge-text').forEach((el, index) => {
                if (index < translations['.badge-text'].length) {
                    el.textContent = translations['.badge-text'][index][currentLang];
                }
            });

            document.querySelectorAll('.status-text').forEach((el, index) => {
                if (index < translations['.status-text'].length) {
                    el.textContent = translations['.status-text'][index][currentLang];
                }
            });

            document.querySelectorAll('.level-text').forEach((el, index) => {
                if (index < translations['.level-text'].length) {
                    el.textContent = translations['.level-text'][index][currentLang];
                }
            });

            document.querySelectorAll('.concept-title').forEach((el, index) => {
                if (index < translations['.concept-title'].length) {
                    el.textContent = translations['.concept-title'][index][currentLang];
                }
            });

            document.querySelectorAll('.concept-text').forEach((el, index) => {
                if (index < translations['.concept-text'].length) {
                    el.textContent = translations['.concept-text'][index][currentLang];
                }
            });

            document.querySelectorAll('.stat-label').forEach((el, index) => {
                if (index < translations['.stat-label'].length) {
                    el.textContent = translations['.stat-label'][index][currentLang];
                }
            });

            document.querySelector('.msg-pt').style.display = currentLang === 'pt' ? 'inline' : 'none';
            document.querySelector('.msg-en').style.display = currentLang === 'en' ? 'inline' : 'none';
            
            const offlineText = document.querySelector('.offline-text');
            if (offlineText && translations['.offline-text']) {
                offlineText.textContent = translations['.offline-text'][currentLang];
            }

            const questionCountPrefix = document.querySelector('.question-count');
            if (questionCountPrefix) {
                const number = questionCountPrefix.innerHTML.match(/\d+/g);
                if (number) {
                    questionCountPrefix.innerHTML = `${translations['questionCountPrefix'][currentLang]} <span id="current-q">${number[0]}</span>/50`;
                }
            }

            const singleElements = [
                '.main-title', '.indicator-text', '.intro-question', '.intro-paragraph',
                '.shuffle-text', '.reset-text', '.share-text', '.ods-text',
                '.prev-text', '.next-text', '.learn-title', '.tip-text',
                '.whatsapp-text', '.share-footer-text', '.footer-text',
                '.modal-title', '.modal-text', '.close-text'
            ];

            singleElements.forEach(selector => {
                const el = document.querySelector(selector);
                if (el && translations[selector]) {
                    el.textContent = translations[selector][currentLang];
                }
            });

            if (typeof quizData !== 'undefined' && quizData.length > 0) {
                loadQuestion();
            }
        }

        translateBtn.addEventListener('click', () => {
            currentLang = currentLang === 'pt' ? 'en' : 'pt';
            translatePage();
        });

        // ==================== IA COMPORTAMENTAL ====================
        const scrollIndicator = document.getElementById('scrollIndicator');
        let hasScrolled = false;
        let hasIndicatorShown = false;

        window.addEventListener('scroll', () => {
            if (!hasScrolled && window.scrollY > 100) {
                hasScrolled = true;
                scrollIndicator.style.display = 'none';
            }
        });

        setTimeout(() => {
            if (!hasScrolled && !hasIndicatorShown) {
                scrollIndicator.style.display = 'flex';
                hasIndicatorShown = true;
                setTimeout(() => {
                    if (!hasScrolled) {
                        scrollIndicator.style.opacity = '0';
                        setTimeout(() => {
                            scrollIndicator.style.display = 'none';
                        }, 1000);
                    }
                }, 15000);
            }
        }, 30000);

        // ==================== NARRAÇÃO ====================
        let introSynthesis = window.speechSynthesis;
        let introUtterance = null;
        let introVoices = [];
        let quizSynthesis = window.speechSynthesis;
        let quizUtterance = null;
        let quizVoices = [];

        const introPlayBtn = document.getElementById('introPlayBtn');
        const introPauseBtn = document.getElementById('introPauseBtn');
        const introStopBtn = document.getElementById('introStopBtn');
        const introVoiceSelect = document.getElementById('introVoiceSelect');
        const introRateControl = document.getElementById('introRateControl');
        const introStatus = document.getElementById('introStatus').querySelector('span');

        const quizPlayBtn = document.getElementById('quizPlayBtn');
        const quizPauseBtn = document.getElementById('quizPauseBtn');
        const quizStopBtn = document.getElementById('quizStopBtn');
        const quizVoiceSelect = document.getElementById('quizVoiceSelect');
        const quizRateControl = document.getElementById('quizRateControl');
        const quizStatus = document.getElementById('quizStatus').querySelector('span');

        // Variável para controlar se a narração automática está ativa
        let autoNarrationEnabled = false;

        function cleanTextForNarration(text) {
            if (!text) return '';
            
            // Remove emojis e símbolos especiais, mantendo apenas texto e pontuação básica
            return text
                // Remove emojis e ícones (range de emojis Unicode)
                .replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
                // Remove símbolos comuns que não devem ser lidos
                .replace(/[🌿🌳🌱🍃🌸🌺🌻🌼🌷🍀🍁🍂🍃🌲🎋🎍🎑🎄🎆🎇✨🎈🎉🎊]/g, '')
                // Remove ícones do Font Awesome (são representados como caracteres especiais)
                .replace(/[\uE000-\uF8FF]/g, '')
                // Remove múltiplos espaços
                .replace(/\s+/g, ' ')
                // Remove pontuação excessiva
                .replace(/[•●○■◆★☆♥♦♣♠▪▫▬▲▼►◄◊○◌◍◎●◐◑◒◓◔◕◖◗◘◙◚◛◜◝◞◟◠◡◢◣◤◥◦◧◨◩◪◫◬◭◮◯]/g, '')
                // Remove caracteres de borda/box drawing
                .replace(/[┌─┐│├┼┘└┴┬┤┴╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬╭╮╯╰]/g, '')
                .trim();
        }

        function getIntroText() {
            const introText = document.querySelector('.intro-text').innerText || '';
            const learnMoreTitle = document.querySelector('.learn-more h3').innerText || '';
            const conceptCards = Array.from(document.querySelectorAll('.concept-card p')).map(p => p.innerText).join(' ');
            const tip = document.querySelector('.learn-more div[style*="background: var(--verde-suave)"]')?.innerText || '';
            return cleanTextForNarration(`Bem-vindo ao Quiz da Praça Viva. ${introText} ${learnMoreTitle}. ${conceptCards} ${tip}`);
        }

        function loadVoices() {
            if (window.speechSynthesis) {
                introVoices = window.speechSynthesis.getVoices();
                introVoiceSelect.innerHTML = '';
                quizVoices = window.speechSynthesis.getVoices();
                quizVoiceSelect.innerHTML = '';
                
                const ptVoices = introVoices.filter(voice => voice.lang.includes('pt'));
                const otherVoices = introVoices.filter(voice => !voice.lang.includes('pt'));
                
                [...ptVoices, ...otherVoices].forEach(voice => {
                    const option1 = document.createElement('option');
                    option1.value = voice.name;
                    option1.textContent = `${voice.name} (${voice.lang})`;
                    introVoiceSelect.appendChild(option1);
                    
                    const option2 = document.createElement('option');
                    option2.value = voice.name;
                    option2.textContent = `${voice.name} (${voice.lang})`;
                    quizVoiceSelect.appendChild(option2);
                });
                
                if (ptVoices.length > 0) {
                    introVoiceSelect.value = ptVoices[0].name;
                    quizVoiceSelect.value = ptVoices[0].name;
                }
            }
        }

        if (window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
            loadVoices();
        }

        function getQuestionOnlyText() {
            const questionEl = document.getElementById('question-text');
            const options = Array.from(document.querySelectorAll('.option-btn span:last-child')).map(span => span.innerText);
            return cleanTextForNarration(`Pergunta: ${questionEl.innerText}. Opções: ${options.join('. ')}.`);
        }

        function getFeedbackText(isCorrect, q) {
            let text = isCorrect ? (currentLang === 'pt' ? 'Parabéns! Você acertou! ' : 'Congratulations! You got it right! ') : 
                (currentLang === 'pt' ? `Que pena! Você errou. A resposta correta é: ${q.options[q.correct]}. ` : 
                `Too bad! You got it wrong. The correct answer is: ${q.options[q.correct]}. `);
            text += (currentLang === 'pt' ? `Explicação: ${q.explanation}. Se nada mudar: ${q.consequence}. Na nossa praça: ${q.connection}` : 
                `Explanation: ${q.explanation_en || q.explanation}. If nothing changes: ${q.consequence_en || q.consequence}. In our square: ${q.connection_en || q.connection}`);
            return cleanTextForNarration(text);
        }

        // Função para narrar a pergunta atual
        function narrateCurrentQuestion() {
            if (!autoNarrationEnabled) return; // Só narra se estiver ativado
            
            if (quizSynthesis.speaking) quizSynthesis.cancel();
            const text = getQuestionOnlyText();
            if (!text) return;
            
            quizUtterance = new SpeechSynthesisUtterance(text);
            const selectedVoice = quizVoices.find(v => v.name === quizVoiceSelect.value);
            if (selectedVoice) quizUtterance.voice = selectedVoice;
            quizUtterance.rate = parseFloat(quizRateControl.value);
            quizUtterance.lang = 'pt-BR';
            quizUtterance.onStart = () => quizStatus.textContent = currentLang === 'pt' ? 'Lendo...' : 'Reading...';
            quizUtterance.onEnd = () => quizStatus.textContent = currentLang === 'pt' ? 'Pronto' : 'Ready';
            quizUtterance.onError = () => quizStatus.textContent = currentLang === 'pt' ? 'Erro' : 'Error';
            quizSynthesis.speak(quizUtterance);
        }

        introPlayBtn.addEventListener('click', () => {
            if (introSynthesis.speaking && introSynthesis.paused) {
                introSynthesis.resume();
                introStatus.textContent = currentLang === 'pt' ? 'Ouvindo...' : 'Listening...';
                return;
            }
            if (introSynthesis.speaking) introSynthesis.cancel();
            const text = getIntroText();
            if (!text) return;
            introUtterance = new SpeechSynthesisUtterance(text);
            const selectedVoice = introVoices.find(v => v.name === introVoiceSelect.value);
            if (selectedVoice) introUtterance.voice = selectedVoice;
            introUtterance.rate = parseFloat(introRateControl.value);
            introUtterance.lang = 'pt-BR';
            introUtterance.onStart = () => introStatus.textContent = currentLang === 'pt' ? 'Ouvindo...' : 'Listening...';
            introUtterance.onEnd = () => introStatus.textContent = currentLang === 'pt' ? 'Pronto' : 'Ready';
            introUtterance.onError = () => introStatus.textContent = currentLang === 'pt' ? 'Erro' : 'Error';
            introSynthesis.speak(introUtterance);
        });

        introPauseBtn.addEventListener('click', () => {
            if (introSynthesis.speaking && !introSynthesis.paused) introSynthesis.pause();
        });

        introStopBtn.addEventListener('click', () => {
            if (introSynthesis.speaking) {
                introSynthesis.cancel();
                introStatus.textContent = currentLang === 'pt' ? 'Parado' : 'Stopped';
            }
        });

        introRateControl.addEventListener('input', (e) => {
            if (introUtterance && introSynthesis.speaking) introUtterance.rate = parseFloat(e.target.value);
        });

        quizPlayBtn.addEventListener('click', () => {
            // Ativa a narração automática quando o usuário clica no play
            autoNarrationEnabled = true;
            
            if (quizSynthesis.speaking && quizSynthesis.paused) {
                quizSynthesis.resume();
                quizStatus.textContent = currentLang === 'pt' ? 'Lendo...' : 'Reading...';
                return;
            }
            if (quizSynthesis.speaking) quizSynthesis.cancel();
            const text = getQuestionOnlyText();
            if (!text) return;
            quizUtterance = new SpeechSynthesisUtterance(text);
            const selectedVoice = quizVoices.find(v => v.name === quizVoiceSelect.value);
            if (selectedVoice) quizUtterance.voice = selectedVoice;
            quizUtterance.rate = parseFloat(quizRateControl.value);
            quizUtterance.lang = 'pt-BR';
            quizUtterance.onStart = () => quizStatus.textContent = currentLang === 'pt' ? 'Lendo...' : 'Reading...';
            quizUtterance.onEnd = () => quizStatus.textContent = currentLang === 'pt' ? 'Pronto' : 'Ready';
            quizUtterance.onError = () => quizStatus.textContent = currentLang === 'pt' ? 'Erro' : 'Error';
            quizSynthesis.speak(quizUtterance);
        });

        quizPauseBtn.addEventListener('click', () => {
            if (quizSynthesis.speaking && !quizSynthesis.paused) quizSynthesis.pause();
        });

        quizStopBtn.addEventListener('click', () => {
            // Desativa a narração automática quando o usuário clica em parar
            autoNarrationEnabled = false;
            
            if (quizSynthesis.speaking) {
                quizSynthesis.cancel();
                quizStatus.textContent = currentLang === 'pt' ? 'Parado' : 'Stopped';
            }
        });

        quizRateControl.addEventListener('input', (e) => {
            if (quizUtterance && quizSynthesis.speaking) quizUtterance.rate = parseFloat(e.target.value);
        });

        function readFeedback(isCorrect, q) {
            if (quizSynthesis.speaking) quizSynthesis.cancel();
            const text = getFeedbackText(isCorrect, q);
            if (!text) return;
            quizUtterance = new SpeechSynthesisUtterance(text);
            const selectedVoice = quizVoices.find(v => v.name === quizVoiceSelect.value);
            if (selectedVoice) quizUtterance.voice = selectedVoice;
            quizUtterance.rate = parseFloat(quizRateControl.value);
            quizUtterance.lang = 'pt-BR';
            quizUtterance.onStart = () => quizStatus.textContent = currentLang === 'pt' ? 'Explicação...' : 'Explanation...';
            quizUtterance.onEnd = () => quizStatus.textContent = currentLang === 'pt' ? 'Pronto' : 'Ready';
            quizUtterance.onError = () => quizStatus.textContent = currentLang === 'pt' ? 'Erro' : 'Error';
            quizSynthesis.speak(quizUtterance);
        }

        // ==================== QUIZ COMPLETO (50 PERGUNTAS) ====================
        const quizData = [
            // ===== NÍVEL 1: SABEDORIA POPULAR (10 perguntas) =====
            {
                question: "Qual plantinha sua avó usava pra fazer chá quando a barriga estava doendo?",
                question_en: "Which little plant did your grandmother use to make tea when your stomach hurt?",
                options: ["Hortelã", "Boldo", "Alecrim", "Babosa"],
                options_en: ["Mint", "Boldo", "Rosemary", "Aloe vera"],
                correct: 1,
                explanation: "O boldo é aquele chá amargo que a gente faz careta, mas que ajuda demais na digestão! Esse conhecimento vem dos nossos avós e é um tesouro da nossa comunidade.",
                explanation_en: "Boldo is that bitter tea that makes us make faces, but it helps a lot with digestion! This knowledge comes from our grandparents and is a treasure of our community.",
                consequence: "Se a gente não valorizar esse saber, perdemos não só o remédio natural, mas também as histórias e os momentos de cuidar uns dos outros.",
                consequence_en: "If we don't value this knowledge, we lose not only the natural remedy, but also the stories and moments of caring for each other.",
                connection: "Na nossa praça tem boldo plantado! Quando passar, colha uma folha, sinta o cheiro e lembre de quem te ensinou.",
                connection_en: "In our square there is boldo planted! When you pass by, pick a leaf, smell it and remember who taught you."
            },
            {
                question: "Qual dessas plantas é brasileira e muito usada pra fazer chá calmante?",
                question_en: "Which of these plants is Brazilian and widely used to make calming tea?",
                options: ["Alecrim", "Lavanda", "Capim-santo", "Hortelã"],
                options_en: ["Rosemary", "Lavender", "Lemongrass", "Mint"],
                correct: 2,
                explanation: "O capim-santo é nosso! Cresce bonito no Brasil e aquele cheirinho de limão já acalma a gente antes mesmo de tomar o chá.",
                explanation_en: "Lemongrass is ours! It grows beautifully in Brazil and that lemony scent calms us even before drinking the tea.",
                consequence: "Desconhecer nossas plantas é como esquecer um pedaço da nossa história e da nossa terra.",
                consequence_en: "Not knowing our plants is like forgetting a piece of our history and our land.",
                connection: "Sinta o cheirinho de capim-santo na praça. É o Brasil cuidando de você.",
                connection_en: "Feel the smell of lemongrass in the square. It's Brazil taking care of you."
            },
            {
                question: "Por que é tão importante conversar com os mais velhos sobre as plantas?",
                question_en: "Why is it so important to talk to the elderly about plants?",
                options: [
                    "Porque eles não têm mais o que fazer",
                    "Porque eles guardam segredos que a ciência não descobriu",
                    "Porque eles aprenderam com os pais deles, numa corrente de sabedoria que não pode ser quebrada"
                ],
                options_en: [
                    "Because they have nothing else to do",
                    "Because they keep secrets that science hasn't discovered",
                    "Because they learned from their parents, in a chain of wisdom that cannot be broken"
                ],
                correct: 2,
                explanation: "Nossos idosos são bibliotecas vivas! Eles sabem qual planta serve pra cada coisa, como preparar, quando colher. É uma sabedoria que vem de muitas gerações.",
                explanation_en: "Our elderly are living libraries! They know which plant serves for each thing, how to prepare, when to harvest. It is wisdom that comes from many generations.",
                consequence: "Quando eles se vão sem ensinar, perdemos para sempre esse conhecimento. Nossos netos vão perguntar e a gente não vai saber responder.",
                consequence_en: "When they leave without teaching, we lose this knowledge forever. Our grandchildren will ask and we won't know how to answer.",
                connection: "Senta com seu avô ou sua avó num banco da praça. Pergunta sobre as plantas da infância deles. Você vai se emocionar.",
                connection_en: "Sit with your grandfather or grandmother on a bench in the square. Ask about the plants from their childhood. You will be moved."
            },
            {
                question: "O que fazer com o gel da babosa quando a gente se queima no fogão?",
                question_en: "What to do with aloe vera gel when you burn yourself on the stove?",
                options: [
                    "Passar manteiga",
                    "Passar o gel da folha, que é cicatrizante natural",
                    "Lavar com água fria e não passar nada"
                ],
                options_en: [
                    "Apply butter",
                    "Apply the leaf gel, which is a natural healer",
                    "Wash with cold water and apply nothing"
                ],
                correct: 1,
                explanation: "A babosa é um verdadeiro 'primeiros socorros'! O gel dentro da folha alivia a queimadura e ajuda a pele a se recuperar. Conhecimento que vale ouro.",
                explanation_en: "Aloe vera is a true 'first aid'! The gel inside the leaf relieves the burn and helps the skin recover. Knowledge worth gold.",
                consequence: "Sem esse saber, a gente sofre mais com queimaduras simples e gasta dinheiro com pomadas caras.",
                consequence_en: "Without this knowledge, we suffer more with simple burns and spend money on expensive ointments.",
                connection: "Nossas babosas estão ali, verdinhas, prontas pra cuidar de você. Mas lembre: queimadura grave precisa de médico!",
                connection_en: "Our aloe vera are there, green, ready to take care of you. But remember: serious burns need a doctor!"
            },
            {
                question: "Qual é o jeito certo de preparar um chá de erva-cidreira?",
                question_en: "What is the right way to prepare lemon balm tea?",
                options: [
                    "Ferver as folhas junto com a água",
                    "Desligar o fogo e colocar as folhas para abafar",
                    "Colocar as folhas no micro-ondas"
                ],
                options_en: [
                    "Boil the leaves with the water",
                    "Turn off the heat and put the leaves in to steep",
                    "Put the leaves in the microwave"
                ],
                correct: 1,
                explanation: "O segredo é não ferver as folhas! Água fervente desliga o fogo, aí coloca as folhas e tampa por uns 5 minutinhos. Assim o sabor e as propriedades ficam perfeitos.",
                explanation_en: "The secret is not to boil the leaves! Boiling water, turn off the heat, then put the leaves in and cover for about 5 minutes. This way the flavor and properties are perfect.",
                consequence: "Preparar errado pode estragar o remédio natural e a gente acha que não funciona, mas o erro tá no jeito de fazer.",
                consequence_en: "Preparing it wrong can ruin the natural remedy and we think it doesn't work, but the error is in the way of doing it.",
                connection: "Nosso chá de erva-cidreira na praça é feito assim, com carinho. Vem provar!",
                connection_en: "Our lemon balm tea in the square is made like this, with love. Come try it!"
            },
            {
                question: "O alecrim é conhecido por ajudar em quê?",
                question_en: "What is rosemary known to help with?",
                options: [
                    "Dar sorte no amor",
                    "Melhorar a memória e a concentração",
                    "Curar resfriado"
                ],
                options_en: [
                    "Bring luck in love",
                    "Improve memory and concentration",
                    "Cure colds"
                ],
                correct: 1,
                explanation: "O alecrim é a planta da lembrança! Na Grécia antiga, os estudantes usavam raminhos nos cabelos durante os exames. E a ciência já provou que ele tem substâncias que protegem o cérebro.",
                explanation_en: "Rosemary is the plant of remembrance! In ancient Greece, students used sprigs in their hair during exams. And science has already proven that it has substances that protect the brain.",
                consequence: "Perder esse conhecimento é deixar de usar um aliado simples e cheiroso para o nosso raciocínio.",
                consequence_en: "Losing this knowledge is failing to use a simple and fragrant ally for our reasoning.",
                connection: "Cheira o alecrim da praça. Sente como a mente parece mais alerta? É ele trabalhando!",
                connection_en: "Smell the rosemary in the square. Feel how your mind seems more alert? It's him working!"
            },
            {
                question: "Pra que serve o mastruz, tão famoso nos quintais?",
                question_en: "What is mastruz, so famous in backyards, used for?",
                options: [
                    "Pra curar verme (lombriga)",
                    "Pra dar azia",
                    "Pra fazer suco"
                ],
                options_en: [
                    "To cure worms",
                    "To cause heartburn",
                    "To make juice"
                ],
                correct: 0,
                explanation: "Mastruz com leite é remédio caseiro tradicional contra vermes. Não é gostoso, mas as antigas juravam que funcionava!",
                explanation_en: "Mastruz with milk is a traditional home remedy against worms. It's not tasty, but the old ladies swore it worked!",
                consequence: "Sem esse conhecimento, a gente corre pra farmácia até pra problemas simples que poderiam ser tratados em casa.",
                consequence_en: "Without this knowledge, we run to the pharmacy even for simple problems that could be treated at home.",
                connection: "Nossas avós que ensinaram. Respeita o saber delas!",
                connection_en: "Our grandmothers taught us. Respect their wisdom!"
            },
            {
                question: "O que é uma 'farmácia viva'?",
                question_en: "What is a 'living pharmacy'?",
                options: [
                    "Uma farmácia que vende plantas",
                    "Um jardim com plantas medicinais pra comunidade usar",
                    "Um remédio que nunca acaba"
                ],
                options_en: [
                    "A pharmacy that sells plants",
                    "A garden with medicinal plants for the community to use",
                    "A medicine that never ends"
                ],
                correct: 1,
                explanation: "Farmácia viva é isso aqui: um lugar onde a gente planta remédio! Cada folha, cada flor é um cuidado que a natureza oferece de graça.",
                explanation_en: "Living pharmacy is this: a place where we plant medicine! Each leaf, each flower is a care that nature offers for free.",
                consequence: "Sem farmácia viva, a gente depende só de remédio comprado e perde o contato com a terra que cura.",
                consequence_en: "Without a living pharmacy, we depend only on bought medicine and lose contact with the earth that heals.",
                connection: "Nossa praça é uma farmácia viva! Cada plantinha é um remédio ao ar livre.",
                connection_en: "Our square is a living pharmacy! Each little plant is an outdoor medicine."
            },
            {
                question: "Qual planta é boa pra aliviar enjoo, inclusive o de gravidez?",
                question_en: "Which plant is good for relieving nausea, including morning sickness?",
                options: ["Hortelã", "Alecrim", "Babosa"],
                options_en: ["Mint", "Rosemary", "Aloe vera"],
                correct: 0,
                explanation: "Hortelã é a salvadora da barriga! Um chazinho fresco alivia enjoo, gases, má digestão. As vovós sabiam disso muito antes da ciência explicar.",
                explanation_en: "Mint is the belly saver! A fresh tea relieves nausea, gas, indigestion. Grandmas knew this long before science explained it.",
                consequence: "Sem a hortelã, a gente sofre mais com essas coisas simples e toma remédio mais forte.",
                consequence_en: "Without mint, we suffer more with these simple things and take stronger medicine.",
                connection: "Colhe uma folhinha de hortelã, amassa e cheira. Já sente o alívio?",
                connection_en: "Pick a mint leaf, crush it and smell it. Do you already feel relief?"
            },
            {
                question: "Como as pessoas aprendiam sobre plantas antigamente?",
                question_en: "How did people learn about plants in the past?",
                options: [
                    "Em livros caros",
                    "De pai pra filho, na conversa e na prática",
                    "Na televisão"
                ],
                options_en: [
                    "In expensive books",
                    "From father to son, in conversation and practice",
                    "On television"
                ],
                correct: 1,
                explanation: "O saber passava de boca em boca, de mão em mão. A avó ensinava a mãe, a mãe ensinava a filha. Era uma corrente de amor e conhecimento.",
                explanation_en: "Knowledge passed from mouth to mouth, from hand to hand. Grandmother taught mother, mother taught daughter. It was a chain of love and knowledge.",
                consequence: "Hoje essa corrente tá se perdendo com a correria e as telas. Os jovens não perguntam, os velhos não contam.",
                consequence_en: "Today this chain is being lost with the rush and screens. The young don't ask, the old don't tell.",
                connection: "O QR Code ajuda, mas nada substitui uma boa conversa no banco da praça. Vem trocar ideia!",
                connection_en: "QR Code helps, but nothing replaces a good conversation on the square bench. Come exchange ideas!"
            },

            // ===== NÍVEL 2: INFÂNCIA E NATUREZA (10 perguntas) =====
            {
                question: "O que acontece com o cérebro de uma criança que cresce num lugar sem árvores, só com asfalto e lixo?",
                question_en: "What happens to the brain of a child who grows up in a place without trees, only with asphalt and garbage?",
                options: [
                    "Ela se acostuma e nem sente falta",
                    "Fica mais estressada, com mais dificuldade de aprender",
                    "O cérebro se desenvolve igual"
                ],
                options_en: [
                    "She gets used to it and doesn't even miss it",
                    "She becomes more stressed, with more difficulty learning",
                    "The brain develops the same"
                ],
                correct: 1,
                explanation: "O estresse de um ambiente feio e abandonado aumenta o cortisol no cérebro das crianças. Esse hormônio atrapalha a memória e o aprendizado.",
                explanation_en: "The stress of an ugly and abandoned environment increases cortisol in children's brains. This hormone hinders memory and learning.",
                consequence: "Uma geração inteira pode crescer com menos chances, não por falta de capacidade, mas por falta de um ambiente que acolhe.",
                consequence_en: "An entire generation can grow up with fewer chances, not for lack of capacity, but for lack of an environment that welcomes.",
                connection: "Nossa praça é um abraço no cérebro das crianças. O verde acalma, a sombra refresca, o espaço pra correr libera energia boa.",
                connection_en: "Our square is a hug for children's brains. The green calms, the shade refreshes, the space to run releases good energy."
            },
            {
                question: "Criança que brinca solta na natureza, subindo em árvore, correndo... isso ajuda em quê?",
                question_en: "Children who play freely in nature, climbing trees, running... what does that help?",
                options: [
                    "Ajuda só a gastar energia",
                    "Desenvolve criatividade, aprendizado e sociabilidade",
                    "Não ajuda em nada"
                ],
                options_en: [
                    "It only helps to expend energy",
                    "Develops creativity, learning and sociability",
                    "It doesn't help at all"
                ],
                correct: 1,
                explanation: "Quando uma criança inventa brincadeira, negocia regras, sobe em árvore, o cérebro dela tá aprendendo coisas que nenhuma tela ensina: resolver problemas, criar, fazer amigos.",
                explanation_en: "When a child invents a game, negotiates rules, climbs a tree, their brain is learning things that no screen teaches: solving problems, creating, making friends.",
                consequence: "Crianças que só ficam em casa ou no celular têm mais dificuldade pra se relacionar e ter ideias novas.",
                consequence_en: "Children who only stay at home or on their cell phones have more difficulty relating and having new ideas.",
                connection: "Olha as crianças brincando na praça. Elas tão construindo o futuro delas, tijolo por tijolo.",
                connection_en: "Look at the children playing in the square. They are building their future, brick by brick."
            },
            {
                question: "Uma criança que vê o bairro cheio de lixo, mato alto... o que ela pode aprender com isso?",
                question_en: "A child who sees the neighborhood full of garbage, tall weeds... what can she learn from this?",
                options: [
                    "Aprende que é assim mesmo, que a vida é assim",
                    "Aprende que ninguém se importa, que o lugar dela não tem valor",
                    "Não aprende nada"
                ],
                options_en: [
                    "She learns that's how it is, that life is like that",
                    "She learns that no one cares, that her place has no value",
                    "She learns nothing"
                ],
                correct: 1,
                explanation: "Criança é esponja. Ela absorve as mensagens do lugar. Um lugar sujo ensina a ela: 'você não merece cuidado'. Isso fica no coração.",
                explanation_en: "Children are sponges. They absorb the messages of the place. A dirty place teaches them: 'you don't deserve care'. This stays in the heart.",
                consequence: "Ela cresce achando que não adianta lutar, que nada muda. E o ciclo do abandono continua.",
                consequence_en: "She grows up thinking it's no use fighting, that nothing changes. And the cycle of abandonment continues.",
                connection: "Cada flor plantada, cada lixo recolhido, diz pra cada criança: 'Você importa. Seu lugar importa'.",
                connection_en: "Each flower planted, each piece of garbage collected, tells each child: 'You matter. Your place matters'."
            },
            {
                question: "Por que crianças que brincam em praças são menos ansiosas?",
                question_en: "Why are children who play in squares less anxious?",
                options: [
                    "Porque cansam e dormem mais",
                    "Porque o contato com a natureza reduz o estresse e acalma",
                    "Não faz diferença"
                ],
                options_en: [
                    "Because they get tired and sleep more",
                    "Because contact with nature reduces stress and calms",
                    "It doesn't make a difference"
                ],
                correct: 1,
                explanation: "A natureza tem um poder calmante. O verde, o vento, o canto dos passarinhos... tudo isso ajuda a diminuir a ansiedade, em crianças e adultos.",
                explanation_en: "Nature has a calming power. The green, the wind, the birds singing... all this helps to reduce anxiety, in children and adults.",
                consequence: "Sem contato com a natureza, a ansiedade infantil só aumenta. As telas pioram, o verde melhora.",
                consequence_en: "Without contact with nature, childhood anxiety only increases. Screens worsen, green improves.",
                connection: "Senta um pouco na grama, respira fundo. Sente a paz? É a natureza cuidando de você.",
                connection_en: "Sit on the grass for a while, breathe deeply. Feel the peace? It's nature taking care of you."
            },
            {
                question: "O que é 'déficit de natureza'?",
                question_en: "What is 'nature deficit'?",
                options: [
                    "Falta de área verde na cidade",
                    "Falta de água nas plantas",
                    "Falta de sol"
                ],
                options_en: [
                    "Lack of green area in the city",
                    "Lack of water in plants",
                    "Lack of sun"
                ],
                correct: 0,
                explanation: "É um termo que os estudiosos usam pra dizer que as crianças tão tendo menos contato com a natureza. E isso faz mal: mais obesidade, mais ansiedade, menos criatividade.",
                explanation_en: "It's a term that scholars use to say that children are having less contact with nature. And this is bad: more obesity, more anxiety, less creativity.",
                consequence: "Uma geração sem contato com a natureza não aprende a amar e cuidar do meio ambiente. O futuro fica ameaçado.",
                consequence_en: "A generation without contact with nature doesn't learn to love and care for the environment. The future is threatened.",
                connection: "Nossa praça é o remédio pro déficit de natureza! Traz suas crianças aqui.",
                connection_en: "Our square is the cure for nature deficit! Bring your children here."
            },
            {
                question: "Crianças que ajudam a plantar e regar aprendem o quê?",
                question_en: "What do children who help plant and water learn?",
                options: [
                    "Aprendem a sujar a roupa",
                    "Aprendem responsabilidade, paciência e cuidado",
                    "Não aprendem nada"
                ],
                options_en: [
                    "They learn to get their clothes dirty",
                    "They learn responsibility, patience and care",
                    "They learn nothing"
                ],
                correct: 1,
                explanation: "Cuidar de uma planta ensina que as coisas levam tempo, que precisamos regar todo dia, que a natureza tem seu ritmo. Lição pra vida toda!",
                explanation_en: "Taking care of a plant teaches that things take time, that we need to water every day, that nature has its rhythm. Lesson for life!",
                consequence: "Sem isso, elas acham que tudo é imediato, igual nos videogames. Perdem a noção do tempo da natureza.",
                consequence_en: "Without this, they think everything is immediate, like in video games. They lose notion of nature's time.",
                connection: "Nossas crianças já têm suas plantinhas favoritas. Pergunta pra elas o que aprenderam!",
                connection_en: "Our children already have their favorite little plants. Ask them what they learned!"
            },
            {
                question: "Como uma praça ajuda no desenvolvimento da imaginação?",
                question_en: "How does a square help in the development of imagination?",
                options: [
                    "Não ajuda",
                    "Uma árvore vira navio, um banco vira castelo, um galho vira espada... é o palco da imaginação",
                    "Atrapalha a imaginação"
                ],
                options_en: [
                    "It doesn't help",
                    "A tree becomes a ship, a bench becomes a castle, a branch becomes a sword... it's the stage of imagination",
                    "It hinders imagination"
                ],
                correct: 1,
                explanation: "Na natureza, uma criança pode inventar mil histórias. Uma folha vira dinossauro, uma poça vira oceano. A imaginação voa solta!",
                explanation_en: "In nature, a child can invent a thousand stories. A leaf becomes a dinosaur, a puddle becomes an ocean. Imagination runs wild!",
                consequence: "Sem esse espaço, a imaginação fica presa em telas e brinquedos prontos, que já vem com história definida.",
                consequence_en: "Without this space, imagination gets stuck in screens and ready-made toys, which already come with a defined story.",
                connection: "Olha as crianças: aquela árvore é um castelo, aquele banco é um carro. A imaginação tá a mil!",
                connection_en: "Look at the children: that tree is a castle, that bench is a car. Imagination is going wild!"
            },
            {
                question: "O que a 'biofilia' significa?",
                question_en: "What does 'biophilia' mean?",
                options: [
                    "Amor por livros",
                    "Amor pela vida e pela natureza, que a gente tem desde que nasce",
                    "Medo de bichos"
                ],
                options_en: [
                    "Love for books",
                    "Love for life and nature, which we have since birth",
                    "Fear of animals"
                ],
                correct: 1,
                explanation: "Biofilia é isso que a gente sente quando vê o mar, uma floresta, um jardim: uma conexão profunda, que tá no nosso DNA. A gente precisa da natureza pra ser feliz.",
                explanation_en: "Biophilia is what we feel when we see the sea, a forest, a garden: a deep connection, that's in our DNA. We need nature to be happy.",
                consequence: "Ignorar essa necessidade nos adoece. Por isso cidade sem árvore deixa a gente triste.",
                consequence_en: "Ignoring this need makes us sick. That's why a city without trees makes us sad.",
                connection: "Essa paz que você sente aqui é sua biofilia sendo alimentada. É sua natureza encontrando a Natureza.",
                connection_en: "This peace you feel here is your biophilia being fed. It's your nature meeting Nature."
            },
            {
                question: "Por que crianças que crescem perto de áreas verdes têm menos problemas de saúde mental?",
                question_en: "Why do children who grow up near green areas have fewer mental health problems?",
                options: [
                    "Sorte",
                    "O verde reduz o estresse e fortalece o cérebro",
                    "Não tem relação"
                ],
                options_en: [
                    "Luck",
                    "Green reduces stress and strengthens the brain",
                    "It's not related"
                ],
                correct: 1,
                explanation: "Estudo na Dinamarca com 1 milhão de pessoas mostrou: quem cresce perto de áreas verdes tem até 55% menos chance de ter transtornos mentais na vida adulta. É ou não é poderoso?",
                explanation_en: "A study in Denmark with 1 million people showed: those who grow up near green areas have up to 55% less chance of having mental disorders in adulthood. Isn't that powerful?",
                consequence: "Cidades sem verde tão criando adultos mais doentes da cabeça, mais ansiosos, mais depressivos.",
                consequence_en: "Cities without green are creating adults who are sicker in the head, more anxious, more depressed.",
                connection: "Cada árvore que a gente planta aqui é um investimento na saúde mental do futuro.",
                connection_en: "Each tree we plant here is an investment in the mental health of the future."
            },
            {
                question: "O que a criança aprende observando um passarinho fazendo ninho?",
                question_en: "What does a child learn watching a bird making a nest?",
                options: [
                    "Nada, passarinho não ensina",
                    "Aprende sobre paciência, construção, cuidado com os filhotes",
                    "Fica com vontade de comer passarinho"
                ],
                options_en: [
                    "Nothing, birds don't teach",
                    "Learns about patience, construction, care for the young",
                    "Gets a craving to eat bird"
                ],
                correct: 1,
                explanation: "A natureza é a maior professora. Ver um passarinho construir o ninho, trazer comida pros filhotes, ensinar eles a voar... são lições de vida que nenhuma escola dá.",
                explanation_en: "Nature is the greatest teacher. Watching a bird build a nest, bring food to its chicks, teach them to fly... are life lessons that no school gives.",
                consequence: "Sem esses exemplos, as crianças perdem a chance de aprender valores como dedicação e cuidado de forma natural.",
                consequence_en: "Without these examples, children lose the chance to learn values like dedication and care naturally.",
                connection: "Lá no pé de pitanga, tem um ninho. Vem ver com a gente!",
                connection_en: "There in the pitanga tree, there's a nest. Come see it with us!"
            },

            // ===== NÍVEL 3: DESCOBERTAS (10 perguntas) =====
            {
                question: "Já reparou que depois que a praça ficou mais verde, apareceram mais passarinhos? Por quê?",
                question_en: "Have you noticed that after the square became greener, more birds appeared? Why?",
                options: [
                    "Sorte",
                    "Porque eles encontraram comida e abrigo nas árvores",
                    "A prefeitura soltou eles"
                ],
                options_en: [
                    "Luck",
                    "Because they found food and shelter in the trees",
                    "The city hall released them"
                ],
                correct: 1,
                explanation: "Os passarinhos são como a gente: precisam de casa e comida. As árvores frutíferas são o mercado deles, e a copa das árvores é a casa. Eles voltaram porque a praça virou um lar!",
                explanation_en: "Birds are like us: they need a home and food. The fruit trees are their market, and the treetops are their home. They came back because the square became a home!",
                consequence: "Sem árvores, os passarinhos vão embora, as pragas aumentam e a gente perde a alegria de ouvir canto.",
                consequence_en: "Without trees, birds leave, pests increase and we lose the joy of hearing singing.",
                connection: "Escuta esse cantinho? É a natureza agradecendo. Cada passarinho é um sinal de vida.",
                connection_en: "Hear that little song? It's nature thanking. Each bird is a sign of life."
            },
            {
                question: "Por que debaixo da árvore é mais fresquinho que no sol do asfalto?",
                question_en: "Why is it cooler under the tree than in the asphalt sun?",
                options: [
                    "É impressão",
                    "Árvore faz sombra e solta vapor d'água que refresca",
                    "O vento é mais forte"
                ],
                options_en: [
                    "It's an impression",
                    "Tree provides shade and releases water vapor that cools",
                    "The wind is stronger"
                ],
                correct: 1,
                explanation: "As árvores são ar-condicionados naturais! Fazem sombra e transpiram água pelas folhas, igual a gente suo pra esfriar. Isso refresca o ar.",
                explanation_en: "Trees are natural air conditioners! They provide shade and transpire water through their leaves, just as we sweat to cool down. This cools the air.",
                consequence: "Sem árvores, a cidade vira um forno. O asfalto esquenta e a gente sofre com o calorão.",
                consequence_en: "Without trees, the city becomes an oven. The asphalt heats up and we suffer from the heat.",
                connection: "Sente esse fresquinho gostoso? É nossa jabuticabeira trabalhando pra você, de graça.",
                connection_en: "Feel that nice coolness? It's our jabuticaba tree working for you, for free."
            },
            {
                question: "Como as raízes das árvores ajudam a evitar enchentes?",
                question_en: "How do tree roots help prevent floods?",
                options: [
                    "Não ajudam",
                    "Elas seguram a terra e ajudam a água a infiltrar no solo",
                    "Elas empurram a água pra longe"
                ],
                options_en: [
                    "They don't help",
                    "They hold the soil and help water infiltrate the ground",
                    "They push the water away"
                ],
                correct: 1,
                explanation: "As raízes fazem a terra ficar fofa, igual uma esponja. Aí quando chove, a água entra no chão em vez de correr tudo de uma vez e alagar a rua.",
                explanation_en: "Roots make the soil fluffy, like a sponge. So when it rains, water goes into the ground instead of all running at once and flooding the street.",
                consequence: "Sem árvores, o chão vira concreto e a água não penetra. Aí qualquer chuva forte vira enchente.",
                consequence_en: "Without trees, the ground becomes concrete and water doesn't penetrate. Then any heavy rain turns into a flood.",
                connection: "Nossa praça é uma esponja que ajuda a salvar o bairro das enchentes.",
                connection_en: "Our square is a sponge that helps save the neighborhood from floods."
            },
            {
                question: "O que as abelhas fazem na praça?",
                question_en: "What do bees do in the square?",
                options: [
                    "Só incomodam",
                    "Polinizam as flores, garantindo que as plantas dêem frutos",
                    "Fazem mal pras plantas"
                ],
                options_en: [
                    "They just bother",
                    "They pollinate flowers, ensuring plants bear fruit",
                    "They harm plants"
                ],
                correct: 1,
                explanation: "Abelha é trabalhadora! Ela vai de flor em flor levando pólen, que é o que faz a flor virar fruto. Sem abelha, não tem goiaba, não tem pitanga, não tem jabuticaba.",
                explanation_en: "Bees are hardworking! They go from flower to flower carrying pollen, which is what makes the flower turn into fruit. Without bees, there's no guava, no pitanga, no jabuticaba.",
                consequence: "Sem abelha, a natureza para. A gente passa fome.",
                consequence_en: "Without bees, nature stops. We starve.",
                connection: "Olha as abelhinhas nas flores. Elas tão trabalhando pra nossa comida. Respeita elas!",
                connection_en: "Look at the little bees on the flowers. They're working for our food. Respect them!"
            },
            {
                question: "O que é uma 'ilha de calor' na cidade?",
                question_en: "What is a 'heat island' in the city?",
                options: [
                    "Um lugar onde faz muito calor porque tem muito asfalto e pouco verde",
                    "Uma praia artificial",
                    "Um vulcão"
                ],
                options_en: [
                    "A place where it's very hot because there's a lot of asphalt and little green",
                    "An artificial beach",
                    "A volcano"
                ],
                correct: 0,
                explanation: "Ilha de calor é quando uma parte da cidade fica muito mais quente que outra por causa de asfalto, prédio, falta de árvore. É como se a cidade tivesse febre.",
                explanation_en: "Heat island is when a part of the city becomes much hotter than another due to asphalt, buildings, lack of trees. It's as if the city had a fever.",
                consequence: "Essas ilhas de calor fazem a gente sofrer mais, gastar mais energia com ventilador e até pioram a saúde.",
                consequence_en: "These heat islands make us suffer more, spend more energy on fans and even worsen health.",
                connection: "Nossa praça quebra essa febre da cidade. Cada árvore é um remédio contra o calor.",
                connection_en: "Our square breaks this city fever. Each tree is a remedy against the heat."
            },
            {
                question: "Por que o ar perto das árvores é mais puro?",
                question_en: "Why is the air near trees purer?",
                options: [
                    "Porque as folhas seguram a poeira",
                    "Porque as árvores sugam a poluição e soltam oxigênio",
                    "Não é mais puro"
                ],
                options_en: [
                    "Because the leaves hold the dust",
                    "Because trees suck up pollution and release oxygen",
                    "It's not purer"
                ],
                correct: 1,
                explanation: "As árvores são o pulmão da cidade! Elas puxam o gás carbônico (que faz mal) e soltam oxigênio (que a gente respira). Uma árvore adulta produz oxigênio pra duas pessoas por dia!",
                explanation_en: "Trees are the lungs of the city! They pull in carbon dioxide (which is bad) and release oxygen (which we breathe). A mature tree produces oxygen for two people per day!",
                consequence: "Sem árvore, o ar fica poluído e a gente adoece mais.",
                consequence_en: "Without trees, the air becomes polluted and we get sick more.",
                connection: "Respira fundo esse ar gostoso da praça. É presente das nossas árvores.",
                connection_en: "Breathe deeply this nice air in the square. It's a gift from our trees."
            },
            {
                question: "Como as minhocas ajudam o solo da praça?",
                question_en: "How do earthworms help the square's soil?",
                options: [
                    "Elas atrapalham as raízes",
                    "Elas cavam túneis que arejam a terra e fazem adubo natural",
                    "Não ajudam"
                ],
                options_en: [
                    "They hinder the roots",
                    "They dig tunnels that aerate the soil and make natural fertilizer",
                    "They don't help"
                ],
                correct: 1,
                explanation: "Minhoca é engenheira da natureza! Ela cava túneis que deixam a terra fofa pra água e o ar entrarem, e ainda faz húmus (adubo) com o que come.",
                explanation_en: "Earthworms are nature's engineers! They dig tunnels that make the soil fluffy for water and air to enter, and they also make humus (fertilizer) with what they eat.",
                consequence: "Sem minhoca, a terra fica dura, pobre, e as plantas não crescem.",
                consequence_en: "Without earthworms, the soil becomes hard, poor, and plants don't grow.",
                connection: "Quando a gente vê minhoca na terra, é sinal de solo saudável. Nossa praça tem muitas!",
                connection_en: "When we see earthworms in the soil, it's a sign of healthy soil. Our square has many!"
            },
            {
                question: "O que os líquens nos troncos das árvores indicam?",
                question_en: "What do lichens on tree trunks indicate?",
                options: [
                    "Que a árvore tá doente",
                    "Que o ar é puro",
                    "Que vai chover"
                ],
                options_en: [
                    "That the tree is sick",
                    "That the air is pure",
                    "That it's going to rain"
                ],
                correct: 1,
                explanation: "Líquen é tipo um fiscal da natureza! Ele só cresce em lugares com ar limpo, sem poluição. Se tem líquen, o ar é bom.",
                explanation_en: "Lichens are like nature's inspectors! They only grow in places with clean air, without pollution. If there are lichens, the air is good.",
                consequence: "Sem líquen, é sinal que o ar tá poluído e a gente tá respirando veneno.",
                consequence_en: "Without lichens, it's a sign that the air is polluted and we're breathing poison.",
                connection: "Olha os líquens nas nossas árvores! É sinal que o ar aqui já tá mais puro.",
                connection_en: "Look at the lichens on our trees! It's a sign that the air here is already purer."
            },
            {
                question: "Por que algumas frutas só aparecem em certas épocas do ano?",
                question_en: "Why do some fruits only appear at certain times of the year?",
                options: [
                    "Porque a natureza tem seu ritmo",
                    "Porque a gente não cuida direito",
                    "É castigo"
                ],
                options_en: [
                    "Because nature has its rhythm",
                    "Because we don't take care properly",
                    "It's punishment"
                ],
                correct: 0,
                explanation: "A natureza tem ciclos. Tem hora de florir, hora de frutificar, hora de descansar. É a sabedoria da terra.",
                explanation_en: "Nature has cycles. There's time to bloom, time to bear fruit, time to rest. It's the wisdom of the earth.",
                consequence: "Quando a gente quer tudo fora de hora, usa agrotóxico, força a natureza, e o resultado é comida sem gosto e que faz mal.",
                consequence_en: "When we want everything out of season, we use pesticides, force nature, and the result is tasteless food that's bad for us.",
                connection: "Na nossa praça, a gente respeita o tempo da natureza. A jabuticaba vem na hora certa, e é mais gostosa.",
                connection_en: "In our square, we respect nature's time. The jabuticaba comes at the right time, and it's tastier."
            },
            {
                question: "O que é 'biodiversidade'?",
                question_en: "What is 'biodiversity'?",
                options: [
                    "Muitos tipos de bicho",
                    "A variedade de plantas e animais num lugar",
                    "Um remédio"
                ],
                options_en: [
                    "Many types of animals",
                    "The variety of plants and animals in a place",
                    "A medicine"
                ],
                correct: 1,
                explanation: "Biodiversidade é a riqueza da vida. Num lugar com muita biodiversidade, tem planta de todo tipo, bicho de todo tipo, tudo em equilíbrio.",
                explanation_en: "Biodiversity is the richness of life. In a place with high biodiversity, there are plants of all kinds, animals of all kinds, everything in balance.",
                consequence: "Quando a gente só planta uma coisa (monocultura), o sistema fica fraco. Uma praga acaba com tudo.",
                consequence_en: "When we plant only one thing (monoculture), the system becomes weak. One pest destroys everything.",
                connection: "Aqui a gente tem 16 espécies de planta! Isso é biodiversidade, isso é vida forte.",
                connection_en: "Here we have 16 plant species! That's biodiversity, that's strong life."
            },

            // ===== NÍVEL 4: UNIÃO (10 perguntas) =====
            {
                question: "O que fazer quando alguém quer usar a praça pra política ou religião, tentando dividir a comunidade?",
                question_en: "What to do when someone wants to use the square for politics or religion, trying to divide the community?",
                options: [
                    "Cada um que cuide da sua vida",
                    "Lembrar que a praça é de todos: o que nos une é maior",
                    "Proibir tudo"
                ],
                options_en: [
                    "Let each mind their own life",
                    "Remember that the square belongs to everyone: what unites us is greater",
                    "Ban everything"
                ],
                correct: 1,
                explanation: "A praça é nossa casa comum. Ela não tem partido, não tem religião. É o lugar onde a gente se encontra como vizinhos, como comunidade.",
                explanation_en: "The square is our common home. It has no party, no religion. It's the place where we meet as neighbors, as a community.",
                consequence: "Quando a gente deixa a divisão entrar, a praça morre. Cada um vai pro seu lado, e o abandono volta.",
                consequence_en: "When we let division in, the square dies. Everyone goes their own way, and abandonment returns.",
                connection: "Nessa praça, já plantaram mãos de todas as crenças e opiniões. E aí está ela, linda.",
                connection_en: "In this square, hands of all beliefs and opinions have planted. And there it is, beautiful."
            },
            {
                question: "Por que é importante que criança, jovem, adulto e idoso usem a mesma praça?",
                question_en: "Why is it important that children, youth, adults and elderly use the same square?",
                options: [
                    "Não é importante",
                    "A criança aprende com o idoso, o idoso se alegra com a criança, todo mundo se fortalece",
                    "Só dá confusão"
                ],
                options_en: [
                    "It's not important",
                    "The child learns from the elderly, the elderly rejoices with the child, everyone gets stronger",
                    "It just causes confusion"
                ],
                correct: 1,
                explanation: "A vida em comunidade é assim: a gente se mistura. O idoso ensina paciência, a criança ensina alegria, o jovem traz ideias novas. A praça é o palco dessa troca.",
                explanation_en: "Community life is like this: we mix. The elderly teach patience, the child teaches joy, the young bring new ideas. The square is the stage for this exchange.",
                consequence: "Sem esse encontro, as gerações ficam isoladas. A solidão aumenta, o aprendizado diminui.",
                consequence_en: "Without this meeting, generations become isolated. Loneliness increases, learning decreases.",
                connection: "Olha ao redor: criança correndo, idoso no banco, jovem conversando. Isso é comunidade de verdade.",
                connection_en: "Look around: child running, elderly on the bench, young talking. That's real community."
            },
            {
                question: "Como a praça ajuda a combater a solidão dos idosos?",
                question_en: "How does the square help combat loneliness among the elderly?",
                options: [
                    "Não ajuda",
                    "Dá um lugar pra eles saírem de casa, verem gente, conversarem",
                    "Atrapalha porque é muito barulho"
                ],
                options_en: [
                    "It doesn't help",
                    "It gives them a place to leave home, see people, talk",
                    "It hinders because it's too noisy"
                ],
                correct: 1,
                explanation: "Solidão é doença. Muitos idosos passam dias sem falar com ninguém. Na praça, eles encontram um banco, uma conversa, um 'bom dia'. Isso salva vidas.",
                explanation_en: "Loneliness is a disease. Many elderly spend days without talking to anyone. In the square, they find a bench, a conversation, a 'good morning'. This saves lives.",
                consequence: "Sem praça, o idoso fica preso em casa, mais triste, mais doente.",
                consequence_en: "Without a square, the elderly stay stuck at home, sadder, sicker.",
                connection: "Vê aquele senhor no banco? Ele vem todo dia. Já fez amizade com meio mundo. A praça é a família dele também.",
                connection_en: "See that man on the bench? He comes every day. He's made friends with half the world. The square is his family too."
            },
            {
                question: "Por que um jovem que ajudou a plantar uma árvore dificilmente vai depredar a praça?",
                question_en: "Why would a young person who helped plant a tree hardly vandalize the square?",
                options: [
                    "Porque ele cansa",
                    "Porque ele sente que a árvore é dele, que ele faz parte daquele lugar",
                    "Não tem relação"
                ],
                options_en: [
                    "Because he gets tired",
                    "Because he feels the tree is his, that he is part of that place",
                    "It's not related"
                ],
                correct: 1,
                explanation: "Pertencimento é isso: quando a gente ajuda a construir, a gente cuida. O jovem que plantou, regou, viu crescer, não vai quebrar. Aquilo é dele também.",
                explanation_en: "Belonging is this: when we help build, we care. The young person who planted, watered, saw it grow, won't break it. That belongs to them too.",
                consequence: "Se não envolver os jovens, eles viram estranhos no próprio bairro. Aí não cuidam, depredam, porque não é deles.",
                consequence_en: "If we don't involve young people, they become strangers in their own neighborhood. Then they don't care, they vandalize, because it's not theirs.",
                connection: "Nossos jovens plantaram, tão nas redes sociais da praça, tão organizando eventos. Eles são o futuro.",
                connection_en: "Our young people planted, they're on the square's social media, organizing events. They are the future."
            },
            {
                question: "O que significa 'bem comum'?",
                question_en: "What does 'common good' mean?",
                options: [
                    "O que é bom pra todo mundo",
                    "O que é bom só pra mim",
                    "Um bem material"
                ],
                options_en: [
                    "What is good for everyone",
                    "What is good only for me",
                    "A material good"
                ],
                correct: 0,
                explanation: "Bem comum é aquilo que beneficia a coletividade. Uma praça bonita é bem comum: todo mundo aproveita, criança, velho, jovem, rico, pobre.",
                explanation_en: "Common good is what benefits the community. A beautiful square is common good: everyone enjoys it, child, elderly, young, rich, poor.",
                consequence: "Quando a gente só pensa no bem individual, o espaço público morre. Cada um cuida só do seu quintal e a rua vira lixo.",
                consequence_en: "When we only think about individual good, public space dies. Each cares only for their own yard and the street becomes garbage.",
                connection: "Essa praça é nosso bem comum. Cuidar dela é cuidar de todo mundo.",
                connection_en: "This square is our common good. Taking care of it is taking care of everyone."
            },
            {
                question: "Como a praça pode ser uma sala de aula ao ar livre?",
                question_en: "How can the square be an outdoor classroom?",
                options: [
                    "Não pode",
                    "Dá pra aprender sobre plantas, bichos, história (com os idosos), arte...",
                    "Só atrapalha a escola"
                ],
                options_en: [
                    "It can't",
                    "You can learn about plants, animals, history (with the elderly), art...",
                    "It just hinders school"
                ],
                correct: 1,
                explanation: "A praça ensina! Criança aprende na prática: vê a semente virar árvore, descobre pra que serve cada planta, escuta histórias dos mais velhos. É educação viva.",
                explanation_en: "The square teaches! Children learn in practice: see the seed become a tree, discover what each plant is for, listen to stories from the elderly. It's living education.",
                consequence: "Educação só na sala de aula fica chata, sem graça, sem conexão com a vida real.",
                consequence_en: "Education only in the classroom becomes boring, dull, without connection to real life.",
                connection: "Cada QR Code é uma aula. Cada planta é um livro. Vem aprender com a gente!",
                connection_en: "Each QR Code is a lesson. Each plant is a book. Come learn with us!"
            },
            {
                question: "O que fazer com alguém que joga lixo na praça?",
                question_en: "What to do with someone who throws garbage in the square?",
                options: [
                    "Brigar com a pessoa",
                    "Conversar com calma, explicar que a praça é de todos e pedir ajuda pra manter limpa",
                    "Ignorar"
                ],
                options_en: [
                    "Fight with the person",
                    "Talk calmly, explain that the square belongs to everyone and ask for help to keep it clean",
                    "Ignore"
                ],
                correct: 1,
                explanation: "Muita gente joga lixo por hábito, sem pensar. Uma conversa respeitosa pode fazer a pessoa refletir. Xingar só cria briga.",
                explanation_en: "Many people throw garbage out of habit, without thinking. A respectful conversation can make the person reflect. Cursing only creates a fight.",
                consequence: "Se a gente briga ou ignora, o lixo continua. Se a gente conversa, pode ganhar mais um guardião.",
                consequence_en: "If we fight or ignore, the garbage continues. If we talk, we might gain another guardian.",
                connection: "Já aconteceu aqui. Um vizinho que jogava lixo hoje ajuda a cuidar. Conversar resolve.",
                connection_en: "It's happened here. A neighbor who used to throw garbage now helps take care. Talking solves it."
            },
            {
                question: "Por que é importante ter gente na praça em vários horários do dia?",
                question_en: "Why is it important to have people in the square at various times of the day?",
                options: [
                    "Atrapalha quem quer sossego",
                    "Espaço ocupado é espaço seguro. Mais gente, menos violência",
                    "Não é importante"
                ],
                options_en: [
                    "It bothers those who want peace",
                    "Occupied space is safe space. More people, less violence",
                    "It's not important"
                ],
                correct: 1,
                explanation: "Criminoso não gosta de lugar movimentado. Quando a praça tá cheia de gente, de dia, de tarde, de noite, ela fica naturalmente mais segura.",
                explanation_en: "Criminals don't like busy places. When the square is full of people, day, afternoon, night, it becomes naturally safer.",
                consequence: "Lugar vazio vira ponto de violência. A comunidade se recolhe e o perigo aumenta.",
                consequence_en: "Empty place becomes a point of violence. The community retreats and danger increases.",
                connection: "Vem pra praça em qualquer horário. Sua presença é nossa segurança.",
                connection_en: "Come to the square at any time. Your presence is our safety."
            },
            {
                question: "O que a praça ensina sobre cidadania?",
                question_en: "What does the square teach about citizenship?",
                options: [
                    "Nada",
                    "Ensina que o espaço público é de todos e que a gente tem que cuidar junto",
                    "Ensina a não respeitar"
                ],
                options_en: [
                    "Nothing",
                    "It teaches that public space belongs to everyone and that we have to care for it together",
                    "It teaches not to respect"
                ],
                correct: 1,
                explanation: "Cidadania é isso: entender que a cidade é nossa, que a gente tem direitos, mas também deveres. Cuidar da praça é exercer cidadania.",
                explanation_en: "Citizenship is this: understanding that the city is ours, that we have rights, but also duties. Taking care of the square is exercising citizenship.",
                consequence: "Sem essa noção, cada um só pensa em si. A cidade vira um caos, ninguém respeita ninguém.",
                consequence_en: "Without this notion, each only thinks of themselves. The city becomes chaos, no one respects anyone.",
                connection: "Cada planta cuidada, cada lixo recolhido, é um ato de cidadania. Parabéns!",
                connection_en: "Each plant cared for, each piece of garbage collected, is an act of citizenship. Congratulations!"
            },
            {
                question: "Por que a praça é importante pra quem vem de outro bairro?",
                question_en: "Why is the square important for those who come from another neighborhood?",
                options: [
                    "Não é importante",
                    "Eles levam uma ideia boa, se inspiram e podem fazer igual no lugar deles",
                    "Atrapalham"
                ],
                options_en: [
                    "It's not important",
                    "They take a good idea, get inspired and can do the same in their place",
                    "They bother"
                ],
                correct: 1,
                explanation: "Visitante é semente. Ele vê a praça bonita, aprende, se emociona e leva a ideia pra plantar no bairro dele. Assim a transformação se espalha.",
                explanation_en: "Visitor is a seed. They see the beautiful square, learn, get emotional and take the idea to plant in their neighborhood. Thus transformation spreads.",
                consequence: "Se a gente fecha a praça pra quem é de fora, a ideia morre aqui. Outros bairros continuam abandonados.",
                consequence_en: "If we close the square to outsiders, the idea dies here. Other neighborhoods remain abandoned.",
                connection: "Se você é visitante, seja bem-vindo! Leva essa semente no coração.",
                connection_en: "If you're a visitor, welcome! Take this seed in your heart."
            },

            // ===== NÍVEL 5: FUTURO (10 perguntas) =====
            {
                question: "O que significa 'pertencimento' e por que é tão importante pra nossa praça?",
                question_en: "What does 'belonging' mean and why is it so important for our square?",
                options: [
                    "É quando a gente acha que a praça é só da gente",
                    "É quando a gente sente que a praça é nossa, que a gente pode cuidar, que a gente faz parte dela",
                    "É nome de time"
                ],
                options_en: [
                    "It's when we think the square is only ours",
                    "It's when we feel the square is ours, that we can care for it, that we are part of it",
                    "It's a team name"
                ],
                correct: 1,
                explanation: "Pertencimento é quando você olha pra praça e pensa 'isso aqui é meu'. Não no sentido de 'só meu', mas de 'eu faço parte disso'. É o que faz você recolher um lixo que não jogou.",
                explanation_en: "Belonging is when you look at the square and think 'this is mine'. Not in the sense of 'only mine', but 'I am part of this'. It's what makes you pick up trash you didn't throw.",
                consequence: "Sem pertencimento, ninguém cuida. A praça vira 'terra de ninguém' e o abandono volta.",
                consequence_en: "Without belonging, no one cares. The square becomes 'no man's land' and abandonment returns.",
                connection: "Cada vez que você vem aqui, seu pertencimento cresce. Essa praça é sua, sim. Cuida dela com amor.",
                connection_en: "Every time you come here, your belonging grows. This square is yours, yes. Take care of it with love."
            },
            {
                question: "O que é 'esperança ativa'?",
                question_en: "What is 'active hope'?",
                options: [
                    "Esperar as coisas melhorarem",
                    "Acreditar que é possível e agir pra construir, todo dia, juntos",
                    "Rezar e não fazer nada"
                ],
                options_en: [
                    "Waiting for things to get better",
                    "Believing it's possible and acting to build, every day, together",
                    "Praying and doing nothing"
                ],
                correct: 1,
                explanation: "Esperança ativa não é 'torcer'. É acreditar no futuro e suar a camisa pra construí-lo. É plantar uma muda hoje, mesmo sabendo que ela vai demorar anos pra dar fruto.",
                explanation_en: "Active hope is not 'cheering'. It's believing in the future and working hard to build it. It's planting a seedling today, even knowing it will take years to bear fruit.",
                consequence: "Sem esperança ativa, resta a apatia, o 'deixa como está'. É a receita pro abandono.",
                consequence_en: "Without active hope, apathy remains, the 'leave it as is'. It's the recipe for abandonment.",
                connection: "Essa praça é um monumento à esperança ativa. Ela só existe porque a gente acreditou e agiu.",
                connection_en: "This square is a monument to active hope. It only exists because we believed and acted."
            },
            {
                question: "Como a praça pode continuar bonita mesmo se a prefeitura mudar ou cortar verba?",
                question_en: "How can the square remain beautiful even if the city hall changes or cuts funding?",
                options: [
                    "Não tem jeito, aí acaba",
                    "A comunidade se organiza, cria uma associação, cuida por conta própria",
                    "Abandona"
                ],
                options_en: [
                    "No way, then it ends",
                    "The community organizes, creates an association, takes care on its own",
                    "Abandon"
                ],
                correct: 1,
                explanation: "O poder público passa, muda, some. Mas a comunidade fica. Se a gente se organizar, criar um grupo, um fundo comunitário, a praça vive pra sempre.",
                explanation_en: "Public power passes, changes, disappears. But the community remains. If we organize, create a group, a community fund, the square lives forever.",
                consequence: "Se depender só da prefeitura, qualquer crise acaba com a praça. Aí a gente perde tudo.",
                consequence_en: "If it depends only on city hall, any crisis ends the square. Then we lose everything.",
                connection: "Já temos um grupo de WhatsApp, mutirões, ideias. A força da praça é a gente.",
                connection_en: "We already have a WhatsApp group, mutirões, ideas. The strength of the square is us."
            },
            {
                question: "O que as crianças de hoje vão ensinar pros filhos delas sobre essa praça?",
                question_en: "What will today's children teach their children about this square?",
                options: [
                    "Nada",
                    "Vão contar que ajudaram a plantar, que brincaram aqui, que aprenderam a cuidar. E vão ensinar os filhos a fazer o mesmo",
                    "Vão esquecer"
                ],
                options_en: [
                    "Nothing",
                    "They'll tell that they helped plant, that they played here, that they learned to care. And they'll teach their children to do the same",
                    "They'll forget"
                ],
                correct: 1,
                explanation: "A memória afetiva é poderosa. Uma criança que viveu a transformação da praça vai contar essa história pros filhos, pros netos. O cuidado vira herança.",
                explanation_en: "Affective memory is powerful. A child who lived the square's transformation will tell this story to their children, grandchildren. Care becomes inheritance.",
                consequence: "Se a gente não envolver as crianças agora, não tem história pra contar. A corrente se rompe.",
                consequence_en: "If we don't involve children now, there's no story to tell. The chain breaks.",
                connection: "Olha as crianças correndo. Daqui a 20 anos, elas vão trazer os filhos delas aqui e contar: 'Eu ajudei a plantar essa árvore'.",
                connection_en: "Look at the children running. In 20 years, they'll bring their children here and tell: 'I helped plant this tree'."
            },
            {
                question: "Como a tecnologia pode ajudar a cuidar da praça?",
                question_en: "How can technology help take care of the square?",
                options: [
                    "Atrapalha, melhor sem",
                    "App pra marcar mutirão, QR Code pra aprender, sensor pra saber quando regar... tecnologia a favor",
                    "Só serve pra joguinho"
                ],
                options_en: [
                    "It hinders, better without",
                    "App to schedule mutirões, QR Code to learn, sensor to know when to water... technology in favor",
                    "It's only good for games"
                ],
                correct: 1,
                explanation: "Tecnologia bem usada é ferramenta. Um grupo de WhatsApp organiza a comunidade. Um sensor avisa se a terra tá seca. QR Code ensina sobre as plantas.",
                explanation_en: "Well-used technology is a tool. A WhatsApp group organizes the community. A sensor warns if the soil is dry. QR Code teaches about plants.",
                consequence: "Sem tecnologia, a gente fica mais lento, mais desorganizado, perde oportunidade de aprender e se conectar.",
                consequence_en: "Without technology, we become slower, more disorganized, lose the opportunity to learn and connect.",
                connection: "Você tá aqui por causa de um QR Code. A tecnologia já tá ajudando!",
                connection_en: "You're here because of a QR Code. Technology is already helping!"
            },
            {
                question: "Qual o recado final que essa praça quer deixar pra você?",
                question_en: "What is the final message this square wants to leave for you?",
                options: [
                    "Que o problema é da prefeitura",
                    "Que a mudança começa em cada um de nós, juntos, com esperança e trabalho",
                    "Que não tem jeito"
                ],
                options_en: [
                    "That the problem is the city hall's",
                    "That change begins in each of us, together, with hope and work",
                    "That there's no way"
                ],
                correct: 1,
                explanation: "A mensagem é de esperança ativa: acreditar que é possível e agir pra construir. Cada muda plantada, cada lixo recolhido, cada conversa é um tijolo no futuro.",
                explanation_en: "The message is of active hope: believing it's possible and acting to build. Each seedling planted, each piece of garbage collected, each conversation is a brick in the future.",
                consequence: "Se a gente não acreditar, o abandono vence. Aí quem perde somos nós, nossas crianças, nosso futuro.",
                consequence_en: "If we don't believe, abandonment wins. Then we lose, our children lose, our future loses.",
                connection: "Você chegou ao fim do quiz, mas a jornada real começa agora. Olha pra essa praça, sente esse vento. Isso é nosso. E a gente cuida. Vamos juntos?",
                connection_en: "You've reached the end of the quiz, but the real journey begins now. Look at this square, feel this wind. This is ours. And we take care. Let's go together?"
            },
            {
                question: "O que é uma 'cidade-esponja'?",
                question_en: "What is a 'sponge city'?",
                options: [
                    "Cidade cheia de esponja",
                    "Cidade que absorve a água da chuva pra não ter enchente, com jardins e pisos que deixam a água infiltrar",
                    "Cidade que flutua"
                ],
                options_en: [
                    "City full of sponges",
                    "City that absorbs rainwater to avoid flooding, with gardens and floors that let water infiltrate",
                    "Floating city"
                ],
                correct: 1,
                explanation: "Cidade-esponja é um jeito de pensar a cidade pra ela não alagar. Em vez de canalizar toda a água, a gente faz jardins de chuva, calçadas que deixam a água passar, praças que absorvem.",
                explanation_en: "Sponge city is a way of thinking about the city so it doesn't flood. Instead of channeling all the water, we make rain gardens, sidewalks that let water through, squares that absorb.",
                consequence: "Se a gente não fizer isso, as enchentes vão piorar com as mudanças no clima. Já viu como tem chovido forte?",
                consequence_en: "If we don't do this, floods will worsen with climate change. Have you seen how hard it's been raining?",
                connection: "Nossa praça já é uma esponjinha. Cada árvore segura água, cada canteiro absorve. Tamo ajudando.",
                connection_en: "Our square is already a little sponge. Each tree holds water, each flowerbed absorbs. We're helping."
            },
            {
                question: "O que é 'telhado verde'?",
                question_en: "What is a 'green roof'?",
                options: [
                    "Telhado pintado de verde",
                    "Cobertura de planta em cima da laje, que isola do calor e ainda produz alimento",
                    "Telha de plástico"
                ],
                options_en: [
                    "Roof painted green",
                    "Plant covering on top of the slab, which insulates from heat and also produces food",
                    "Plastic tile"
                ],
                correct: 1,
                explanation: "Telhado verde é uma horta no teto! Planta em cima da laje deixa a casa mais fresca no verão, mais quente no inverno, e ainda dá pra plantar tempero, flor.",
                explanation_en: "Green roof is a garden on the roof! Plants on top of the slab make the house cooler in summer, warmer in winter, and you can also plant herbs, flowers.",
                consequence: "Sem telhado verde, a laje esquenta, a casa vira forno, a gente gasta energia com ventilador.",
                consequence_en: "Without a green roof, the slab heats up, the house becomes an oven, we spend energy on fans.",
                connection: "Quem sabe um dia a gente não faz uma oficina aqui na praça pra ensinar a fazer telhado verde em casa?",
                connection_en: "Maybe one day we'll have a workshop here in the square to teach how to make a green roof at home?"
            },
            {
                question: "Como medir o lucro de uma praça, se ela não vende nada?",
                question_en: "How to measure the profit of a square, if it sells nothing?",
                options: [
                    "Não tem lucro",
                    "O lucro é em saúde: menos gente doente, menos gasto com hospital, mais felicidade",
                    "Só dá prejuízo"
                ],
                options_en: [
                    "There's no profit",
                    "The profit is in health: fewer sick people, less hospital spending, more happiness",
                    "It only causes loss"
                ],
                correct: 1,
                explanation: "O lucro da praça é social. Uma pessoa que caminha aqui adoece menos e dá menos despesa pro SUS. Um jovem ocupado não entra pro crime. Isso é lucro, e é enorme.",
                explanation_en: "The profit of the square is social. A person who walks here gets sick less and costs the public health system less. An occupied young person doesn't turn to crime. That's profit, and it's enormous.",
                consequence: "Se a gente só pensar em dinheiro, nunca vai investir em praça. E aí a conta vem mais cara: mais doença, mais violência.",
                consequence_en: "If we only think about money, we'll never invest in squares. And then the bill comes more expensive: more disease, more violence.",
                connection: "Cada real investido aqui volta multiplicado em saúde e alegria pra todo mundo.",
                connection_en: "Each real invested here returns multiplied in health and joy for everyone."
            },
            {
                question: "Qual a maior riqueza que uma comunidade pode ter?",
                question_en: "What is the greatest wealth a community can have?",
                options: [
                    "Dinheiro",
                    "A união das pessoas, o sentimento de que juntos a gente pode tudo",
                    "Muitos carros"
                ],
                options_en: [
                    "Money",
                    "The union of people, the feeling that together we can do anything",
                    "Many cars"
                ],
                correct: 1,
                explanation: "A maior riqueza não se mede em dinheiro, mas em laços. Uma comunidade unida supera crise, protege seus membros, constrói futuro. Isso não tem preço.",
                explanation_en: "The greatest wealth is not measured in money, but in bonds. A united community overcomes crises, protects its members, builds a future. That is priceless.",
                consequence: "Comunidade rica em dinheiro mas pobre em união é fria, insegura, solitária.",
                consequence_en: "A community rich in money but poor in union is cold, insecure, lonely.",
                connection: "Olha ao redor: essa conversa, essa criança correndo, esse idoso sorrindo. Isso é nossa maior riqueza.",
                connection_en: "Look around: this conversation, this child running, this smiling elderly. That is our greatest wealth."
            }
        ];

        // Níveis (5 níveis de 10 questões)
        const levelNames = ["Sabedoria", "Infância", "Descobertas", "União", "Futuro"];
        const levelNamesEn = ["Wisdom", "Childhood", "Discoveries", "Unity", "Future"];

        // Elementos DOM
        const questionText = document.getElementById('question-text');
        const optionsContainer = document.getElementById('options-container');
        const feedbackDiv = document.getElementById('feedback');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const currentQ = document.getElementById('current-q');
        const questionCounter = document.getElementById('question-counter');
        const correctCounter = document.getElementById('correct-counter');
        const currentLevel = document.getElementById('current-level');
        const progressBar = document.getElementById('xp-progress');
        const progressText = document.getElementById('progress-text');
        const levelButtons = document.querySelectorAll('.level-btn');
        const levelBadge = document.getElementById('level-badge');
        const shuffleBtn = document.getElementById('shuffle-btn');
        const resetOrderBtn = document.getElementById('reset-order-btn');
        const shareQuizBtn = document.getElementById('share-quiz-btn');
        const shareFooterBtn = document.getElementById('shareFooterBtn');
        const shareModal = document.getElementById('shareModal');
        const shareLinkDisplay = document.getElementById('shareLinkDisplay');
        const quizSection = document.getElementById('quizSection');

        // Estado
        let currentQuestionIndex = 0;
        let correctAnswers = 0;
        let answered = Array(quizData.length).fill(false);
        let answers = Array(quizData.length).fill(null);

        const quizLink = "https://curtar1.vml10.xyz/QUIZ-PRACA-VIVA";

        function openShareModal() { shareModal.style.display = 'flex'; }
        function closeShareModal() { shareModal.style.display = 'none'; }
        
        function shareOnWhatsApp() { 
            const text = encodeURIComponent(currentLang === 'pt' ? 
                "🌿 *Quiz da Praça Viva!* \n\nAprenda como a natureza cuida da gente e da nossa comunidade! \n\n" : 
                "🌿 *Living Square Quiz!* \n\nLearn how nature takes care of us and our community! \n\n");
            const url = encodeURIComponent(quizLink);
            window.open(`https://wa.me/?text=${text}${url}`, '_blank');
            closeShareModal(); 
        }
        
        function shareOnFacebook() { 
            const url = encodeURIComponent(quizLink);
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
            closeShareModal(); 
        }
        
        function copyLink() { 
            navigator.clipboard.writeText(quizLink).then(() => { 
                alert(currentLang === 'pt' ? 'Link copiado! 📋' : 'Link copied! 📋'); 
            }).catch(() => {
                alert(currentLang === 'pt' ? 'Clique no link para copiar manualmente' : 'Click on the link to copy manually');
            });
            closeShareModal(); 
        }

        document.getElementById('whatsapp-share').addEventListener('click', shareOnWhatsApp);
        document.getElementById('facebook-share').addEventListener('click', shareOnFacebook);
        document.getElementById('copy-link').addEventListener('click', copyLink);

        function shuffleArray(array) {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        }

        function shuffleQuiz() {
            const shuffled = shuffleArray([...quizData]);
            while(quizData.length) { quizData.pop(); }
            shuffled.forEach(q => quizData.push(q));
            
            currentQuestionIndex = 0;
            correctAnswers = 0;
            answered = Array(quizData.length).fill(false);
            answers = Array(quizData.length).fill(null);
            correctCounter.textContent = correctAnswers;
            loadQuestion();
            updateProgress();
            alert(currentLang === 'pt' ? '🌿 Perguntas embaralhadas! Um novo desafio pra você.' : '🌿 Questions shuffled! A new challenge for you.');
        }

        function resetOrder() { location.reload(); }

        function loadQuestion() {
            const q = quizData[currentQuestionIndex];

            questionText.textContent = currentLang === 'pt' ? q.question : (q.question_en || q.question);
            
            currentQ.textContent = currentQuestionIndex + 1;
            questionCounter.textContent = `${currentQuestionIndex + 1}/${quizData.length}`;

            const levelNum = Math.floor(currentQuestionIndex / 10) + 1;
            currentLevel.textContent = levelNum;
            levelBadge.textContent = `🌱 ${currentLang === 'pt' ? levelNames[levelNum - 1] : levelNamesEn[levelNum - 1]}`;
            levelBadge.className = `level-badge level${levelNum}-badge`;

            optionsContainer.innerHTML = '';
            const options = currentLang === 'pt' ? q.options : (q.options_en || q.options);
            options.forEach((option, i) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';

                if (answered[currentQuestionIndex] && answers[currentQuestionIndex] === i) {
                    btn.style.background = i === q.correct ? '#4caf50' : '#f44336';
                    btn.style.color = 'white';
                    btn.disabled = true;
                }

                btn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + i)}</span><span>${option}</span>`;
                btn.addEventListener('click', () => selectOption(i));
                optionsContainer.appendChild(btn);
            });

            if (answered[currentQuestionIndex]) {
                const isCorrect = answers[currentQuestionIndex] === q.correct;
                showFeedback(isCorrect, q);
            } else {
                feedbackDiv.className = 'feedback';
                feedbackDiv.innerHTML = '';
            }

            prevBtn.disabled = currentQuestionIndex === 0;
            nextBtn.disabled = !answered[currentQuestionIndex];
            nextBtn.textContent = currentQuestionIndex === quizData.length - 1 ? 
                (currentLang === 'pt' ? 'Ver resultado' : 'See result') : 
                (currentLang === 'pt' ? 'Próxima' : 'Next');
        }

        function selectOption(optionIndex) {
            const q = quizData[currentQuestionIndex];
            const isCorrect = optionIndex === q.correct;

            document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);

            document.querySelectorAll('.option-btn').forEach((btn, index) => {
                if (index === q.correct) btn.style.background = '#4caf50';
                else if (index === optionIndex && !isCorrect) btn.style.background = '#f44336';
                btn.style.color = 'white';
            });

            answered[currentQuestionIndex] = true;
            answers[currentQuestionIndex] = optionIndex;

            if (isCorrect) {
                correctAnswers++;
                correctCounter.textContent = correctAnswers;
            }

            showFeedback(isCorrect, q);
            nextBtn.disabled = false;
            updateProgress();
            readFeedback(isCorrect, q);
            
            // Centraliza a seção do quiz para mostrar as explicações
            quizSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        function showFeedback(isCorrect, q) {
            feedbackDiv.className = `feedback show ${isCorrect ? 'correct' : 'incorrect'}`;
            
            const explanation = currentLang === 'pt' ? q.explanation : (q.explanation_en || q.explanation);
            const consequence = currentLang === 'pt' ? q.consequence : (q.consequence_en || q.consequence);
            const connection = currentLang === 'pt' ? q.connection : (q.connection_en || q.connection);
            
            feedbackDiv.innerHTML = `
                <div class="feedback-title">
                    <i class="fas fa-${isCorrect ? 'check-circle' : 'times-circle'}"></i>
                    ${isCorrect ? (currentLang === 'pt' ? '✅ Boa!' : '✅ Good!') : 
                        (currentLang === 'pt' ? '🌱 Que tal pensar diferente?' : '🌱 How about thinking differently?')}
                </div>
                <div class="feedback-content">
                    <p><strong>${explanation}</strong></p>
                    <p style="margin-top: 12px; background: #f1f8e9; padding: 12px; border-radius: 15px;">
                        <i class="fas fa-exclamation-triangle" style="color: #ff9800;"></i> 
                        <strong>${currentLang === 'pt' ? 'Se nada mudar:' : 'If nothing changes:'}</strong> ${consequence}
                    </p>
                    <p style="margin-top: 12px; background: #d4e6b5; padding: 12px; border-radius: 15px;">
                        <i class="fas fa-leaf" style="color: #2e7d32;"></i> 
                        <strong>${currentLang === 'pt' ? 'Na nossa praça:' : 'In our square:'}</strong> ${connection}
                    </p>
                </div>
            `;
        }

        function updateProgress() {
            const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
            progressBar.style.width = `${progress}%`;
            const percent = Math.round(progress);
            if (percent < 25) progressText.textContent = `${currentLang === 'pt' ? 'Começando nossa caminhada...' : 'Starting our journey...'} (${currentQuestionIndex + 1}/${quizData.length})`;
            else if (percent < 50) progressText.textContent = `${currentLang === 'pt' ? 'Já aprendemos bastante!' : 'We have learned a lot!'} (${currentQuestionIndex + 1}/${quizData.length})`;
            else if (percent < 75) progressText.textContent = `${currentLang === 'pt' ? 'Continue assim!' : 'Keep going!'} (${currentQuestionIndex + 1}/${quizData.length})`;
            else progressText.textContent = `${currentLang === 'pt' ? 'Quase lá!' : 'Almost there!'} (${currentQuestionIndex + 1}/${quizData.length})`;
        }

        nextBtn.addEventListener('click', () => {
            if (currentQuestionIndex === quizData.length - 1) {
                showFinalResults();
                return;
            }
            currentQuestionIndex++;
            loadQuestion();
            quizSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Narra automaticamente a próxima pergunta se a narração automática estiver ativada
            narrateCurrentQuestion();
        });

        prevBtn.addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                loadQuestion();
                quizSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Narra automaticamente a pergunta anterior se a narração automática estiver ativada
                narrateCurrentQuestion();
            }
        });

        function showFinalResults() {
            const score = Math.round((correctAnswers / quizData.length) * 100);
            let message = '';
            if (score >= 85) message = currentLang === 'pt' ? "🌈 Você é um guardião da natureza! Que orgulho!" : "🌈 You are a nature guardian! So proud!";
            else if (score >= 60) message = currentLang === 'pt' ? "🌱 Você está no caminho, vamos juntos!" : "🌱 You're on the right track, let's go together!";
            else message = currentLang === 'pt' ? "🍃 Cada passo conta. Vamos aprender mais juntos?" : "🍃 Every step counts. Shall we learn more together?";

            const quizSection = document.querySelector('.quiz-section');
            quizSection.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h2 style="font-size: 2rem; color: #2e7d32;">${currentLang === 'pt' ? 'Obrigado!' : 'Thank you!'} 💚</h2>
                    <div style="font-size: 3rem; font-weight: bold; margin: 20px 0; color: var(--dourado);">${score}%</div>
                    <p style="font-size: 1.3rem; margin-bottom: 20px;">${message}</p>
                    <p style="margin: 20px 0;">${currentLang === 'pt' ? 'Acertos:' : 'Correct answers:'} ${correctAnswers}/${quizData.length}</p>
                    <div style="background: var(--verde-suave); padding: 20px; border-radius: 20px; margin: 20px 0;">
                        <p>🌳 ${currentLang === 'pt' ? 'Você agora é oficialmente um Guardião da Praça! Compartilhe essa conquista.' : 'You are now officially a Square Guardian! Share this achievement.'}</p>
                    </div>
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button class="control-btn" id="restart-btn" style="background: var(--laranja);">
                            <i class="fas fa-redo"></i> ${currentLang === 'pt' ? 'Refazer' : 'Restart'}
                        </button>
                        <button class="control-btn" id="share-result-btn" style="background: var(--ceu);">
                            <i class="fas fa-share-alt"></i> ${currentLang === 'pt' ? 'Compartilhar' : 'Share'}
                        </button>
                    </div>
                </div>
            `;
            document.getElementById('restart-btn').addEventListener('click', () => location.reload());
            document.getElementById('share-result-btn').addEventListener('click', openShareModal);
        }

        document.querySelectorAll('.level-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const firstQuestion = index * 10;
                if (firstQuestion < quizData.length) {
                    currentQuestionIndex = firstQuestion;
                    loadQuestion();
                    quizSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Narra a pergunta do nível selecionado se a narração automática estiver ativada
                    narrateCurrentQuestion();
                }
            });
        });

        shuffleBtn.addEventListener('click', shuffleQuiz);
        resetOrderBtn.addEventListener('click', resetOrder);
        shareQuizBtn.addEventListener('click', openShareModal);
        shareFooterBtn.addEventListener('click', openShareModal);
        window.onclick = (e) => { if (e.target === shareModal) closeShareModal(); };

        loadQuestion();
        // Narração automática inicial removida - só começa quando usuário clicar no play