// ========== FUNÇÕES GLOBAIS (MODAIS, POPUPS, SIDEBAR, ETC.) ==========

// --- Funções Modais (Saldo, Login, Criar Equipa) ---
function abrirModalSaldo() {
  const modal = document.getElementById("modalAdicionarSaldo");
  if (modal) modal.style.display = "block";
}
function fecharModalSaldo() {
  const modal = document.getElementById("modalAdicionarSaldo");
  if (modal) modal.style.display = "none";
}
function adicionarSaldo() {
  const valorInput = document.getElementById("valorSaldo");
  const saldoAtualEl = document.getElementById("saldoAtual");
  if (!valorInput || !saldoAtualEl) return;

  const valorSaldo = parseFloat(valorInput.value);
  if (!isNaN(valorSaldo) && valorSaldo > 0) {
    let saldoAtual = 0;
    // Tenta extrair o valor numérico atual do saldo
    const match = saldoAtualEl.textContent.match(/[\d,.]+/);
    if (match) {
        saldoAtual = parseFloat(match[0].replace(',', '.')); // Trata vírgula como ponto decimal se necessário
    }
    const novoSaldo = saldoAtual + valorSaldo;
    saldoAtualEl.textContent = `${novoSaldo.toFixed(2)}€`; // Formata com 2 casas decimais
    valorInput.value = ''; // Limpa o input
    fecharModalSaldo();
  } else {
    alert("Por favor, insira um valor de saldo válido.");
  }
}

function addEquipa() { // Renomeada para corresponder ao onclick no HTML
    const modal = document.getElementById('modalCriarEquipa');
    if (modal) modal.style.display = 'block';
}
function fecharModal() { // Função genérica para fechar modais (usada no 'x')
    // Fecha todos os modais abertos (ou pode adaptar para fechar um específico)
    document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
}
function criarEquipa() {
    const nomeEquipaInput = document.getElementById('nomeEquipa');
    if (!nomeEquipaInput) return;
    const nomeEquipa = nomeEquipaInput.value.trim();
    if (nomeEquipa) {
        alert(`Equipa "${nomeEquipa}" criada com sucesso! (simulação)`);
        // Aqui adicionaria a lógica para realmente criar e mostrar a equipa
        nomeEquipaInput.value = ''; // Limpa o input
        fecharModal(); // Fecha o modal de criar equipa
    } else {
        alert("Por favor, insira um nome para a equipa.");
    }
}

function abrirModalLogin() {
    const modal = document.getElementById('modalLogin');
    if (modal) modal.style.display = 'block';
}
function fecharModalLogin() {
    const modal = document.getElementById('modalLogin');
    if (modal) modal.style.display = 'none';
}
function fazerLogin() {
    const user = document.getElementById('username').value;
    // Adicionar validação de login real aqui
    alert(`Login simulado para: ${user}`);
    fecharModalLogin();
}


// --- Funções Popup Data/Hora ---

// Função para gerar opções de horário (00:00 - 23:30)
function gerarOpcoesHorario(selectElement) {
  if (!selectElement) return;
  selectElement.innerHTML = ''; // Limpa opções existentes

  // Adiciona uma opção vazia inicial
  const optionVazia = document.createElement("option");
  optionVazia.value = "";
  optionVazia.textContent = "Selecione...";
  optionVazia.disabled = true; // Não pode ser selecionada diretamente
  optionVazia.selected = true; // Começa selecionada
  selectElement.appendChild(optionVazia);

  // Gera horas de 30 em 30 min (ajuste o início/fim/incremento se necessário)
  for (let h = 0; h <= 23; h++) {
    for (let m = 0; m < 60; m += 30) {
      const horaFormatada = String(h).padStart(2, '0');
      const minutoFormatado = String(m).padStart(2, '0');
      const valor = `${horaFormatada}:${minutoFormatado}`;

      const option = document.createElement("option");
      option.value = valor;
      option.textContent = valor;
      selectElement.appendChild(option);
    }
  }
}

