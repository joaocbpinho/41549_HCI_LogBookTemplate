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

  // ========== GERAR OPÇÕES DE HORÁRIO ==========
  function gerarOpcoesHorario(selectElement) {
    for (let hora = 0; hora < 24; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const option = document.createElement("option");
        const horaFormatada = hora.toString().padStart(2, "0");
        const minutoFormatado = minuto.toString().padStart(2, "0");
        option.value = `${horaFormatada}:${minutoFormatado}`;
        option.textContent = `${horaFormatada}:${minutoFormatado}`;
        selectElement.appendChild(option);
      }
    }
  }

  // Preencher os selects de hora de início e fim
  const horaInicioSelect = document.getElementById("horaInicio");
  const horaFimSelect = document.getElementById("horaFim");

  if (horaInicioSelect && horaFimSelect) {
    gerarOpcoesHorario(horaInicioSelect);
    gerarOpcoesHorario(horaFimSelect);
  }
});

// Função auxiliar para converter "HH:MM" em minutos desde a meia-noite
function parseTime(timeStr) {
  if (!timeStr) return -1; // Retorna -1 para hora inválida ou vazia
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Função para atualizar as opções de Hora Fim com base na Hora Início
function atualizarOpcoesHoraFim() {
  const horaInicioSelect = document.getElementById('horaInicio');
  const horaFimSelect = document.getElementById('horaFim');
  const inicioSelecionadoMin = parseTime(horaInicioSelect.value);
  const fimAtualMin = parseTime(horaFimSelect.value);

  let primeiroValidoEncontrado = false;
  let novoValorFim = ""; // Guarda o valor atual se ainda for válido, ou o primeiro válido

  for (let i = 0; i < horaFimSelect.options.length; i++) {
    const option = horaFimSelect.options[i];
    const optionMin = parseTime(option.value);

    // A opção vazia é sempre válida
    if (option.value === "") {
      option.disabled = false;
      continue;
    }

    // Desabilita se for <= hora de início
    if (inicioSelecionadoMin !== -1 && optionMin <= inicioSelecionadoMin) {
      option.disabled = true;
    } else {
      option.disabled = false;
      // Guarda o primeiro valor válido encontrado
      if (!primeiroValidoEncontrado) {
        primeiroValidoEncontrado = true;
        // Se o valor atual se tornou inválido, usaremos este como fallback
        if (fimAtualMin !== -1 && fimAtualMin <= inicioSelecionadoMin) {
           novoValorFim = option.value;
        } else {
           // Se o valor atual ainda é válido, mantém-no
           novoValorFim = horaFimSelect.value;
        }
      }
    }
  }

  // Se a hora de fim selecionada ficou inválida, redefine para o primeiro válido ou vazio
  if (fimAtualMin !== -1 && inicioSelecionadoMin !== -1 && fimAtualMin <= inicioSelecionadoMin) {
      horaFimSelect.value = novoValorFim || ""; // Usa o primeiro válido ou vazio se não houver nenhum
  } else if (inicioSelecionadoMin === -1) {
      // Se a hora de início foi desmarcada, reabilita tudo e mantém a seleção atual se possível
      for (let i = 0; i < horaFimSelect.options.length; i++) {
          horaFimSelect.options[i].disabled = false;
      }
  }
}

// Função para atualizar as opções de Hora Início com base na Hora Fim
function atualizarOpcoesHoraInicio() {
  const horaInicioSelect = document.getElementById('horaInicio');
  const horaFimSelect = document.getElementById('horaFim');
  const fimSelecionadoMin = parseTime(horaFimSelect.value);
  const inicioAtualMin = parseTime(horaInicioSelect.value);

  let ultimoValidoEncontrado = ""; // Guarda o último valor válido

  for (let i = 0; i < horaInicioSelect.options.length; i++) {
    const option = horaInicioSelect.options[i];
    const optionMin = parseTime(option.value);

    // A opção vazia é sempre válida
    if (option.value === "") {
      option.disabled = false;
      continue;
    }

    // Desabilita se for >= hora de fim
    if (fimSelecionadoMin !== -1 && optionMin >= fimSelecionadoMin) {
      option.disabled = true;
    } else {
      option.disabled = false;
      // Guarda o último valor válido encontrado
      ultimoValidoEncontrado = option.value;
    }
  }

  // Se a hora de início selecionada ficou inválida, redefine para vazio
  if (inicioAtualMin !== -1 && fimSelecionadoMin !== -1 && inicioAtualMin >= fimSelecionadoMin) {
      horaInicioSelect.value = ""; // Força a escolher novamente
  } else if (fimSelecionadoMin === -1) {
       // Se a hora de fim foi desmarcada, reabilita tudo e mantém a seleção atual se possível
      for (let i = 0; i < horaInicioSelect.options.length; i++) {
          horaInicioSelect.options[i].disabled = false;
      }
  }
}

function abrirPopup() {
  const popup = document.getElementById('popup');
  popup.style.display = 'block'; // Exibe o popup

  const horaInicio = document.getElementById('horaInicio');
  const horaFim = document.getElementById('horaFim');

  // Preenche as opções se necessário (só na primeira vez)
  if (horaInicio && horaInicio.options.length === 0) {
    preencherOpcoesTempo(horaInicio);
    // Adiciona listener DEPOIS de preencher
    horaInicio.addEventListener('change', atualizarOpcoesHoraFim);
  }

  if (horaFim && horaFim.options.length === 0) {
    preencherOpcoesTempo(horaFim);
    // Adiciona listener DEPOIS de preencher
    horaFim.addEventListener('change', atualizarOpcoesHoraInicio);
  }

  // Garante que as opções estão atualizadas com base nos valores atuais (caso já existam)
  atualizarOpcoesHoraFim();
  atualizarOpcoesHoraInicio();
}

// Nova função para preencher os selects
function preencherOpcoesTempo(select) {
  // Adicionar opção vazia primeiro
  const optionVazia = document.createElement("option");
  optionVazia.value = "";
  optionVazia.textContent = "";
  select.appendChild(optionVazia);
  
  // Adicionar as horas
  for (let hora = 0; hora < 24; hora++) {
    for (let minuto = 0; minuto < 60; minuto += 30) {
      const option = document.createElement("option");
      const horaFormatada = hora.toString().padStart(2, "0");
      const minutoFormatado = minuto.toString().padStart(2, "0");
      option.value = `${horaFormatada}:${minutoFormatado}`;
      option.textContent = `${horaFormatada}:${minutoFormatado}`;
      select.appendChild(option);
    }
  }
  
  // Garantir que a opção vazia é a selecionada
  select.selectedIndex = 0;
}

function fecharPopup() {
  const popup = document.getElementById('popup');
  popup.style.display = 'none'; // Oculta o pop-up
}

function confirmarDataHora() {
  const data = document.getElementById('dataSelecionada').value;
  const horaInicio = document.getElementById('horaInicio').value;
  const horaFim = document.getElementById('horaFim').value;
  
  // Verificar se todos os campos foram preenchidos
  if (!data || !horaInicio || !horaFim) {
    alert("Por favor, preencha todos os campos (data, hora de início e hora de fim).");
    return;
  }
  
  // Atualizar o resumo na barra de pesquisa
  const dataFormatada = new Date(data).toLocaleDateString('pt-PT');
  document.getElementById('dataHoraResumo').textContent = 
    `${dataFormatada}, ${horaInicio}-${horaFim}`;
  
  fecharPopup();
}

// Funções para o NOVO Popup de Comodidades
function abrirPopupComodidades() {
  const popup = document.getElementById('popupComodidades');
  if (popup) popup.style.display = 'block'; // Mostra o popup de comodidades
}

function fecharPopupComodidades() {
  const popup = document.getElementById('popupComodidades');
  if (popup) popup.style.display = 'none'; // Esconde o popup de comodidades
}

function confirmarComodidades() {
  const comodidadesSelecionadas = [];
  // Seleciona todos os checkboxes com name="comodidades" que estão marcados DENTRO do popup específico
  const checkboxes = document.querySelectorAll('#popupComodidades input[name="comodidades"]:checked'); 

  checkboxes.forEach(checkbox => {
    // Adiciona o valor (ex: "Estacionamento", "Balneários") à lista
    comodidadesSelecionadas.push(checkbox.value); 
  });

  const resumoSpan = document.getElementById('comodidadesResumo');
  if (resumoSpan) {
      if (comodidadesSelecionadas.length > 0) {
        // Mostra os valores selecionados separados por vírgula
        resumoSpan.textContent = comodidadesSelecionadas.join(', '); 
      } else {
        // Se nada for selecionado, volta ao texto padrão
        resumoSpan.textContent = 'Escolher...'; 
      }
  }

  fecharPopupComodidades(); // Fecha o popup após confirmar
}

// --- Funções para o Popup de Desporto ---

// Função para preencher as opções de desporto
function preencherOpcoesDesporto(selectElement) {
  // Limpa opções existentes (exceto se já tiver a vazia)
  while (selectElement.options.length > 0) {
    selectElement.remove(0);
  }

  const desportos = ["Futebol", "Ténis", "Padel", "Basquetebol", "Voleibol"]; // Adicione mais desportos aqui

  // Adicionar opção vazia/padrão
  const optionVazia = document.createElement("option");
  optionVazia.value = "";
  optionVazia.textContent = "Selecione..."; // Texto da opção padrão
  optionVazia.disabled = true; // Opcional: não permitir selecionar esta
  optionVazia.selected = true; // Opcional: começar com esta selecionada
  selectElement.appendChild(optionVazia);

  // Adicionar os desportos
  desportos.forEach(desporto => {
    const option = document.createElement("option");
    option.value = desporto;
    option.textContent = desporto;
    selectElement.appendChild(option);
  });
}

// Função para abrir o Popup de Desporto
function abrirPopupDesporto() {
  const popup = document.getElementById('popupDesporto');
  if (!popup) return;

  const desportoSelect = document.getElementById('desportoSelect');

  // Preenche as opções se for a primeira vez ou se estiver vazio
  if (desportoSelect && desportoSelect.options.length <= 1) { // <=1 para contar a opção padrão
    preencherOpcoesDesporto(desportoSelect);
  }

  popup.style.display = 'block'; // Mostra o popup
}

// Função para fechar o Popup de Desporto
function fecharPopupDesporto() {
  const popup = document.getElementById('popupDesporto');
  if (popup) popup.style.display = 'none'; // Esconde o popup
}

// Função para confirmar a seleção de Desporto
function confirmarDesporto() {
  const desportoSelect = document.getElementById('desportoSelect');
  const desportoSelecionado = desportoSelect.value;

  // Verifica se um desporto válido foi selecionado (não a opção padrão vazia)
  if (!desportoSelecionado) {
    alert("Por favor, selecione um desporto.");
    return;
  }

  const resumoSpan = document.getElementById('desportoResumo');
  if (resumoSpan) {
    resumoSpan.textContent = desportoSelecionado; // Atualiza o texto na barra de pesquisa
  }

  fecharPopupDesporto(); // Fecha o popup
}

