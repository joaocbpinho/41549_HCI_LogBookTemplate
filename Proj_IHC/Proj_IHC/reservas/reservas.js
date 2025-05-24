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
const mensagemConfirmarCancelarEl = document.getElementById('mensagemConfirmarCancelar'); 

// NOVO: Referências para o modal de confirmação de aceitar convite
const modalConfirmarAceitarConvite = document.getElementById('modalConfirmarAceitarConvite');
const btnCloseConfirmarAceitarConviteModal = document.getElementById('closeConfirmarAceitarConviteModal');
const btnConfirmarAceitacaoConviteDefinitivo = document.getElementById('btnConfirmarAceitacaoConviteDefinitivo');
const btnCancelarAceitacaoConvite = document.getElementById('btnCancelarAceitacaoConvite');
let convitePendenteParaAceitar = null; 

// NOVO: Referência para a mensagem de sem convites
const mensagemSemConvitesEl = document.getElementById('mensagemSemConvites');
const listaConvitesContainer = document.querySelector('#convites-pendentes-section .lista-convites.cards');


let reservaIdParaCancelar = null; // Variável para guardar o ID da reserva a ser cancelada // DESCOMENTAR ESTA LINHA

// NOVO: Funções para exibir mensagens de feedback
function exibirFeedback(mensagem, tipo) { // tipo pode ser 'success', 'danger', 'info'
    const feedbackEl = document.getElementById('feedbackMessage');
    if (feedbackEl) {
        feedbackEl.textContent = mensagem;
        feedbackEl.className = `alert alert-${tipo}`; // Usa classes Bootstrap-like para estilo
        feedbackEl.style.display = 'block';
        setTimeout(() => {
            feedbackEl.style.display = 'none';
        }, 4000);
    } else {
        // Fallback se o elemento não existir
        alert(`${tipo.toUpperCase()}: ${mensagem}`);
    }
}

// Funções de utilidade para gestão de saldo e utilizador (MODIFICADAS)
function getSaldoUtilizador() {
    const saldoString = localStorage.getItem('saldoUsuario'); // Ler diretamente de 'saldoUsuario'
    // console.log("[getSaldoUtilizador] saldoUsuario (string from localStorage):", saldoString);
    if (saldoString === null) {
        console.warn("[getSaldoUtilizador] 'saldoUsuario' não encontrado no localStorage. Retornando 0.");
        return 0;
    }
    const saldoNumerico = parseFloat(saldoString);
    if (isNaN(saldoNumerico)) {
        console.warn("[getSaldoUtilizador] 'saldoUsuario' não é um número válido. Valor:", saldoString, ". Retornando 0.");
        return 0;
    }
    // console.log("[getSaldoUtilizador] Saldo retornado (de saldoUsuario):", saldoNumerico);
    return saldoNumerico;
}

function atualizarSaldoUtilizador(novoSaldo) {
    if (typeof novoSaldo !== 'number' || isNaN(novoSaldo)) {
        console.error("[atualizarSaldoUtilizador] Tentativa de atualizar saldo com valor não numérico:", novoSaldo);
        return;
    }
    localStorage.setItem('saldoUsuario', novoSaldo.toFixed(2)); // Guardar como string, consistente com index/script.js
    // console.log("[atualizarSaldoUtilizador] Saldo atualizado em 'saldoUsuario' para:", novoSaldo.toFixed(2));
    
    // Tenta chamar a função global para atualizar a navbar, se existir
    if (typeof window.atualizarSaldoNavbar === 'function') {
        window.atualizarSaldoNavbar();
    } else if (document.getElementById("saldoAtual")) { // Fallback para atualizar diretamente se a função global não for encontrada
        document.getElementById("saldoAtual").textContent = `${novoSaldo.toFixed(2)}€`;
    }
}

// Funções de utilidade para gestão de reservas (consistente com campo.js)
function getTodasReservas() {
    return JSON.parse(localStorage.getItem('todasReservas')) || [];
}

function guardarTodasReservas(reservas) {
    localStorage.setItem('todasReservas', JSON.stringify(reservas));
}


