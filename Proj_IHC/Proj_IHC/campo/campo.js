document.addEventListener("DOMContentLoaded", () => {
  // ========== CARROSSEL DE IMAGENS ==========
  const campoImages = [
    "../images/campo_3.jpg",
    "../images/campo_2.jpg",
    "../images/campo_1.jpg",
  ];
  let currentImageIndex = 0;
  const campoImage = document.getElementById("campoImage");

  document.getElementById("nextBtn").addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + 1) % campoImages.length;
    campoImage.src = campoImages[currentImageIndex];
  });

  document.getElementById("prevBtn").addEventListener("click", () => {
    currentImageIndex = (currentImageIndex - 1 + campoImages.length) % campoImages.length;
    campoImage.src = campoImages[currentImageIndex];
  });

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
  if (fecharModalSaldoBtn) {
    fecharModalSaldoBtn.addEventListener("click", () => {
      modalAdicionarSaldo.style.display = "none";
    });






  }

  const adicionarSaldoBtn = document.getElementById("confirmarAdicionarSaldo");
  if (adicionarSaldoBtn) {
    adicionarSaldoBtn.addEventListener("click", () => {
      const valorInput = document.getElementById("valorSaldo");
      const valorSaldo = parseFloat(valorInput.value);
      if (!isNaN(valorSaldo) && valorSaldo > 0) {
        const saldoAtual = parseFloat(saldoAtualEl.textContent.replace("€", ""));
        const novoSaldo = saldoAtual + valorSaldo;
        saldoAtualEl.textContent = `${novoSaldo.toFixed(2)}€`;
        modalAdicionarSaldo.style.display = "none";
      } else {
        alert("Por favor, insira um valor válido.");
      }
    });

  }

  // ========== DROPDOWN DO PERFIL ==========
  const profileButton = document.getElementById("profileButton");
  const profileDropdown = document.getElementById("profileDropdown");

  if (profileButton && profileDropdown) {
    profileButton.addEventListener("click", () => {
      profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block";
    });

    window.addEventListener("click", function (e) {
      if (!e.target.closest("#profileButton") && !e.target.closest("#profileDropdown")) {
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
});

// Modal de Reserva
document.addEventListener("DOMContentLoaded", () => {
  const reservaModal = document.getElementById("reservaModal");

  window.abrirReserva = function () {
    reservaModal.style.display = "block";
  };

  window.fecharReserva = function () {
    reservaModal.style.display = "none";
  };

  // Renderizar Calendário
  const calendarGrid = document.querySelector(".calendar-grid");
  const calendarioMesAno = document.getElementById("calendarioMesAno");
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");

  let currentDate = new Date();

  function renderCalendar(date) {
    calendarGrid.innerHTML = `
      <div class="calendar-day-header">S</div>
      <div class="calendar-day-header">T</div>
      <div class="calendar-day-header">Q</div>
      <div class="calendar-day-header">Q</div>
      <div class="calendar-day-header">S</div>
      <div class="calendar-day-header">S</div>
      <div class="calendar-day-header">D</div>
    `;

    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarioMesAno.textContent = `${date.toLocaleString("pt-PT", { month: "long" }).charAt(0).toUpperCase() + date.toLocaleString("pt-PT", { month: "long" }).slice(1)} ${year}`;

    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("div");
      calendarGrid.appendChild(emptyCell);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dayEl = document.createElement("div");
      dayEl.className = "calendar-day";
      dayEl.innerText = d;
      dayEl.addEventListener("click", () => {
        document.querySelectorAll(".calendar-day").forEach(el => el.classList.remove("active"));
        dayEl.classList.add("active");
        console.log("Dia selecionado:", d, month + 1, year);
      });
      calendarGrid.appendChild(dayEl);
    }
  }

  prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  renderCalendar(currentDate);

  // Gerenciar Horários
  const horariosList = document.querySelector(".horarios-list");
  const horarios = [
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
    "20:00 - 21:00",
    "21:00 - 22:00",
    "22:00 - 23:00",
    "23:00 - 00:00"
  ];

  horarios.forEach(horario => {
    const slot = document.createElement("div");
    slot.className = "horario-slot";
    slot.innerText = horario;

    slot.addEventListener("click", () => {
      document.querySelectorAll(".horario-slot").forEach(s => s.classList.remove("selected"));
      slot.classList.add("selected");
      console.log("Horário selecionado:", horario);
    });

    horariosList.appendChild(slot);
  });

  // Gerenciar Comodidades
  window.abrirComodidades = function () {
    document.getElementById("comodidadesModal").style.display = "block";
  };

  window.fecharComodidades = function () {
    document.getElementById("comodidadesModal").style.display = "none";
  };

  window.confirmarComodidades = function () {
    alert("Comodidades confirmadas!");
    fecharComodidades();
  };

  // Simular Pagamento
  window.realizarPagamento = function () {
    alert("Pagamento realizado com sucesso!");
    fecharReserva();
  };
});
// Gerenciar seleção de comodidades
function selecionarComodidade(element) {
  element.classList.toggle("selecionada");
}

// Confirmar comodidades selecionadas
function confirmarComodidades() {
  const selecionadas = Array.from(document.querySelectorAll(".comodidades-lista .selecionada"))
    .map(el => el.getAttribute("data-nome"));
  alert(`Comodidades selecionadas: ${selecionadas.join(", ")}`);
  fecharComodidades();
}

// Fechar o modal de comodidades
function fecharComodidades() {
  document.getElementById("comodidadesModal").style.display = "none";
}
// Função para fechar o modal de reserva
function fecharReserva() {
  const reservaModal = document.getElementById("reservaModal");
  reservaModal.style.display = "none";
}