// Função auxiliar para converter "HH:MM" em minutos
function parseTime(timeStr) {
  if (!timeStr) return -1;
  const parts = timeStr.split(':');
  if (parts.length !== 2) return -1;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return -1;
  return hours * 60 + minutes;
}

// Atualiza opções de Hora Fim baseado na Hora Início
function atualizarOpcoesHoraFim() {
  const horaInicioSelect = document.getElementById('horaInicio');
  const horaFimSelect = document.getElementById('horaFim');
  if (!horaInicioSelect || !horaFimSelect) return;

  const inicioSelecionadoMin = parseTime(horaInicioSelect.value);
  const fimAtualMin = parseTime(horaFimSelect.value); // Guarda o valor atual para tentar manter

  let primeiroValidoEncontrado = false;
  let novoIndiceSelecionado = -1; // Guarda o índice da opção a ser selecionada

  for (let i = 0; i < horaFimSelect.options.length; i++) {
    const option = horaFimSelect.options[i];
    const optionMin = parseTime(option.value);

    // Opção vazia é sempre válida
    if (option.value === "") {
      option.disabled = false;
      option.style.display = '';
      continue;
    }

    // Desabilita e esconde se for <= hora de início
    if (inicioSelecionadoMin !== -1 && optionMin <= inicioSelecionadoMin) {
      option.disabled = true;
      option.style.display = 'none';
    } else {
      option.disabled = false;
      option.style.display = '';
      // Se a opção atual ainda for válida, marca-a para ser selecionada
      if (optionMin === fimAtualMin) {
          novoIndiceSelecionado = i;
      }
      // Se não encontrámos uma válida ainda, marca esta como a primeira
      if (!primeiroValidoEncontrado) {
          primeiroValidoEncontrado = true;
          // Se a opção atual se tornou inválida, usa esta primeira válida como fallback
          if (novoIndiceSelecionado === -1 || fimAtualMin <= inicioSelecionadoMin) {
              novoIndiceSelecionado = i;
          }
      }
    }
  }

  // Define o índice selecionado (ou 0 se for a opção vazia)
  horaFimSelect.selectedIndex = (novoIndiceSelecionado !== -1) ? novoIndiceSelecionado : 0;

  // Se hora início não estiver selecionada, reabilita tudo
   if (inicioSelecionadoMin === -1) {
       for (let i = 0; i < horaFimSelect.options.length; i++) {
           horaFimSelect.options[i].disabled = false;
           horaFimSelect.options[i].style.display = '';
       }
       // Mantém a seleção atual se possível, senão vai para a vazia (índice 0)
       horaFimSelect.selectedIndex = (fimAtualMin !== -1 && horaFimSelect.options[horaFimSelect.selectedIndex].value === horaFimSelect.value) ? horaFimSelect.selectedIndex : 0;
   }
}

// Atualiza opções de Hora Início baseado na Hora Fim
function atualizarOpcoesHoraInicio() {
    const horaInicioSelect = document.getElementById('horaInicio');
    const horaFimSelect = document.getElementById('horaFim');
    if (!horaInicioSelect || !horaFimSelect) return;

    const fimSelecionadoMin = parseTime(horaFimSelect.value);
    const inicioAtualMin = parseTime(horaInicioSelect.value); // Guarda o valor atual

    let ultimoIndiceValido = -1; // Guarda o índice da última opção válida

    for (let i = 0; i < horaInicioSelect.options.length; i++) {
        const option = horaInicioSelect.options[i];
        const optionMin = parseTime(option.value);

        if (option.value === "") {
            option.disabled = false;
            option.style.display = '';
            continue;
        }

        // Desabilita e esconde se for >= hora de fim
        if (fimSelecionadoMin !== -1 && optionMin >= fimSelecionadoMin) {
            option.disabled = true;
            option.style.display = 'none';
        } else {
            option.disabled = false;
            option.style.display = '';
            ultimoIndiceValido = i; // Atualiza o último índice válido
        }
    }

    // Se a seleção atual se tornou inválida, seleciona a opção vazia (índice 0)
    if (inicioAtualMin !== -1 && fimSelecionadoMin !== -1 && inicioAtualMin >= fimSelecionadoMin) {
        horaInicioSelect.selectedIndex = 0;
    }
    // Se a hora de fim não estiver selecionada, reabilita tudo
    else if (fimSelecionadoMin === -1) {
        for (let i = 0; i < horaInicioSelect.options.length; i++) {
            horaInicioSelect.options[i].disabled = false;
            horaInicioSelect.options[i].style.display = '';
        }
         // Mantém a seleção atual se possível, senão vai para a vazia (índice 0)
        horaInicioSelect.selectedIndex = (inicioAtualMin !== -1 && horaInicioSelect.options[horaInicioSelect.selectedIndex].value === horaInicioSelect.value) ? horaInicioSelect.selectedIndex : 0;
    }
}


