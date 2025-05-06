let todasReservas = []; // Adicionar esta variável global
let todosCampos = []; // Se precisar de detalhes dos campos, pode carregar aqui também

// Variáveis para guardar seleções do modal de reserva
let selectedDate = null;
let selectedTime = null;
let selectedAmenities = [];

// Função para carregar as reservas do localStorage (semelhante à de reservas.js)
// Simplificada: assume que se não houver nada, começa vazio.
// Se quiser o fallback para reservas.json, pode copiar a versão mais completa.
async function carregarReservas() {
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

// Função para guardar reservas no localStorage (idêntica à de reservas.js)
function guardarReservasNoLocalStorage() {
    try {
        localStorage.setItem('todasReservas', JSON.stringify(todasReservas));
        console.log("Reservas guardadas no localStorage a partir de campo.js.");
    } catch (error) {
        console.error("Erro ao guardar reservas no localStorage em campo.js:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
  // ========== CARROSSEL DE IMAGENS ==========
  const campoImages = [
    "../images/campo_3.jpg",
    "../images/campo_2.jpg",
    "../images/campo_1.jpg",
  ];
  let currentImageIndex = 0;
  const campoImage = document.getElementById("campoImage");

  if (document.getElementById("nextBtn") && campoImage) {
    document.getElementById("nextBtn").addEventListener("click", () => {
      currentImageIndex = (currentImageIndex + 1) % campoImages.length;
      campoImage.src = campoImages[currentImageIndex];
    });
  }

  if (document.getElementById("prevBtn") && campoImage) {
    document.getElementById("prevBtn").addEventListener("click", () => {
      currentImageIndex = (currentImageIndex - 1 + campoImages.length) % campoImages.length;
      campoImage.src = campoImages[currentImageIndex];
    });
  }

  // ========== MODAL DE ADICIONAR SALDO ==========
  const saldoAtualEl = document.getElementById("saldoAtual");
  const saldoContainer = document.getElementById("saldoContainer");
  const modalAdicionarSaldo = document.getElementById("modalAdicionarSaldo");

  if (saldoContainer) {
    saldoContainer.addEventListener("click", () => {
      if (modalAdicionarSaldo) modalAdicionarSaldo.style.display = "block";
    });
  }

  const fecharModalSaldoBtn = document.getElementById("fecharModalSaldo");
  if (fecharModalSaldoBtn && modalAdicionarSaldo) {
    fecharModalSaldoBtn.addEventListener("click", () => {
      modalAdicionarSaldo.style.display = "none";
    });
  }

  const adicionarSaldoBtn = document.getElementById("confirmarAdicionarSaldo");
  if (adicionarSaldoBtn && modalAdicionarSaldo && saldoAtualEl) {
    adicionarSaldoBtn.addEventListener("click", () => {
      const valorInput = document.getElementById("valorSaldo");
      if (valorInput) {
        const valorSaldo = parseFloat(valorInput.value);
        if (!isNaN(valorSaldo) && valorSaldo > 0) {
          const saldoAtual = parseFloat(saldoAtualEl.textContent.replace("€", ""));
          const novoSaldo = saldoAtual + valorSaldo;
          saldoAtualEl.textContent = `${novoSaldo.toFixed(2)}€`;
          localStorage.setItem('saldoUsuario', novoSaldo.toFixed(2));
          modalAdicionarSaldo.style.display = "none";
        } else {
          alert("Por favor, insira um valor válido.");
        }
      }
    });
  }

  const saldoGuardado = localStorage.getItem('saldoUsuario');
  if (saldoGuardado && saldoAtualEl) {
    saldoAtualEl.textContent = `${parseFloat(saldoGuardado).toFixed(2)}€`;
  } else if (saldoAtualEl) {
    const saldoInicial = 0.00;
    saldoAtualEl.textContent = `${saldoInicial.toFixed(2)}€`;
    localStorage.setItem('saldoUsuario', saldoInicial.toFixed(2));
  }

  // ========== DROPDOWN DO PERFIL ==========
  const profileButton = document.getElementById("profileButton");
  const profileDropdown = document.getElementById("profileDropdown");

  if (profileButton && profileDropdown) {
    profileButton.addEventListener("click", (event) => {
      event.stopPropagation();
      profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block";
    });

    window.addEventListener("click", function (e) {
      if (profileDropdown.style.display === "block" && !profileButton.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.style.display = "none";
      }
    });
  }

  // ========== CALENDÁRIO (DIAS DO MÊS) ==========
  const calendarContainer = document.getElementById("calendarDays");
  if (calendarContainer) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const dayEl = document.createElement("div");
      dayEl.className = "calendar-day";
      dayEl.innerText = d;
      dayEl.addEventListener("click", () => {
        document.querySelectorAll(".calendar-day").forEach(el => el.classList.remove("active"));
        dayEl.classList.add("active");
        console.log("Dia selecionado:", d, month + 1, year);
      });
      calendarContainer.appendChild(dayEl);
    }
  }

  // ========== HORÁRIOS ==========
  const horarios = document.querySelectorAll(".hour-slot input");
  horarios.forEach(cb => {
    cb.addEventListener("change", () => {
      const selecionadas = Array.from(horarios)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
      console.log("Horas selecionadas:", selecionadas);
    });
  });

  // ========== MODAL CRIAR EQUIPA ==========
  const criarEquipaBtn = document.getElementById("criarEquipaBtn");
  const modalCriarEquipa = document.getElementById("modalCriarEquipa");

  if (criarEquipaBtn && modalCriarEquipa) {
    criarEquipaBtn.addEventListener("click", () => {
      modalCriarEquipa.style.display = "block";
    });
  }

  const fecharEquipaBtn = document.getElementById("fecharCriarEquipa");
  if (fecharEquipaBtn) {
    fecharEquipaBtn.addEventListener("click", () => {
      modalCriarEquipa.style.display = "none";
    });
  }

  const confirmarCriarEquipa = document.getElementById("confirmarCriarEquipa");
  if (confirmarCriarEquipa) {
    confirmarCriarEquipa.addEventListener("click", () => {
      const nomeEquipa = document.getElementById("nomeEquipa").value;
      if (nomeEquipa) {
        alert(`Equipa "${nomeEquipa}" criada com sucesso!`);
        modalCriarEquipa.style.display = "none";
      } else {
        alert("Por favor, insira um nome para a equipa.");
      }
    });
  }

  carregarReservas();
});

