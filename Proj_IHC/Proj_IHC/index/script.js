// ========== FUNÇÕES GLOBAIS (MODAIS, SIDEBAR, RENDERIZAÇÃO INICIAL) ==========

// --- Funções Modais (Saldo, Login, Criar Equipa) ---
function abrirModalSaldo() {
  const modal = document.getElementById("modalAdicionarSaldo");
  if (modal) modal.style.display = "block";
}
function fecharModalSaldo() {
  const modal = document.getElementById("modalAdicionarSaldo");
  if (modal) modal.style.display = "none";
}
function adicionarSaldo() {
  const valorInput = document.getElementById("valorSaldo");
  const saldoAtualEl = document.getElementById("saldoAtual");
  if (!valorInput || !saldoAtualEl) return;

  if (!metodoPagamentoAtual) {
    alert("Por favor, selecione um método de pagamento antes de depositar.");
    abrirModalMetodosPagamento();
    return;
  }
  if (metodoPagamentoAtual === 'visa' && !detalhesMetodo.final) {
    alert("Por favor, confirme os detalhes do cartão.");
    abrirModalDetalhesCartao();
    return;
  }

  const valorSaldo = parseFloat(valorInput.value);
  if (!isNaN(valorSaldo) && valorSaldo > 0) {
    let saldoAtual = 0;
    const match = saldoAtualEl.textContent.match(/[\d,.]+/);
    if (match) {
      saldoAtual = parseFloat(match[0].replace(/\./g, '').replace(',', '.'));
    }
    const novoSaldo = saldoAtual + valorSaldo;

    console.log(`Simulando depósito de ${valorSaldo.toFixed(2)}€ via ${metodoPagamentoAtual}`);
    saldoAtualEl.textContent = `${novoSaldo.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€`;
    localStorage.setItem('saldoUsuario', novoSaldo.toFixed(2));
    valorInput.value = '';
    document.querySelectorAll('.saldo-opcoes button').forEach(btn => btn.classList.remove('selected'));
    fecharModalSaldo();
    alert(`Depósito de ${valorSaldo.toFixed(2)}€ realizado com sucesso via ${metodoPagamentoAtual}!`);
  } else {
    alert("Por favor, insira um valor de saldo válido.");
  }
}

function addEquipa() {
  const modal = document.getElementById('modalCriarEquipa');
  if (modal) modal.style.display = 'block';
}
function fecharModal() {
  document.querySelectorAll('.modal, .popup').forEach(modal => modal.style.display = 'none');
}
function criarEquipa() {
  window.location.href = "equipa/equipa.html";
}

function abrirModalLogin() {
  const modal = document.getElementById('modalLogin');
  if (modal) modal.style.display = 'block';
}
function fecharModalLogin() {
  const modal = document.getElementById('modalLogin');
  if (modal) modal.style.display = 'none';
}
function fazerLogin() {
  const user = document.getElementById('username').value;
  alert(`Login simulado para: ${user}`);
  fecharModalLogin();
}

// --- Funções Barra Lateral (Sidebar) ---
function openProfileSidebar() {
  const sidebar = document.getElementById("profileSidebar");
  const overlay = document.getElementById("sidebarOverlay");
  if (sidebar) sidebar.style.width = "250px";
  if (overlay) overlay.style.display = "block";
}

