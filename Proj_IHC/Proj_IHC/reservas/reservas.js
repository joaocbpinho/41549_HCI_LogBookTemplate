// Variáveis globais para dados
let todasReservas = [];
let todosCampos = []; // Para guardar detalhes dos campos

// ========== FUNÇÕES DE CARREGAMENTO DE DADOS ==========

// Função para carregar os campos do JSON (necessário para nomes)
async function carregarCampos() {
    // Evita recarregar se já tiverem sido carregados
    if (todosCampos.length > 0) {
        return Promise.resolve();
    }
    try {
        // Ajuste o caminho se 'campos.json' não estiver na raiz relativa a 'reservas.html'
        const response = await fetch('../campo/campos.json'); // Caminho relativo ao HTML
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        todosCampos = await response.json();
        console.log("Campos carregados com sucesso:", todosCampos);
    } catch (error) {
        console.error("Erro ao carregar campos.json:", error);
        return Promise.reject(error);
    }
}

// Função para carregar as reservas do JSON
async function carregarReservas() {
    // Evita recarregar
    if (todasReservas.length > 0) {
        return Promise.resolve();
    }
    try {
        const response = await fetch('reservas.json'); // Ficheiro está na mesma pasta
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        todasReservas = await response.json();
        console.log("Reservas carregadas com sucesso:", todasReservas);
    } catch (error) {
        console.error("Erro ao carregar reservas.json:", error);
        return Promise.reject(error);
    }
}

// ========== FUNÇÕES DE RENDERIZAÇÃO ==========