function abrirModalConfirmarAceitarConvite(detalhesConvite) {
    console.log("[reservas.js] abrirModalConfirmarAceitarConvite chamada com:", detalhesConvite); // DEBUG
    convitePendenteParaAceitar = detalhesConvite; 
    precoBaseConviteAtual = parseFloat(detalhesConvite.preco);

    // ... (população dos elementos do modal) ...
    document.getElementById('confirmacaoConviteCampoNome').textContent = detalhesConvite.campoNome;
    document.getElementById('confirmacaoConviteData').textContent = detalhesConvite.dataISO;
    document.getElementById('confirmacaoConviteHora').textContent = detalhesConvite.hora;
    document.getElementById('confirmacaoConviteOriginador').textContent = detalhesConvite.originador || 'Equipa Desconhecida';
    document.getElementById('confirmacaoConvitePrecoBase').textContent = `${precoBaseConviteAtual.toFixed(2)}€`;

    console.log("[reservas.js] Verificando todosCampos antes de carregar equipamentos:", todosCampos); // DEBUG
    if (todosCampos && todosCampos.length > 0) {
        carregarEquipamentosParaModalConvite(detalhesConvite.campoId);
    } else {
        console.warn("[reservas.js] 'todosCampos' está vazio ou não definido ao tentar carregar equipamentos para convite."); // DEBUG
        document.getElementById('listaEquipamentosConvite').innerHTML = '<li>Erro ao carregar equipamentos (dados de campos indisponíveis).</li>';
        atualizarPrecoTotalConviteModal(); // Para garantir que o preço final reflete a ausência de equipamentos
    }
    
    if (modalConfirmarAceitarConvite) {
        console.log("[reservas.js] Exibindo modalConfirmarAceitarConvite."); // DEBUG
        modalConfirmarAceitarConvite.style.display = 'block';
    } else {
        console.error("[reservas.js] modalConfirmarAceitarConvite é null!"); // DEBUG
    }
}

function fecharModalConfirmarAceitarConvite() {
    if (modalConfirmarAceitarConvite) {
        modalConfirmarAceitarConvite.style.display = 'none';
    }
    convitePendenteParaAceitar = null; // Limpa os detalhes pendentes
}

// NOVO: Função para verificar e mostrar/esconder mensagem de sem convites
function atualizarVisibilidadeMensagemConvites() {
    if (listaConvitesContainer && mensagemSemConvitesEl) {
        const numeroDeConvites = listaConvitesContainer.querySelectorAll('.card').length;
        if (numeroDeConvites === 0) {
            mensagemSemConvitesEl.style.display = 'block';
        } else {
            mensagemSemConvitesEl.style.display = 'none';
        }
    }
}


