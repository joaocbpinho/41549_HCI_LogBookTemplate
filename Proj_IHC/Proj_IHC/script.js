document.getElementById('addButton').addEventListener('click', function () {
    alert('Adicionar saldo!');
  });
  
  document.getElementById('profileButton').addEventListener('click', function () {
    alert('Abrir perfil do utilizador!');
  });
  
  // Abrir o modal
  function addEquipa() {
    document.getElementById("modalCriarEquipa").style.display = "block";
  }
  
  // Fechar o modal
  function fecharModal() {
    document.getElementById("modalCriarEquipa").style.display = "none";
  }
  
  // Criar equipa (simples exemplo)
  function criarEquipa() {
    const nomeEquipa = document.getElementById("nomeEquipa").value;
    if (nomeEquipa) {
      alert(`Equipa "${nomeEquipa}" criada com sucesso!`);
      fecharModal();
    } else {
      alert("Por favor, insira um nome para a equipa.");
    }
  }
  
  // Abrir o modal de adicionar saldo
  function abrirModalSaldo() {
    document.getElementById("modalAdicionarSaldo").style.display = "block";
  }

  // Fechar o modal de adicionar saldo
  function fecharModalSaldo() {
    document.getElementById("modalAdicionarSaldo").style.display = "none";
  }

  // Adicionar saldo
  function adicionarSaldo() {
    const valorSaldo = parseFloat(document.getElementById("valorSaldo").value);
    if (!isNaN(valorSaldo) && valorSaldo > 0) {
      const saldoAtual = parseFloat(document.getElementById("saldoAtual").textContent.replace("€", ""));
      const novoSaldo = saldoAtual + valorSaldo;
      document.getElementById("saldoAtual").textContent = `${novoSaldo.toFixed(2)}€`;
      fecharModalSaldo();
    } else {
      alert("Por favor, insira um valor válido.");
    }
  }
  
  function toggleDropdown(id) {
    document.querySelectorAll('.dropdown').forEach(drop => {
      if (drop.id !== id) {
        drop.classList.remove('active');
      }
    });
    document.getElementById(id).classList.toggle('active');
  }
  
  // Alternar o dropdown do perfil
  function toggleProfileDropdown() {
    const dropdown = document.getElementById("profileDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  }

  // Fechar o dropdown ao clicar fora
  window.addEventListener("click", function (e) {
    if (!e.target.closest("#profileButton") && !e.target.closest("#profileDropdown")) {
      document.getElementById("profileDropdown").style.display = "none";
    }
  });

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
