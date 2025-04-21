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

// Defina estas funções NO INÍCIO do arquivo, antes de qualquer outro código
function preencherHorasPopup() {
  const horaInicio = document.getElementById("horaInicio");
  const horaFim = document.getElementById("horaFim");
  if (!horaInicio || !horaFim) return;

  horaInicio.innerHTML = '<option value="">Escolher uma hora</option>';
  horaFim.innerHTML = '<option value="">Escolher uma hora</option>';
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hora = h.toString().padStart(2, "0") + ":" + m.toString().padStart(2, "0");
      const opt1 = document.createElement("option");
      opt1.value = hora;
      opt1.textContent = hora;
      horaInicio.appendChild(opt1);

      const opt2 = document.createElement("option");
      opt2.value = hora;
      opt2.textContent = hora;
      horaFim.appendChild(opt2);
    }
  }
}

function confirmarDataHora() {
  const data = document.getElementById("dataSelecionada").value;
  const inicio = document.getElementById("horaInicio").value;
  const fim = document.getElementById("horaFim").value;
  if (!data || !inicio || !fim) {
    alert("Preencha todos os campos!");
    return;
  }
  document.getElementById("dataHoraResumo").textContent = 
    `${data.split('-').reverse().join('/')} | ${inicio} - ${fim}`;
  fecharPopup();
}

function abrirPopup() {
  preencherHorasPopup();
  document.getElementById("popup").style.display = "block";
}

function fecharPopup() {
  document.getElementById("popup").style.display = "none";
}

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

    const horarioSelect = document.getElementById("horario");
    const duracaoSelect = document.getElementById("duracao");

    // Gerar horários disponíveis (de 00:00 a 23:30)
    function gerarHorarios() {
      horarioSelect.innerHTML = '<option value="">Escolha um horário</option>';
      for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
          const hora = h.toString().padStart(2, "0");
          const minuto = m.toString().padStart(2, "0");
          const horario = `${hora}:${minuto}`;
          const option = document.createElement("option");
          option.value = horario;
          option.textContent = horario;
          horarioSelect.appendChild(option);
        }
      }
    }

    // Atualizar horários com base na duração
    function atualizarHorarios() {
      const duracao = parseInt(duracaoSelect.value); // Duração em minutos
      const horarioSelecionado = horarioSelect.value;

      if (horarioSelecionado) {
        const [hora, minuto] = horarioSelecionado.split(":").map(Number);
        const fim = new Date(0, 0, 0, hora, minuto + duracao); // Calcula o horário final
        const horaFim = fim.getHours().toString().padStart(2, "0");
        const minutoFim = fim.getMinutes().toString().padStart(2, "0");
        console.log(`Horário selecionado: ${horarioSelecionado} - ${horaFim}:${minutoFim}`);
      }
    }

    // Gerar horários ao carregar a página
    gerarHorarios();

    // Atualizar horários ao mudar a duração
    duracaoSelect.addEventListener("change", atualizarHorarios);
    horarioSelect.addEventListener("change", atualizarHorarios);
  });

document.addEventListener("DOMContentLoaded", () => {
  const horarioSelect = document.getElementById("horario");
  const dataSelecionada = document.getElementById("dataSelecionada");

  // Gerar horários disponíveis (de 08:00 a 22:00)
  function gerarHorarios() {
    horarioSelect.innerHTML = '<option value="">Escolha um horário</option>';
    for (let h = 8; h <= 22; h++) { // Horários das 08:00 às 22:00
      for (let m = 0; m < 60; m += 30) { // Incrementos de 30 minutos
        const hora = h.toString().padStart(2, "0");
        const minuto = m.toString().padStart(2, "0");
        const horario = `${hora}:${minuto}`;
        const option = document.createElement("option");
        option.value = horario;
        option.textContent = horario;
        horarioSelect.appendChild(option);
      }
    }
  }

  // Atualizar horários com base na data selecionada
  function atualizarHorarios() {
    const data = dataSelecionada.value;
    if (!data) {
      alert("Por favor, selecione uma data.");
      return;
    }
    console.log(`Data selecionada: ${data}`);
    gerarHorarios(); // Gerar horários disponíveis para a data selecionada
  }

  // Gerar horários ao mudar a data
  dataSelecionada.addEventListener("change", atualizarHorarios);
});

