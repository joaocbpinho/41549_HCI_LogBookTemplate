document.addEventListener("DOMContentLoaded", () => {
    // ========== CALENDÁRIO ==========
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
  
      calendarioMesAno.textContent = `${date.toLocaleString("pt-BR", { month: "long" })} ${year}`;
  
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
  
    // ========== HORÁRIOS ==========
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
  
   // ========== COMODIDADES ==========
    const comodidadesModal = document.getElementById("comodidadesModal");

    window.abrirComodidades = function () {
    comodidadesModal.style.display = "block";
    };

    window.fecharComodidades = function () {
    comodidadesModal.style.display = "none";
    };

    document.querySelectorAll(".comodidades-lista .comodidade").forEach(item => {
    item.addEventListener("click", () => {
        item.classList.toggle("selecionada");
    });
    });

    window.confirmarComodidades = function () {
    const selecionadas = Array.from(document.querySelectorAll(".comodidade.selecionada"))
        .map(el => el.getAttribute("data-nome"));
    console.log("Comodidades selecionadas:", selecionadas);
    comodidadesModal.style.display = "none";
    };


  });
  