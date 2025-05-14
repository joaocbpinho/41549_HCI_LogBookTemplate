// Variáveis globais para dados
let todasReservas = [];
let todosCampos = []; // Para guardar detalhes dos campos
const modalDetalhesReserva = document.getElementById('modalDetalhesReserva'); // Referência ao novo modal
const spanCloseDetalhesReserva = modalDetalhesReserva ? modalDetalhesReserva.querySelector('.close') : null; // Referência ao botão de fechar

// Referências para o novo modal de confirmação de cancelamento
const modalConfirmarCancelar = document.getElementById('modalConfirmarCancelar');
const btnCloseConfirmarCancelarModal = document.getElementById('closeConfirmarCancelarModal');
const btnConfirmarCancelamentoDefinitivo = document.getElementById('btnConfirmarCancelamentoDefinitivo');
const btnManterReserva = document.getElementById('btnManterReserva');
const mensagemConfirmarCancelarEl = document.getElementById('mensagemConfirmarCancelar'); // Para personalizar a mensagem

let reservaIdParaCancelar = null; // Variável para guardar o ID da reserva a ser cancelada

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

    const userIdLogado = "prototipoUser";
    console.log(`[reservas.js] Filtrando reservas para userId: ${userIdLogado}`);

    const minhasReservas = todasReservas.filter(reserva => reserva.userId === userIdLogado);
    console.log(`[reservas.js] Reservas encontradas para este user:`, minhasReservas);

    minhasReservas.sort((a, b) => {
        try {
            const dataPartA = a.data.split('/');
            const horaPartA = a.horario ? a.horario.split(' - ')[0] : '00:00';
            const dataHoraA = new Date(`${dataPartA[2]}-${dataPartA[1]}-${dataPartA[0]}T${horaPartA}:00`);

            const dataPartB = b.data.split('/');
            const horaPartB = b.horario ? b.horario.split(' - ')[0] : '00:00';
            const dataHoraB = new Date(`${dataPartB[2]}-${dataPartB[1]}-${dataPartB[0]}T${horaPartB}:00`);

            if (isNaN(dataHoraA.getTime()) || isNaN(dataHoraB.getTime())) {
                console.warn("[reservas.js] Data inválida encontrada durante a ordenação:", a, b);
                return 0;
            }
            return dataHoraB - dataHoraA;
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
        console.log("[reservas.js] Renderizando reserva:", reserva); // LOG ADICIONADO
        const nomeCampo = reserva.nomeCampo || (todosCampos.find(campo => campo.id && String(reserva.campoId) === String(campo.id))?.nome || 'Campo Desconhecido');

        let dataFormatada = reserva.data;
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

        const reservaIdParaBotao = reserva.id || `reserva_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        if (!reserva.id) {
            console.warn("[reservas.js] Reserva sem ID, gerando um temporário para o botão:", reserva);
        }

        const equipasGuardadas = carregarEquipas();
        const totalMembros = Array.isArray(reserva.equipasConvidadas) && reserva.equipasConvidadas.length > 0
            ? reserva.equipasConvidadas.reduce((total, equipaNome) => {
                const equipa = equipasGuardadas.find(e => e.nome.trim().toLowerCase() === equipaNome.trim().toLowerCase());
                return total + (Array.isArray(equipa?.membros) ? equipa.membros.length : 0);
            }, 1) // Inclui o utilizador
            : 1;

        const confirmadosTexto = `${reserva.numConfirmados || 2} / ${totalMembros} membros`;

        card.innerHTML = `
            <h3>${nomeCampo}</h3>
            <p><strong>Data:</strong> ${dataFormatada}</p>
            <p><strong>Horário:</strong> ${reserva.horario || 'N/D'}</p>
            <p><strong>Preço:</strong> ${precoTexto}</p>
            <p><strong>Comodidades Solicitadas:</strong> ${comodidadesTexto}</p>
            <p><strong>Confirmados:</strong> ${confirmadosTexto}</p>
            <div class="reserva-actions">
                <button class="detalhes-btn" data-reserva-id="${reservaIdParaBotao}">Mais Detalhes</button>
                <button class="cancelar-reserva-btn" data-reserva-id="${reservaIdParaBotao}">Cancelar Reserva</button>
            </div>
        `;
        container.appendChild(card);
    });

    adicionarEventListenersAcoes();
}

// ========== FUNÇÕES DE AÇÕES ==========

// Função para fechar o modal de detalhes da reserva
function fecharModalDetalhesReserva() {
    if (modalDetalhesReserva) {
        modalDetalhesReserva.style.display = "none";
    }
}

function abrirDetalhesReserva(event) {
    console.log("[reservas.js] abrirDetalhesReserva clicado"); // LOG ADICIONADO
    const reservaId = event.target.dataset.reservaId;
    console.log("[reservas.js] ID da reserva para detalhes:", reservaId); // LOG ADICIONADO
    const reserva = todasReservas.find(r => r.id && r.id.toString() === reservaId);
    console.log("[reservas.js] Reserva encontrada para detalhes:", reserva); // LOG ADICIONADO

    if (reserva && modalDetalhesReserva) {
        // Popular o modal com os dados da reserva
        document.getElementById('detalheCampoNome').textContent = reserva.nomeCampo || (todosCampos.find(c => c.id && String(reserva.campoId) === String(c.id))?.nome || 'Campo Desconhecido');
        
        let dataFormatadaModal = reserva.data;
        try {
            const partesData = reserva.data.split('/');
            if (partesData.length === 3) {
                const dataObj = new Date(partesData[2], parseInt(partesData[1]) - 1, partesData[0]);
                if (!isNaN(dataObj.getTime())) {
                    dataFormatadaModal = dataObj.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                }
            }
        } catch(e) { /* usa data original se falhar */ }
        console.log("[reservas.js] Equipas convidadas na reserva:", reserva.equipasConvidadas);

        const equipasGuardadas = carregarEquipas();
        let equipasConvidadasTexto = 'Nenhuma';

        if (equipasGuardadas && Array.isArray(reserva.equipasConvidadas)) {
            equipasConvidadasTexto = reserva.equipasConvidadas.map(equipaNome => {
                const equipa = equipasGuardadas.find(e => e.nome.trim().toLowerCase() === equipaNome.trim().toLowerCase());
                return equipa ? equipa.nome : `${equipaNome} (não encontrada)`;
            }).join(', ');
        }

        const totalMembros = Array.isArray(reserva.equipasConvidadas) && reserva.equipasConvidadas.length > 0
            ? reserva.equipasConvidadas.reduce((total, equipaNome) => {
                const equipa = equipasGuardadas.find(e => e.nome.trim().toLowerCase() === equipaNome.trim().toLowerCase());
                return total + (Array.isArray(equipa?.membros) ? equipa.membros.length : 0);
            }, 1) // Inclui o utilizador
            : 1;

        const confirmadosTexto = `${reserva.numConfirmados || 2} / ${totalMembros} membros`;

        document.getElementById('detalheNumConfirmados').textContent = confirmadosTexto;
        document.getElementById('detalheEquipaConvidada').textContent = equipasConvidadasTexto;
        document.getElementById('detalheReservaId').textContent = reserva.id;

        modalDetalhesReserva.style.display = "block";
    } else {
        if (!reserva) alert(`Reserva ID: ${reservaId} não encontrada.`);
        if (!modalDetalhesReserva) console.error("Modal de detalhes da reserva não encontrado no DOM.");
    }
}
// Nova função para fechar o modal de confirmação de cancelamento
function fecharModalConfirmarCancelar() {
    if (modalConfirmarCancelar) {
        modalConfirmarCancelar.style.display = "none";
    }
    reservaIdParaCancelar = null; // Limpa o ID ao fechar
}

function processarCancelamentoDefinitivo() {
    if (!reservaIdParaCancelar) {
        console.error("[reservas.js] ID da reserva para cancelar não está definido ao processar.");
        fecharModalConfirmarCancelar();
        return;
    }
    console.log("[reservas.js] Confirmado o cancelamento para a reserva ID:", reservaIdParaCancelar);

    const reservaParaCancelar = todasReservas.find(r => r.id && String(r.id) === reservaIdParaCancelar);
    if (!reservaParaCancelar) {
        alert(`[reservas.js] Reserva ID: ${reservaIdParaCancelar} não encontrada para cancelamento final.`);
        fecharModalConfirmarCancelar();
        reservaIdParaCancelar = null;
        return;
    }
    
    // Re-verificar o utilizador
    const userIdLogado = "prototipoUser"; // Ajustar se tiver login real
    if (reservaParaCancelar.userId !== userIdLogado) {
        alert("[reservas.js] Apenas o criador da reserva pode cancelá-la.");
        fecharModalConfirmarCancelar();
        reservaIdParaCancelar = null;
        return;
    }
    console.log(JSON.parse(localStorage.getItem('equipas')));
    // Calcular o número de membros
    const equipasGuardadas = localStorage.getItem('equipas');
    let numeroDeMembros = 1; // Inclui o utilizador que fez a reserva

    if (equipasGuardadas && Array.isArray(reservaParaCancelar.equipasConvidadas)) {
        const todasEquipas = JSON.parse(equipasGuardadas);
        console.log("[reservas.js] Todas as equipas carregadas do localStorage:", todasEquipas);

        numeroDeMembros += reservaParaCancelar.equipasConvidadas.reduce((total, equipaNome) => {
            const equipa = todasEquipas.find(e => e.nome.trim().toLowerCase() === equipaNome.trim().toLowerCase());
            if (!equipa) {
                console.warn(`[reservas.js] Equipa não encontrada: ${equipaNome}`);
            }
            return total + (Array.isArray(equipa?.membros) ? equipa.membros.length : 0);
        }, 0);
    }
    console.log("Número total de membros (incluindo o utilizador):", numeroDeMembros);

    // Calcular a parte paga pelo utilizador
    const partePagaPeloUtilizador = parseFloat(reservaParaCancelar.preco) / numeroDeMembros;

    // Atualizar o saldo do utilizador
    let saldoAtualNumerico = parseFloat(localStorage.getItem('saldoUsuario')) || 0.00;
    saldoAtualNumerico += partePagaPeloUtilizador; // Devolve apenas a parte paga pelo utilizador
    localStorage.setItem('saldoUsuario', saldoAtualNumerico.toFixed(2));

    // Atualizar o saldo no DOM
    const saldoAtualEl = document.getElementById("saldoAtual");
    if (saldoAtualEl) {
        saldoAtualEl.textContent = `${saldoAtualNumerico.toFixed(2)}€`;
    }

    // Remover a reserva do array
    const originalLength = todasReservas.length;
    todasReservas = todasReservas.filter(reserva => !(reserva.id && String(reserva.id) === reservaIdParaCancelar));

    if (todasReservas.length < originalLength) {
        guardarReservasNoLocalStorage();
        exibirMensagem("sucesso", `Reserva ID: ${reservaIdParaCancelar} cancelada com sucesso! ${partePagaPeloUtilizador.toFixed(2)}€ devolvidos ao saldo.`);
        renderizarMinhasReservas('listaMinhasReservas');
    } else {
        alert(`[reservas.js] Erro ao tentar cancelar a reserva ID: ${reservaIdParaCancelar}. A reserva não foi removida ou já não existia.`);
    }

    fecharModalConfirmarCancelar(); // Fecha o modal após a ação
    reservaIdParaCancelar = null;   // Limpa o ID
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
    console.log("[reservas.js] Botão 'Cancelar Reserva' clicado, abrindo modal de confirmação.");
    const idDaReserva = event.target.dataset.reservaId;
    console.log("[reservas.js] ID da reserva para possível cancelamento:", idDaReserva);

    const reservaParaCancelar = todasReservas.find(r => r.id && String(r.id) === idDaReserva);

    if (!reservaParaCancelar) {
        alert(`[reservas.js] Reserva ID: ${idDaReserva} não encontrada.`);
        return;
    }

    const userIdLogado = "prototipoUser"; // Ajustar se tiver login real
    if (reservaParaCancelar.userId !== userIdLogado) {
        alert("[reservas.js] Apenas o criador da reserva pode cancelá-la.");
        return;
    }
    
    reservaIdParaCancelar = idDaReserva; // Guarda o ID para uso na confirmação

    // Personaliza a mensagem no modal
    if (mensagemConfirmarCancelarEl) {
        const nomeCampo = reservaParaCancelar.nomeCampo || (todosCampos.find(c => c.id && String(reservaParaCancelar.campoId) === String(c.id))?.nome || 'Campo Desconhecido');
        mensagemConfirmarCancelarEl.innerHTML = `Tem a certeza que quer cancelar a reserva para <strong>${nomeCampo}</strong> (Data: ${reservaParaCancelar.data}, Horário: ${reservaParaCancelar.horario || 'N/D'})?<br>Esta ação não pode ser desfeita.`;
    }

    if (modalConfirmarCancelar) {
        modalConfirmarCancelar.style.display = "block";
    } else {
        console.error("[reservas.js] Modal de confirmação de cancelamento não encontrado. Usando confirm() como fallback.");
        // Fallback para o confirm antigo se o modal não existir
        if (confirm(`Tem a certeza que quer CANCELAR a reserva para ${reservaParaCancelar.nomeCampo || 'este campo'}? Esta ação não pode ser desfeita.`)) {
            reservaIdParaCancelar = idDaReserva; // Garante que está definido
            processarCancelamentoDefinitivo(); // Chama a função de processamento
        } else {
            reservaIdParaCancelar = null; // Limpa se o utilizador cancelar no confirm
        }
    }
}
// ========== INICIALIZAÇÃO E EVENT LISTENERS ==========

function adicionarEventListenersAcoes() {
    console.log("[reservas.js] Adicionando event listeners para ações..."); // LOG ADICIONADO
    const detalhesBtns = document.querySelectorAll(".detalhes-btn");
    const cancelarPresencaBtns = document.querySelectorAll(".cancelar-presenca-btn");
    const cancelarReservaBtns = document.querySelectorAll(".cancelar-reserva-btn");

    console.log(`[reservas.js] Botões 'Mais Detalhes' encontrados: ${detalhesBtns.length}`); // LOG ADICIONADO
    console.log(`[reservas.js] Botões 'Cancelar Reserva' encontrados: ${cancelarReservaBtns.length}`); // LOG ADICIONADO

    detalhesBtns.forEach(btn => btn.addEventListener("click", abrirDetalhesReserva));
    cancelarPresencaBtns.forEach(btn => btn.addEventListener("click", cancelarPresencas));
    cancelarReservaBtns.forEach(btn => btn.addEventListener("click", cancelarReserva));
}

async function inicializarPaginaReservas() {
    try {
        await carregarCampos();
        await carregarReservas();
        renderizarMinhasReservas('listaMinhasReservas');

        // Adicionar event listener para fechar o modal de detalhes se ele existir
        if (spanCloseDetalhesReserva) {
            spanCloseDetalhesReserva.onclick = fecharModalDetalhesReserva;
        }
        
        // Event listeners para o modal de confirmação de cancelamento
        if (btnCloseConfirmarCancelarModal) {
            btnCloseConfirmarCancelarModal.onclick = fecharModalConfirmarCancelar;
        }
        if (btnConfirmarCancelamentoDefinitivo) {
            btnConfirmarCancelamentoDefinitivo.onclick = processarCancelamentoDefinitivo;
        }
        if (btnManterReserva) {
            btnManterReserva.onclick = fecharModalConfirmarCancelar;
        }

        // Fechar modais se clicar fora do conteúdo
        window.addEventListener('click', function(event) {
            if (event.target === modalDetalhesReserva) {
                fecharModalDetalhesReserva();
            }
            if (event.target === modalConfirmarCancelar) {
                fecharModalConfirmarCancelar();
            }
        });

    } catch (error) {
        console.error("Erro ao inicializar a página de reservas:", error);
        const container = document.getElementById('listaMinhasReservas');
        if (container) {
            container.innerHTML = '<p>Ocorreu um erro ao carregar os dados das reservas. Verifique a consola para mais detalhes.</p>';
        }
    }
}
function exibirMensagem(tipo, mensagem) {
    const mensagemDiv = document.createElement("div");
    mensagemDiv.className = `mensagem-${tipo}`; // "mensagem-sucesso" ou "mensagem-erro"
    mensagemDiv.textContent = mensagem;
  
    document.body.appendChild(mensagemDiv);
  
    // Remover a mensagem após 3 segundos
    setTimeout(() => {
        mensagemDiv.remove();
    }, 3000);
  }

function carregarEquipas() {
    try {
        const equipasGuardadas = localStorage.getItem('equipas');
        if (equipasGuardadas) {
            return JSON.parse(equipasGuardadas);
        } else {
            console.warn("[reservas.js] Nenhuma equipa encontrada no localStorage.");
            return [];
        }
    } catch (error) {
        console.error("[reservas.js] Erro ao carregar equipas do localStorage:", error);
        return [];
    }
}
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM carregado para reservas.js");
    inicializarPaginaReservas();
});