function abrirPopup() {
  const popup = document.getElementById('popup');
  if (!popup) return;

  // Define data mínima (só na primeira vez ou se não existir)
  const dataInput = document.getElementById('dataSelecionada');
  if (dataInput && !dataInput.getAttribute('min')) {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    dataInput.min = `${ano}-${mes}-${dia}`;
  }

  // Garante que as opções de hora estão preenchidas (chamar sempre é seguro se a função limpar primeiro)
  gerarOpcoesHorario(document.getElementById('horaInicio'));
  gerarOpcoesHorario(document.getElementById('horaFim'));

  // Atualiza as opções com base nos valores atuais (ou padrão)
  atualizarOpcoesHoraFim();
  atualizarOpcoesHoraInicio();

  popup.style.display = 'block';
}

function fecharPopup() {
  const popup = document.getElementById('popup');
  if (popup) popup.style.display = 'none';
}

function confirmarDataHora() {
  const dataInput = document.getElementById('dataSelecionada');
  const horaInicioSelect = document.getElementById('horaInicio');
  const horaFimSelect = document.getElementById('horaFim');
  const resumoEl = document.getElementById('dataHoraResumo');

  if (!dataInput || !horaInicioSelect || !horaFimSelect || !resumoEl) return;

  const data = dataInput.value;
  const horaInicio = horaInicioSelect.value;
  const horaFim = horaFimSelect.value;

  // Validação
  if (!data || !horaInicio || !horaFim) {
    alert("Por favor, selecione a data, hora de início e hora de fim.");
    return;
  }

  // *** ADICIONAR VALIDAÇÃO: Hora Fim > Hora Início ***
  if (parseTime(horaFim) <= parseTime(horaInicio)) {
      alert("A hora de fim deve ser posterior à hora de início.");
      return; // Não fecha o popup
  }

  // Atualizar resumo
  try {
      const [ano, mes, dia] = data.split('-');
      const dataFormatada = `${dia}/${mes}/${ano}`;
      resumoEl.textContent = `${dataFormatada}, ${horaInicio} - ${horaFim}`;
  } catch (e) {
      resumoEl.textContent = `${data}, ${horaInicio} - ${horaFim}`; // Fallback
  }
   resumoEl.classList.add('selecionado'); // Adiciona classe para feedback visual (definir no CSS)

  fecharPopup();
}

// --- Funções Popup Comodidades ---
function abrirPopupComodidades() {
  const popup = document.getElementById('popupComodidades');
  if (popup) popup.style.display = 'block';
}
function fecharPopupComodidades() {
  const popup = document.getElementById('popupComodidades');
  if (popup) popup.style.display = 'none';
}
function confirmarComodidades() {
  const checkboxes = document.querySelectorAll('#popupComodidades input[name="comodidades"]:checked');
  const comodidadesSelecionadas = Array.from(checkboxes).map(cb => cb.labels[0].textContent.trim()); // Pega o texto do label
  const resumoSpan = document.getElementById('comodidadesResumo');

  if (resumoSpan) {
      if (comodidadesSelecionadas.length > 0) {
        resumoSpan.textContent = comodidadesSelecionadas.join(', ');
        resumoSpan.classList.add('selecionado');
      } else {
        resumoSpan.textContent = 'Escolher...';
        resumoSpan.classList.remove('selecionado');
      }
  }
  fecharPopupComodidades();
}