async function processarAceitacaoConviteDefinitiva() {
    if (!convitePendenteParaAceitar) {
        console.error("Nenhum convite pendente para aceitar.");
        fecharModalConfirmarAceitarConvite();
        return;
    }

    const { conviteId, campoId, campoNome, dataISO, hora, originador } = convitePendenteParaAceitar;
    
    let custoEquipamentosSelecionados = 0;
    const equipamentosSelecionadosParaReserva = [];
    const listaEquipamentosEl = document.getElementById('listaEquipamentosConvite');
    if (listaEquipamentosEl) {
        listaEquipamentosEl.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            const precoEquip = parseFloat(checkbox.dataset.preco);
            custoEquipamentosSelecionados += precoEquip;
            equipamentosSelecionadosParaReserva.push({
                nome: checkbox.dataset.nome,
                preco: precoEquip
            });
        });
    }

    const precoFinalAPagar = precoBaseConviteAtual + custoEquipamentosSelecionados;

    const [year, month, day] = dataISO.split('-');
    const dataFormatadaParaStorage = `${day}/${month}/${year}`;
    const userIdLogado = "prototipoUser"; // Para protótipo
    let saldoAtual = getSaldoUtilizador();

    if (isNaN(precoFinalAPagar) || precoFinalAPagar < 0) {
        exibirFeedback("Preço final inválido para o convite.", "danger");
        fecharModalConfirmarAceitarConvite();
        return;
    }

    if (saldoAtual < precoFinalAPagar) {
        exibirFeedback("Saldo insuficiente para aceitar este convite e reservar os equipamentos.", "danger");
        if (typeof window.abrirModalSaldo === 'function') {
            window.abrirModalSaldo();
        }
        fecharModalConfirmarAceitarConvite();
        return; 
    }

    const novoSaldo = saldoAtual - precoFinalAPagar;
    atualizarSaldoUtilizador(novoSaldo);

    const novaReserva = {
        id: `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: userIdLogado,
        campoId: campoId,
        nomeCampo: campoNome,
        data: dataFormatadaParaStorage,
        horario: hora,
        preco: precoFinalAPagar, // Preço total pago
        // Opcional: pode querer guardar o preço base do convite e o custo dos equipamentos separadamente
        // precoBaseOriginal: precoBaseConviteAtual, 
        // custoEquipamentos: custoEquipamentosSelecionados,
        comodidadesSelecionadas: [], // Manter para consistência, pode ser usado no futuro
        equipamentosSelecionados: equipamentosSelecionadosParaReserva, // Guardar os equipamentos selecionados
        estado: "Confirmada",
        origem: "convite_aceite"
    };
    
    todasReservas.push(novaReserva); 
    guardarReservasNoLocalStorage(); 

    exibirFeedback(`Convite aceite! Reserva para ${campoNome} em ${dataFormatadaParaStorage} às ${hora} confirmada (Equipamentos: ${equipamentosSelecionadosParaReserva.map(e => e.nome).join(', ') || 'Nenhum'}). Preço: ${precoFinalAPagar.toFixed(2)}€`, "success");
    
    const conviteCardElement = document.getElementById(`convite-${conviteId}`);
    if (conviteCardElement) {
        conviteCardElement.remove();
    }
    
    renderizarMinhasReservas('listaMinhasReservas');
    fecharModalConfirmarAceitarConvite();
    atualizarVisibilidadeMensagemConvites();
}


function configurarBotoesConvite() {
    console.log("[reservas.js] Iniciando configurarBotoesConvite..."); // DEBUG
    document.querySelectorAll('.btn-aceitar-convite').forEach(button => {
        console.log("[reservas.js] Configurando botão 'Aceitar e Reservar':", button); // DEBUG
        button.addEventListener('click', async (event) => {
            console.log("[reservas.js] Botão 'Aceitar e Reservar' CLICADO."); // DEBUG
            const conviteId = event.target.dataset.conviteId;
            const campoId = event.target.dataset.campoId;
            const campoNome = event.target.dataset.campoNome;
            const dataISO = event.target.dataset.data;
            const hora = event.target.dataset.hora;
            const preco = parseFloat(event.target.dataset.preco);
            const originador = event.target.dataset.originador || button.closest('.card')?.querySelector('p:nth-of-type(4)')?.textContent.replace('Convidado por: ','').trim();

            const detalhesConvite = { conviteId, campoId, campoNome, dataISO, hora, preco, originador };
            console.log("[reservas.js] Detalhes do convite para abrir modal:", detalhesConvite); // DEBUG
            abrirModalConfirmarAceitarConvite(detalhesConvite);
        });
    });

    document.querySelectorAll('.btn-recusar-convite').forEach(button => {
        button.addEventListener('click', (event) => {
            const conviteId = event.target.dataset.conviteId;
            const conviteCardElement = document.getElementById(`convite-${conviteId}`); // ID do card é "convite-estatico-1"
            if (conviteCardElement) {
                conviteCardElement.remove();
            }
            exibirFeedback("Convite recusado.", "info");
            atualizarVisibilidadeMensagemConvites(); // CHAMAR AQUI
        });
    });
    atualizarVisibilidadeMensagemConvites(); // CHAMAR AQUI para o estado inicial
}

// ========== FUNÇÕES DE CARREGAMENTO DE DADOS ==========

// Função para carregar os campos do JSON (necessário para nomes)
async function carregarCampos() {
    console.log("[reservas.js] Iniciando carregarCampos..."); // DEBUG
    // Evita recarregar se já tiverem sido carregados
    if (todosCampos.length > 0) {
        console.log("[reservas.js] Campos já carregados."); // DEBUG
        return Promise.resolve();
    }
    try {
        const response = await fetch('../campo/campos.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        todosCampos = await response.json();
        console.log("[reservas.js] Campos carregados com sucesso:", todosCampos); // DEBUG
    } catch (error) {
        console.error("[reservas.js] Erro ao carregar campos.json:", error); // DEBUG
        // Considerar como lidar com este erro - talvez exibir uma mensagem ao utilizador
        return Promise.reject(error);
    }
}

// Função para carregar as reservas do localStorage
async function carregarReservas() {
    console.log("[reservas.js] Iniciando carregarReservas..."); // DEBUG
    try {
        const reservasGuardadas = localStorage.getItem('todasReservas');
        if (reservasGuardadas) {
            todasReservas = JSON.parse(reservasGuardadas);
            console.log("[reservas.js] Reservas carregadas do localStorage:", todasReservas); // DEBUG
        } else {
            todasReservas = [];
            console.log("[reservas.js] Nenhuma reserva no localStorage."); // DEBUG
        }
    } catch (error) {
        console.error("[reservas.js] Erro ao carregar/processar reservas do localStorage:", error); // DEBUG
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
    console.log(`[reservas.js] Iniciando renderizarMinhasReservas para container: ${containerId}`); // DEBUG
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`[reservas.js] Container com ID '${containerId}' não encontrado.`); // DEBUG
        return;
    }
    console.log("[reservas.js] Limpando container de reservas..."); // DEBUG
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

        // Definir as variáveis que estavam em falta:
        const precoTexto = reserva.preco ? `${parseFloat(reserva.preco).toFixed(2)}€` : 'N/D';
        
        let comodidadesArray = [];
        if (reserva.equipamentosSelecionados && reserva.equipamentosSelecionados.length > 0) {
            comodidadesArray = reserva.equipamentosSelecionados.map(e => e.nome || e);
        } else if (reserva.comodidadesSelecionadas && reserva.comodidadesSelecionadas.length > 0) {
            comodidadesArray = reserva.comodidadesSelecionadas.map(c => c.nome || c);
        }
        const comodidadesTexto = comodidadesArray.length > 0 ? comodidadesArray.join(', ') : 'Nenhuma';

        let confirmadosTexto = reserva.estado || 'N/D'; // Usar o estado da reserva como fallback
        if (typeof reserva.numConfirmados !== 'undefined') {
            // Se tivermos numeroTotalMembrosConsiderados, podemos fazer um X / Y
            if (typeof reserva.numeroTotalMembrosConsiderados !== 'undefined') {
                 confirmadosTexto = `${reserva.numConfirmados || 0} / ${reserva.numeroTotalMembrosConsiderados || 1} membros`;
            } else {
                confirmadosTexto = `Confirmados: ${reserva.numConfirmados}`;
            }
        } else if (reserva.estado === "Confirmada" && typeof reserva.numConfirmados === 'undefined') {
            // Se está confirmada mas não temos numConfirmados, podemos apenas dizer "Confirmada"
            confirmadosTexto = "Confirmada";
        }


        const reservaIdParaBotao = reserva.id;

        const card = document.createElement('div');
        card.className = 'card'; 

        card.innerHTML = `
            <div class="card-content">
                <h3>${nomeCampo}</h3>
                <p><strong>Data:</strong> ${dataFormatada}</p>
                <p><strong>Horário:</strong> ${reserva.horario || 'N/D'}</p>
                <p><strong>Preço:</strong> ${precoTexto}</p>
                <p><strong>Comodidades Solicitadas:</strong> ${comodidadesTexto}</p>
                <p><strong>Confirmados:</strong> ${confirmadosTexto}</p>
            </div>
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
    let saldoAtualUtilizador = getSaldoUtilizador();
    atualizarSaldoUtilizador(saldoAtualUtilizador + partePagaPeloUtilizador);

    // Remover a reserva do array
    const originalLength = todasReservas.length;
    todasReservas = todasReservas.filter(reserva => !(reserva.id && String(reserva.id) === reservaIdParaCancelar));

    if (todasReservas.length < originalLength) {
        guardarReservasNoLocalStorage();
        // exibirMensagem("sucesso", `Reserva ID: ${reservaIdParaCancelar} cancelada com sucesso! ${partePagaPeloUtilizador.toFixed(2)}€ devolvidos ao saldo.`); // LINHA ANTIGA
        exibirFeedback(`Reserva ID: ${reservaIdParaCancelar} cancelada com sucesso! ${partePagaPeloUtilizador.toFixed(2)}€ devolvidos ao saldo.`, "success"); // LINHA NOVA
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

    const userIdLogado = "prototipoUser"; // LINHA NOVA
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
    console.log("[reservas.js] Iniciando inicializarPaginaReservas..."); // DEBUG
    try {
        await carregarCampos(); 
        console.log("[reservas.js] carregarCampos concluído em inicializarPaginaReservas."); // DEBUG
        await carregarReservas(); 
        console.log("[reservas.js] carregarReservas concluído em inicializarPaginaReservas."); // DEBUG
        
        renderizarMinhasReservas('listaMinhasReservas'); 
        console.log("[reservas.js] renderizarMinhasReservas chamada a partir de inicializarPaginaReservas."); // DEBUG
        
        configurarBotoesConvite(); 
        console.log("[reservas.js] configurarBotoesConvite chamada a partir de inicializarPaginaReservas."); // DEBUG

        if (spanCloseDetalhesReserva) {
            spanCloseDetalhesReserva.onclick = fecharModalDetalhesReserva;
        }
        
        if (btnCloseConfirmarCancelarModal) {
            btnCloseConfirmarCancelarModal.onclick = fecharModalConfirmarCancelar;
        }
        if (btnConfirmarCancelamentoDefinitivo) {
            btnConfirmarCancelamentoDefinitivo.onclick = processarCancelamentoDefinitivo;
        }
        if (btnManterReserva) {
            btnManterReserva.onclick = fecharModalConfirmarCancelar;
        }

        // NOVO: Event listeners para o modal de confirmação de aceitar convite
        if (btnCloseConfirmarAceitarConviteModal) {
            btnCloseConfirmarAceitarConviteModal.onclick = fecharModalConfirmarAceitarConvite;
        }
        if (btnConfirmarAceitacaoConviteDefinitivo) {
            btnConfirmarAceitacaoConviteDefinitivo.onclick = processarAceitacaoConviteDefinitiva;
        }
        if (btnCancelarAceitacaoConvite) {
            btnCancelarAceitacaoConvite.onclick = fecharModalConfirmarAceitarConvite;
        }

        window.addEventListener('click', function(event) {
            if (event.target === modalDetalhesReserva) {
                fecharModalDetalhesReserva();
            }
            if (event.target === modalConfirmarCancelar) {
                fecharModalConfirmarCancelar();
            }
            // NOVO: Fechar modal de aceitar convite se clicar fora
            if (event.target === modalConfirmarAceitarConvite) {
                fecharModalConfirmarAceitarConvite();
            }
        });

    } catch (error) {
        console.error("[reservas.js] Erro CRÍTICO ao inicializar a página de reservas:", error); // DEBUG
        const containerReservas = document.getElementById('listaMinhasReservas');
        if (containerReservas) {
            containerReservas.innerHTML = '<p>Ocorreu um erro grave ao carregar os dados. Tente recarregar a página.</p>';
        }
        const containerConvites = document.querySelector('#convites-pendentes-section .lista-convites.cards');
        if (containerConvites) {
            // Poderia adicionar uma mensagem de erro aqui também se a configuração dos convites depender de dados que falharam
        }
    }
}

// Certifique-se que inicializarPaginaReservas é chamada quando o DOM está pronto
document.addEventListener('DOMContentLoaded', inicializarPaginaReservas);

/* REMOVER ESTA FUNÇÃO SE NÃO FOR MAIS NECESSÁRIA APÓS PADRONIZAR PARA exibirFeedback
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
*/

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

// SIMULAÇÃO: Estrutura de dados para equipamentos disponíveis por desporto
// Idealmente, isto viria de campos.json ou de um ficheiro de configuração dedicado
const equipamentosDisponiveisPorDesporto = {
    "Futebol": [
        { nome: "Bola de Futebol", icone: "fas fa-futbol", preco: 2.00 },
        { nome: "Coletes (5 unidades)", icone: "fas fa-shirt", preco: 3.00 }
    ],
    "Futsal": [
        { nome: "Bola de Futsal", icone: "fas fa-futbol", preco: 2.00 },
        { nome: "Coletes (5 unidades)", icone: "fas fa-shirt", preco: 3.00 }
    ],
    "Padel": [
        { nome: "Raquete de Padel", icone: "fas fa-racquet", preco: 2.50 }, // Use um ícone apropriado
        { nome: "Bolas de Padel (tubo)", icone: "fas fa-baseball-ball", preco: 1.50 } // Use um ícone apropriado
    ],
    "Ténis": [
        { nome: "Raquete de Ténis", icone: "fas fa-racquet", preco: 2.50 },
        { nome: "Bolas de Ténis (tubo)", icone: "fas fa-baseball-ball", preco: 1.50 }
    ],
    "Basquetebol": [
        { nome: "Bola de Basquetebol", icone: "fas fa-basketball-ball", preco: 2.00 }
    ],
    // Adicione outros desportos e equipamentos conforme necessário
};

let precoBaseConviteAtual = 0; // Para guardar o preço base do convite ao abrir o modal

// Função para carregar e exibir equipamentos no modal de convite
function carregarEquipamentosParaModalConvite(campoId) {
    console.log(`[reservas.js] Iniciando carregarEquipamentosParaModalConvite para campoId: ${campoId}`); // DEBUG
    const listaEquipamentosEl = document.getElementById('listaEquipamentosConvite');
    if (!listaEquipamentosEl) {
        console.error("Elemento #listaEquipamentosConvite não encontrado.");
        return;
    }
    listaEquipamentosEl.innerHTML = ''; // Limpa lista anterior

    const campo = todosCampos.find(c => c.id.toString() === campoId.toString());
    if (!campo || !Array.isArray(campo.desporto) || campo.desporto.length === 0) {
        listaEquipamentosEl.innerHTML = '<li>Informação de desporto indisponível para este campo.</li>';
        atualizarPrecoTotalConviteModal();
        return;
    }

    // Considera o primeiro desporto listado para o campo para buscar equipamentos
    const desportoPrincipal = campo.desporto[0]; 
    const equipamentosParaDesporto = equipamentosDisponiveisPorDesporto[desportoPrincipal] || [];

    if (equipamentosParaDesporto.length === 0) {
        listaEquipamentosEl.innerHTML = '<li>Nenhum equipamento adicional disponível para este desporto.</li>';
    } else {
        equipamentosParaDesporto.forEach(equip => {
            const li = document.createElement('li');
            const checkboxId = `equip-convite-${equip.nome.replace(/\s+/g, '-').toLowerCase()}`;
            li.innerHTML = `
                <label for="${checkboxId}">
                    <input type="checkbox" id="${checkboxId}" data-nome="${equip.nome}" data-preco="${equip.preco}">
                    <i class="${equip.icone || 'fas fa-tools'}"></i> ${equip.nome} (+${parseFloat(equip.preco).toFixed(2)}€)
                </label>
            `;
            li.querySelector('input[type="checkbox"]').addEventListener('change', atualizarPrecoTotalConviteModal);
            listaEquipamentosEl.appendChild(li);
        });
    }
    atualizarPrecoTotalConviteModal(); // Calcula e mostra o preço inicial
}

// Função para atualizar o cálculo do preço total no modal de convite
function atualizarPrecoTotalConviteModal() {
    const listaEquipamentosEl = document.getElementById('listaEquipamentosConvite');
    const custoTotalEquipamentosEl = document.getElementById('custoTotalEquipamentosConvite');
    const precoFinalEl = document.getElementById('confirmacaoConvitePrecoFinal');

    if (!listaEquipamentosEl || !custoTotalEquipamentosEl || !precoFinalEl) return;

    let custoEquipamentos = 0;
    listaEquipamentosEl.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        custoEquipamentos += parseFloat(checkbox.dataset.preco);
    });

    custoTotalEquipamentosEl.textContent = custoEquipamentos.toFixed(2);
    const precoFinalTotal = precoBaseConviteAtual + custoEquipamentos;
    precoFinalEl.textContent = `${precoFinalTotal.toFixed(2)}€`;
}