function closeProfileSidebar() {
  const sidebar = document.getElementById("profileSidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const notificationPanel = document.getElementById('notificationPanel');

  if (notificationPanel && notificationPanel.classList.contains('visible')) {
    notificationPanel.classList.remove('visible');
  }

  if (sidebar) sidebar.style.width = "0";
  if (overlay) overlay.style.display = "none";
}

function fazerLogout() {
  alert("Logout efetuado! (simulação)");
  closeProfileSidebar();
}

// --- Painel de Notificações (dentro da Sidebar) ---
function toggleNotificationPanel(event) {
  event.preventDefault();
  const notificationPanel = document.getElementById('notificationPanel');
  const sidebar = document.getElementById("profileSidebar");

  if (!notificationPanel || !sidebar) {
    console.error("Painel de notificações ou sidebar não encontrado.");
    return;
  }

  if (sidebar.style.width === "250px") {
    notificationPanel.classList.toggle('visible');
    console.log("Painel de notificações alternado. Visível:", notificationPanel.classList.contains('visible'));
  } else {
    console.log("Sidebar fechada, não abrindo o painel de notificações.");
    notificationPanel.classList.remove('visible');
  }
}

// --- Função para renderizar campos disponíveis (Exemplo inicial, opcional) ---
async function renderizarCamposDisponiveisInicial() {
  const resultsContainer = document.getElementById('resultsContainer');
  const searchResultsSection = document.getElementById("searchResultsSection");
  if (!resultsContainer || !searchResultsSection) return;

  if (typeof todosOsCampos === 'undefined' || todosOsCampos.length === 0) {
    console.warn("Campos ainda não disponíveis em script.js. A renderização inicial pode falhar ou esperar.");
    resultsContainer.innerHTML = '<p>Carregando campos...</p>';
    resultsContainer.classList.remove("cards");

    if (typeof carregarCampos === 'function') {
      try {
        await carregarCampos();
      } catch (error) {
        resultsContainer.innerHTML = '<p>Erro ao carregar campos iniciais.</p>';
        return;
      }
    } else {
      resultsContainer.innerHTML = '<p>Erro: Função carregarCampos não encontrada.</p>';
      return;
    }
  }

  if (todosOsCampos.length > 0) {
    resultsContainer.innerHTML = '';
    resultsContainer.classList.add("cards");
    const camposParaMostrar = todosOsCampos.slice(0, 4);

    if (camposParaMostrar.length === 0) {
      resultsContainer.innerHTML = '<p>Nenhum campo disponível encontrado.</p>';
      resultsContainer.classList.remove("cards");
    } else {
      camposParaMostrar.forEach(campo => {
        const card = document.createElement('div');
        card.className = 'card';

        const imagePath = campo.imagem && campo.imagem.startsWith('../') ? campo.imagem.substring(3) : (campo.imagem || 'images/placeholder.png');
        const precoStr = typeof campo.preco_hora === 'number' ? campo.preco_hora.toFixed(2) + '€' : 'N/D';

        card.innerHTML = `
          <img src="${imagePath}" alt="${campo.nome || 'Campo'}">
          <div class="card-content">
            <h3>${campo.nome || 'Campo'}</h3>
            <p><strong>Localidade:</strong> ${campo.localidade || 'N/D'}</p>
            <p><strong>Preço/Hora:</strong> ${precoStr}</p>
          </div>
          <div class="buttons">
            <button onclick="irParaDetalhes(${campo.id})">Mais Detalhes</button>
          </div>
        `;
        resultsContainer.appendChild(card);
      });
    }
  } else if (!resultsContainer.innerHTML.includes('Erro')) {
    resultsContainer.innerHTML = '<p>Não há campos disponíveis para mostrar inicialmente.</p>';
    resultsContainer.classList.remove("cards");
  }
}

// --- Novas Funções para Métodos de Pagamento ---

let metodoPagamentoAtual = null;
let detalhesMetodo = {};

function abrirModalMetodosPagamento() {
  const modal = document.getElementById("modalMetodoPagamento");
  if (modal) modal.style.display = "block";
}

function fecharModalMetodosPagamento() {
  const modal = document.getElementById("modalMetodoPagamento");
  if (modal) modal.style.display = "none";
}

function abrirModalDetalhesCartao() {
  const modal = document.getElementById("modalDetalhesCartao");
  if (modal) modal.style.display = "block";
}

function fecharModalDetalhesCartao() {
  const modal = document.getElementById("modalDetalhesCartao");
  if (modal) modal.style.display = "none";
}

function selecionarMetodo(metodo) {
  console.log("Método selecionado:", metodo);
  metodoPagamentoAtual = metodo;
  detalhesMetodo = {};

  if (metodo === 'visa') {
    fecharModalMetodosPagamento();
    abrirModalDetalhesCartao();
  } else {
    atualizarMetodoPagamentoUI();
    fecharModalMetodosPagamento();
  }

  document.querySelectorAll('.metodos-pagamento-lista li').forEach(li => {
    li.classList.remove('selected');
    if (li.getAttribute('onclick').includes(`'${metodo}'`)) {
      li.classList.add('selected');
    }
  });
}

function confirmarDetalhesCartao() {
  const numeroCartao = document.getElementById('numeroCartao').value;
  const nomeTitular = document.getElementById('nomeTitular').value;
  const dataValidade = document.getElementById('dataValidade').value;
  const cvv = document.getElementById('cvv').value;

  if (numeroCartao && nomeTitular && dataValidade && cvv && numeroCartao.length >= 15) {
    detalhesMetodo = {
      tipo: 'Cartão',
      final: numeroCartao.slice(-4),
      nome: nomeTitular
    };
    metodoPagamentoAtual = 'visa';
    console.log("Detalhes do cartão confirmados (simulação):", detalhesMetodo);
    atualizarMetodoPagamentoUI();
    fecharModalDetalhesCartao();
    document.getElementById('numeroCartao').value = '';
    document.getElementById('nomeTitular').value = '';
    document.getElementById('dataValidade').value = '';
    document.getElementById('cvv').value = '';
  } else {
    alert("Por favor, preencha todos os detalhes do cartão corretamente.");
  }
}

function atualizarMetodoPagamentoUI() {
  const iconeEl = document.getElementById('metodoSelecionadoIcone');
  const nomeEl = document.getElementById('metodoSelecionadoNome');
  const detalheEl = document.getElementById('metodoSelecionadoDetalhe');

  if (!iconeEl || !nomeEl || !detalheEl) return;

  switch (metodoPagamentoAtual) {
    case 'visa':
      iconeEl.src = '../images/visa_logo.png';
      nomeEl.textContent = detalhesMetodo.tipo || 'Cartão de Crédito/Débito';
      detalheEl.textContent = detalhesMetodo.final ? `Terminado em ${detalhesMetodo.final}` : 'Detalhes não confirmados';
      break;
    case 'mbway':
      iconeEl.src = '../images/mbway_logo.png';
      nomeEl.textContent = 'MB WAY';
      detalheEl.textContent = 'Pagamento via App MB WAY';
      break;
    case 'paypal':
      iconeEl.src = '../images/paypal_logo.png';
      nomeEl.textContent = 'PayPal';
      detalheEl.textContent = 'Pagamento via conta PayPal';
      break;
    default:
      iconeEl.src = '../images/default-payment.png';
      nomeEl.textContent = 'Nenhum selecionado';
      detalheEl.textContent = '';
      break;
  }
}

function definirValorSaldo(valor) {
  const valorInput = document.getElementById("valorSaldo");
  if (valorInput) {
    valorInput.value = valor.toFixed(2);
  }
  document.querySelectorAll('.saldo-opcoes button').forEach(btn => {
    btn.classList.remove('selected');
    if (parseFloat(btn.textContent) === valor) {
      btn.classList.add('selected');
    }
  });
}

// ========== EVENT LISTENER DOMContentLoaded (Principal) ==========

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar saldo (global para todas as páginas)
  const saldoContainer = document.getElementById("saldoContainer");
  if (saldoContainer) {
    let saldoSpan = saldoContainer.querySelector('span#saldoAtual');
    if (!saldoSpan) { // Se o span não existir dentro do container, cria-o
      saldoSpan = document.createElement('span');
      saldoSpan.id = 'saldoAtual';
      // Adiciona algum texto placeholder ou formatação inicial se desejar
      saldoContainer.appendChild(saldoSpan);
    }
    
    const saldoGuardado = localStorage.getItem('saldoUsuario');
    if (saldoGuardado !== null) {
      saldoSpan.textContent = `${parseFloat(saldoGuardado).toFixed(2)}€`;
    } else {
      const saldoInicial = 0.00;
      localStorage.setItem('saldoUsuario', saldoInicial.toString());
      saldoSpan.textContent = `${saldoInicial.toFixed(2)}€`;
    }
  } else {
    console.warn("Elemento saldoContainer não encontrado no DOM. O saldo não será exibido/atualizado por script.js.");
  }

  // Inicializar nome do utilizador na sidebar (global)
  const nomeUtilizadorSidebar = document.querySelector("#profileSidebar .profile-name");
  if (nomeUtilizadorSidebar) {
    const nomeGuardado = localStorage.getItem('nomeUtilizador');
    if (nomeGuardado) {
      nomeUtilizadorSidebar.textContent = nomeGuardado;
    }
  }
  
  console.log("DOM carregado para script.js (principal)");

  // Verificar a página atual
  const currentPagePath = window.location.pathname;
  const currentPageFile = currentPagePath.split('/').pop();

  // Executar funções específicas do index.html apenas se estivermos nessa página
  if (currentPageFile === "index.html" || currentPageFile === "") {
    if (typeof carregarEExibirReservasIndex === "function") {
      try {
        carregarEExibirReservasIndex();
      } catch (e) {
        console.error("Erro ao executar carregarEExibirReservasIndex:", e);
      }
    }

    if (typeof carregarEExibirEquipasIndex === "function") {
      try {
        carregarEExibirEquipasIndex();
      } catch (e) {
        console.error("Erro ao executar carregarEExibirEquipasIndex:", e);
      }
    }

    if (typeof inicializarPesquisa === "function") {
      inicializarPesquisa();
    }
  }

  const saldoGuardado = localStorage.getItem('saldoUsuario');
  const saldoAtualEl = document.getElementById("saldoAtual");
  if (saldoAtualEl) {
    const saldoValor = saldoGuardado ? parseFloat(saldoGuardado) : 0;
    saldoAtualEl.textContent = `${saldoValor.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€`;
  }

  document.querySelectorAll('.modal, .popup').forEach(modal => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        if (modal.id === 'modalAdicionarSaldo') fecharModalSaldo();
        else if (modal.id === 'modalMetodoPagamento') fecharModalMetodosPagamento();
        else if (modal.id === 'modalDetalhesCartao') fecharModalDetalhesCartao();
        else if (modal.id === 'modalLogin') fecharModalLogin();
        else modal.style.display = 'none';
      }
    });
  });

  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeProfileSidebar);
  }

  atualizarMetodoPagamentoUI();

  console.log("Listeners e configurações de script.js (principal) aplicados.");
});

window.abrirModalSaldo = abrirModalSaldo;
window.fecharModalSaldo = fecharModalSaldo;
window.adicionarSaldo = adicionarSaldo;
window.fecharModal = fecharModal;
window.criarEquipa = criarEquipa;
window.abrirModalLogin = abrirModalLogin;
window.fecharModalLogin = fecharModalLogin;
window.fazerLogin = fazerLogin;
window.openProfileSidebar = openProfileSidebar;
window.closeProfileSidebar = closeProfileSidebar;
window.fazerLogout = fazerLogout;
window.toggleNotificationPanel = toggleNotificationPanel;
window.fecharModalMetodosPagamento = fecharModalMetodosPagamento;
window.abrirModalMetodosPagamento = abrirModalMetodosPagamento;
window.selecionarMetodo = selecionarMetodo;
window.fecharModalDetalhesCartao = fecharModalDetalhesCartao;
window.confirmarDetalhesCartao = confirmarDetalhesCartao;
window.definirValorSaldo = definirValorSaldo;