document.addEventListener("DOMContentLoaded", () => {
  const reservaModal = document.getElementById("reservaModal");

  if (!reservaModal) {
    return;
  }

  window.abrirReserva = function () {
    selectedDate = null;
    selectedTime = null;
    selectedAmenities = [];
    document.querySelectorAll('#reservaModal .calendar-day.active').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('#reservaModal .horario-slot.selected').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('#reservaModal .comodidades-lista li.selecionada').forEach(el => el.classList.remove('selecionada'));

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
    const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    diasSemana.forEach(dia => {
        const dayHeaderEl = document.createElement("div");
        dayHeaderEl.className = "calendar-day-header";
        dayHeaderEl.innerText = dia;
        calendarGridModal.appendChild(dayHeaderEl);
    });

    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarioMesAnoModal.textContent = `${date.toLocaleString("pt-PT", { month: "long" }).charAt(0).toUpperCase() + date.toLocaleString("pt-PT", { month: "long" }).slice(1)} ${year}`;

    for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "calendar-day empty";
      calendarGridModal.appendChild(emptyCell);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dayEl = document.createElement("div");
      dayEl.className = "calendar-day";
      dayEl.innerText = d;
      dayEl.addEventListener("click", () => {
        document.querySelectorAll('#reservaModal .calendar-day.active').forEach(el => el.classList.remove('active'));
        dayEl.classList.add("active");
        selectedDate = new Date(year, month, d);
        console.log("Data selecionada (modal):", selectedDate);
      });
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
    "21:00 - 22:00", "22:00 - 23:00", "23:00 - 00:00"
  ];

  if (horariosListModal) {
    horariosListModal.innerHTML = '';
    horariosData.forEach(horario => {
      const slot = document.createElement("div");
      slot.className = "horario-slot";
      slot.innerText = horario;

      slot.addEventListener("click", () => {
        document.querySelectorAll('#reservaModal .horario-slot.selected').forEach(s => s.classList.remove("selected"));
        slot.classList.add("selected");
        selectedTime = horario;
        console.log("Horário selecionado (modal):", selectedTime);
      });
      horariosListModal.appendChild(slot);
    });
  }

  const comodidadesModalEl = reservaModal.querySelector("#comodidadesModal");

  window.abrirComodidades = function () {
    if (comodidadesModalEl) comodidadesModalEl.style.display = "block";
  };

  window.fecharComodidades = function () {
    if (comodidadesModalEl) comodidadesModalEl.style.display = "none";
  };

  window.confirmarComodidades = function () {
    selectedAmenities = Array.from(comodidadesModalEl.querySelectorAll(".comodidades-lista li.selecionada"))
      .map(el => el.getAttribute("data-nome"));
    alert(`Comodidades confirmadas: ${selectedAmenities.join(", ")}`);
    fecharComodidades();
  };
  
  const closeComodidadesBtn = comodidadesModalEl ? comodidadesModalEl.querySelector('.close') : null;
  if (closeComodidadesBtn) {
      closeComodidadesBtn.onclick = fecharComodidades;
  }
  const confirmarComodidadesBtn = comodidadesModalEl ? comodidadesModalEl.querySelector('button') : null;
   if (confirmarComodidadesBtn && confirmarComodidadesBtn.textContent === "Confirmar") {
      confirmarComodidadesBtn.onclick = confirmarComodidades;
  }

  window.realizarPagamento = function () {
    if (!selectedDate || !selectedTime) {
      alert("Por favor, selecione uma data e um horário para a reserva.");
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    let campoId = urlParams.get('id'); 
    
    if (!campoId) {
        const tituloCampoElement = document.querySelector('.campo-section h1');
        if (tituloCampoElement) {
            const tituloTexto = tituloCampoElement.textContent;
            const match = tituloTexto.match(/\d+/);
            if (match) {
                campoId = match[0];
            }
        }
    }
    if (!campoId) {
        console.warn("ID do campo não encontrado, usando 'ID_Desconhecido'. Verifique a lógica de obtenção do ID.");
        campoId = "ID_Desconhecido"; 
    }

    const userIdLogado = localStorage.getItem('userId') || '123456'; // Consistência com outras partes, usar 'userId'
    
    // Extrair horaInicio e horaFim de selectedTime
    let horaInicio = 'N/D';
    let horaFim = 'N/D';
    if (selectedTime && selectedTime.includes(' - ')) {
        const partesHorario = selectedTime.split(' - ');
        horaInicio = partesHorario[0];
        horaFim = partesHorario[1];
    } else if (selectedTime) { // Caso selectedTime seja apenas uma hora, por algum motivo
        horaInicio = selectedTime;
    }


    const novaReserva = {
      id: Date.now().toString(),
      userId: userIdLogado,
      campoId: campoId,
      data: `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`,
      horaInicio: horaInicio, // Guardar apenas a hora de início
      horaFim: horaFim,       // Guardar a hora de fim
      comodidades: selectedAmenities,
      estado: "Confirmada",
    };

    todasReservas.push(novaReserva);
    guardarReservasNoLocalStorage();

    alert("Reserva realizada com sucesso e guardada!");
    console.log("Nova reserva adicionada:", novaReserva);
    console.log("Todas as reservas agora:", todasReservas);
    
    fecharReserva();
  };

  const closeReservaBtn = reservaModal.querySelector('.close');
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