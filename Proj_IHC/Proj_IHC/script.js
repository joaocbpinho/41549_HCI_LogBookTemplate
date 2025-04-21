document.addEventListener("DOMContentLoaded", () => {
  // ========== CARROSSEL DE IMAGENS ==========
  const campoImages = [
    "images/campo_3.jpg",
    "images/campo_2.jpg",
    "images/campo_1.jpg",
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