// Modificar abrirModalConfirmarAceitarConvite
function abrirModalConfirmarAceitarConvite(detalhesConvite) {
    console.log("[reservas.js] abrirModalConfirmarAceitarConvite chamada com:", detalhesConvite); // DEBUG
    convitePendenteParaAceitar = detalhesConvite; 
    precoBaseConviteAtual = parseFloat(detalhesConvite.preco);

    // ... (população dos elementos do modal) ...
    document.getElementById('confirmacaoConviteCampoNome').textContent = detalhesConvite.campoNome;
    document.getElementById('confirmacaoConviteData').textContent = detalhesConvite.dataISO;
    document.getElementById('confirmacaoConviteHora').textContent = detalhesConvite.hora;
    document.getElementById('confirmacaoConviteOriginador').textContent = detalhesConvite.originador || 'Equipa Desconhecida';
    document.getElementById('confirmacaoConvitePrecoBase').textContent = `${precoBaseConviteAtual.toFixed(2)}€`;

    console.log("[reservas.js] Verificando todosCampos antes de carregar equipamentos:", todosCampos); // DEBUG
    if (todosCampos && todosCampos.length > 0) {
        carregarEquipamentosParaModalConvite(detalhesConvite.campoId);
    } else {
        console.warn("[reservas.js] 'todosCampos' está vazio ou não definido ao tentar carregar equipamentos para convite."); // DEBUG
        document.getElementById('listaEquipamentosConvite').innerHTML = '<li>Erro ao carregar equipamentos (dados de campos indisponíveis).</li>';
        atualizarPrecoTotalConviteModal(); // Para garantir que o preço final reflete a ausência de equipamentos
    }
    
    if (modalConfirmarAceitarConvite) {
        console.log("[reservas.js] Exibindo modalConfirmarAceitarConvite."); // DEBUG
        modalConfirmarAceitarConvite.style.display = 'block';
    } else {
        console.error("[reservas.js] modalConfirmarAceitarConvite é null!"); // DEBUG
    }
}