// --- Funções Popup Desporto ---
function preencherOpcoesDesporto(selectElement) {
    if (!selectElement) return;
    selectElement.innerHTML = ''; // Limpa

    const desportos = ["Futebol", "Ténis", "Padel", "Basquetebol", "Voleibol"];

    const optionVazia = document.createElement("option");
    optionVazia.value = "";
    optionVazia.textContent = "Selecione...";
    optionVazia.disabled = true;
    optionVazia.selected = true;
    selectElement.appendChild(optionVazia);

    desportos.forEach(desporto => {
        const option = document.createElement("option");
        option.value = desporto;
        option.textContent = desporto;
        selectElement.appendChild(option);
    });
}
function abrirPopupDesporto() {
  const popup = document.getElementById('popupDesporto');
  if (!popup) return;
  // Preenche sempre para garantir que está atualizado (limpa primeiro)
  preencherOpcoesDesporto(document.getElementById('desportoSelect'));
  popup.style.display = 'block';
}
function fecharPopupDesporto() {
  const popup = document.getElementById('popupDesporto');
  if (popup) popup.style.display = 'none';
}
function confirmarDesporto() {
  const desportoSelect = document.getElementById('desportoSelect');
  const resumoSpan = document.getElementById('desportoResumo');
  if (!desportoSelect || !resumoSpan) return;

  const desportoSelecionado = desportoSelect.value;
  if (!desportoSelecionado) {
    alert("Por favor, selecione um desporto.");
    return;
  }
  resumoSpan.textContent = desportoSelecionado;
  resumoSpan.classList.add('selecionado');
  fecharPopupDesporto();
}

// --- Autocomplete Localidade ---
const cidadesPortugal = [
  "Lisboa", "Porto", "Vila Nova de Gaia", "Amadora", "Braga", "Funchal",
  "Coimbra", "Setúbal", "Almada", "Queluz", "Agualva-Cacém", "Guimarães",
  "Odivelas", "Aveiro", "Leiria", "Faro", "Évora", "Viseu", "Barreiro",
  "Matosinhos", "Ponta Delgada", "Viana do Castelo", "Santarém", "Beja",
  "Castelo Branco", "Guarda", "Portalegre", "Bragança", "Vila Real"
];
function setupAutocompleteLocalidade() {
    const localidadeInput = document.getElementById('localidade');
    const sugestoesList = document.getElementById('sugestoesLocalidade');
    if (!localidadeInput || !sugestoesList) return;

    localidadeInput.addEventListener('input', function() {
        const inputText = this.value.toLowerCase();
        sugestoesList.innerHTML = '';
        sugestoesList.style.display = 'none';
        if (inputText.length === 0) return;

        const sugestoesFiltradas = cidadesPortugal.filter(cidade =>
            cidade.toLowerCase().startsWith(inputText)
        );

        if (sugestoesFiltradas.length > 0) {
            sugestoesFiltradas.forEach(cidade => {
                const li = document.createElement('li');
                li.textContent = cidade;
                li.addEventListener('click', function() {
                    localidadeInput.value = this.textContent;
                    sugestoesList.innerHTML = '';
                    sugestoesList.style.display = 'none';
                    // Opcional: Atualizar resumo se necessário
                    // atualizarResumoLocalidade(this.textContent);
                });
                sugestoesList.appendChild(li);
            });
            sugestoesList.style.display = 'block';
        }
    });

    // Fechar a lista ao clicar fora
    document.addEventListener('click', function(event) {
        if (!localidadeInput.contains(event.target) && !sugestoesList.contains(event.target)) {
            sugestoesList.style.display = 'none';
        }
    });
}
// Função para atualizar resumo (exemplo, adaptar conforme necessário)
// function atualizarResumoLocalidade(localidade) {
//     const resumoEl = document.getElementById('localidadeResumo'); // Supondo que existe um span para resumo
//     if (resumoEl) {
//         resumoEl.textContent = localidade;
//         resumoEl.classList.add('selecionado');
//     }
// }


// --- Funções Barra Lateral ---
function openProfileSidebar() {
  const sidebar = document.getElementById("profileSidebar");
  const overlay = document.getElementById("sidebarOverlay");
  if (sidebar) sidebar.style.width = "250px";
  if (overlay) overlay.style.display = "block";
  // NÃO abre o painel de notificações automaticamente
}

