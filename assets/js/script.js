/*
===================================================================
            Portfólio - Interações e Segurança de Links
===================================================================
    Objetivo: Gerenciar clique em botão de projeto futuro (exibindo alerta)
              e configurar atributos de segurança para links externos.
              
              INCLUI FUNCIONALIDADES DA PÁGINA "SOBRE MIM" (sobre_mim.html):
              - Cálculo automático de idade
              - Funcionalidade de copiar textos (e-mail e telefone)
              - Fallback para imagem de avatar
              
              🆕 VERSÃO CARROSSEL: Adicionadas funcionalidades de:
              - Navegação por setas (anterior/próximo)
              - Indicadores (dots) clicáveis
              - Scroll suave entre os slides
              - Atualização automática dos indicadores
              
    Autor : Rodrigo Barbosa
    Data  : 2026 (Atualizado com funcionalidades do carrossel)
===================================================================
*/

// IIFE (Immediately Invoked Function Expression) para isolar o escopo e evitar poluição global
(function () {
    // ============================================================
    // FUNCIONALIDADES DO PORTFÓLIO PRINCIPAL (index.html)
    // ============================================================
    
    // 1. Obtém o elemento do botão "Projeto Futuro" pelo seu ID
    const btnFuture = document.getElementById('btnProjetoFuturo');

    // Verifica se o botão existe na página (evita erro caso o ID não seja encontrado)
    if (btnFuture) {
        // Adiciona um listener para o evento de clique no botão
        btnFuture.addEventListener('click', (e) => {
            // Previne qualquer comportamento padrão do botão (ex.: envio de formulário ou navegação)
            e.preventDefault();
            // Exibe um alerta amigável informando que o projeto está reservado para o futuro
            alert('🔮 Projeto reservado para futuras implementações.\nEm breve, novidades incríveis estarão disponíveis aqui!');
        });
    }

    // 2. Seleciona todos os elementos com a classe 'btn-projeto' que possuem o atributo target="_blank"
    //    (links que abrem em nova aba)
    const externalLinks = document.querySelectorAll('.btn-projeto[target="_blank"]');

    // Para cada link encontrado, aplica configurações de segurança
    externalLinks.forEach(link => {
        // Adiciona o atributo 'rel="noopener noreferrer"' para:
        // - 'noopener': impede que a nova página acesse o objeto window.opener da página original
        // - 'noreferrer': impede que a nova página saiba qual site originou o clique (protege o referenciador)
        // Essas práticas evitam vulnerabilidades como tabnabbing e vazamento de informações.
        link.setAttribute('rel', 'noopener noreferrer');
    });

    // ============================================================
    // 🆕 FUNCIONALIDADES DO CARROSSEL (index.html)
    // ============================================================
    
    // Verifica se os elementos do carrossel existem na página
    const carrosselSlides = document.getElementById('carrosselSlides');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const indicadoresContainer = document.getElementById('carrosselIndicadores');
    
    // Só executa a lógica do carrossel se os elementos existirem
    if (carrosselSlides && btnPrev && btnNext && indicadoresContainer) {
        
        // Obtém todos os slides (itens do carrossel)
        const slides = document.querySelectorAll('.carrossel-item');
        const totalSlides = slides.length;
        
        // Variável para controlar o índice atual (usado para navegação por dots)
        let currentIndex = 0;
        
        // Flag para evitar múltiplos scrolls simultâneos
        let isScrolling = false;
        
        /**
         * Função: atualizarIndicadores
         * Descrição: Atualiza a classe 'ativo' nos indicadores (dots)
         *            baseado no slide que está visível no momento
         */
        function atualizarIndicadores() {
            // Calcula qual slide está mais visível baseado na posição de scroll
            const scrollLeft = carrosselSlides.scrollLeft;
            const slideWidth = slides[0]?.offsetWidth || 0;
            const gap = 32; // Gap entre os slides (2rem = 32px)
            const slideTotalWidth = slideWidth + gap;
            
            // Calcula o índice aproximado baseado no scroll
            let newIndex = Math.round(scrollLeft / slideTotalWidth);
            
            // Garante que o índice esteja dentro dos limites
            newIndex = Math.max(0, Math.min(newIndex, totalSlides - 1));
            
            // Atualiza o índice atual
            currentIndex = newIndex;
            
            // Remove a classe 'ativo' de todos os indicadores
            document.querySelectorAll('.indicador').forEach((indicador, idx) => {
                if (idx === currentIndex) {
                    indicador.classList.add('ativo');
                } else {
                    indicador.classList.remove('ativo');
                }
            });
        }
        
        /**
         * Função: scrollParaSlide
         * Parâmetro: index (número do slide desejado)
         * Descrição: Rola o carrossel suavemente até o slide especificado
         */
        function scrollParaSlide(index) {
            // Impede execução durante scroll em andamento
            if (isScrolling) return;
            
            // Garante que o índice esteja dentro dos limites válidos
            if (index < 0) index = 0;
            if (index >= totalSlides) index = totalSlides - 1;
            
            // Calcula a posição de scroll baseada na largura do slide + gap
            const slideWidth = slides[0]?.offsetWidth || 0;
            const gap = 32; // Gap entre os slides (2rem = 32px)
            const scrollPosition = index * (slideWidth + gap);
            
            // Marca que está em scroll
            isScrolling = true;
            
            // Realiza o scroll suave
            carrosselSlides.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            
            // Atualiza o índice atual
            currentIndex = index;
            
            // Após o scroll, reativa a flag
            setTimeout(() => {
                isScrolling = false;
                atualizarIndicadores();
            }, 500); // Tempo suficiente para o scroll suave completar
        }
        
        /**
         * Função: slideAnterior
         * Descrição: Navega para o slide anterior
         */
        function slideAnterior() {
            if (currentIndex > 0) {
                scrollParaSlide(currentIndex - 1);
            } else {
                // Efeito visual para indicar que está no primeiro slide
                carrosselSlides.style.transform = 'translateX(5px)';
                setTimeout(() => {
                    carrosselSlides.style.transform = '';
                }, 200);
            }
        }
        
        /**
         * Função: proximoSlide
         * Descrição: Navega para o próximo slide
         */
        function proximoSlide() {
            if (currentIndex < totalSlides - 1) {
                scrollParaSlide(currentIndex + 1);
            } else {
                // Efeito visual para indicar que está no último slide
                carrosselSlides.style.transform = 'translateX(-5px)';
                setTimeout(() => {
                    carrosselSlides.style.transform = '';
                }, 200);
            }
        }
        
        /**
         * Função: criarIndicadores
         * Descrição: Cria os indicadores (dots) dinamicamente baseado no número de slides
         */
        function criarIndicadores() {
            // Limpa o container de indicadores
            indicadoresContainer.innerHTML = '';
            
            // Cria um indicador para cada slide
            for (let i = 0; i < totalSlides; i++) {
                const indicador = document.createElement('div');
                indicador.classList.add('indicador');
                // Adiciona evento de clique para navegar diretamente ao slide correspondente
                indicador.addEventListener('click', () => {
                    scrollParaSlide(i);
                });
                indicadoresContainer.appendChild(indicador);
            }
            
            // Marca o primeiro indicador como ativo
            if (totalSlides > 0) {
                document.querySelectorAll('.indicador')[0]?.classList.add('ativo');
            }
        }
        
        /**
         * Função: debounce
         * Descrição: Limita a taxa de execução de uma função (útil para eventos de scroll)
         */
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
        
        // Cria os indicadores ao carregar a página
        criarIndicadores();
        
        // Adiciona os listeners de eventos para os botões de navegação
        btnPrev.addEventListener('click', slideAnterior);
        btnNext.addEventListener('click', proximoSlide);
        
        // Adiciona listener para o evento de scroll no carrossel
        // Usa debounce para melhor performance
        carrosselSlides.addEventListener('scroll', debounce(() => {
            atualizarIndicadores();
        }, 100));
        
        // Adiciona listener para redimensionamento da janela
        // Recalcula a posição dos indicadores quando a tela é redimensionada
        window.addEventListener('resize', debounce(() => {
            atualizarIndicadores();
        }, 200));
        
        // Suporte a teclado para acessibilidade
        // Tecla esquerda: slide anterior, tecla direita: próximo slide
        document.addEventListener('keydown', (e) => {
            // Verifica se o carrossel está visível na tela
            const carrosselContainer = document.querySelector('.carrossel-container');
            if (carrosselContainer && carrosselContainer.offsetParent !== null) {
                if (e.key === 'ArrowLeft') {
                    slideAnterior();
                    e.preventDefault(); // Previne o scroll da página
                } else if (e.key === 'ArrowRight') {
                    proximoSlide();
                    e.preventDefault(); // Previne o scroll da página
                }
            }
        });
        
        // Adiciona suporte a touch para dispositivos móveis
        let touchStartX = 0;
        let touchEndX = 0;
        
        carrosselSlides.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carrosselSlides.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diffX = touchEndX - touchStartX;
            // Se o deslize foi significativo (maior que 50px)
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Deslizou para a direita: slide anterior
                    slideAnterior();
                } else {
                    // Deslizou para a esquerda: próximo slide
                    proximoSlide();
                }
            }
        });
        
        // Log de inicialização do carrossel
        console.log(`🎠 Carrossel inicializado com ${totalSlides} slides`);
    } else {
        // Mensagem opcional para páginas que não possuem carrossel (ex: sobre_mim.html)
        if (!document.querySelector('.carrossel-container')) {
            console.log("📄 Carrossel não detectado nesta página (modo compatível)");
        }
    }
    
    // ============================================================
    // FUNCIONALIDADES DA PÁGINA "SOBRE MIM" (sobre_mim.html)
    // ============================================================
    
    // 1. Cálculo automático da idade com base em 29 de maio de 1979
    function calcularIdade(dataNascimentoStr) {
        const hoje = new Date();
        const nascimento = new Date(dataNascimentoStr);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mesAtual = hoje.getMonth();
        const diaAtual = hoje.getDate();
        const mesNasc = nascimento.getMonth();
        const diaNasc = nascimento.getDate();
        // Se ainda não passou o aniversário neste ano, subtrai 1
        if (mesAtual < mesNasc || (mesAtual === mesNasc && diaAtual < diaNasc)) {
            idade--;
        }
        return idade;
    }

    const dataNasc = "1979-05-29"; // Formato ISO
    const idade = calcularIdade(dataNasc);
    const idadeElemento = document.getElementById('idadeDinamica');
    if (idadeElemento) {
        idadeElemento.innerHTML = `🎂 ${idade} anos · Nascido em 29/05/1979`;
    } else {
        console.warn("Elemento idadeDinamica não encontrado (página Sobre não está carregada?)");
    }

    // 2. Funcionalidade de copiar texto dos contatos (e-mail e telefone)
    const botoesCopiar = document.querySelectorAll('.btn-copiar');
    botoesCopiar.forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = botao.getAttribute('data-copiar');
            if (targetId) {
                const elementoTexto = document.getElementById(targetId);
                if (elementoTexto) {
                    const textoParaCopiar = elementoTexto.innerText.trim();
                    navigator.clipboard.writeText(textoParaCopiar).then(() => {
                        // Feedback temporário no próprio botão
                        const textoOriginal = botao.innerText;
                        botao.innerText = '✓ Copiado!';
                        setTimeout(() => {
                            botao.innerText = textoOriginal;
                        }, 1800);
                    }).catch(err => {
                        console.error('Erro ao copiar: ', err);
                        alert('Não foi possível copiar automaticamente. Copie manualmente.');
                    });
                }
            }
        });
    });

    // 3. Tratamento de fallback para imagem de avatar: caso não exista a imagem, usar placeholder
    const avatarImg = document.querySelector('.avatar-img');
    if (avatarImg && avatarImg.complete) {
        if (avatarImg.naturalWidth === 0) {
            avatarImg.src = 'https://placehold.co/200x200?text=Rodrigo+Barbosa';
        }
    } else if (avatarImg) {
        avatarImg.onerror = function() {
            this.src = 'https://placehold.co/200x200?text=RB';
            this.onerror = null;
        };
    }
    
    // Tratamento também para o avatar do card no carrossel (se existir)
    const avatarCard = document.querySelector('.avatar-card');
    if (avatarCard && avatarCard.complete) {
        if (avatarCard.naturalWidth === 0) {
            avatarCard.src = 'https://placehold.co/110x90?text=RB';
        }
    } else if (avatarCard) {
        avatarCard.onerror = function() {
            this.src = 'https://placehold.co/110x90?text=RB';
            this.onerror = null;
        };
    }
    
    // ============================================================
    // MENSAGENS DE CONSOLE (identidade visual do desenvolvedor)
    // ============================================================
    console.log("🚀 projetosrb | IDEIAS EM CÓDIGO. SOLUÇÕES EM AÇÃO.");
    console.log("Portfólio ajustado: logo-titulo (imagem + título) aumentado 15% — hero mantido intacto.");
    console.log("🎠 Carrossel interativo ativo: navegação por setas, dots e teclado.");
    
    // Mensagem adicional se a página Sobre estiver carregada
    if (document.querySelector('.sobre-container')) {
        console.log(`📄 Sobre | projetosrb — Idade calculada: ${idade} anos. Contatos com cópia segura.`);
    }
    
    // Mensagem adicional se o carrossel foi carregado com sucesso
    if (document.querySelector('.carrossel-container')) {
        const totalSlidesCarrossel = document.querySelectorAll('.carrossel-item').length;
        console.log(`✨ Carrossel com ${totalSlidesCarrossel} projetos disponíveis (incluindo "Sobre Mim")`);
    }
})();
