document.getElementById('addButton').addEventListener('click', function () {
    alert('Adicionar saldo!');
  });
  
  document.getElementById('profileButton').addEventListener('click', function () {
    alert('Abrir perfil do utilizador!');
  });
  
  function addEquipa() {
    alert('Criar nova equipa!');
  }
  
  function toggleDropdown(id) {
    document.querySelectorAll('.dropdown').forEach(drop => {
      if (drop.id !== id) {
        drop.classList.remove('active');
      }
    });
    document.getElementById(id).classList.toggle('active');
  }
  

  window.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown').forEach(drop => drop.classList.remove('active'));
    }
  });
  

  document.addEventListener("DOMContentLoaded", () => {
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
  
    
    const horarios = document.querySelectorAll(".hour-slot input");
    horarios.forEach(cb => {
      cb.addEventListener("change", () => {
        const selecionadas = Array.from(horarios)
          .filter(cb => cb.checked)
          .map(cb => cb.value);
        console.log("Horas selecionadas:", selecionadas);
      });
    });
  });
  