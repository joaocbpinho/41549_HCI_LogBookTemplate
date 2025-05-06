let nomeEquipaSelecionadaParaGestao = null;

function abrirModalDetalhesEquipa(equipa) {
  const modal = document.getElementById("modalDetalhesEquipa");
  const nomeEl = document.getElementById("modalNomeEquipa");
  const desportoEl = document.getElementById("modalDesportoEquipa");
  const membrosListEl = document.getElementById("modalMembrosEquipa");

  if (!modal || !nomeEl || !desportoEl || !membrosListEl) {
    console.error("Elementos do modal de detalhes da equipa não encontrados.");
    return;
  }

  nomeEl.textContent = equipa.nome || 'N/D';
  desportoEl.textContent = equipa.desporto ? equipa.desporto.charAt(0).toUpperCase() + equipa.desporto.slice(1) : 'N/D';

  membrosListEl.innerHTML = ''; // Limpa membros anteriores

  if (equipa.membros && equipa.membros.length > 0) {
    equipa.membros.forEach(membro => {
      const li = document.createElement('li');
      li.textContent = membro;
      membrosListEl.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'Nenhum membro adicionado.';
    membrosListEl.appendChild(li);
  }

  nomeEquipaSelecionadaParaGestao = equipa.nome;
  modal.style.display = "block";
}

function fecharModalDetalhesEquipa() {
  const modal = document.getElementById("modalDetalhesEquipa");
  if (modal) modal.style.display = "none";
  nomeEquipaSelecionadaParaGestao = null;
}

function irParaPaginaEquipa() {
  if (nomeEquipaSelecionadaParaGestao) {
    // Passa o nome da equipa para a página de equipa, pode ser via localStorage ou URL param
    localStorage.setItem("equipaSelecionada", nomeEquipaSelecionadaParaGestao);
    window.location.href = "../equipa/equipa.html"; // Ajuste o caminho se necessário
  } else {
    // Comportamento padrão se nenhuma equipa específica estiver selecionada para gestão
    // ou redirecionar para a página geral de equipas sem uma equipa pré-selecionada.
    window.location.href = "../equipa/equipa.html"; // Ajuste o caminho se necessário
  }
}

function renderizarEquipas() {
  const listaEquipasContainer = document.getElementById("listaEquipas");
  if (!listaEquipasContainer) {
    console.error("Elemento #listaEquipas não encontrado no DOM.");
    return;
  }
  const equipas = JSON.parse(localStorage.getItem("equipas")) || [];
  listaEquipasContainer.innerHTML = ""; // Limpa conteúdo anterior

  equipas.forEach((equipa) => {
    const desportoFormatado = equipa.desporto ? equipa.desporto.charAt(0).toUpperCase() + equipa.desporto.slice(1) : 'N/D';
    const card = document.createElement("div");
    // Adiciona a classe base .card para herdar estilos e .card-equipa para estilos específicos
    card.className = "card card-equipa"; 
    card.innerHTML = `
      <div class="card-content">
        <h3>${equipa.nome || 'Equipa sem nome'}</h3>
        <p><strong>Desporto:</strong> ${desportoFormatado}</p>
      </div>
    `;
    card.addEventListener("click", () => {
      // Certifique-se que está a passar o objeto equipa completo se necessário
      // ou apenas os dados necessários para abrir o modal.
      // A lógica original procurava a equipa completa novamente, o que é bom se 'equipa' aqui for um resumo.
      const equipaCompleta = (JSON.parse(localStorage.getItem("equipas")) || []).find(e => e.nome === equipa.nome);
      if (equipaCompleta) {
        abrirModalDetalhesEquipa(equipaCompleta);
      } else {
        // Fallback se a equipa completa não for encontrada (deve ser raro se os dados estiverem consistentes)
        abrirModalDetalhesEquipa(equipa); 
      }
    });
    card.style.cursor = 'pointer'; // Já definido em .card-equipa no CSS
    card.title = `Ver detalhes da equipa ${equipa.nome || ''}`;
    listaEquipasContainer.appendChild(card);
  });

  // Adicionar o card "Criar Equipa"
  const addCard = document.createElement("div");
  // Adiciona a classe base .card e .add-card para estilização específica
  addCard.className = "card add-card"; 
  addCard.innerHTML = `
    <div class="add-card-content">➕ Criar Equipa</div>
  `;
  addCard.title = 'Criar uma nova equipa';
  addCard.style.cursor = 'pointer'; // Já definido em .add-card no CSS
  addCard.addEventListener('click', () => {
    window.location.href = '../equipa/equipa.html'; // Ajuste o caminho se necessário
  });
  listaEquipasContainer.appendChild(addCard);
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado para equipasindex.js");
  renderizarEquipas();

  // Adicionar event listener ao botão de fechar do modal de detalhes da equipa, se existir
  // O modal em si está em index.html, mas o seu comportamento é gerido aqui.
  const modalDetalhes = document.getElementById('modalDetalhesEquipa');
  if (modalDetalhes) {
    const closeButton = modalDetalhes.querySelector('.close');
    if (closeButton) {
        // Remove onclick antigo se houver e adiciona listener
        closeButton.removeAttribute('onclick');
        closeButton.addEventListener('click', fecharModalDetalhesEquipa);
    }
    const gerirButton = modalDetalhes.querySelector('button'); // Assume que é o único botão ou o primeiro
     if (gerirButton && gerirButton.textContent.includes("Gerir Equipa")) { // Seja mais específico se houver outros botões
        gerirButton.removeAttribute('onclick');
        gerirButton.addEventListener('click', irParaPaginaEquipa);
    }
  }
});

// Expor funções globalmente se forem chamadas por onclick="" em HTML
// É melhor adicionar event listeners em JS (como feito acima para o close), mas para manter compatibilidade:
window.fecharModalDetalhesEquipa = fecharModalDetalhesEquipa;
window.irParaPaginaEquipa = irParaPaginaEquipa;
// abrirModalDetalhesEquipa é chamada internamente por renderizarEquipas, não precisa ser global
// a menos que haja outros pontos de entrada.