document.addEventListener("DOMContentLoaded", () => {
  const horaInicioSelect = document.getElementById("horaInicio");
  const horaFimSelect = document.getElementById("horaFim");
  const dataSelecionada = document.getElementById("dataSelecionada");

  // Gerar horários disponíveis (de 08:00 a 22:00)
  function gerarHorarios(selectElement) {
    selectElement.innerHTML = '<option value="">Escolher uma hora</option>';
    for (let h = 8; h <= 22; h++) { // Horários das 08:00 às 22:00
      for (let m = 0; m < 60; m += 30) { // Incrementos de 30 minutos
        const hora = h.toString().padStart(2, "0");
        const minuto = m.toString().padStart(2, "0");
        const horario = `${hora}:${minuto}`;
        const option = document.createElement("option");
        option.value = horario;
        option.textContent = horario;
        selectElement.appendChild(option);
      }
    }
  }

  // Validar seleção de horários
  function validarHorarios() {
    const horaInicio = horaInicioSelect.value;
    const horaFim = horaFimSelect.value;

    if (!horaInicio || !horaFim) {
      console.log("Por favor, selecione ambos os horários.");
      return;
    }

    const [horaInicioH, horaInicioM] = horaInicio.split(":").map(Number);
    const [horaFimH, horaFimM] = horaFim.split(":").map(Number);

    const inicio = new Date(0, 0, 0, horaInicioH, horaInicioM);
    const fim = new Date(0, 0, 0, horaFimH, horaFimM);

    if (fim <= inicio) {
      alert("A hora de fim deve ser posterior à hora de início.");
      horaFimSelect.value = ""; // Resetar a seleção de hora de fim
    } else {
      console.log(`Horário selecionado: ${horaInicio} - ${horaFim}`);
    }
  }

  // Gerar horários ao carregar a página
  gerarHorarios(horaInicioSelect);
  gerarHorarios(horaFimSelect);

  // Validar horários ao mudar a seleção
  horaInicioSelect.addEventListener("change", validarHorarios);
  horaFimSelect.addEventListener("change", validarHorarios);

  // Abrir o pop-up
  window.abrirPopup = function () {
    preencherHorasPopup();
    document.getElementById("popup").style.display = "block";
  };

  // Fechar o pop-up
  window.fecharPopup = function () {
    document.getElementById("popup").style.display = "none";
  };

  // Função de pesquisa
  window.pesquisar = function () {
    const localidade = document.getElementById("localidade").value;
    const data = dataSelecionada.value;
    const horaInicio = horaInicioSelect.value;
    const horaFim = horaFimSelect.value;

    if (!localidade || !data || !horaInicio || !horaFim) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    console.log(`Localidade: ${localidade}, Data: ${data}, Horário: ${horaInicio} - ${horaFim}`);
    alert(`Pesquisa realizada para ${localidade}, ${data}, das ${horaInicio} às ${horaFim}.`);
  };

  // Associar a função de pesquisa ao botão
  document.querySelector(".search-button").addEventListener("click", window.pesquisar);

  // Fechar popup
  function fecharPopup() {
    document.getElementById("popup").style.display = "none";
  }

  // Preencher selects de hora
  function preencherHorasPopup() {
    const horaInicio = document.getElementById("horaInicio");
    const horaFim = document.getElementById("horaFim");
    if (!horaInicio || !horaFim) return;

    horaInicio.innerHTML = '<option value="">Escolher uma hora</option>';
    horaFim.innerHTML = '<option value="">Escolher uma hora</option>';
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hora = h.toString().padStart(2, "0") + ":" + m.toString().padStart(2, "0");
        const opt1 = document.createElement("option");
        opt1.value = hora;
        opt1.textContent = hora;
        horaInicio.appendChild(opt1);

        const opt2 = document.createElement("option");
        opt2.value = hora;
        opt2.textContent = hora;
        horaFim.appendChild(opt2);
      }
    }
  }

  // Confirmar seleção e mostrar na barra
  function confirmarDataHora() {
    const data = document.getElementById("dataSelecionada").value;
    const inicio = document.getElementById("horaInicio").value;
    const fim = document.getElementById("horaFim").value;
    if (!data || !inicio || !fim) {
      alert("Preencha todos os campos!");
      return;
    }
    document.getElementById("dataHoraResumo").textContent = 
      `${data.split('-').reverse().join('/')} | ${inicio} - ${fim}`;
    fecharPopup();
  }

  // Fechar popup ao clicar fora
  window.addEventListener("click", function(e) {
    const popup = document.getElementById("popup");
    if (popup.style.display === "block" && !popup.contains(e.target) && !e.target.closest('.search-col-data')) {
      fecharPopup();
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const localidadeInput = document.getElementById("localidade");
  const sugestoesLocalidade = document.getElementById("sugestoesLocalidade");

  // Lista de localidades disponíveis
  const localidades = ["Aveiro", "Porto", "Coimbra", "Lisboa"];

  // Mostrar sugestões com base no input
  localidadeInput.addEventListener("input", () => {
    const query = localidadeInput.value.toLowerCase();
    sugestoesLocalidade.innerHTML = ""; // Limpar sugestões anteriores

    if (query) {
      const sugestoes = localidades.filter(localidade =>
        localidade.toLowerCase().startsWith(query)
      );

      sugestoes.forEach(sugestao => {
        const li = document.createElement("li");
        li.textContent = sugestao;
        li.addEventListener("click", () => {
          localidadeInput.value = sugestao; // Preencher o campo com a sugestão selecionada
          sugestoesLocalidade.innerHTML = ""; // Limpar sugestões
        });
        sugestoesLocalidade.appendChild(li);
      });

      sugestoesLocalidade.style.display = sugestoes.length ? "block" : "none";
    } else {
      sugestoesLocalidade.style.display = "none";
    }
  });

  // Fechar a lista de sugestões ao clicar fora
  document.addEventListener("click", (e) => {
    if (!localidadeInput.contains(e.target) && !sugestoesLocalidade.contains(e.target)) {
      sugestoesLocalidade.innerHTML = "";
      sugestoesLocalidade.style.display = "none";
    }
  });
});

