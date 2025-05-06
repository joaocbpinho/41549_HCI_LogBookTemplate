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
        return Promise.reject(error); // Rejeita a promessa para que o Promise.all possa lidar com o erro
    }
}

// Função para carregar as reservas do localStorage
async function carregarReservas() {
    try {
        const reservasGuardadas = localStorage.getItem('todasReservas');
        if (reservasGuardadas) {
            todasReservas = JSON.parse(reservasGuardadas);
            console.log("Reservas carregadas do localStorage:", todasReservas);
        } else {
            // Se não houver reservas no localStorage, começa com um array vazio.
            // A tentativa de carregar 'reservas.json' como seed foi removida.
            todasReservas = [];
            console.log("Nenhuma reserva no localStorage. Iniciando com array vazio.");
        }
    } catch (error) {
        console.error("Erro ao carregar/processar reservas do localStorage:", error);
        todasReservas = []; // Garante que é um array em caso de erro de parse do localStorage
    }
    // Mantido para consistência se usado em Promise.all, embora a operação principal seja síncrona.
    return Promise.resolve();
}

// Nova função para guardar reservas no localStorage
function guardarReservasNoLocalStorage() {
    try {
        localStorage.setItem('todasReservas', JSON.stringify(todasReservas));
        console.log("Reservas guardadas no localStorage.");
    } catch (error) {
        console.error("Erro ao guardar reservas no localStorage:", error);
    }
}

// ========== FUNÇÕES DE RENDERIZAÇÃO ==========

