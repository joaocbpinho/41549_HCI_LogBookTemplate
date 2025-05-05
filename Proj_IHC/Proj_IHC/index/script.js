// ========== FUNÇÕES GLOBAIS (MODAIS, SIDEBAR, RENDERIZAÇÃO INICIAL) ==========

// --- Funções Modais (Saldo, Login, Criar Equipa, Detalhes Equipa) ---
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

// --- Funções Modais (Adicionar as novas) ---
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

  membrosListEl.innerHTML = '';

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
    localStorage.setItem("equipaSelecionada", nomeEquipaSelecionadaParaGestao);
    window.location.href = "../equipa/equipa.html";
  } else {
    window.location.href = "../equipa/equipa.html";
  }
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

// ========== FUNÇÕES PARA CARREGAR E EXIBIR RESERVAS NO INDEX ==========

async function carregarEExibirReservasIndex() {
  const listaReservasContainer = document.getElementById('listaReservas');
  if (!listaReservasContainer) {
    console.error("Elemento #listaReservas não encontrado no DOM.");
    return;
  }

  listaReservasContainer.innerHTML = '<p>A carregar as suas próximas reservas...</p>';
  listaReservasContainer.classList.remove('cards');

  const userIdLogado = localStorage.getItem('userId') || '123456';

  if (!userIdLogado) {
    listaReservasContainer.innerHTML = '<p>Faça login para ver as suas reservas.</p>';
    return;
  }

  try {
    const [responseReservas, responseCampos] = await Promise.all([
      fetch('../reservas/reservas.json'),
      fetch('../campo/campos.json')
    ]);

    if (!responseReservas.ok) throw new Error(`Erro ao carregar reservas: ${responseReservas.status}`);
    if (!responseCampos.ok) throw new Error(`Erro ao carregar campos: ${responseCampos.status}`);

    const todasReservas = await responseReservas.json();
    const todosOsCamposIndex = await responseCampos.json();

    const reservasUsuario = todasReservas.filter(reserva => reserva.userId === userIdLogado);

    const agora = new Date();
    const reservasFuturas = reservasUsuario.filter(reserva => {
      try {
        const dataHoraReserva = new Date(`${reserva.data}T${reserva.horaInicio}`);
        return dataHoraReserva > agora;
      } catch (e) {
        console.warn(`Data/hora inválida para reserva ID ${reserva.id}: ${reserva.data} ${reserva.horaInicio}`);
        return false;
      }
    });

    reservasFuturas.sort((a, b) => new Date(`${a.data}T${a.horaInicio}`) - new Date(`${b.data}T${b.horaInicio}`));

    const proximasReservasParaMostrar = reservasFuturas.slice(0, 3);

    renderizarListaReservasIndex(proximasReservasParaMostrar, todosOsCamposIndex, listaReservasContainer);

  } catch (error) {
    console.error("Erro ao carregar ou processar reservas para o Index:", error);
    listaReservasContainer.innerHTML = '<p>Ocorreu um erro ao carregar as suas reservas.</p>';
  }
}

function renderizarListaReservasIndex(reservasParaMostrar, camposInfo, container) {
  container.innerHTML = '';

  if (reservasParaMostrar.length === 0) {
    container.innerHTML = '<p>Nenhuma reserva futura encontrada.</p>';
  } else {
    container.classList.add('cards');
    reservasParaMostrar.forEach(reserva => {
      const campoDetalhes = camposInfo.find(campo => campo.id === reserva.campoId);
      const nomeCampo = campoDetalhes ? campoDetalhes.nome : 'Campo Desconhecido';

      const cardReserva = document.createElement('div');
      cardReserva.className = 'card';

      let dataFormatada = reserva.data;
      try {
        const [ano, mes, dia] = reserva.data.split('-');
        dataFormatada = `${dia}/${mes}/${ano}`;
      } catch (e) { }

      cardReserva.innerHTML = `
        <div class="card-content">
          <h3>${nomeCampo}</h3>
          <p><strong>Data:</strong> ${dataFormatada}</p>
          <p><strong>Hora:</strong> ${reserva.horaInicio} - ${reserva.horaFim}</p>
          <p><strong>Desporto:</strong> ${reserva.desporto || 'N/D'}</p>
        </div>
      `;
      container.appendChild(cardReserva);
    });
  }

  const cardVerTodas = document.createElement("div");
  cardVerTodas.className = "card add-card view-all-reservas-card";
  cardVerTodas.innerHTML = `
    <div class="add-card-content">📅 Ver todas as reservas</div>
  `;
  cardVerTodas.title = 'Ver todas as suas reservas';
  cardVerTodas.style.cursor = 'pointer';
  cardVerTodas.onclick = () => window.location.href = '../reservas/reservas.html';
  container.appendChild(cardVerTodas);

  container.classList.add('cards');
}

