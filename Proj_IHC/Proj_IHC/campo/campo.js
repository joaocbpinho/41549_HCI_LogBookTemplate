let todasReservas = [];
let todosCampos = []; // Irá guardar os dados de campos.json

// Variáveis para guardar seleções do modal de reserva
let selectedDate = null;
let selectedTime = null;
let selectedAmenities = [];

// Variáveis globais para o carrossel dinâmico
let campoAtualImagens = [];
let currentImageIndex = 0;
const campoImageElement = document.getElementById("campoImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

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

        if (campoSelecionado) {
            document.title = `${campoSelecionado.nome} - Play Smart`;

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
                        ${campoSelecionado.comodidades ? campoSelecionado.comodidades.map(c => `<p><i class="fas fa-check-circle"></i> ${c}</p>`).join('') : '<p>Nenhuma comodidade listada.</p>'}
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
        alert("Endereço não disponível para mostrar direções.");
    }
}

window.copiarEndereco = function(endereco) {
    if (endereco) {
        navigator.clipboard.writeText(endereco).then(() => {
            alert('Endereço copiado!');
        }).catch(err => {
            console.error('Erro ao copiar endereço: ', err);
            alert('Erro ao copiar endereço.');
        });
    } else {
        alert("Endereço não disponível para copiar.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const campoId = urlParams.get('id');

    if (campoId) {
        carregarDadosCampoEConfigurarPagina(campoId);
        carregarReservas(campoId);
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
            alert(`Comodidades confirmadas: ${selectedAmenities.join(", ") || "Nenhuma"}`);
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
        if (!selectedDate || !selectedTime) {
            alert("Por favor, selecione uma data e um horário para a reserva.");
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        let campoId = urlParams.get('id'); 
        let precoPorHora = 0;

        if (!campoId) {
            console.warn("ID do campo não encontrado na URL.");
            const tituloCampoElement = document.querySelector('.campo-section h1');
            if (tituloCampoElement && todosCampos.length > 0) {
                const nomeCampoPagina = tituloCampoElement.textContent;
                const campoEncontrado = todosCampos.find(c => c.nome === nomeCampoPagina);
                if (campoEncontrado) {
                    campoId = campoEncontrado.id.toString();
                    precoPorHora = parseFloat(campoEncontrado.preco_hora);
                }
            }
        } else {
            if (todosCampos.length === 0) {
                 try {
                    const response = await fetch('campos.json');
                    if (!response.ok) throw new Error('Falha ao buscar campos para preço.');
                    todosCampos = await response.json();
                } catch (error) {
                    console.error("Erro ao carregar campos para obter preço:", error);
                    alert("Erro ao obter informações do preço do campo. Tente novamente.");
                    return;
                }
            }
            const campoAtual = todosCampos.find(c => c.id === parseInt(campoId));
            if (campoAtual) {
                precoPorHora = parseFloat(campoAtual.preco_hora);
            } else {
                 console.error("Campo não encontrado no JSON para obter preço, usando ID:", campoId);
                 alert("Não foi possível encontrar os detalhes do preço para este campo.");
                 return;
            }
        }
        
        if (!campoId) {
            console.error("ID do campo não pôde ser determinado. Reserva cancelada.");
            alert("Erro: Não foi possível identificar o campo para a reserva.");
            return; 
        }
        if (precoPorHora <= 0) {
            alert("Preço do campo inválido ou não encontrado. Não é possível realizar a reserva.");
            return;
        }

        const userIdLogado = localStorage.getItem('userId');
        if (!userIdLogado) {
            alert("Utilizador não autenticado. Por favor, faça login para reservar.");
            return;
        }

        let saldoUtilizador = parseFloat(localStorage.getItem('saldoUsuario') || "0");

        if (saldoUtilizador < precoPorHora) {
            alert(`Saldo insuficiente (${saldoUtilizador.toFixed(2)}€). O preço da reserva é ${precoPorHora.toFixed(2)}€. Por favor, adicione saldo.`);
            return;
        }
        
        const novoSaldo = saldoUtilizador - precoPorHora;
        localStorage.setItem('saldoUsuario', novoSaldo.toFixed(2));
        const saldoAtualEl = document.getElementById("saldoAtual");
        if (saldoAtualEl) saldoAtualEl.textContent = `${novoSaldo.toFixed(2)}€`;

        let horaInicio = 'N/D';
        let horaFim = 'N/D';
        if (selectedTime && selectedTime.includes(' - ')) {
            const partesHorario = selectedTime.split(' - ');
            horaInicio = partesHorario[0].trim();
            horaFim = partesHorario[1].trim();
        } else if (selectedTime) { 
            horaInicio = selectedTime.trim();
        }

        const novaReserva = {
            id: Date.now().toString(),
            userId: userIdLogado,
            campoId: campoId.toString(),
            nomeCampo: document.querySelector('.campo-section h1') ? document.querySelector('.campo-section h1').textContent : "Nome Indisponível",
            data: `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`,
            horaInicio: horaInicio,
            horaFim: horaFim,
            comodidades: selectedAmenities,
            precoPago: precoPorHora,
            estado: "Confirmada",
        };

        todasReservas.push(novaReserva);
        guardarReservasNoLocalStorage();

        alert(`Reserva realizada com sucesso! Novo saldo: ${novoSaldo.toFixed(2)}€`);
        console.log("Nova reserva adicionada:", novaReserva);
        console.log("Todas as reservas agora:", todasReservas);
        
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
});

window.selecionarComodidade = function(element) {
    element.classList.toggle("selecionada");
};