function renderizarMinhasReservas(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container com ID '${containerId}' não encontrado para renderizar reservas.`);
        return;
    }

    container.innerHTML = ''; // Limpa 'A carregar...' ou conteúdo antigo

    const userIdLogado = localStorage.getItem('userId') || '123456'; // Usar 'userIdLogado' se for essa a chave
    const minhasReservas = todasReservas.filter(reserva => reserva.userId === userIdLogado);

    // Ordenar por data e hora (mais recentes primeiro)
    // Certifique-se que reserva.data e reserva.horaInicio/horaFim existem e estão no formato esperado
    minhasReservas.sort((a, b) => {
        const dataA = new Date(`${a.data}T${a.horaInicio || '00:00'}`); // Fallback para horaInicio
        const dataB = new Date(`${b.data}T${b.horaInicio || '00:00'}`); // Fallback para horaInicio
        return dataB - dataA; // Mais recentes primeiro
    });

    if (minhasReservas.length === 0) {
        container.innerHTML = '<p>Nenhuma reserva encontrada.</p>';
        return;
    }

    minhasReservas.forEach(reserva => {
        const campoDetalhes = todosCampos.find(campo => campo.id && reserva.campoId && campo.id.toString() === reserva.campoId.toString());
        const nomeCampo = campoDetalhes ? campoDetalhes.nome : 'Campo Desconhecido';

        let dataFormatada = reserva.data;
        // Tentar formatar a data, assumindo que reserva.data é algo como "YYYY-MM-DD" ou "DD/MM/YYYY"
        // O JavaScript Date constructor é flexível mas pode ser inconsistente com formatos DD/MM/YYYY.
        // É mais seguro se a data estiver em "YYYY-MM-DD".
        try {
            // Se a data já estiver no formato DD/MM/YYYY, podemos precisar de a reordenar para o construtor Date
            let dataParaObjeto = reserva.data;
            if (reserva.data.includes('/')) { // Ex: 25/12/2023
                const partes = reserva.data.split('/');
                if (partes.length === 3) {
                    dataParaObjeto = `${partes[2]}-${partes[1]}-${partes[0]}`; // YYYY-MM-DD
                }
            }
            const dataObj = new Date(dataParaObjeto + 'T00:00:00'); // Adiciona T00:00:00 para evitar problemas de fuso horário
            if (!isNaN(dataObj)) { // Verifica se a data é válida
                 dataFormatada = dataObj.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
            } else {
                console.warn("Data inválida para formatação:", reserva.data);
            }
        } catch (e) {
            console.warn("Erro ao formatar data:", reserva.data, e);
            /* Usa a data como está se falhar */
        }

        const card = document.createElement('div');
        card.className = 'card';
        // Adicionar verificação para reserva.precoDefinido
        const precoTexto = (reserva.precoDefinido !== undefined && reserva.precoDefinido !== null)
            ? parseFloat(reserva.precoDefinido).toFixed(2) + '€'
            : 'N/D';

        card.innerHTML = `
            <h3>${nomeCampo}</h3>
            <p><strong>Data:</strong> ${dataFormatada}</p>
            <p><strong>Hora:</strong> ${reserva.hora || (reserva.horaInicio && reserva.horaFim ? `${reserva.horaInicio} - ${reserva.horaFim}` : 'N/D')}</p>
            <p><strong>Desporto:</strong> ${reserva.desporto || 'N/D'}</p>
            <p><strong>Número Convidados:</strong> ${reserva.numConvidados !== undefined ? reserva.numConvidados : 'N/D'}</p>
            <p><strong>Número Confirmados:</strong> ${reserva.numConfirmados !== undefined ? reserva.numConfirmados : 'N/D'}</p>
            <p><strong>Preço Definido:</strong> ${precoTexto}</p>
            <div class="reserva-actions">
                <button class="detalhes-btn" data-reserva-id="${reserva.id}">Mais Detalhes</button>
                <button class="cancelar-presenca-btn" data-reserva-id="${reserva.id}">Gerir Presenças</button>
                <button class="cancelar-reserva-btn" data-reserva-id="${reserva.id}">Cancelar Reserva</button>
            </div>
        `;
        container.appendChild(card);
    });

    adicionarEventListenersAcoes();
}

// ========== FUNÇÕES DE AÇÕES ==========

function abrirDetalhesReserva(event) {
    const reservaId = event.target.dataset.reservaId;
    const reserva = todasReservas.find(r => r.id && r.id.toString() === reservaId);
    if (reserva) {
        localStorage.setItem('reservaDetalheId', reservaId); // Para outra página usar
        // Poderia redirecionar para uma página de detalhes:
        // window.location.href = `../detalhesReserva/detalhesReserva.html`;
        alert(`Abrindo detalhes da reserva ID: ${reservaId}\nCampo ID: ${reserva.campoId}\nData: ${reserva.data}`);
    } else {
        alert(`Reserva ID: ${reservaId} não encontrada.`);
    }
}

function cancelarPresencas(event) {
    const reservaId = event.target.dataset.reservaId;
    const reservaIndex = todasReservas.findIndex(r => r.id && r.id.toString() === reservaId);

    if (reservaIndex === -1) {
        alert("Reserva não encontrada!");
        return;
    }

    const userIdLogado = localStorage.getItem('userId') || '123456'; // Usar 'userIdLogado' se for essa a chave
    if (todasReservas[reservaIndex].userId !== userIdLogado) {
        alert("Apenas o criador da reserva pode gerir as presenças desta forma (ex: zerar confirmados).");
        return;
    }

    if (confirm(`Tem a certeza que quer zerar o número de confirmados para a reserva ID: ${reservaId}?`)) {
        todasReservas[reservaIndex].numConfirmados = 0;

        guardarReservasNoLocalStorage();
        alert(`Número de confirmados zerado para a reserva ID: ${reservaId}!`);
        renderizarMinhasReservas('listaMinhasReservas');
    }
}

function cancelarReserva(event) {
    const reservaId = event.target.dataset.reservaId;
    const reservaParaCancelar = todasReservas.find(r => r.id && r.id.toString() === reservaId);

    if (!reservaParaCancelar) {
        alert(`Reserva ID: ${reservaId} não encontrada para cancelamento.`);
        return;
    }

    const userIdLogado = localStorage.getItem('userId') || '123456'; // Usar 'userIdLogado' se for essa a chave
    if (reservaParaCancelar.userId !== userIdLogado) {
        alert("Apenas o criador da reserva pode cancelá-la.");
        return;
    }

    if (confirm(`Tem a certeza que quer CANCELAR a reserva ID: ${reservaId}? Esta ação não pode ser desfeita.`)) {
        const originalLength = todasReservas.length;
        todasReservas = todasReservas.filter(reserva => !(reserva.id && reserva.id.toString() === reservaId));

        if (todasReservas.length < originalLength) {
            guardarReservasNoLocalStorage();
            alert(`Reserva ID: ${reservaId} cancelada!`);
            renderizarMinhasReservas('listaMinhasReservas');
        } else {
            // Este caso pode acontecer se o ID não for encontrado no filter, embora o find anterior devesse apanhá-lo.
            alert(`Erro ao tentar cancelar a reserva ID: ${reservaId}. A reserva não foi removida.`);
        }
    }
}

// ========== SIDEBAR E LOGOUT ==========

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
    localStorage.removeItem('userId'); // Ou 'userIdLogado'
    localStorage.removeItem('userName');
    localStorage.removeItem('saldo');
    // localStorage.removeItem('todasReservas'); // Decidir se as reservas devem ser limpas no logout
    window.location.href = '../index/index.html';
    closeProfileSidebar(); // Fechar a sidebar após o redirecionamento pode não ser necessário ou visível
}

// ========== INICIALIZAÇÃO E EVENT LISTENERS ==========

function adicionarEventListenersAcoes() {
    const detalhesBtns = document.querySelectorAll(".detalhes-btn");
    const cancelarPresencaBtns = document.querySelectorAll(".cancelar-presenca-btn");
    const cancelarReservaBtns = document.querySelectorAll(".cancelar-reserva-btn");

    detalhesBtns.forEach(btn => btn.addEventListener("click", abrirDetalhesReserva));
    cancelarPresencaBtns.forEach(btn => btn.addEventListener("click", cancelarPresencas));
    cancelarReservaBtns.forEach(btn => btn.addEventListener("click", cancelarReserva));
}

async function inicializarPaginaReservas() {
    try {
        // Carrega campos primeiro, depois reservas.
        await carregarCampos();
        await carregarReservas();

        renderizarMinhasReservas('listaMinhasReservas');

        // Carregar dados do perfil na sidebar
        const userName = localStorage.getItem('userName') || 'Utilizador';
        const userId = localStorage.getItem('userId') || 'N/D'; // Ou 'userIdLogado'
        const profileNameEl = document.querySelector('.profile-name');
        const profileIdEl = document.querySelector('.profile-id');
        if (profileNameEl) profileNameEl.textContent = userName;
        if (profileIdEl) profileIdEl.textContent = `ID: ${userId}`;

        // Carregar saldo
        const saldoAtualEl = document.getElementById('saldoAtual');
        const saldoGuardado = localStorage.getItem('saldo') || '0.00';
        if (saldoAtualEl) saldoAtualEl.textContent = parseFloat(saldoGuardado).toFixed(2) + '€';

    } catch (error) {
        console.error("Erro ao inicializar a página de reservas:", error);
        const container = document.getElementById('listaMinhasReservas');
        if (container) {
            container.innerHTML = '<p>Ocorreu um erro ao carregar os dados das reservas. Verifique a consola para mais detalhes.</p>';
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM carregado para reservas.js");
    inicializarPaginaReservas();

    // Adicionar listener ao botão de perfil se ainda não tiver um via onclick no HTML
    const profileButton = document.getElementById("profileButton");
    if (profileButton && !profileButton.onclick) {
        profileButton.addEventListener("click", openProfileSidebar);
    }
    
    // Adicionar listener ao overlay se ainda não tiver um via onclick no HTML
    const overlay = document.getElementById("sidebarOverlay");
    if (overlay && !overlay.onclick) {
        overlay.onclick = closeProfileSidebar;
    }

    // Adicionar listener ao botão de fechar da sidebar se ainda não tiver um via onclick no HTML
    const closeBtnSidebar = document.querySelector("#profileSidebar .closebtn");
    if (closeBtnSidebar && !closeBtnSidebar.onclick) {
        closeBtnSidebar.addEventListener("click", closeProfileSidebar);
    }

    // Adicionar listener ao botão de logout se ainda não tiver um via onclick no HTML
    const logoutBtn = document.querySelector(".sidebar-logout");
    if (logoutBtn && !logoutBtn.onclick) {
        logoutBtn.addEventListener("click", fazerLogout);
    }

    // Adicionar listeners para o modal de saldo se os botões não tiverem onclick no HTML
    const saldoContainer = document.getElementById("saldoContainer");
    if (saldoContainer && !saldoContainer.onclick) {
        saldoContainer.addEventListener("click", abrirModalSaldo);
    }
    const fecharModalSaldoBtn = document.querySelector("#modalAdicionarSaldo .close");
    if (fecharModalSaldoBtn && !fecharModalSaldoBtn.onclick) {
        fecharModalSaldoBtn.addEventListener("click", fecharModalSaldo);
    }
    const adicionarSaldoBtn = document.querySelector("#modalAdicionarSaldo button");
    if (adicionarSaldoBtn && !adicionarSaldoBtn.onclick) {
        adicionarSaldoBtn.addEventListener("click", adicionarSaldo);
    }
});

// Funções para Modal Saldo
function abrirModalSaldo() {
    const modal = document.getElementById('modalAdicionarSaldo');
    if (modal) modal.style.display = 'block';
}

function fecharModalSaldo() {
    const modal = document.getElementById('modalAdicionarSaldo');
    if (modal) modal.style.display = 'none';
}

function adicionarSaldo() {
    const inputValor = document.getElementById('valorSaldo');
    if (!inputValor) {
        console.error("Elemento 'valorSaldo' não encontrado.");
        return;
    }
    const valor = parseFloat(inputValor.value);
    if (isNaN(valor) || valor <= 0) {
        alert("Por favor, insira um valor válido.");
        return;
    }

    let saldoAtual = parseFloat(localStorage.getItem('saldo') || '0');
    saldoAtual += valor;
    localStorage.setItem('saldo', saldoAtual.toFixed(2));

    const saldoAtualEl = document.getElementById('saldoAtual');
    if (saldoAtualEl) saldoAtualEl.textContent = saldoAtual.toFixed(2) + '€';

    alert(`Saldo adicionado: ${valor.toFixed(2)}€`);
    inputValor.value = '';
    fecharModalSaldo();
}