// ========== FUNÇÃO PARA RENDERIZAR EQUIPAS NO INDEX ==========

function renderizarEquipas() {
  const listaEquipas = document.getElementById("listaEquipas");
  if (!listaEquipas) {
    console.error("Elemento #listaEquipas não encontrado no DOM.");
    return;
  }
  const equipas = JSON.parse(localStorage.getItem("equipas")) || [];
  listaEquipas.innerHTML = "";

  equipas.forEach((equipa) => {
    const desportoFormatado = equipa.desporto ? equipa.desporto.charAt(0).toUpperCase() + equipa.desporto.slice(1) : 'N/D';
    const card = document.createElement("div");
    card.className = "card card-equipa";
    card.innerHTML = `
      <div class="card-content">
        <h3>${equipa.nome || 'Equipa sem nome'}</h3>
        <p><strong>Desporto:</strong> ${desportoFormatado}</p>
      </div>
    `;
    card.addEventListener("click", () => {
      const equipaCompleta = equipas.find(e => e.nome === equipa.nome);
      if (equipaCompleta) {
        abrirModalDetalhesEquipa(equipaCompleta);
      } else {
        console.error("Não foi possível encontrar os detalhes completos da equipa:", equipa.nome);
      }
    });
    card.style.cursor = 'pointer';
    card.title = `Ver detalhes da equipa ${equipa.nome || ''}`;
    listaEquipas.appendChild(card);
  });

  const addCard = document.createElement("div");
  addCard.className = "card add-card";
  addCard.innerHTML = `
    <div class="add-card-content">➕ Criar Equipa</div>
  `;
  addCard.title = 'Criar uma nova equipa';
  addCard.style.cursor = 'pointer';
  addCard.addEventListener('click', () => {
    window.location.href = '../equipa/equipa.html';
  });
  listaEquipas.appendChild(addCard);
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
  console.log("DOM carregado para script.js (principal)");

  carregarEExibirReservasIndex();
  renderizarEquipas();

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
        else if (modal.id === 'modalDetalhesEquipa') fecharModalDetalhesEquipa();
        else if (modal.id === 'modalLogin') fecharModalLogin();
        else modal.style.display = 'none';
      }
    });
  });

  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeProfileSidebar);
  }

  const modalDetalhes = document.getElementById('modalDetalhesEquipa');
  if (modalDetalhes) {
    modalDetalhes.addEventListener('click', (event) => {
      if (event.target === modalDetalhes) {
        fecharModalDetalhesEquipa();
      }
    });
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
window.fecharModalDetalhesEquipa = fecharModalDetalhesEquipa;
window.irParaPaginaEquipa = irParaPaginaEquipa;
window.fecharModalMetodosPagamento = fecharModalMetodosPagamento;
window.abrirModalMetodosPagamento = abrirModalMetodosPagamento;
window.selecionarMetodo = selecionarMetodo;
window.fecharModalDetalhesCartao = fecharModalDetalhesCartao;
window.confirmarDetalhesCartao = confirmarDetalhesCartao;
window.definirValorSaldo = definirValorSaldo;