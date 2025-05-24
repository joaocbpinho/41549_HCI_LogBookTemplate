let todasReservas = [];
let todosCampos = []; // Irá guardar os dados de campos.json

// Variáveis para guardar seleções do modal de reserva
let selectedDate = null; // Deve ser um objeto Date
let selectedTime = null; // Deve ser uma string como "HH:MM - HH:MM"
let selectedAmenities = []; // Deve ser um array de strings com os nomes das comodidades
const equipamentoSelecionado = { id: null, nome: null, preco: 0 };

// NOVO: Variável para guardar detalhes da reserva pendente de confirmação
let reservaPendenteParaConfirmacao = null;

// NOVO: Referência ao modal de confirmação
const confirmacaoReservaModal = document.getElementById("confirmacaoReservaModal");

// Variáveis globais para o carrossel dinâmico
let campoAtualImagens = [];
let currentImageIndex = 0;
const campoImageElement = document.getElementById("campoImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
let equipasSelecionadas = []; // Armazena as equipas selecionadas

function carregarEquipasParaCampo(desportosCampo) {
    console.log("🔄 Função carregarEquipasParaCampo chamada com desportos:", desportosCampo);

    const equipasGuardadas = localStorage.getItem('equipas');
    const convidarContainer = document.querySelector('.convidar-container');
    console.log("✅ Desportos do campo (original):", desportosCampo);
    console.log("📦 Equipas no localStorage (string):", equipasGuardadas);

    if (!equipasGuardadas || !convidarContainer) {
        console.warn("Nenhuma equipa encontrada ou container de equipas não disponível.");
        if (convidarContainer) { // Still add the "+" button if container exists
             convidarContainer.innerHTML = ''; // Clear previous content
             const addButton = document.createElement('button');
             addButton.className = 'convidar-btn add-equipa-btn'; // Added specific class for styling if needed
             addButton.textContent = '+';
             addButton.title = 'Adicionar/Gerir Equipas';
             addButton.onclick = () => {
                 window.location.href = "../equipa/equipa.html";
             };
             convidarContainer.appendChild(addButton);
        }
        return;
    }

    const equipas = JSON.parse(equipasGuardadas);

    const equipasFiltradas = equipas.filter(equipa => {
        // Ensure equipa.desporto exists and is a string before calling trim/toLowerCase
        const desportoEquipa = equipa.desporto && typeof equipa.desporto === 'string' 
                               ? equipa.desporto.trim().toLowerCase() 
                               : 'indefinido'; // or some other default/error handling

        // Inclui sempre equipas com desporto "outro"
        if (desportoEquipa === "outro") {
            return true;
        }

        // Verifica se o desporto da equipa corresponde a algum desporto do campo
        // Ensure desportosCampo is an array and its elements are strings
        return Array.isArray(desportosCampo) && desportosCampo.some(desportoCampo =>
            typeof desportoCampo === 'string' && desportoEquipa === desportoCampo.trim().toLowerCase()
        );
    });

    console.log("🎯 Equipas filtradas:", equipasFiltradas);

    // Limpar e renderizar
    convidarContainer.innerHTML = '';
    const equipaInfoEl = document.getElementById("equipaSelecionadaInfo");


    equipasFiltradas.forEach(equipa => {
        const button = document.createElement('button');
        button.className = 'convidar-btn';
        button.textContent = equipa.nome;
        button.dataset.equipaNome = equipa.nome; // Store nome for easier check

        button.onclick = () => {
            if (button.classList.contains('selecionada')) {
                // Se já está selecionada, deseleciona
                button.classList.remove('selecionada');
                equipasSelecionadas = [];
                if (equipaInfoEl) {
                    equipaInfoEl.textContent = "Nenhuma equipa selecionada.";
                    delete equipaInfoEl.dataset.nomeEquipa;
                }
                console.log(`Equipa "${equipa.nome}" deselecionada!`);
            } else {
                // Se não está selecionada, seleciona esta e deseleciona outras
                document.querySelectorAll('.convidar-btn.selecionada').forEach(btn => btn.classList.remove('selecionada'));
                button.classList.add('selecionada');
                equipasSelecionadas = [equipa]; // Armazena o objeto equipa completo
                if (equipaInfoEl) {
                    equipaInfoEl.textContent = equipa.nome;
                    equipaInfoEl.dataset.nomeEquipa = equipa.nome;
                }
                console.log(`Equipa "${equipa.nome}" selecionada!`);
            }
        };

        convidarContainer.appendChild(button);
    });

    // Botão de adicionar nova equipa (ou ir para a página de equipas)
    const addButton = document.createElement('button');
    addButton.className = 'convidar-btn add-equipa-btn'; // Added specific class for styling if needed
    addButton.textContent = '+';
    addButton.title = 'Adicionar/Gerir Equipas';
    addButton.onclick = () => {
        window.location.href = "../equipa/equipa.html";
    };
    convidarContainer.appendChild(addButton);
}

function selecionarEquipa(equipa) {
    exibirMensagem("sucesso", `Equipa "${equipa.nome}" selecionada! Convites serão enviados aos membros aquando a reserva.`);
};

function exibirMensagem(tipo, mensagem) {
    const mensagemDiv = document.createElement("div");
    mensagemDiv.className = `mensagem-${tipo}`; // "mensagem-sucesso" ou "mensagem-erro"
    mensagemDiv.textContent = mensagem;

    document.body.appendChild(mensagemDiv);

    // Remover a mensagem após 3 segundos
    setTimeout(() => {
        mensagemDiv.remove();
    }, 3000);
}

window.abrirEquipamentos = function () {
    const comodidadesModalEl = document.getElementById("comodidadesModal");
    if (comodidadesModalEl) {
        const urlParams = new URLSearchParams(window.location.search);
        const campoId = urlParams.get('id');
        const campoSelecionado = todosCampos.find(campo => campo.id === parseInt(campoId));

        if (campoSelecionado) {
            const equipamentos = {
                Futebol: [
                    { nome: "Bolas", icone: "fas fa-futbol" },
                    { nome: "Coletes", icone: "fas fa-shirt" },
                    { nome: "Cones", icone: "../images/cone.png" } // Caminho para o PNG
                ],
                Ténis: [
                    { nome: "Raquetes", icone: "fas fa-table-tennis" },
                    { nome: "Bolas de Ténis", icone: "fas fa-futbol" },
                    { nome: "Rede", icone: "fas fa-border-all" }
                ],
                Padel: [
                    { nome: "Raquetes de Padel", icone: "fas fa-table-tennis" },
                    { nome: "Bolas de Padel", icone: "fas fa-futbol" }
                ],
                Basquetebol: [
                    { nome: "Bolas de Basquetebol", icone: "fas fa-basketball-ball" },
                    { nome: "Coletes", icone: "fas fa-shirt" }
                ],
                Voleibol: [
                    { nome: "Bolas de Voleibol", icone: "fas fa-volleyball-ball" },
                    { nome: "Rede", icone: "fas fa-border-all" }
                ],
                Andebol: [
                    { nome: "Bolas de Andebol", icone: "fas fa-futbol" },
                    { nome: "Coletes", icone: "fas fa-shirt" }
                ]
            };

            const equipamentosDesporto = equipamentos[campoSelecionado.desporto[0]] || [];

            const listaComodidades = comodidadesModalEl.querySelector(".comodidades-lista");
            listaComodidades.innerHTML = ''; // Limpa a lista antes de adicionar

            equipamentosDesporto.forEach(equipamento => {
                const li = document.createElement("li");
                li.className = "equipamento";
                li.setAttribute("data-nome", equipamento.nome);

                const nomeLower = equipamento.nome.toLowerCase();
                const isIndividualComQuantidade =
                    nomeLower.includes("colete") ||
                    nomeLower.includes("raquete de padel") ||
                    nomeLower.includes("raquetes de padel") ||
                    nomeLower.includes("raquete") ||
                    nomeLower.includes("raquetes");

                // Ícone
                let icon;
                if (equipamento.icone.endsWith && equipamento.icone.endsWith(".png")) {
                    icon = document.createElement("img");
                    icon.src = equipamento.icone;
                    icon.alt = equipamento.nome;
                    icon.style.width = "24px";
                    icon.style.height = "24px";
                    icon.style.marginRight = "10px";
                } else {
                    icon = document.createElement("i");
                    icon.className = equipamento.icone;
                    icon.style.marginRight = "10px";
                }
                li.appendChild(icon);

                // Nome
                li.appendChild(document.createTextNode(` ${equipamento.nome} `));

                if (
                    equipamento.nome.toLowerCase().includes("bolas") ||
                    equipamento.nome.toLowerCase().includes("rede") ||
                    equipamento.nome.toLowerCase().includes("bola de ténis") ||
                    equipamento.nome.toLowerCase().includes("bola de padel") ||
                    equipamento.nome.toLowerCase().includes("bola de basquetebol") ||
                    equipamento.nome.toLowerCase().includes("bola de voleibol") ||
                    equipamento.nome.toLowerCase().includes("bola de andebol")
                ) {
                    li.setAttribute("data-tipo", "coletivo");
                    const span = document.createElement("span");
                    span.style.color = "green";
                    span.textContent = "(Coletivo +1€)";
                    li.appendChild(span);
                } else if (isIndividualComQuantidade) {
                    li.setAttribute("data-tipo", "individual");
                    const span = document.createElement("span");
                    span.style.color = "blue";
                    span.textContent = "(Individual +1€/un)";
                    li.appendChild(span);

                    // Botão -
                    const btnMenos = document.createElement("button");
                    btnMenos.type = "button";
                    btnMenos.textContent = "-";
                    btnMenos.style.marginLeft = "8px";
                    btnMenos.onclick = function (e) {
                        e.stopPropagation();
                        let qtd = parseInt(inputQtd.value) || 1;
                        if (qtd > 1) inputQtd.value = qtd - 1;
                    };

                    // Input de quantidade
                    const inputQtd = document.createElement("input");
                    inputQtd.type = "number";
                    inputQtd.min = "1";
                    inputQtd.value = "1";
                    inputQtd.className = "quantidade-equipamento";
                    inputQtd.style.width = "40px";
                    inputQtd.style.margin = "0 6px";
                    inputQtd.onclick = function (e) { e.stopPropagation(); };

                    // Botão +
                    const btnMais = document.createElement("button");
                    btnMais.type = "button";
                    btnMais.textContent = "+";
                    btnMais.onclick = function (e) {
                        e.stopPropagation();
                        let qtd = parseInt(inputQtd.value) || 1;
                        inputQtd.value = qtd + 1;
                    };

                    li.appendChild(btnMenos);
                    li.appendChild(inputQtd);
                    li.appendChild(btnMais);
                } else {
                    li.setAttribute("data-tipo", "individual");
                    const span = document.createElement("span");
                    span.style.color = "blue";
                    span.textContent = "(Individual +1€)";
                    li.appendChild(span);
                }

                li.onclick = function (e) {
                    // Não marcar/desmarcar ao clicar nos botões ou input de quantidade
                    if (e.target.tagName.toLowerCase() === "button" || e.target.tagName.toLowerCase() === "input") return;
                    this.classList.toggle("selecionada");
                };
                listaComodidades.appendChild(li);


                // Adicionar os equipamentos à lista           

                // Verificar se o ícone é uma imagem PNG ou um ícone Font Awesome
                if (equipamento.icone.endsWith(".png")) {
                    const img = document.createElement("img");
                    img.src = equipamento.icone;
                    img.alt = equipamento.nome;
                    img.style.width = "24px"; // Ajuste o tamanho da imagem conforme necessário
                    img.style.height = "24px";
                    img.style.marginRight = "10px";
                    li.appendChild(img);
                } else {
                    const icon = document.createElement("i");
                    icon.className = equipamento.icone;
                }
            });

            // Atualizar o título do modal para "Equipamentos"
            const modalTitle = comodidadesModalEl.querySelector("h2");
            modalTitle.textContent = "Equipamentos";
        }

        comodidadesModalEl.style.display = "block";
    } else {
        console.error("Modal de comodidades não encontrado no DOM.");
    }
};
window.fecharEquipamentoModal = function () {
    const equipamentoModal = document.getElementById("equipamentoModal");
    equipamentoModal.style.display = "none"; // Fecha o modal
};

function selecionarEquipamento(equipamento) {
    exibirMensagem("sucesso", `Equipamento "${equipamento}" selecionado!`);
    window.fecharEquipamentoModal();
}
async function carregarReservas(campoIdParaFiltrar) {
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

function guardarReservasNoLocalStorage(novaReserva) {
    const reservasExistentes = JSON.parse(localStorage.getItem('todasReservas')) || []; // ALTERADO para 'todasReservas'
    reservasExistentes.push(novaReserva);
    localStorage.setItem('todasReservas', JSON.stringify(reservasExistentes)); // ALTERADO para 'todasReservas'
}

function atualizarCarrossel() {
    if (campoImageElement && campoAtualImagens.length > 0) {
        campoImageElement.src = campoAtualImagens[currentImageIndex];
        campoImageElement.alt = `Imagem ${currentImageIndex + 1} do campo`;
    }
    if (prevBtn) prevBtn.style.display = campoAtualImagens.length > 1 ? 'block' : 'none';
    if (nextBtn) nextBtn.style.display = campoAtualImagens.length > 1 ? 'block' : 'none';
}

async function carregarDadosCampoEConfigurarPagina(id) {
    try {
        if (todosCampos.length === 0) {
            const response = await fetch('campos.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} ao buscar campos.json`);
            }
            todosCampos = await response.json();
        }

        const campoSelecionado = todosCampos.find(campo => campo.id === parseInt(id));
        console.log("Campo selecionado:", campoSelecionado); // Verifica o campo carregado

        if (campoSelecionado) {
            document.title = `${campoSelecionado.nome} - Play Smart`;
            console.log("Função chamada para o desporto:", campoSelecionado.desporto);
            carregarEquipasParaCampo(campoSelecionado.desporto);

            const campoTituloElement = document.querySelector('.campo-section h1');
            if (campoTituloElement) {
                campoTituloElement.textContent = campoSelecionado.nome;

            }

            campoAtualImagens = campoSelecionado.imagens && campoSelecionado.imagens.length > 0 ? campoSelecionado.imagens : ['../images/default_campo.png'];
            currentImageIndex = 0;
            atualizarCarrossel();

            const infoSection = document.querySelector('.campo-info');
            if (infoSection) {
                infoSection.innerHTML = `
                    <h2><i class="fas fa-info-circle"></i> Informações do Campo</h2>
                    <p id="campoDescricao"><i class="fas fa-futbol"></i> ${campoSelecionado.descricao || 'Descrição não disponível.'}</p>
                    <div id="campoComodidadesLista">
                        ${campoSelecionado.comodidades ? campoSelecionado.comodidades.map(c => {
                    let iconClass = 'fa-question-circle'; // Ícone padrão caso não seja identificado
                    if (c.toLowerCase().includes('balneário')) iconClass = 'fa-shower';
                    else if (c.toLowerCase().includes('equipamento')) iconClass = 'fa-shirt';
                    else if (c.toLowerCase().includes('estacionamento')) iconClass = 'fa-parking';
                    else if (c.toLowerCase().includes('iluminação')) iconClass = 'fa-lightbulb';
                    else if (c.toLowerCase().includes('wc')) iconClass = 'fa-restroom';
                    else if (c.toLowerCase().includes('bar')) iconClass = 'fa-martini-glass';

                    return `<p><i class="fas ${iconClass}"></i> ${c}</p>`;
                }).join('') : '<p>Nenhuma comodidade listada.</p>'}
                    </div>
                    <p id="campoCapacidade"><i class="fas fa-users"></i> Capacidade: ${campoSelecionado.capacidade || 'N/A'} jogadores</p>
                    <p id="campoPreco"><i class="fas fa-euro-sign"></i> Preço por hora: ${parseFloat(campoSelecionado.preco_hora).toFixed(2)}€</p>
                    
                    <h2><i class="fas fa-map-marker-alt"></i> Endereço</h2>
                    <p id="campoMorada">${campoSelecionado.morada || 'Endereço não disponível.'}</p>
                    <div class="campo-actions">
                        <button class="action-btn" onclick="mostrarDirecoes('${campoSelecionado.morada}')">Direções</button>
                        <button class="action-btn" onclick="copiarEndereco('${campoSelecionado.morada}')">Copiar</button>
                    </div>
                `;
            }

            const comodidadesListaModal = document.querySelector('#comodidadesModal .comodidades-lista');
            if (comodidadesListaModal) {
                comodidadesListaModal.innerHTML = '';
                if (campoSelecionado.comodidades && campoSelecionado.comodidades.length > 0) {
                    campoSelecionado.comodidades.forEach(comodidade => {
                        const li = document.createElement('li');
                        li.className = 'comodidade';
                        li.setAttribute('data-nome', comodidade);
                        li.onclick = function () { selecionarComodidade(this); };

                        let iconClass = 'fa-question-circle';
                        if (comodidade.toLowerCase().includes('balneário')) iconClass = 'fa-shower';
                        else if (comodidade.toLowerCase().includes('equipamento')) iconClass = 'fa-shirt';
                        else if (comodidade.toLowerCase().includes('estacionamento')) iconClass = 'fa-parking';
                        else if (comodidade.toLowerCase().includes('iluminação')) iconClass = 'fa-lightbulb';
                        else if (comodidade.toLowerCase().includes('wc')) iconClass = 'fa-restroom';
                        else if (comodidade.toLowerCase().includes('bar')) iconClass = 'fa-martini-glass';

                        li.innerHTML = `<i class="fas ${iconClass}"></i> ${comodidade}`;
                        comodidadesListaModal.appendChild(li);
                    });
                } else {
                    comodidadesListaModal.innerHTML = '<li>Nenhuma comodidade específica para este campo.</li>';
                }
            }
        } else {
            console.error('Campo não encontrado com o ID:', id);
            const campoTituloElement = document.querySelector('.campo-section h1');
            if (campoTituloElement) campoTituloElement.textContent = "Campo não encontrado";
            if (campoImageElement) campoImageElement.src = '../images/default_campo_error.png';
            if (campoImageElement) campoImageElement.alt = "Campo não encontrado";
            const infoSection = document.querySelector('.campo-info');
            if (infoSection) infoSection.innerHTML = "<p>Não foi possível carregar as informações do campo.</p>";
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao carregar dados do campo:', error);
        const campoTituloElement = document.querySelector('.campo-section h1');
        if (campoTituloElement) campoTituloElement.textContent = "Erro ao carregar campo";
        if (campoImageElement) campoImageElement.src = '../images/default_campo_error.png';
        if (campoImageElement) campoImageElement.alt = "Erro ao carregar campo";
    }
}

window.mostrarDirecoes = function (endereco) {
    if (endereco) {
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`, '_blank');
    } else {
        exibirMensagem("erro", "Endereço não disponível para mostrar direções.");
    }
}

window.copiarEndereco = function (endereco) {
    if (endereco) {
        navigator.clipboard.writeText(endereco).then(() => {
            exibirMensagem("sucesso", 'Endereço copiado!');
        }).catch(err => {
            console.error('Erro ao copiar endereço: ', err);
            exibirMensagem("erro", 'Erro ao copiar endereço.');
        });
    } else {
        exibirMensagem("erro", "Endereço não disponível para copiar.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const campoId = urlParams.get('id');

    if (campoId) {
        carregarDadosCampoEConfigurarPagina(campoId);
        carregarReservas(campoId); // Carrega reservas específicas desta página
    } else {
        console.error('ID do campo não encontrado na URL.');
        document.querySelector('.campo-section h1').textContent = "Campo Inválido";
        if (campoImageElement) campoImageElement.src = '../images/default_campo_error.png';
        if (campoImageElement) campoImageElement.alt = "Campo inválido";
        const infoSection = document.querySelector('.campo-info');
        if (infoSection) infoSection.innerHTML = "<p>Por favor, selecione um campo válido a partir da página inicial.</p>";
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }

    if (nextBtn && campoImageElement) {
        nextBtn.addEventListener("click", () => {
            if (campoAtualImagens.length > 1) {
                currentImageIndex = (currentImageIndex + 1) % campoAtualImagens.length;
                atualizarCarrossel();
            }
        });
    }

    if (prevBtn && campoImageElement) {
        prevBtn.addEventListener("click", () => {
            if (campoAtualImagens.length > 1) {
                currentImageIndex = (currentImageIndex - 1 + campoAtualImagens.length) % campoAtualImagens.length;
                atualizarCarrossel();
            }
        });
    }

    const saldoAtualEl = document.getElementById("saldoAtual");
    const saldoContainer = document.getElementById("saldoContainer");

    if (saldoContainer) {
        saldoContainer.addEventListener("click", () => {
            const modalAdicionarSaldo = document.getElementById("modalAdicionarSaldo");
            if (modalAdicionarSaldo) {
                modalAdicionarSaldo.style.display = "block";
            } else {
                console.warn("Elemento modalAdicionarSaldo não encontrado no DOM de campo.html.");
            }
        });
    }

    const saldoGuardado = localStorage.getItem('saldoUsuario');
    if (saldoGuardado && saldoAtualEl) {
        saldoAtualEl.textContent = `${parseFloat(saldoGuardado).toFixed(2)}€`;
    } else if (saldoAtualEl) {
        const saldoInicial = 0.00;
        saldoAtualEl.textContent = `${saldoInicial.toFixed(2)}€`;
    }

    const profileButton = document.getElementById("profileButton");

    if (profileButton) {
        profileButton.addEventListener("click", (event) => {
            event.stopPropagation();
            console.log("Botão de perfil clicado.");
        });
    }

    const btnConfirmarPagamentoFinal = document.getElementById('btnConfirmarPagamentoFinal');
    if (btnConfirmarPagamentoFinal) {
        console.log("Botão 'btnConfirmarPagamentoFinal' encontrado. Adicionando listener.");
        btnConfirmarPagamentoFinal.addEventListener('click', () => {
            console.log("Botão 'Confirmar e Pagar' clicado!");
            efetivarReservaAposConfirmacao();
        });
    } else {
        console.error("Botão 'btnConfirmarPagamentoFinal' NÃO encontrado no DOM!");
    }

    if (confirmacaoReservaModal) {
        confirmacaoReservaModal.addEventListener('click', (event) => {
            if (event.target === confirmacaoReservaModal) {
                fecharConfirmacaoReservaModal();
                reservaPendenteParaConfirmacao = null; // Limpa se fechar clicando fora
            }
        });
        const closeBtn = confirmacaoReservaModal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                fecharConfirmacaoReservaModal();
                reservaPendenteParaConfirmacao = null;
            };
        }
        const cancelBtn = document.getElementById('btnCancelarConfirmacao');
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                fecharConfirmacaoReservaModal();
                reservaPendenteParaConfirmacao = null;
            };
        }
    } else {
        console.warn("Modal de confirmação da reserva (confirmacaoReservaModal) não encontrado para configurar fecho.");
    }
    atualizarSaldoDisplay();
});

// Função auxiliar para formatar a data (adicione se não tiver uma similar)
function formatarDataParaReserva(dateObj) {
    if (!dateObj) return 'N/D';
    const dia = String(dateObj.getDate()).padStart(2, '0');
    const mes = String(dateObj.getMonth() + 1).padStart(2, '0'); // Meses são 0-indexed
    const ano = dateObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// NOVO: Função para formatar data para exibição amigável
function formatarDataParaExibicaoAmigavel(dateObj) {
    if (!dateObj) return 'N/D';
    return dateObj.toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// NOVO: Funções para abrir/fechar o modal de confirmação
window.abrirConfirmacaoReservaModal = function () {
    if (confirmacaoReservaModal) {
        confirmacaoReservaModal.style.display = "block";
    }
}

window.fecharConfirmacaoReservaModal = function () {
    if (confirmacaoReservaModal) {
        confirmacaoReservaModal.style.display = "none";
    }
}

function atualizarSaldoDisplay() {
    const saldoAtualEl = document.getElementById("saldoAtual");
    if (!saldoAtualEl) return;

    const saldoGuardado = localStorage.getItem('saldoUsuario');
    const saldoValor = saldoGuardado ? parseFloat(saldoGuardado) : 0.00;

    if (!saldoGuardado) { // Se não houver saldo, inicializa com 0.00
        localStorage.setItem('saldoUsuario', saldoValor.toFixed(2));
    }
    saldoAtualEl.textContent = `${saldoValor.toFixed(2)}€`;
}

window.realizarPagamento = async function () {
    const dataParaReserva = selectedDate;
    const horarioParaReserva = selectedTime;
    const comodidadesParaReserva = [...selectedAmenities];

    if (!dataParaReserva || !horarioParaReserva) {
        exibirMensagem("erro", "Por favor, selecione data e horário a partir do calendário e da lista de horários no modal de reserva.");
        return;
    }

    const userIdLogado = localStorage.getItem('userId') || "prototipoUser";

    const urlParams = new URLSearchParams(window.location.search);
    const campoId = urlParams.get('id');
    let campoAtual = null;

    if (todosCampos.length === 0) {
        try {
            const response = await fetch('campos.json');
            if (!response.ok) throw new Error('Falha ao buscar campos.json para pagamento');
            todosCampos = await response.json();
        } catch (error) {
            console.error("Erro ao carregar campos.json em realizarPagamento:", error);
            exibirMensagem("erro", "Erro ao carregar detalhes do campo. Tente novamente.");
            return;
        }
    }

    if (campoId) {
        campoAtual = todosCampos.find(campo => campo.id === parseInt(campoId));
    }

    if (!campoAtual) {
        exibirMensagem("erro", "Detalhes do campo não encontrados. Não é possível realizar a reserva.");
        return;
    }

    const equipaSelecionadaNome = document.getElementById("equipaSelecionadaInfo")?.dataset.nomeEquipa;
    let equipaObjParaCalculo = null;
    let numeroMembrosEquipaOriginal = 1; 

    if (equipaSelecionadaNome) {
        const equipasGuardadas = JSON.parse(localStorage.getItem('equipas')) || [];
        equipaObjParaCalculo = equipasGuardadas.find(e => e.nome === equipaSelecionadaNome);
        if (equipaObjParaCalculo && equipaObjParaCalculo.membros && Array.isArray(equipaObjParaCalculo.membros)) {
            numeroMembrosEquipaOriginal = equipaObjParaCalculo.membros.length + 1;
        }
    }

    let precoBase = parseFloat(campoAtual.preco_hora);
    // ...dentro de window.realizarPagamento...
    let precoComodidades = 0;
    const equipamentosSelecionados = Array.from(document.querySelectorAll('.equipamento.selecionada'));
    const equipamentosInfo = equipamentosSelecionados.map(li => {
        const tipo = li.getAttribute('data-tipo');
        const nome = li.getAttribute('data-nome');
        let quantidade = 1;
        const inputQtd = li.querySelector('.quantidade-equipamento');
        if (inputQtd) {
            quantidade = parseInt(inputQtd.value) || 1;
        }
        if (tipo === "coletivo") {
            if (equipaSelecionadaNome && numeroMembrosEquipaOriginal > 0) {
                precoComodidades += 1 / numeroMembrosEquipaOriginal;
                return `${nome} (Coletivo, +1€ dividido)`;
            } else {
                precoComodidades += 1;
                return `${nome} (Coletivo, +1€)`;
            }
        } else {
            precoComodidades += quantidade * 1;
            return `${nome} (Individual, ${quantidade}x +${quantidade}€)`;
        }
    });
        // ...existing code...
    document.getElementById('confirmacaoComodidades').textContent = equipamentosInfo.length > 0 ? equipamentosInfo.join(', ') : 'Nenhum';
    // ...existing code...

    const precoTotalReserva = precoBase + precoComodidades;

    // ...existing code...
    let precoAPagarPeloUtilizador = precoTotalReserva; 
    const capacidadeCampo = parseInt(campoAtual.capacidade); // Definindo um valor padrão para a capacidade
    if (equipaSelecionadaNome && numeroMembrosEquipaOriginal > 0) {
        precoAPagarPeloUtilizador = precoTotalReserva / numeroMembrosEquipaOriginal;
    } else {
        precoAPagarPeloUtilizador = precoTotalReserva;
    }
    
    // ...existing code...
    console.log("Detalhes do cálculo do preço:");
    console.log("Capacidade do Campo:", capacidadeCampo);
    console.log("Preço Total da Reserva:", precoTotalReserva);
    console.log("Preço a Pagar pelo Utilizador (baseado na capacidade):", precoAPagarPeloUtilizador);
    if (equipaSelecionadaNome) {
        console.log("Equipa selecionada (informativo):", equipaSelecionadaNome, "Membros originais considerados:", numeroMembrosEquipaOriginal);
    }

    reservaPendenteParaConfirmacao = {
        dataParaReserva,
        horarioParaReserva,
        comodidadesParaReserva,
        campoAtual,
        equipaSelecionadaObj: equipaObjParaCalculo,
        equipaSelecionadaNome,
        numeroMembrosEquipa: numeroMembrosEquipaOriginal, 
        precoTotalReserva,
        precoAPagarPeloUtilizador, 
        userIdLogado
    };

    // ...existing code...
    document.getElementById('confirmacaoCampoNome').textContent = campoAtual.nome;
    document.getElementById('confirmacaoData').textContent = formatarDataParaExibicaoAmigavel(dataParaReserva);
    document.getElementById('confirmacaoHorario').textContent = horarioParaReserva;
    // Troque esta linha:
    document.getElementById('confirmacaoComodidades').textContent = comodidadesParaReserva.length > 0 ? comodidadesParaReserva.join(', ') : 'Nenhuma';
    // Por esta:
    document.getElementById('confirmacaoComodidades').textContent = equipamentosInfo.length > 0 ? equipamentosInfo.join(', ') : 'Nenhum';

    document.getElementById('confirmacaoEquipa').textContent = equipaSelecionadaNome
        ? `${equipaSelecionadaNome} (${numeroMembrosEquipaOriginal} jogadores)`
        : 'Nenhuma (reserva individual)';
    document.getElementById('confirmacaoPrecoTotal').textContent = `${precoTotalReserva.toFixed(2)}€`;
    document.getElementById('confirmacaoPrecoUtilizador').textContent = `${precoAPagarPeloUtilizador.toFixed(2)}€`;

    abrirConfirmacaoReservaModal();
    // ...existing code...
};

async function efetivarReservaAposConfirmacao() {
    console.log("[efetivarReservaAposConfirmacao] Função chamada.");

    if (!reservaPendenteParaConfirmacao) {
        console.error("[efetivarReservaAposConfirmacao] reservaPendenteParaConfirmacao é null. Saindo.");
        exibirMensagem("erro", "Não há detalhes de reserva para confirmar. Por favor, tente novamente.");
        fecharConfirmacaoReservaModal();
        return;
    }

    console.log("[efetivarReservaAposConfirmacao] Detalhes pendentes:", reservaPendenteParaConfirmacao);

    const {
        dataParaReserva,
        horarioParaReserva,
        comodidadesParaReserva,
        campoAtual,
        equipaSelecionadaObj,
        equipaSelecionadaNome,
        numeroMembrosEquipa,
        precoTotalReserva,
        precoAPagarPeloUtilizador,
        userIdLogado
    } = reservaPendenteParaConfirmacao;

    let saldoAtualTexto = localStorage.getItem('saldoUsuario') || "0.00";
    let saldoAtualNumerico = parseFloat(saldoAtualTexto);
    console.log(`[efetivarReservaAposConfirmacao] Saldo: ${saldoAtualNumerico}, Preço a pagar: ${precoAPagarPeloUtilizador}`);

    if (saldoAtualNumerico < precoAPagarPeloUtilizador) {
        console.warn("[efetivarReservaAposConfirmacao] Saldo insuficiente.");
        exibirMensagem("erro", `Saldo insuficiente (${saldoAtualNumerico.toFixed(2)}€) para pagar a sua parte de ${precoAPagarPeloUtilizador.toFixed(2)}€.`);
        fecharConfirmacaoReservaModal();
        abrirModalSaldo(); // Função global para abrir modal de saldo
        return;
    }

    saldoAtualNumerico -= precoAPagarPeloUtilizador;
    localStorage.setItem('saldoUsuario', saldoAtualNumerico.toFixed(2));
    atualizarSaldoDisplay();
    console.log("[efetivarReservaAposConfirmacao] Saldo atualizado:", saldoAtualNumerico);

    const novaReserva = {
        id: `res_${Date.now()}_${campoAtual.id}`,
        userId: userIdLogado,
        campoId: campoAtual.id,
        nomeCampo: campoAtual.nome,
        data: formatarDataParaReserva(dataParaReserva),
        horario: horarioParaReserva,
        preco: precoTotalReserva,
        precoPagoPeloUtilizador: precoAPagarPeloUtilizador,
        comodidades: comodidadesParaReserva,
        equipasConvidadas: equipaSelecionadaNome ? [equipaSelecionadaNome] : [],
        numeroTotalMembrosConsiderados: numeroMembrosEquipa,
        numConfirmados: 1,
        estado: "Confirmada"
    };

    guardarReservasNoLocalStorage(novaReserva);
    console.log("[efetivarReservaAposConfirmacao] Reserva guardada:", novaReserva);

    exibirMensagem("sucesso", `Reserva para ${campoAtual.nome} confirmada com sucesso!`);

    fecharConfirmacaoReservaModal();
    fecharReserva(); // Fecha o modal de reserva principal

    selectedDate = null;
    selectedTime = null;
    selectedAmenities = [];

    const reservaModal = document.getElementById("reservaModal");
    if (reservaModal) {
        reservaModal.querySelectorAll('.calendar-day.active').forEach(el => el.classList.remove('active'));
        reservaModal.querySelectorAll('.horario-slot.selected').forEach(el => el.classList.remove('selected'));

        const equipaInfoEl = document.getElementById("equipaSelecionadaInfo");
        if (equipaInfoEl) {
            equipaInfoEl.textContent = "Nenhuma equipa selecionada.";
            delete equipaInfoEl.dataset.nomeEquipa;
        }
        const convidarContainer = reservaModal.querySelector('.convidar-container');
        if (convidarContainer) {
            convidarContainer.querySelectorAll('.convidar-btn.selecionada').forEach(btn => {
                btn.classList.remove('selecionada');
            });
        }

        const comodidadesModalEl = document.getElementById("comodidadesModal");
        if (comodidadesModalEl) {
            comodidadesModalEl.querySelectorAll(".comodidades-lista li.selecionada").forEach(el => el.classList.remove('selecionada'));
        }
    }

    reservaPendenteParaConfirmacao = null;
    console.log("[efetivarReservaAposConfirmacao] Processo concluído.");
}

window.fecharReserva = function () {
    const reservaModal = document.getElementById("reservaModal");
    if (reservaModal) {
        reservaModal.style.display = "none";
    } else {
        console.error("Modal de reserva não encontrado no DOM.");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const reservaModal = document.getElementById("reservaModal");

    if (!reservaModal) {
        console.warn("Modal de reserva não encontrado.");
        return;
    }

    window.abrirReserva = function () {
        const reservaModal = document.getElementById("reservaModal");
        if (reservaModal) {
            // Resetar seleções anteriores
            selectedDate = null;
            selectedTime = null;
            selectedAmenities = [];
            document.querySelectorAll('#reservaModal .calendar-day.active').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('#reservaModal .horario-slot.selected').forEach(el => el.classList.remove('selected'));
            const comodidadesModalEl = document.getElementById("comodidadesModal");
            if (comodidadesModalEl) {
                comodidadesModalEl.querySelectorAll(".comodidades-lista li.selecionada").forEach(el => el.classList.remove('selecionada'));
            }

            // Exibir o modal de reserva
            reservaModal.style.display = "block";
        } else {
            console.error("Modal de reserva não encontrado no DOM.");
        }
    };

    const calendarGridModal = reservaModal.querySelector(".calendar-grid");
    const calendarioMesAnoModal = reservaModal.querySelector("#calendarioMesAno");
    const prevMonthBtnModal = reservaModal.querySelector("#prevMonth");
    const nextMonthBtnModal = reservaModal.querySelector("#nextMonth");

    let currentDateModal = new Date();

    function renderCalendarModal(date) {
        if (!calendarGridModal || !calendarioMesAnoModal) return;

        calendarGridModal.innerHTML = '';
        const diasSemanaNomes = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
        diasSemanaNomes.forEach(diaNome => {
            const dayHeaderEl = document.createElement("div");
            dayHeaderEl.className = "calendar-day-header";
            dayHeaderEl.innerText = diaNome;
            calendarGridModal.appendChild(dayHeaderEl);
        });

        const year = date.getFullYear();
        const month = date.getMonth();
        const today = new Date();

        let firstDayOfMonthIndex = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        calendarioMesAnoModal.textContent = `${date.toLocaleString("pt-PT", { month: "long" }).charAt(0).toUpperCase() + date.toLocaleString("pt-PT", { month: "long" }).slice(1)} ${year}`;

        for (let i = 0; i < firstDayOfMonthIndex; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.className = "calendar-day empty";
            calendarGridModal.appendChild(emptyCell);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dayEl = document.createElement("div");
            dayEl.className = "calendar-day";
            dayEl.innerText = d;
            const currentDateLoop = new Date(year, month, d);

            if (currentDateLoop < today.setHours(0, 0, 0, 0)) {
                dayEl.classList.add("disabled");
            } else {
                dayEl.addEventListener("click", () => {
                    if (dayEl.classList.contains("disabled")) return;

                    const activeDay = calendarGridModal.querySelector('.calendar-day.active');
                    if (activeDay) activeDay.classList.remove("active");

                    dayEl.classList.add("active");
                    selectedDate = new Date(year, month, d);
                    console.log("Data selecionada (modal):", selectedDate);
                });
            }
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
        "21:00 - 22:00"
    ];

    if (horariosListModal) {
        horariosListModal.innerHTML = '';
        horariosData.forEach(horario => {
            const slot = document.createElement("div");
            slot.className = "horario-slot";
            slot.innerText = horario;

            slot.addEventListener("click", () => {
                const selectedSlot = horariosListModal.querySelector('.horario-slot.selected');
                if (selectedSlot) selectedSlot.classList.remove("selected");

                slot.classList.add("selected");
                selectedTime = horario;
                console.log("Horário selecionado (modal):", selectedTime);
            });
            horariosListModal.appendChild(slot);
        });
    }

    const comodidadesModalEl = document.getElementById("comodidadesModal");

    window.abrirComodidades = function () {
        const comodidadesModalEl = document.getElementById("comodidadesModal");
        if (comodidadesModalEl) {
            const urlParams = new URLSearchParams(window.location.search);
            const campoId = urlParams.get('id');
            const campoSelecionado = todosCampos.find(campo => campo.id === parseInt(campoId));

            if (campoSelecionado) {
                const listaComodidades = comodidadesModalEl.querySelector(".comodidades-lista");
                listaComodidades.innerHTML = ''; // Limpa a lista antes de adicionar

                // Adicionar todas as comodidades do campo
                if (campoSelecionado.comodidades && campoSelecionado.comodidades.length > 0) {
                    campoSelecionado.comodidades.forEach(comodidade => {
                        const li = document.createElement('li');
                        li.className = "comodidade";
                        li.setAttribute("data-nome", comodidade);
                        li.onclick = function () {
                            this.classList.toggle("selecionada");
                        };

                        let iconClass = "fa-question-circle"; // Ícone padrão
                        if (comodidade.toLowerCase().includes("balneário")) iconClass = "fa-shower";
                        else if (comodidade.toLowerCase().includes("equipamento")) iconClass = "fa-shirt";
                        else if (comodidade.toLowerCase().includes("estacionamento")) iconClass = "fa-parking";
                        else if (comodidade.toLowerCase().includes("iluminação")) iconClass = "fa-lightbulb";
                        else if (comodidade.toLowerCase().includes("wc")) iconClass = "fa-restroom";

                        li.innerHTML = `<i class="fas ${iconClass}"></i> ${comodidade}`;
                        listaComodidades.appendChild(li);
                    });
                } else {
                    listaComodidades.innerHTML = '<li>Nenhuma comodidade disponível.</li>';
                }

                // Atualizar o título do modal para "Comodidades"
                const modalTitle = comodidadesModalEl.querySelector("h2");
                modalTitle.textContent = "Comodidades";
            }

            comodidadesModalEl.style.display = "block";
        } else {
            console.error("Modal de comodidades não encontrado no DOM.");
        }
    };
    window.fecharComodidades = function () {
        if (comodidadesModalEl) comodidadesModalEl.style.display = "none";
    };

    window.confirmarComodidades = function () {
        if (comodidadesModalEl) {
            selectedAmenities = Array.from(comodidadesModalEl.querySelectorAll(".comodidades-lista li.selecionada"))
                .map(el => el.getAttribute("data-nome"));

            // Adicionar preço adicional para "Equipamento"
            let precoAdicional = 0;
            if (selectedAmenities.includes("Equipamento")) {
                precoAdicional += 1; // Exemplo: 5€ por equipamento
                exibirMensagem("sucesso", "Preço adicional de 1€ adicionado para Equipamento.");
            }

            exibirMensagem("sucesso", `Comodidades confirmadas: ${selectedAmenities.join(", ") || "Nenhuma"}`);
            fecharComodidades();
        }
    };


    const closeComodidadesBtn = comodidadesModalEl ? comodidadesModalEl.querySelector('.close') : null;
    if (closeComodidadesBtn) {
        closeComodidadesBtn.onclick = fecharComodidades;
    }
    const btnConfirmarComodidadesNoModal = comodidadesModalEl ? comodidadesModalEl.querySelector('button') : null;
    if (btnConfirmarComodidadesNoModal && btnConfirmarComodidadesNoModal.textContent.toLowerCase().includes("confirmar")) {
        btnConfirmarComodidadesNoModal.onclick = confirmarComodidades;
    }
});