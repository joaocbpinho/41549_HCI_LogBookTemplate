// ========== FUNÇÕES ESPECÍFICAS DA SEARCH BAR E SEUS POPUPS ==========

// --- Funções Popup Data/Hora ---
function gerarOpcoesHorario(selectElement) {
  if (!selectElement) return;
  selectElement.innerHTML = '';

  const optionVazia = document.createElement("option");
  optionVazia.value = "";
  optionVazia.textContent = "Selecione...";
  optionVazia.disabled = true;
  optionVazia.selected = true;
  selectElement.appendChild(optionVazia);

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

function parseTime(timeStr) {
  if (!timeStr) return -1;
  const parts = timeStr.split(':');
  if (parts.length !== 2) return -1;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return -1;
  return hours * 60 + minutes;
}

function atualizarOpcoesHoraFim() {
  const horaInicioSelect = document.getElementById('horaInicio');
  const horaFimSelect = document.getElementById('horaFim');
  if (!horaInicioSelect || !horaFimSelect) return;

  const inicioSelecionadoMin = parseTime(horaInicioSelect.value);
  const fimAtualMin = parseTime(horaFimSelect.value);

  let primeiroValidoEncontrado = false;
  let novoIndiceSelecionado = -1;

  for (let i = 0; i < horaFimSelect.options.length; i++) {
    const option = horaFimSelect.options[i];
    const optionMin = parseTime(option.value);

    if (option.value === "") {
      option.disabled = false;
      option.style.display = '';
      continue;
    }

    if (inicioSelecionadoMin !== -1 && optionMin <= inicioSelecionadoMin) {
      option.disabled = true;
      option.style.display = 'none';
    } else {
      option.disabled = false;
      option.style.display = '';
      if (optionMin === fimAtualMin) {
          novoIndiceSelecionado = i;
      }
      if (!primeiroValidoEncontrado) {
          primeiroValidoEncontrado = true;
          if (novoIndiceSelecionado === -1 || fimAtualMin <= inicioSelecionadoMin) {
              novoIndiceSelecionado = i;
          }
      }
    }
  }

  horaFimSelect.selectedIndex = (novoIndiceSelecionado !== -1) ? novoIndiceSelecionado : 0;

   if (inicioSelecionadoMin === -1) {
       for (let i = 0; i < horaFimSelect.options.length; i++) {
           horaFimSelect.options[i].disabled = false;
           horaFimSelect.options[i].style.display = '';
       }
       horaFimSelect.selectedIndex = (fimAtualMin !== -1 && horaFimSelect.options[horaFimSelect.selectedIndex]?.value === horaFimSelect.value) ? horaFimSelect.selectedIndex : 0;
   }
}

function atualizarOpcoesHoraInicio() {
    const horaInicioSelect = document.getElementById('horaInicio');
    const horaFimSelect = document.getElementById('horaFim');
    if (!horaInicioSelect || !horaFimSelect) return;

    const fimSelecionadoMin = parseTime(horaFimSelect.value);
    const inicioAtualMin = parseTime(horaInicioSelect.value);

    let ultimoIndiceValido = -1;

    for (let i = 0; i < horaInicioSelect.options.length; i++) {
        const option = horaInicioSelect.options[i];
        const optionMin = parseTime(option.value);

        if (option.value === "") {
            option.disabled = false;
            option.style.display = '';
            continue;
        }

        if (fimSelecionadoMin !== -1 && optionMin >= fimSelecionadoMin) {
            option.disabled = true;
            option.style.display = 'none';
        } else {
            option.disabled = false;
            option.style.display = '';
            ultimoIndiceValido = i;
        }
    }

    if (inicioAtualMin !== -1 && fimSelecionadoMin !== -1 && inicioAtualMin >= fimSelecionadoMin) {
        horaInicioSelect.selectedIndex = 0;
    }
    else if (fimSelecionadoMin === -1) {
        for (let i = 0; i < horaInicioSelect.options.length; i++) {
            horaInicioSelect.options[i].disabled = false;
            horaInicioSelect.options[i].style.display = '';
        }
        horaInicioSelect.selectedIndex = (inicioAtualMin !== -1 && horaInicioSelect.options[horaInicioSelect.selectedIndex]?.value === horaInicioSelect.value) ? horaInicioSelect.selectedIndex : 0;
    }
}

function abrirPopup() {
  const popup = document.getElementById('popup');
  if (!popup) return;

  const dataInput = document.getElementById('dataSelecionada');
  if (dataInput && !dataInput.getAttribute('min')) {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    dataInput.min = `${ano}-${mes}-${dia}`;
  }

  // Gera opções apenas quando o popup é aberto
  gerarOpcoesHorario(document.getElementById('horaInicio'));
  gerarOpcoesHorario(document.getElementById('horaFim'));

  // Atualiza as opções com base nos valores atuais (ou nenhum)
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

  if (!data || !horaInicio || !horaFim) {
    alert("Por favor, selecione a data, hora de início e hora de fim.");
    return;
  }

  if (parseTime(horaFim) <= parseTime(horaInicio)) {
      alert("A hora de fim deve ser posterior à hora de início.");
      return;
  }

  try {
      const [ano, mes, dia] = data.split('-');
      const dataFormatada = `${dia}/${mes}/${ano}`;
      resumoEl.textContent = `${dataFormatada}, ${horaInicio} - ${horaFim}`;
  } catch (e) {
      resumoEl.textContent = `${data}, ${horaInicio} - ${horaFim}`;
  }
   resumoEl.classList.add('selecionado');

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
  const comodidadesSelecionadas = Array.from(checkboxes).map(cb => cb.labels[0].textContent.trim());
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
    selectElement.innerHTML = '';

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
  "Castelo Branco", "Guarda", "Portalegre", "Bragança", "Vila Real", "Gafanha da Nazaré"
  // Adicione mais cidades conforme necessário
];
function setupAutocompleteLocalidade() {
    const localidadeInput = document.getElementById('localidade');
    console.log("[Autocomplete] localidadeInput:", localidadeInput); // DEBUG

    // Cria a lista de sugestões dinamicamente se não existir
    let sugestoesList = document.getElementById('sugestoesLocalidade');
    if (!sugestoesList) {
        console.log("[Autocomplete] sugestoesLocalidade não encontrada, criando dinamicamente."); // DEBUG
        sugestoesList = document.createElement('ul');
        sugestoesList.id = 'sugestoesLocalidade';
        sugestoesList.className = 'autocomplete-list'; // Usa a classe CSS definida
        if (localidadeInput && localidadeInput.parentNode) { // DEBUG: Verificar se parentNode existe
            localidadeInput.parentNode.appendChild(sugestoesList);
            console.log("[Autocomplete] sugestoesLocalidade adicionada ao DOM."); // DEBUG
        } else {
            console.error("[Autocomplete] localidadeInput ou seu parentNode não existe para adicionar a lista de sugestões."); // DEBUG
            return; // Não continuar se não puder adicionar a lista
        }
    } else {
        console.log("[Autocomplete] sugestoesLocalidade encontrada no DOM:", sugestoesList); // DEBUG
    }

    if (!localidadeInput) {
        console.error("[Autocomplete] Input de localidade não encontrado!"); // DEBUG
        return;
    }

    localidadeInput.addEventListener('input', function() {
        const inputText = this.value.toLowerCase();
        console.log("[Autocomplete] Input alterado:", inputText); // DEBUG

        sugestoesList.innerHTML = ''; // Limpa sugestões anteriores
        // sugestoesList.classList.add('hidden'); // Esconde por defeito, mostra se houver sugestões

        if (inputText.length === 0) {
            console.log("[Autocomplete] Input vazio, escondendo lista."); // DEBUG
            sugestoesList.classList.add('hidden');
            return;
        }

        const sugestoesFiltradas = cidadesPortugal.filter(cidade =>
            cidade.toLowerCase().startsWith(inputText)
        );
        console.log("[Autocomplete] Sugestões filtradas:", sugestoesFiltradas); // DEBUG

        if (sugestoesFiltradas.length > 0) {
            sugestoesFiltradas.forEach(cidade => {
                const li = document.createElement('li');
                li.textContent = cidade;
                li.addEventListener('click', function() {
                    localidadeInput.value = this.textContent;
                    sugestoesList.innerHTML = '';
                    sugestoesList.classList.add('hidden');
                    console.log("[Autocomplete] Sugestão clicada:", this.textContent); // DEBUG
                });
                sugestoesList.appendChild(li);
            });
            sugestoesList.classList.remove('hidden'); // Mostra a lista
            console.log("[Autocomplete] Lista de sugestões mostrada."); // DEBUG
        } else {
            sugestoesList.classList.add('hidden'); // Esconde se não houver sugestões
            console.log("[Autocomplete] Nenhuma sugestão, lista escondida."); // DEBUG
        }
    });

    // Fecha a lista se clicar fora
    document.addEventListener('click', function(event) {
        if (localidadeInput && sugestoesList && !localidadeInput.contains(event.target) && !sugestoesList.contains(event.target)) {
            sugestoesList.classList.add('hidden');
            // console.log("[Autocomplete] Clique fora, lista escondida."); // DEBUG (pode ser muito verboso)
        }
    });
    console.log("[Autocomplete] setupAutocompleteLocalidade concluído."); // DEBUG
}

// --- Função Pesquisar ---
function pesquisar() {
  const localidade = document.getElementById("localidade").value;
  const dataHoraResumoEl = document.getElementById("dataHoraResumo");
  const comodidadesResumoEl = document.getElementById("comodidadesResumo");
  const desportoResumoEl = document.getElementById("desportoResumo");

  const dataHoraResumo = dataHoraResumoEl.classList.contains('selecionado') ? dataHoraResumoEl.textContent : '';
  const comodidadesResumo = comodidadesResumoEl.classList.contains('selecionado') ? comodidadesResumoEl.textContent : '';
  const desportoResumo = desportoResumoEl.classList.contains('selecionado') ? desportoResumoEl.textContent : '';


  const filtros = {
    localidade: localidade,
    dataHora: dataHoraResumo,
    // Divide as comodidades apenas se houver texto selecionado
    comodidades: comodidadesResumo ? comodidadesResumo.split(', ') : [],
    desporto: desportoResumo,
  };
  console.log("Filtros aplicados:", filtros);

  // Guarda os filtros no localStorage para que renderizarResultados possa aceder ao desporto
  localStorage.setItem('filtrosPesquisa', JSON.stringify(filtros));

  // Garante que 'todosOsCampos' está carregado antes de filtrar
  if (typeof todosOsCampos === 'undefined' || todosOsCampos.length === 0) {
      console.warn("'todosOsCampos' não carregados. Tentando carregar e pesquisar...");
      carregarCampos().then(() => {
          const resultadosFiltrados = filtrarCampos(todosOsCampos, filtros);
          renderizarResultados(resultadosFiltrados); // Passa os resultados para renderizar
      }).catch(error => {
          console.error("Erro ao carregar campos durante a pesquisa:", error);
          // Opcional: Mostrar mensagem de erro ao utilizador
      });
  } else {
      const resultadosFiltrados = filtrarCampos(todosOsCampos, filtros);
      console.log("Resultados filtrados:", resultadosFiltrados);
      renderizarResultados(resultadosFiltrados); // Passa os resultados para renderizar
  }
}

// ========== LÓGICA DE PESQUISA E RESULTADOS NO INDEX ==========

// Variável global para armazenar os campos carregados
let todosOsCampos = [];

// Função para carregar os campos do JSON
async function carregarCampos() {
  // Evita recarregar se já tiverem sido carregados
  if (todosOsCampos.length > 0) {
      console.log("Campos já estavam carregados.");
      return Promise.resolve(); // Retorna uma promessa resolvida
  }
  try {
    // Ajuste o caminho se 'campos.json' não estiver na raiz relativa a 'index.html'
    const response = await fetch('../campo/campos.json'); // Caminho relativo ao HTML
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    todosOsCampos = await response.json();
    console.log("Campos carregados com sucesso:", todosOsCampos);
  } catch (error) {
    console.error("Erro ao carregar campos.json:", error);
    const resultsContainer = document.getElementById("resultsContainer");
    if (resultsContainer) {
      resultsContainer.innerHTML = `<p>Ocorreu um erro ao carregar os campos necessários para a pesquisa.</p>`;
      document.getElementById("searchResultsSection").style.display = 'block';
    }
    // Rejeita a promessa para que o .then em pesquisar() não execute filtrarCampos
    return Promise.reject(error);
  }
}

// Função para filtrar os campos com base nos critérios
function filtrarCampos(campos, filtros) {
    const filtroLocalidade = filtros.localidade ? filtros.localidade.toLowerCase() : '';
    const filtroDesporto = filtros.desporto ? filtros.desporto.toLowerCase() : '';
    const filtroComodidades = filtros.comodidades || [];
    // TODO: Implementar filtro de Data/Hora se necessário

    return campos.filter((campo) => {
        const localidadeCampo = campo.localidade ? campo.localidade.toLowerCase() : '';
        const desportosCampo = Array.isArray(campo.desporto) ? campo.desporto.map(d => d.toLowerCase()) : [];
        const comodidadesCampo = Array.isArray(campo.comodidades) ? campo.comodidades.map(c => c.trim().toLowerCase()) : [];

        const correspondeLocalidade = !filtroLocalidade || localidadeCampo.includes(filtroLocalidade);
        const correspondeDesporto = !filtroDesporto || desportosCampo.includes(filtroDesporto);
        const correspondeComodidades = filtroComodidades.length === 0 || filtroComodidades.every(comFiltro =>
            comodidadesCampo.includes(comFiltro.trim().toLowerCase())
        );
        // const correspondeDataHora = true; // Adicionar lógica aqui

        return correspondeLocalidade && correspondeDesporto && correspondeComodidades /* && correspondeDataHora */;
    });
}

// Função para renderizar os resultados da pesquisa
function renderizarResultados(resultados) {
    const resultsContainer = document.getElementById("resultsContainer");
    const searchResultsSection = document.getElementById("searchResultsSection");
    if (!resultsContainer || !searchResultsSection) return;

    resultsContainer.classList.add("cards");
    resultsContainer.innerHTML = ""; // Limpa resultados anteriores

    // Recupera o desporto selecionado nos filtros para usar na exibição
    const filtrosGuardados = JSON.parse(localStorage.getItem('filtrosPesquisa')) || {};
    const desportoFiltrado = filtrosGuardados.desporto || ''; // Pega o desporto do filtro guardado

    if (resultados.length === 0) {
        resultsContainer.innerHTML = `<p>Nenhum resultado encontrado para os filtros aplicados.</p>`;
        resultsContainer.classList.remove("cards"); // Remove estilo grid se vazio
    } else {
        resultados.forEach((resultado) => {
            const card = document.createElement("div");
            card.className = "card";

            let imagePath = '../images/placeholder.jpg'; // Default placeholder
            // MODIFICAÇÃO IMPORTANTE: Usar o array 'imagens' e pegar a primeira
            if (Array.isArray(resultado.imagens) && resultado.imagens.length > 0) {
                imagePath = resultado.imagens[0];
            } else if (resultado.imagem) { // Fallback para o campo 'imagem' antigo se existir
                imagePath = resultado.imagem;
            }

            // Determina qual desporto mostrar: o filtrado ou o primeiro do campo
            const desportoParaMostrar = desportoFiltrado || (Array.isArray(resultado.desporto) && resultado.desporto.length > 0 ? resultado.desporto[0] : 'N/D');
            const precoStr = typeof resultado.preco_hora === 'number' ? resultado.preco_hora.toFixed(2) + '€' : 'N/D';

            // Modifica o innerHTML para o formato desejado
            card.innerHTML = `
                <img src="${imagePath}" alt="${resultado.nome || 'Campo Desportivo'}">
                <div class="card-content">
                    <p>${resultado.nome || 'Campo Desportivo'}</p>
                    <p>${resultado.localidade || 'N/D'} - ${desportoParaMostrar}</p>
                    <p>Preço/hora - ${precoStr}</p>
                </div>
                <div class="buttons">
                  <button onclick="irParaDetalhes(${resultado.id})">Mais Detalhes</button>
                </div>
              `;
            resultsContainer.appendChild(card);
        });
    }
    // Garante que a secção de resultados está visível
    searchResultsSection.classList.remove('hidden');
}

// Função para navegar para a página de detalhes do campo
function irParaDetalhes(campoId) {
    // Caminho relativo ao index.html
    const url = `../campo/campo.html?id=${campoId}`;
    window.location.href = url;
}
// Torna a função acessível globalmente para ser chamada pelo onclick no HTML
window.irParaDetalhes = irParaDetalhes;


// ========== INICIALIZAÇÃO E EVENT LISTENERS (Específicos da Search Bar) ==========

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM carregado para search-bar.js");

    // Carrega os dados dos campos necessários para a pesquisa e autocomplete
    carregarCampos().catch(error => {
        console.error("Falha no carregamento inicial dos campos:", error);
    });

    // Configura o autocomplete da localidade
    setupAutocompleteLocalidade(); // Certifique-se que esta chamada está aqui e descomentada

    // Adiciona listeners para os selects de hora DENTRO do popup de data/hora
    // Estes listeners são adicionados aqui porque os elementos estão no DOM principal,
    // mas a lógica de atualização pertence à funcionalidade do popup da search bar.
    const horaInicioSelect = document.getElementById("horaInicio");
    const horaFimSelect = document.getElementById("horaFim");
    if (horaInicioSelect) {
        horaInicioSelect.addEventListener('change', atualizarOpcoesHoraFim);
    }
    if (horaFimSelect) {
        horaFimSelect.addEventListener('change', atualizarOpcoesHoraInicio);
    }

    // Nota: As funções como abrirPopup, confirmarDataHora, pesquisar, etc.,
    // são chamadas diretamente pelos 'onclick' no HTML.

    console.log("Listeners e configurações de search-bar.js aplicados.");
});