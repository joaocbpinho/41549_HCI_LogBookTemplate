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

// Função para carregar as reservas do localStorage
async function carregarReservas() {
    try {
        const reservasGuardadas = localStorage.getItem('todasReservas');
        if (reservasGuardadas) {
            todasReservas = JSON.parse(reservasGuardadas);
            console.log("Reservas carregadas do localStorage:", todasReservas);
        } else {
            todasReservas = [];
            console.log("Nenhuma reserva no localStorage. Iniciando com array vazio.");
        }
    } catch (error) {
        console.error("Erro ao carregar/processar reservas do localStorage:", error);
        todasReservas = [];
    }
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
    minhasReservas.sort((a, b) => {
        const dataA = new Date(`${a.data}T${a.horaInicio || '00:00'}`);
        const dataB = new Date(`${b.data}T${b.horaInicio || '00:00'}`);
        return dataB - dataA;
    });

    if (minhasReservas.length === 0) {
        container.innerHTML = '<p>Nenhuma reserva encontrada.</p>';
        return;
    }

    minhasReservas.forEach(reserva => {
        const campoDetalhes = todosCampos.find(campo => campo.id && reserva.campoId && campo.id.toString() === reserva.campoId.toString());
        const nomeCampo = campoDetalhes ? campoDetalhes.nome : 'Campo Desconhecido';

        let dataFormatada = reserva.data;
        try {
            let dataParaObjeto = reserva.data;
            if (reserva.data.includes('/')) {
                const partes = reserva.data.split('/');
                if (partes.length === 3) {
                    dataParaObjeto = `${partes[2]}-${partes[1]}-${partes[0]}`;
                }
            }
            const dataObj = new Date(dataParaObjeto + 'T00:00:00');
            if (!isNaN(dataObj)) {
                dataFormatada = dataObj.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
            } else {
                console.warn("Data inválida para formatação:", reserva.data);
            }
        } catch (e) {
            console.warn("Erro ao formatar data:", reserva.data, e);
        }

        const card = document.createElement('div');
        card.className = 'card';
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
        localStorage.setItem('reservaDetalheId', reservaId);
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

    const userIdLogado = localStorage.getItem('userId') || '123456';
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

    const userIdLogado = localStorage.getItem('userId') || '123456';
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
            alert(`Erro ao tentar cancelar a reserva ID: ${reservaId}. A reserva não foi removida.`);
        }
    }
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
        await carregarCampos();
        await carregarReservas();
        renderizarMinhasReservas('listaMinhasReservas');
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
});