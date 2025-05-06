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
        const reservasGuardadas = localStorage.getItem('todasReservas'); // Chave correta
        if (reservasGuardadas) {
            todasReservas = JSON.parse(reservasGuardadas);
            console.log("[reservas.js] Reservas carregadas do localStorage:", todasReservas);
        } else {
            todasReservas = [];
            console.log("[reservas.js] Nenhuma reserva no localStorage. Iniciando com array vazio.");
        }
    } catch (error) {
        console.error("[reservas.js] Erro ao carregar/processar reservas do localStorage:", error);
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
        console.error(`[reservas.js] Container com ID '${containerId}' não encontrado para renderizar reservas.`);
        return;
    }

    container.innerHTML = ''; // Limpa 'A carregar...' ou conteúdo antigo

    // ***** ALTERAÇÃO IMPORTANTE: Usar o mesmo userId que campo.js usa para guardar *****
    const userIdLogado = "prototipoUser"; // Para corresponder ao que campo.js guarda
    // Idealmente, o userId viria de um sistema de login consistente e guardado em localStorage.getItem('userIdLogado') por exemplo.
    console.log(`[reservas.js] Filtrando reservas para userId: ${userIdLogado}`);

    const minhasReservas = todasReservas.filter(reserva => reserva.userId === userIdLogado);
    console.log(`[reservas.js] Reservas encontradas para este user:`, minhasReservas);

    minhasReservas.sort((a, b) => {
        try {
            const dataPartA = a.data.split('/'); // DD/MM/YYYY
            const horaPartA = a.horario ? a.horario.split(' - ')[0] : '00:00'; // HH:MM
            const dataHoraA = new Date(`${dataPartA[2]}-${dataPartA[1]}-${dataPartA[0]}T${horaPartA}:00`);

            const dataPartB = b.data.split('/');
            const horaPartB = b.horario ? b.horario.split(' - ')[0] : '00:00';
            const dataHoraB = new Date(`${dataPartB[2]}-${dataPartB[1]}-${dataPartB[0]}T${horaPartB}:00`);

            if (isNaN(dataHoraA.getTime()) || isNaN(dataHoraB.getTime())) { // Verificar se as datas são válidas
                console.warn("[reservas.js] Data inválida encontrada durante a ordenação:", a, b);
                return 0;
            }
            return dataHoraB - dataHoraA; // Mais recentes primeiro
        } catch (e) {
            console.warn("[reservas.js] Erro ao ordenar datas de reserva:", a.data, b.data, e);
            return 0;
        }
    });

    if (minhasReservas.length === 0) {
        container.innerHTML = '<p>Nenhuma reserva encontrada para este utilizador.</p>';
        return;
    }

    minhasReservas.forEach(reserva => {
        const nomeCampo = reserva.nomeCampo || (todosCampos.find(campo => campo.id && String(reserva.campoId) === String(campo.id))?.nome || 'Campo Desconhecido');

        let dataFormatada = reserva.data; // Formato DD/MM/YYYY
        try {
            const partesData = reserva.data.split('/');
            if (partesData.length === 3) {
                const dataObj = new Date(partesData[2], parseInt(partesData[1]) - 1, partesData[0]);
                if (!isNaN(dataObj.getTime())) {
                    dataFormatada = dataObj.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
                }
            }
        } catch(e) {
            console.warn("[reservas.js] Não foi possível re-formatar a data da reserva:", reserva.data, e);
        }

        const card = document.createElement('div');
        card.className = 'card';
        const precoTexto = (reserva.preco !== undefined && reserva.preco !== null)
            ? parseFloat(reserva.preco).toFixed(2) + '€'
            : 'N/D';
        
        const comodidadesTexto = reserva.comodidades && reserva.comodidades.length > 0 ? reserva.comodidades.join(', ') : 'Nenhuma especificada';

        card.innerHTML = `
            <h3>${nomeCampo}</h3>
            <p><strong>Data:</strong> ${dataFormatada}</p>
            <p><strong>Horário:</strong> ${reserva.horario || 'N/D'}</p> <!-- Usar reserva.horario -->
            <p><strong>Preço:</strong> ${precoTexto}</p>
            <p><strong>Comodidades Solicitadas:</strong> ${comodidadesTexto}</p>
            <div class="reserva-actions">
                <button class="detalhes-btn" data-reserva-id="${reserva.id}">Mais Detalhes</button>
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
    const reservaParaCancelar = todasReservas.find(r => r.id && String(r.id) === reservaId);

    if (!reservaParaCancelar) {
        alert(`[reservas.js] Reserva ID: ${reservaId} não encontrada para cancelamento.`);
        return;
    }

    const userIdLogado = "prototipoUser"; // ***** ALTERAÇÃO IMPORTANTE *****
    if (reservaParaCancelar.userId !== userIdLogado) {
        alert("[reservas.js] Apenas o criador da reserva pode cancelá-la.");
        return;
    }

    if (confirm(`[reservas.js] Tem a certeza que quer CANCELAR a reserva ID: ${reservaId}? Esta ação não pode ser desfeita.`)) {
        const originalLength = todasReservas.length;
        todasReservas = todasReservas.filter(reserva => !(reserva.id && String(reserva.id) === reservaId));

        if (todasReservas.length < originalLength) {
            guardarReservasNoLocalStorage(); // Função já existente em reservas.js
            alert(`[reservas.js] Reserva ID: ${reservaId} cancelada!`);
            renderizarMinhasReservas('listaMinhasReservas'); // Re-renderizar
        } else {
            alert(`[reservas.js] Erro ao tentar cancelar a reserva ID: ${reservaId}. A reserva não foi removida.`);
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