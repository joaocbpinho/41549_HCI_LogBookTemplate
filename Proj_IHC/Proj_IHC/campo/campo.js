
let todasReservas = [];
let todosCampos = []; // Irá guardar os dados de campos.json

// Variáveis para guardar seleções do modal de reserva
let selectedDate = null; // Deve ser um objeto Date
let selectedTime = null; // Deve ser uma string como "HH:MM - HH:MM"
let selectedAmenities = []; // Deve ser um array de strings com os nomes das comodidades

// Variáveis globais para o carrossel dinâmico
let campoAtualImagens = [];
let currentImageIndex = 0;
const campoImageElement = document.getElementById("campoImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
let equipasSelecionadas = []; // Armazena as equipas selecionadas

function carregarEquipasParaCampo(desportosCampo) {
    console.log("🔄 Função carregarEquipasParaCampo chamada com desportos:", desportosCampo);

    const equipasGuardadas = localStorage.getItem('equipas');
    const convidarContainer = document.querySelector('.convidar-container');
    console.log("✅ Desportos do campo (original):", desportosCampo);
    console.log("📦 Equipas no localStorage (string):", equipasGuardadas);

    if (!equipasGuardadas || !convidarContainer) {
        console.warn("Nenhuma equipa encontrada ou container de equipas não disponível.");
        return;
    }

    const equipas = JSON.parse(equipasGuardadas);

    const equipasFiltradas = equipas.filter(equipa => {
        const desportoEquipa = equipa.desporto.trim().toLowerCase();
    
        // Inclui sempre equipas com desporto "Outro"
        if (desportoEquipa === "outro") {
            return true;
        }
    
        // Verifica se o desporto da equipa corresponde a algum desporto do campo
        return desportosCampo.some(desportoCampo =>
            desportoEquipa === desportoCampo.trim().toLowerCase()
        );
    });

    console.log("🎯 Equipas filtradas:", equipasFiltradas);

    // Limpar e renderizar
    convidarContainer.innerHTML = '';

    equipasFiltradas.forEach(equipa => {
        const button = document.createElement('button');
        button.className = 'convidar-btn';
        button.textContent = equipa.nome;

        button.onclick = () => {
            if (equipasSelecionadas.includes(equipa)) {
                equipasSelecionadas = equipasSelecionadas.filter(e => e !== equipa);
                button.classList.remove('selecionada');
                console.log(`Equipa "${equipa.nome}" desmarcada.`);
            } else {
                equipasSelecionadas.push(equipa);
                button.classList.add('selecionada');
                console.log(`Equipa "${equipa.nome}" selecionada!`);
            }
        };

        convidarContainer.appendChild(button);
    });

    // Botão de adicionar nova equipa
    const addButton = document.createElement('button');
    addButton.className = 'convidar-btn';
    addButton.textContent = '+';
    addButton.onclick = () => {
        window.location.href = "../equipa/equipa.html";
    };
    convidarContainer.appendChild(addButton);
}

function selecionarEquipa(equipa) {
    exibirMensagem("sucesso",`Equipa "${equipa.nome}" selecionada! Convites serão enviados aos membros aquando a reserva.`);
};

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

window.abrirEquipamentoModal = function (desporto) {
    const equipamentoModal = document.getElementById("equipamentoModal");
    const equipamentoLista = equipamentoModal.querySelector(".equipamento-lista");

    equipamentoLista.innerHTML = ''; // Limpa a lista antes de adicionar

    // Adicione os equipamentos dinamicamente com base no desporto
    const equipamentos = {
        Futebol: ["Bolas", "Coletes", "Cones"],
        Ténis: ["Raquetes", "Bolas de Ténis", "Rede"],
        Padel: ["Raquetes de Padel", "Bolas de Padel"],
        Basquetebol: ["Bolas de Basquetebol", "Tabela", "Coletes"],
        Voleibol: ["Bolas de Voleibol", "Rede"],
        Andebol: ["Bolas de Andebol", "Coletes"]
    };

    const equipamentosDesporto = equipamentos[desporto] || ["Equipamento padrão"];

    // Adicionar os equipamentos à lista
    equipamentosDesporto.forEach(equipamento => {
        const li = document.createElement("li");
        li.textContent = equipamento;
        li.onclick = () => selecionarEquipamento(equipamento);
        equipamentoLista.appendChild(li);
    });

    equipamentoModal.style.display = "block"; // Exibe o modal
};

window.fecharEquipamentoModal = function () {
    const equipamentoModal = document.getElementById("equipamentoModal");
    equipamentoModal.style.display = "none"; // Fecha o modal
};

function selecionarEquipamento(equipamento) {
    exibirMensagem("sucesso", `Equipamento "${equipamento}" selecionado!`);
    window.fecharEquipamentoModal();
}
async function carregarReservas(campoIdParaFiltrar) {
    try {
        const reservasGuardadas = localStorage.getItem('todasReservas');
        if (reservasGuardadas) {
            todasReservas = JSON.parse(reservasGuardadas);
            console.log("Reservas carregadas do localStorage em campo.js:", todasReservas);
        } else {
            todasReservas = [];
            console.log("Nenhuma reserva no localStorage. Iniciando com array vazio em campo.js.");
        }
    } catch (error) {
        console.error("Erro ao carregar/processar reservas em campo.js:", error);
        todasReservas = [];
    }
}

function guardarReservasNoLocalStorage() {
    try {
        localStorage.setItem('todasReservas', JSON.stringify(todasReservas));
        console.log("Reservas guardadas no localStorage a partir de campo.js.");
    } catch (error) {
        console.error("Erro ao guardar reservas no localStorage em campo.js:", error);
    }
}

function atualizarCarrossel() {
    if (campoImageElement && campoAtualImagens.length > 0) {
        campoImageElement.src = campoAtualImagens[currentImageIndex];
        campoImageElement.alt = `Imagem ${currentImageIndex + 1} do campo`;
    }
    if (prevBtn) prevBtn.style.display = campoAtualImagens.length > 1 ? 'block' : 'none';
    if (nextBtn) nextBtn.style.display = campoAtualImagens.length > 1 ? 'block' : 'none';
}

async function carregarDadosCampoEConfigurarPagina(id) {
    try {
        if (todosCampos.length === 0) {
            const response = await fetch('campos.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} ao buscar campos.json`);
            }
            todosCampos = await response.json();
        }

        const campoSelecionado = todosCampos.find(campo => campo.id === parseInt(id));
        console.log("Campo selecionado:", campoSelecionado); // Verifica o campo carregado

        if (campoSelecionado) {
            document.title = `${campoSelecionado.nome} - Play Smart`;
            console.log("Função chamada para o desporto:", campoSelecionado.desporto);
            carregarEquipasParaCampo(campoSelecionado.desporto);
        
            const campoTituloElement = document.querySelector('.campo-section h1');
            if (campoTituloElement) {
                campoTituloElement.textContent = campoSelecionado.nome;
                
            }

            campoAtualImagens = campoSelecionado.imagens && campoSelecionado.imagens.length > 0 ? campoSelecionado.imagens : ['../images/default_campo.png'];
            currentImageIndex = 0;
            atualizarCarrossel();

            const infoSection = document.querySelector('.campo-info');
            if (infoSection) {
                infoSection.innerHTML = `
                    <h2><i class="fas fa-info-circle"></i> Informações do Campo</h2>
                    <p id="campoDescricao"><i class="fas fa-futbol"></i> ${campoSelecionado.descricao || 'Descrição não disponível.'}</p>
                    <div id="campoComodidadesLista">
                        ${campoSelecionado.comodidades ? campoSelecionado.comodidades.map(c => {
                            let iconClass = 'fa-question-circle'; // Ícone padrão caso não seja identificado
                            if (c.toLowerCase().includes('balneário')) iconClass = 'fa-shower';
                            else if (c.toLowerCase().includes('equipamento')) iconClass = 'fa-shirt';
                            else if (c.toLowerCase().includes('estacionamento')) iconClass = 'fa-parking';
                            else if (c.toLowerCase().includes('iluminação')) iconClass = 'fa-lightbulb';
                            else if (c.toLowerCase().includes('wc')) iconClass = 'fa-restroom';
                            else if (c.toLowerCase().includes('bar')) iconClass = 'fa-martini-glass';
        
                            return `<p><i class="fas ${iconClass}"></i> ${c}</p>`;
                        }).join('') : '<p>Nenhuma comodidade listada.</p>'}
                    </div>
                    <p id="campoCapacidade"><i class="fas fa-users"></i> Capacidade: ${campoSelecionado.capacidade || 'N/A'} jogadores</p>
                    <p id="campoPreco"><i class="fas fa-euro-sign"></i> Preço por hora: ${parseFloat(campoSelecionado.preco_hora).toFixed(2)}€</p>
                    
                    <h2><i class="fas fa-map-marker-alt"></i> Endereço</h2>
                    <p id="campoMorada">${campoSelecionado.morada || 'Endereço não disponível.'}</p>
                    <div class="campo-actions">
                        <button class="action-btn" onclick="mostrarDirecoes('${campoSelecionado.morada}')">Direções</button>
                        <button class="action-btn" onclick="copiarEndereco('${campoSelecionado.morada}')">Copiar</button>
                    </div>
                `;
            }

            const comodidadesListaModal = document.querySelector('#comodidadesModal .comodidades-lista');
            if (comodidadesListaModal) {
                comodidadesListaModal.innerHTML = '';
                if (campoSelecionado.comodidades && campoSelecionado.comodidades.length > 0) {
                    campoSelecionado.comodidades.forEach(comodidade => {
                        const li = document.createElement('li');
                        li.className = 'comodidade';
                        li.setAttribute('data-nome', comodidade);
                        li.onclick = function() { selecionarComodidade(this); };
                        
                        let iconClass = 'fa-question-circle';
                        if (comodidade.toLowerCase().includes('balneário')) iconClass = 'fa-shower';
                        else if (comodidade.toLowerCase().includes('equipamento')) iconClass = 'fa-shirt';
                        else if (comodidade.toLowerCase().includes('estacionamento')) iconClass = 'fa-parking';
                        else if (comodidade.toLowerCase().includes('iluminação')) iconClass = 'fa-lightbulb';
                        else if (comodidade.toLowerCase().includes('wc')) iconClass = 'fa-restroom';
                        else if (comodidade.toLowerCase().includes('bar')) iconClass = 'fa-martini-glass';

                        li.innerHTML = `<i class="fas ${iconClass}"></i> ${comodidade}`;
                        comodidadesListaModal.appendChild(li);
                    });
                } else {
                    comodidadesListaModal.innerHTML = '<li>Nenhuma comodidade específica para este campo.</li>';
                }
            }
        } else {
            console.error('Campo não encontrado com o ID:', id);
            const campoTituloElement = document.querySelector('.campo-section h1');
            if (campoTituloElement) campoTituloElement.textContent = "Campo não encontrado";
            if(campoImageElement) campoImageElement.src = '../images/default_campo_error.png';
            if(campoImageElement) campoImageElement.alt = "Campo não encontrado";
            const infoSection = document.querySelector('.campo-info');
            if(infoSection) infoSection.innerHTML = "<p>Não foi possível carregar as informações do campo.</p>";
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao carregar dados do campo:', error);
        const campoTituloElement = document.querySelector('.campo-section h1');
        if (campoTituloElement) campoTituloElement.textContent = "Erro ao carregar campo";
        if(campoImageElement) campoImageElement.src = '../images/default_campo_error.png';
        if(campoImageElement) campoImageElement.alt = "Erro ao carregar campo";
    }
}

window.mostrarDirecoes = function(endereco) {
    if (endereco) {
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`, '_blank');
    } else {
        exibirMensagem("erro","Endereço não disponível para mostrar direções.");
    }
}

window.copiarEndereco = function(endereco) {
    if (endereco) {
        navigator.clipboard.writeText(endereco).then(() => {
            exibirMensagem("sucesso",'Endereço copiado!');
        }).catch(err => {
            console.error('Erro ao copiar endereço: ', err);
            exibirMensagem("erro",'Erro ao copiar endereço.');
        });
    } else {
        exibirMensagem("erro","Endereço não disponível para copiar.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const campoId = urlParams.get('id');

    if (campoId) {
        carregarDadosCampoEConfigurarPagina(campoId);
        carregarReservas(campoId); // Carrega reservas específicas desta página
    } else {
        console.error('ID do campo não encontrado na URL.');
        document.querySelector('.campo-section h1').textContent = "Campo Inválido";
        if(campoImageElement) campoImageElement.src = '../images/default_campo_error.png';
        if(campoImageElement) campoImageElement.alt = "Campo inválido";
        const infoSection = document.querySelector('.campo-info');
        if(infoSection) infoSection.innerHTML = "<p>Por favor, selecione um campo válido a partir da página inicial.</p>";
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }

    if (nextBtn && campoImageElement) {
        nextBtn.addEventListener("click", () => {
            if (campoAtualImagens.length > 1) {
                currentImageIndex = (currentImageIndex + 1) % campoAtualImagens.length;
                atualizarCarrossel();
            }
        });
    }

    if (prevBtn && campoImageElement) {
        prevBtn.addEventListener("click", () => {
            if (campoAtualImagens.length > 1) {
                currentImageIndex = (currentImageIndex - 1 + campoAtualImagens.length) % campoAtualImagens.length;
                atualizarCarrossel();
            }
        });
    }

    const saldoAtualEl = document.getElementById("saldoAtual");
    const saldoContainer = document.getElementById("saldoContainer");

    if (saldoContainer) {
        saldoContainer.addEventListener("click", () => {
            const modalAdicionarSaldo = document.getElementById("modalAdicionarSaldo");
            if (modalAdicionarSaldo) {
                 modalAdicionarSaldo.style.display = "block";
            } else {
                console.warn("Elemento modalAdicionarSaldo não encontrado no DOM de campo.html.");
            }
        });
    }

    const saldoGuardado = localStorage.getItem('saldoUsuario');
    if (saldoGuardado && saldoAtualEl) {
        saldoAtualEl.textContent = `${parseFloat(saldoGuardado).toFixed(2)}€`;
    } else if (saldoAtualEl) {
        const saldoInicial = 0.00;
        saldoAtualEl.textContent = `${saldoInicial.toFixed(2)}€`;
    }

    const profileButton = document.getElementById("profileButton");

    if (profileButton) {
        profileButton.addEventListener("click", (event) => {
            event.stopPropagation();
            console.log("Botão de perfil clicado.");
        });
    }
});

// Função auxiliar para formatar a data (adicione se não tiver uma similar)
function formatarDataParaReserva(dateObj) {
    if (!dateObj) return '';
    // Se selectedDate já for uma string formatada, ajuste conforme necessário
    if (typeof dateObj === 'string') return dateObj; 
    
    // Se selectedDate for um objeto Date
    const dia = String(dateObj.getDate()).padStart(2, '0');
    const mes = String(dateObj.getMonth() + 1).padStart(2, '0'); // Meses são 0-indexed
    const ano = dateObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const reservaModal = document.getElementById("reservaModal");

    if (!reservaModal) {
        console.warn("Modal de reserva não encontrado.");
        return;
    }

    window.abrirReserva = function () {
        selectedDate = null;
        selectedTime = null;
        selectedAmenities = [];
        document.querySelectorAll('#reservaModal .calendar-day.active').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('#reservaModal .horario-slot.selected').forEach(el => el.classList.remove('selected'));
        const comodidadesModalEl = document.getElementById("comodidadesModal");
        if (comodidadesModalEl) {
            comodidadesModalEl.querySelectorAll(".comodidades-lista li.selecionada").forEach(el => el.classList.remove('selecionada'));
        }
        reservaModal.style.display = "block";
    };

    window.fecharReserva = function () {
        reservaModal.style.display = "none";
    };

    const calendarGridModal = reservaModal.querySelector(".calendar-grid");
    const calendarioMesAnoModal = reservaModal.querySelector("#calendarioMesAno");
    const prevMonthBtnModal = reservaModal.querySelector("#prevMonth");
    const nextMonthBtnModal = reservaModal.querySelector("#nextMonth");

    let currentDateModal = new Date();

    function renderCalendarModal(date) {
        if (!calendarGridModal || !calendarioMesAnoModal) return;

        calendarGridModal.innerHTML = '';
        const diasSemanaNomes = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
        diasSemanaNomes.forEach(diaNome => {
            const dayHeaderEl = document.createElement("div");
            dayHeaderEl.className = "calendar-day-header";
            dayHeaderEl.innerText = diaNome;
            calendarGridModal.appendChild(dayHeaderEl);
        });

        const year = date.getFullYear();
        const month = date.getMonth();
        const today = new Date();

        let firstDayOfMonthIndex = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        calendarioMesAnoModal.textContent = `${date.toLocaleString("pt-PT", { month: "long" }).charAt(0).toUpperCase() + date.toLocaleString("pt-PT", { month: "long" }).slice(1)} ${year}`;

        for (let i = 0; i < firstDayOfMonthIndex; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.className = "calendar-day empty";
            calendarGridModal.appendChild(emptyCell);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dayEl = document.createElement("div");
            dayEl.className = "calendar-day";
            dayEl.innerText = d;
            const currentDateLoop = new Date(year, month, d);

            if (currentDateLoop < today.setHours(0,0,0,0)) {
                dayEl.classList.add("disabled");
            } else {
                dayEl.addEventListener("click", () => {
                    if (dayEl.classList.contains("disabled")) return;

                    const activeDay = calendarGridModal.querySelector('.calendar-day.active');
                    if (activeDay) activeDay.classList.remove("active");
                    
                    dayEl.classList.add("active");
                    selectedDate = new Date(year, month, d);
                    console.log("Data selecionada (modal):", selectedDate);
                });
            }
            calendarGridModal.appendChild(dayEl);
        }
    }

    if (prevMonthBtnModal) {
        prevMonthBtnModal.addEventListener("click", () => {
            currentDateModal.setMonth(currentDateModal.getMonth() - 1);
            renderCalendarModal(currentDateModal);
        });
    }

    if (nextMonthBtnModal) {
        nextMonthBtnModal.addEventListener("click", () => {
            currentDateModal.setMonth(currentDateModal.getMonth() + 1);
            renderCalendarModal(currentDateModal);
        });
    }
    
    if (calendarGridModal) {
        renderCalendarModal(currentDateModal);
    }

    const horariosListModal = reservaModal.querySelector(".horarios-list");
    const horariosData = [
        "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00",
        "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00",
        "17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00",
        "21:00 - 22:00"
    ];

    if (horariosListModal) {
        horariosListModal.innerHTML = '';
        horariosData.forEach(horario => {
            const slot = document.createElement("div");
            slot.className = "horario-slot";
            slot.innerText = horario;

            slot.addEventListener("click", () => {
                const selectedSlot = horariosListModal.querySelector('.horario-slot.selected');
                if (selectedSlot) selectedSlot.classList.remove("selected");
                
                slot.classList.add("selected");
                selectedTime = horario;
                console.log("Horário selecionado (modal):", selectedTime);
            });
            horariosListModal.appendChild(slot);
        });
    }

    const comodidadesModalEl = document.getElementById("comodidadesModal");

    window.abrirComodidades = function () {
        if (comodidadesModalEl) comodidadesModalEl.style.display = "block";
    };

    window.fecharComodidades = function () {
        if (comodidadesModalEl) comodidadesModalEl.style.display = "none";
    };

    window.confirmarComodidades = function () {
        if (comodidadesModalEl) {
            selectedAmenities = Array.from(comodidadesModalEl.querySelectorAll(".comodidades-lista li.selecionada"))
                .map(el => el.getAttribute("data-nome"));
    
            // Adicionar preço adicional para "Equipamento"
            let precoAdicional = 0;
            if (selectedAmenities.includes("Equipamento")) {
                precoAdicional += 1; // Exemplo: 5€ por equipamento
                exibirMensagem("sucesso","Preço adicional de 1€ adicionado para Equipamento.");
            }
    
            exibirMensagem("sucesso",`Comodidades confirmadas: ${selectedAmenities.join(", ") || "Nenhuma"}`);
            fecharComodidades();
        }
    };
    
  
    const closeComodidadesBtn = comodidadesModalEl ? comodidadesModalEl.querySelector('.close') : null;
    if (closeComodidadesBtn) {
        closeComodidadesBtn.onclick = fecharComodidades;
    }
    const btnConfirmarComodidadesNoModal = comodidadesModalEl ? comodidadesModalEl.querySelector('button') : null;
    if (btnConfirmarComodidadesNoModal && btnConfirmarComodidadesNoModal.textContent.toLowerCase().includes("confirmar")) {
       btnConfirmarComodidadesNoModal.onclick = confirmarComodidades;
    }

    window.realizarPagamento = async function () {
        const dataParaReserva = selectedDate;
        const horarioParaReserva = selectedTime;
        const comodidadesParaReserva = selectedAmenities;
    
        if (!dataParaReserva || !horarioParaReserva) {
            exibirMensagem("erro", "Por favor, selecione data e horário a partir do calendário e da lista de horários no modal de reserva.");
            return;
        }
    
        const userIdLogado = "prototipoUser"; // Simulação de utilizador logado
    
        const urlParams = new URLSearchParams(window.location.search);
        const campoId = urlParams.get('id');
        let campoAtual = null;
    
        if (campoId && todosCampos.length > 0) {
            campoAtual = todosCampos.find(campo => campo.id === parseInt(campoId));
        } else if (campoId) {
            try {
                if (todosCampos.length === 0) {
                    const response = await fetch('campos.json');
                    if (!response.ok) throw new Error('Falha ao buscar campos.json');
                    todosCampos = await response.json();
                }
                campoAtual = todosCampos.find(campo => campo.id === parseInt(campoId));
            } catch (error) {
                console.error("Erro ao tentar carregar campo para pagamento:", error);
                exibirMensagem("erro", "Erro crítico ao carregar dados do campo. A reserva não pode ser processada.");
                return;
            }
        }
    
        if (!campoAtual) {
            exibirMensagem("erro", "Erro ao carregar dados do campo para processar a reserva. Tente novamente ou selecione o campo novamente.");
            return;
        }
    
        const precoCampo = parseFloat(campoAtual.preco_hora);
        const precoDividido = precoCampo / 2;
    
        // Lógica de Saldo
        let saldoAtualNumerico = parseFloat(localStorage.getItem('saldoUsuario')) || 0.00;
    
        if (saldoAtualNumerico < precoDividido) {
            exibirMensagem("erro", `Saldo insuficiente (${saldoAtualNumerico.toFixed(2)}€) para realizar a reserva de ${precoDividido.toFixed(2)}€.`);
            abrirModalSaldo();
            return;
        }
    
        saldoAtualNumerico -= precoDividido;
        localStorage.setItem('saldoUsuario', saldoAtualNumerico.toString());
    
        const dataFormatada = formatarDataParaReserva(dataParaReserva);
    
        const novaReserva = {
            id: Date.now(),
            campoId: campoAtual.id,
            nomeCampo: campoAtual.nome,
            data: dataFormatada,
            horario: horarioParaReserva,
            preco: precoCampo,
            comodidades: comodidadesParaReserva,
            userId: userIdLogado,
            equipasConvidadas: equipasSelecionadas.map(e => e.nome) // Adiciona as equipas convidadas
        };
    
        todasReservas.push(novaReserva);
        guardarReservasNoLocalStorage();
    
        // Enviar convites para os membros das equipas selecionadas
        equipasSelecionadas.forEach(equipa => {
            equipa.membros.forEach(membro => {
                console.log(`Convite enviado para ${membro} da equipa "${equipa.nome}".`);
            });
        });
    
        exibirMensagem("sucesso", `Reserva para ${campoAtual.nome} em ${dataFormatada} às ${horarioParaReserva} confirmada! Novo saldo: ${saldoAtualNumerico.toFixed(2)}€`);
        fecharReserva();
    };
    const closeReservaBtn = reservaModal.querySelector('.modal-content > .close');
    if (closeReservaBtn) {
        closeReservaBtn.onclick = fecharReserva;
    }
    const confirmarReservaBtn = reservaModal.querySelector('.pagar-btn');
    if (confirmarReservaBtn) {
        confirmarReservaBtn.onclick = realizarPagamento;
    }


    window.selecionarComodidade = function(element) {
        element.classList.toggle("selecionada");
}


});
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const campoId = urlParams.get('id');

    if (campoId) {
        carregarDadosCampoEConfigurarPagina(campoId);
    } else {
        console.error('ID do campo não encontrado na URL.');
    }
});