function renderizarMinhasReservas(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; // Limpa 'A carregar...' ou conteúdo antigo

    // Obter ID do utilizador logado (ajuste conforme necessário)
    const userIdLogado = localStorage.getItem('userId') || '123456'; // Usar '123456' como fallback para teste

    const minhasReservas = todasReservas.filter(reserva => reserva.userId === userIdLogado);

    // Ordenar por data (mais recentes primeiro - opcional)
    minhasReservas.sort((a, b) => new Date(b.data + 'T' + b.horaInicio) - new Date(a.data + 'T' + a.horaInicio));

    if (minhasReservas.length === 0) {
        container.innerHTML = '<p>Nenhuma reserva encontrada.</p>';
        return;
    }

    minhasReservas.forEach(reserva => {
        const campoDetalhes = todosCampos.find(campo => campo.id === reserva.campoId);
        const nomeCampo = campoDetalhes ? campoDetalhes.nome : 'Campo Desconhecido';

        // Formatar data (ex: 10 abril) - Pode ajustar
        let dataFormatada = reserva.data;
        try {
            const dataObj = new Date(reserva.data + 'T00:00:00'); // Adiciona T00:00:00 para evitar problemas de fuso horário
            dataFormatada = dataObj.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' });
        } catch (e) { /* Usa a data como está se falhar */ }

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${nomeCampo}</h3>
            <p><strong>Data:</strong> ${dataFormatada}, ${reserva.horaInicio} - ${reserva.horaFim}</p>
            <p><strong>Desporto:</strong> ${reserva.desporto || 'N/D'}</p>
            <p><strong>Número Convidados:</strong> ${reserva.numConvidados}</p>
            <p><strong>Número Confirmados:</strong> ${reserva.numConfirmados}</p>
            <p><strong>Preço Definido:</strong> ${reserva.precoDefinido ? reserva.precoDefinido.toFixed(2) + '€' : 'N/D'}</p>
            <div class="reserva-actions">
                <button class="detalhes-btn" data-reserva-id="${reserva.id}">Mais Detalhes</button>
                <button class="cancelar-presenca-btn" data-reserva-id="${reserva.id}">Cancelar Presenças</button>
                <button class="cancelar-reserva-btn" data-reserva-id="${reserva.id}">Cancelar Reserva</button>
            </div>
        `;
        container.appendChild(card);
    });

    // Adiciona event listeners DEPOIS de criar os botões
    adicionarEventListenersAcoes();
}

// ========== FUNÇÕES DE AÇÕES (Exemplos) ==========

function abrirDetalhesReserva(event) {
    const reservaId = event.target.dataset.reservaId;
    alert(`Abrindo detalhes da reserva ID: ${reservaId}`);
    // Aqui pode redirecionar para outra página ou abrir um modal com detalhes
}

function cancelarPresencas(event) {
    const reservaId = event.target.dataset.reservaId;
    if (confirm(`Tem a certeza que quer cancelar as presenças para a reserva ID: ${reservaId}?`)) {
        alert(`Presenças canceladas para a reserva ID: ${reservaId}!`);
        // Adicionar lógica para atualizar dados (JSON ou backend)
    }
}

function cancelarReserva(event) {
    const reservaId = event.target.dataset.reservaId;
    if (confirm(`Tem a certeza que quer CANCELAR a reserva ID: ${reservaId}? Esta ação não pode ser desfeita.`)) {
        alert(`Reserva ID: ${reservaId} cancelada!`);
        // Adicionar lógica para remover/atualizar dados (JSON ou backend)
        // E depois, talvez recarregar a lista:
        // renderizarMinhasReservas('listaMinhasReservas');
    }
}

// ========== SIDEBAR E LOGOUT (Já existentes) ==========

function openProfileSidebar() {
    const sidebar = document.getElementById("profileSidebar");
    const overlay = document.getElementById("sidebarOverlay");
    if (sidebar) sidebar.style.width = "250px";
    if (overlay) overlay.classList.add("active");
}

function closeProfileSidebar() {
    const sidebar = document.getElementById("profileSidebar");
    const overlay = document.getElementById("sidebarOverlay");
    if (sidebar) sidebar.style.width = "0";
    if (overlay) overlay.classList.remove("active");
}

function fazerLogout() {
    alert("Logout efetuado!");
    // Limpar dados de sessão/login (ex: localStorage)
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    // Redirecionar para página inicial ou de login
    window.location.href = '../index/index.html'; // Ajuste se necessário
    closeProfileSidebar();
}

// ========== INICIALIZAÇÃO E EVENT LISTENERS ==========

// Função para adicionar listeners aos botões de ação (DEVE ser chamada DEPOIS de renderizar)
function adicionarEventListenersAcoes() {
    const detalhesBtns = document.querySelectorAll(".detalhes-btn");
    const cancelarPresencaBtns = document.querySelectorAll(".cancelar-presenca-btn");
    const cancelarReservaBtns = document.querySelectorAll(".cancelar-reserva-btn");

    detalhesBtns.forEach(btn => btn.addEventListener("click", abrirDetalhesReserva));
    cancelarPresencaBtns.forEach(btn => btn.addEventListener("click", cancelarPresencas));
    cancelarReservaBtns.forEach(btn => btn.addEventListener("click", cancelarReserva));
}

// Função principal de inicialização
async function inicializarPaginaReservas() {
    try {
        // Carrega os dados necessários em paralelo
        await Promise.all([
            carregarCampos(),
            carregarReservas()
        ]);

        // Renderiza as reservas do utilizador
        renderizarMinhasReservas('listaMinhasReservas');

        // Carregar saldo e outras infos do header (se necessário)
        // carregarDadosHeader(); // Implementar esta função se precisar

    } catch (error) {
        console.error("Erro ao inicializar a página de reservas:", error);
        const container = document.getElementById('listaMinhasReservas');
        if (container) {
            container.innerHTML = '<p>Ocorreu um erro ao carregar os dados das reservas.</p>';
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM carregado para reservas.js");
    inicializarPaginaReservas();

    // Adiciona listener para o overlay da sidebar (se ainda não existir)
    const overlay = document.getElementById("sidebarOverlay");
    if (overlay && !overlay.onclick) { // Evita adicionar múltiplos listeners
        overlay.onclick = closeProfileSidebar;
    }

    // Carregar dados do perfil na sidebar (exemplo)
    const userName = localStorage.getItem('userName') || 'Utilizador';
    const userId = localStorage.getItem('userId') || 'N/D';
    const profileNameEl = document.querySelector('.profile-name');
    const profileIdEl = document.querySelector('.profile-id');
    if (profileNameEl) profileNameEl.textContent = userName;
    if (profileIdEl) profileIdEl.textContent = `ID: ${userId}`;

    // Carregar saldo (exemplo)
    const saldoAtualEl = document.getElementById('saldoAtual');
    const saldoGuardado = localStorage.getItem('saldo') || '0.00';
    if (saldoAtualEl) saldoAtualEl.textContent = parseFloat(saldoGuardado).toFixed(2) + '€';

});

// Funções para Modal Saldo (se precisar delas nesta página)
function abrirModalSaldo() {
    const modal = document.getElementById('modalAdicionarSaldo');
    if(modal) modal.style.display = 'block';
}

function fecharModalSaldo() {
    const modal = document.getElementById('modalAdicionarSaldo');
    if(modal) modal.style.display = 'none';
}

function adicionarSaldo() {
    const inputValor = document.getElementById('valorSaldo');
    const valor = parseFloat(inputValor.value);
    if (isNaN(valor) || valor <= 0) {
        alert("Por favor, insira um valor válido.");
        return;
    }

    let saldoAtual = parseFloat(localStorage.getItem('saldo') || '0');
    saldoAtual += valor;
    localStorage.setItem('saldo', saldoAtual.toFixed(2));

    // Atualiza o header
    const saldoAtualEl = document.getElementById('saldoAtual');
    if (saldoAtualEl) saldoAtualEl.textContent = saldoAtual.toFixed(2) + '€';

    alert(`Saldo adicionado: ${valor.toFixed(2)}€`);
    inputValor.value = '';
    fecharModalSaldo();
}