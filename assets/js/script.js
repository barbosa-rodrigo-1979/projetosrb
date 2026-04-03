/*
===================================================================
            Portfólio - Interações e Segurança de Links
===================================================================
    Objetivo: Gerenciar clique em botão de projeto futuro (exibindo alerta)
              e configurar atributos de segurança para links externos.
    Autor : Rodrigo Barbosa
    Data  : 2026
===================================================================
*/

// IIFE (Immediately Invoked Function Expression) para isolar o escopo e evitar poluição global
(function () {
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

    // 3. Mensagens no console para depuração e identidade visual do desenvolvedor
    console.log("🚀 projetosrb | IDEIAS EM CÓDIGO. SOLUÇÕES EM AÇÃO.");
    console.log("Portfólio ajustado: logo-titulo (imagem + título) aumentado 15% — hero mantido intacto.");
})();