function closeProfileSidebar() {
  const sidebar = document.getElementById("profileSidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const notificationPanel = document.getElementById('notificationPanel'); // Pega o painel

  // Fecha o painel de notificações se estiver aberto
  if (notificationPanel && notificationPanel.classList.contains('visible')) {
    notificationPanel.classList.remove('visible');
    // Opcional: remover classe 'active' do link se usar
    // const link = document.querySelector('.sidebar a[onclick*="toggleNotificationPanel"]');
    // if (link) link.classList.remove('active');
  }

  if (sidebar) sidebar.style.width = "0";
  if (overlay) overlay.style.display = "none";
}

function fazerLogout() {
  alert("Logout efetuado! (simulação)");
  closeProfileSidebar(); // Fecha a sidebar e o painel de notificações
}

// --- Painel de Notificações ---
function toggleNotificationPanel(linkElement) {
  const notificationPanel = document.getElementById('notificationPanel');
  const sidebar = document.getElementById("profileSidebar");

  if (!notificationPanel || !sidebar) {
    console.error("Painel de notificações ou sidebar não encontrado.");
    return;
  }

  // Só permite abrir o painel se a sidebar estiver aberta
  if (sidebar.style.width === "250px") {
    // Alterna a visibilidade do painel
    notificationPanel.classList.toggle('visible');

    // Opcional: Adicionar/remover classe 'active' no link para feedback visual
    // if (linkElement) {
    //   linkElement.classList.toggle('active', notificationPanel.classList.contains('visible'));
    // }

    console.log("Painel de notificações alternado. Visível:", notificationPanel.classList.contains('visible'));
  } else {
    console.log("Sidebar fechada, não abrindo o painel de notificações.");
    // Garante que o painel está fechado se a sidebar não estiver totalmente aberta
    notificationPanel.classList.remove('visible');
    // if (linkElement) linkElement.classList.remove('active');
  }
}

// --- Função Pesquisar ---
function pesquisar() {
  const filtros = {
    localidade: document.getElementById("localidade").value,
    dataHora: document.getElementById("dataHoraResumo").textContent,
    desporto: document.getElementById("desportoResumo").textContent,
    comodidades: document.getElementById("comodidadesResumo").textContent,
  };

  // Salvar os filtros no localStorage
  localStorage.setItem("filtros", JSON.stringify(filtros));

  // Redirecionar para a página de pesquisa
  window.location.href = "pesquisa/pesquisa.html";
}


// Função para redirecionar para a página de criação de equipa
function criarEquipa() {
  // Salvar dados iniciais no Local Storage (se necessário)
  const equipas = JSON.parse(localStorage.getItem("equipas")) || [];
  localStorage.setItem("equipas", JSON.stringify(equipas));

  // Redirecionar para a página de criação de equipa
  window.location.href = "equipa/equipa.html";
}

// ========== EVENT LISTENER DOMContentLoaded ==========
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado para index.html");

  // --- Adicionar Listeners Essenciais para index.html ---

  // Listener para selects de hora (adicionar UMA VEZ)
  const horaInicioSelect = document.getElementById("horaInicio");
  const horaFimSelect = document.getElementById("horaFim");
  if (horaInicioSelect) {
      horaInicioSelect.addEventListener('change', atualizarOpcoesHoraFim);
  }
  if (horaFimSelect) {
      horaFimSelect.addEventListener('change', atualizarOpcoesHoraInicio);
  }

  // Configurar autocomplete da localidade
  setupAutocompleteLocalidade();

  // Preencher opções iniciais (se aplicável e não feito em abrirPopup)
  // gerarOpcoesHorario(horaInicioSelect); // Já é feito em abrirPopup
  // gerarOpcoesHorario(horaFimSelect);   // Já é feito em abrirPopup
  // preencherOpcoesDesporto(document.getElementById('desportoSelect')); // Já é feito em abrirPopupDesporto

  console.log("Listeners e configurações de index.html aplicados.");
});