// Modificar processarAceitacaoConviteDefinitiva
async function processarAceitacaoConviteDefinitiva() {
    if (!convitePendenteParaAceitar) {
        console.error("Nenhum convite pendente para aceitar.");
        fecharModalConfirmarAceitarConvite();
        return;
    }

    const { conviteId, campoId, campoNome, dataISO, hora, originador } = convitePendenteParaAceitar;
    
    let custoEquipamentosSelecionados = 0;
    const equipamentosSelecionadosParaReserva = [];
    const listaEquipamentosEl = document.getElementById('listaEquipamentosConvite');
    if (listaEquipamentosEl) {
        listaEquipamentosEl.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            const precoEquip = parseFloat(checkbox.dataset.preco);
            custoEquipamentosSelecionados += precoEquip;
            equipamentosSelecionadosParaReserva.push({
                nome: checkbox.dataset.nome,
                preco: precoEquip
            });
        });
    }

    const precoFinalAPagar = precoBaseConviteAtual + custoEquipamentosSelecionados;

    const [year, month, day] = dataISO.split('-');
    const dataFormatadaParaStorage = `${day}/${month}/${year}`;
    const userIdLogado = "prototipoUser"; // Para protótipo
    let saldoAtual = getSaldoUtilizador();

    if (isNaN(precoFinalAPagar) || precoFinalAPagar < 0) {
        exibirFeedback("Preço final inválido para o convite.", "danger");
        fecharModalConfirmarAceitarConvite();
        return;
    }

    if (saldoAtual < precoFinalAPagar) {
        exibirFeedback("Saldo insuficiente para aceitar este convite e reservar os equipamentos.", "danger");
        if (typeof window.abrirModalSaldo === 'function') {
            window.abrirModalSaldo();
        }
        fecharModalConfirmarAceitarConvite();
        return; 
    }

    const novoSaldo = saldoAtual - precoFinalAPagar;
    atualizarSaldoUtilizador(novoSaldo);

    const novaReserva = {
        id: `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: userIdLogado,
        campoId: campoId,
        nomeCampo: campoNome,
        data: dataFormatadaParaStorage,
        horario: hora,
        preco: precoFinalAPagar, // Preço total pago
        // Opcional: pode querer guardar o preço base do convite e o custo dos equipamentos separadamente
        // precoBaseOriginal: precoBaseConviteAtual, 
        // custoEquipamentos: custoEquipamentosSelecionados,
        comodidadesSelecionadas: [], // Manter para consistência, pode ser usado no futuro
        equipamentosSelecionados: equipamentosSelecionadosParaReserva, // Guardar os equipamentos selecionados
        estado: "Confirmada",
        origem: "convite_aceite"
    };
    
    todasReservas.push(novaReserva); 
    guardarReservasNoLocalStorage(); 

    exibirFeedback(`Convite aceite! Reserva para ${campoNome} em ${dataFormatadaParaStorage} às ${hora} confirmada (Equipamentos: ${equipamentosSelecionadosParaReserva.map(e => e.nome).join(', ') || 'Nenhum'}). Preço: ${precoFinalAPagar.toFixed(2)}€`, "success");
    
    const conviteCardElement = document.getElementById(`convite-${conviteId}`);
    if (conviteCardElement) {
        conviteCardElement.remove();
    }
    
    renderizarMinhasReservas('listaMinhasReservas');
    fecharModalConfirmarAceitarConvite();
    atualizarVisibilidadeMensagemConvites();
}

// ... (restante do seu código, incluindo inicializarPaginaReservas onde carregarCampos é chamada)