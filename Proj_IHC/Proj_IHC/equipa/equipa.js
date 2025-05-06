function abrirPopupCriarEquipa() {
  const popup = document.getElementById("popupCriarEquipa");
  popup.style.display = "block";

  // Limpar seleções anteriores
  const amigosSelecionados = document.querySelectorAll(".amigos-list .selectable.selected");
  amigosSelecionados.forEach((amigo) => amigo.classList.remove("selected"));

  // Limpar o formulário
  document.getElementById("criarEquipaForm").reset();

  // Limpar restrições de desporto
  document.getElementById("restricoesDesporto").textContent = "";
}
// Fechar o pop-up de criar equipa
function fecharPopupCriarEquipa() {
  document.getElementById("popupCriarEquipa").style.display = "none";
}

// Abrir o pop-up de gerir equipa
function abrirPopupGerirEquipa(nomeEquipa) {
  const equipas = JSON.parse(localStorage.getItem("equipas")) || [];
  const equipa = equipas.find((e) => e.nome === nomeEquipa);

  if (!equipa) {
    alert("Equipa não encontrada.");
    return;
  }

  document.getElementById("novoNomeEquipa").value = equipa.nome;

  const membrosEquipa = document.getElementById("membrosEquipa");
  membrosEquipa.innerHTML = "";
  equipa.membros.forEach((membro, index) => {
    const membroDiv = document.createElement("div");
    membroDiv.className = "membro-item";
    membroDiv.innerHTML = `
      <span>${membro}</span>
      <button type="button" class="remover-membro-btn" onclick="removerMembro('${nomeEquipa}', ${index})">Remover</button>
    `;
    membrosEquipa.appendChild(membroDiv);
  });

  document.getElementById("popupGerirEquipa").style.display = "block";

  // Salvar o nome da equipa atual no atributo do formulário
  document.getElementById("gerirEquipaForm").setAttribute("data-equipa", nomeEquipa);
}

// Fechar o pop-up de gerir equipa
function fecharPopupGerirEquipa() {
  document.getElementById("popupGerirEquipa").style.display = "none";
}
// Exibir mensagem de erro
function exibirMensagemErro(mensagem, elementoPai) {
  const mensagemErro = document.createElement("div");
  mensagemErro.className = "mensagem-erro";
  mensagemErro.textContent = mensagem;

  elementoPai.appendChild(mensagemErro);

  // Remover a mensagem após 3 segundos
  setTimeout(() => {
    mensagemErro.remove();
  }, 3000);
}
function obterAmigosSelecionados() {
  const amigosSelecionados = [];
  const botoesSelecionados = document.querySelectorAll(".amigos-list .selected, .amigos-recentes .selected");

  botoesSelecionados.forEach((botao) => {
    amigosSelecionados.push(botao.textContent.trim());
  });

  return amigosSelecionados;
}
function criarEquipa() {
  const nomeEquipa = document.getElementById("nomeEquipa").value.trim();
  const desporto = document.getElementById("desporto").value;
  const amigosSelecionados = obterAmigosSelecionados();
  const form = document.getElementById("criarEquipaForm");

  if (!nomeEquipa) {
    exibirMensagemErro("Por favor, insira um nome para a equipa.", form);
    return;
  }

  // Verificar se o nome da equipa já existe
  const equipas = JSON.parse(localStorage.getItem("equipas")) || [];
  const nomeDuplicado = equipas.some((e) => e.nome.toLowerCase() === nomeEquipa.toLowerCase());
  if (nomeDuplicado) {
    exibirMensagemErro("Já existe uma equipa com este nome.", form);
    return;
  }
  
  if (!desporto) {
    exibirMensagemErro("Por favor, selecione um desporto.", form);
    return;
  }
  // Definir os limites de jogadores com base no desporto
 
// Normalizar o valor do desporto para evitar problemas de capitalização ou espaços extras
  const desportoNormalizado = desporto.trim().toLowerCase();

  switch (desportoNormalizado) {
    case "futebol 11":
      minimoJogadores = 11;
      maximoJogadores = 22;
      break;
    case "futebol 5":
      minimoJogadores = 5;
      maximoJogadores = 10;
      break;
    case "futebol 7":
      minimoJogadores = 7;
      maximoJogadores = 14;
      break;
    case "futsal":
      minimoJogadores = 5;
      maximoJogadores = 12;
      break;
    case "andebol":
      minimoJogadores = 7;
      maximoJogadores = 14;
      break;
    case "padel":
      minimoJogadores = 2;
      maximoJogadores = 4;
      break;
    case "ténis":
      minimoJogadores = 1;
      maximoJogadores = 2;
      break;
    case "basquetebol":
      minimoJogadores = 5;
      maximoJogadores = 12;
      break;
    case "voleibol":
      minimoJogadores = 6;
      maximoJogadores = 12;
      break;
    default:
      minimoJogadores = 0;
      maximoJogadores = Infinity; // Sem limite
  }

  if (amigosSelecionados.length + 1 < minimoJogadores) {
    const desportoFormatado = desportoNormalizado.charAt(0).toUpperCase() + desporto.slice(1);
    exibirMensagemErro(
      `O número mínimo de jogadores para ${desportoFormatado} é ${minimoJogadores}.`,
      form
    );
    return;
  }

  if (amigosSelecionados.length + 1 > maximoJogadores) {
    const desportoFormatado = desportoNormalizado.charAt(0).toUpperCase() + desporto.slice(1);
    exibirMensagemErro(
      `O número máximo de jogadores para ${desportoFormatado} é ${maximoJogadores}.`,
      form
    );
    return;
  }
  // Criar a equipa

  equipas.push({
    nome: nomeEquipa,
    desporto: desporto,
    membros: amigosSelecionados,
  });
  localStorage.setItem("equipas", JSON.stringify(equipas));

  fecharPopupCriarEquipa();
  renderizarEquipas();
}
// Renderizar equipas na interface
function renderizarEquipas() {
  const equipas = JSON.parse(localStorage.getItem("equipas")) || [];
  const listaEquipas = document.getElementById("listaEquipas");
  listaEquipas.innerHTML = ""; // Limpar lista de equipas

  equipas.forEach((equipa) => {
    const desportoFormatado = equipa.desporto.charAt(0).toUpperCase() + equipa.desporto.slice(1); // Capitalizar a primeira letra

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${equipa.nome}</h3>
      <p><strong>Desporto:</strong> ${desportoFormatado}</p>
      <button class="gerir-btn" onclick="abrirPopupGerirEquipa('${equipa.nome}')">Gerir</button>
    `;
    listaEquipas.appendChild(card);
  });
}
// Abrir o pop-up de confirmação para remover a equipa
function abrirPopupConfirmarRemoverEquipa(nomeEquipa) {
  equipaParaRemover = nomeEquipa; // Armazena o nome da equipa a ser removida
  const popup = document.getElementById("popupConfirmarRemoverEquipa");
  if (popup) {
    popup.style.display = "block";
  }
}

// Fechar o pop-up de confirmação para remover a equipa
function fecharPopupConfirmarRemoverEquipa() {
  const popup = document.getElementById("popupConfirmarRemoverEquipa");
  if (popup) {
    popup.style.display = "none";
  }
}

// Confirmar a remoção da equipa
function confirmarRemocaoEquipa() {
  if (!equipaParaRemover) return;

  let equipas = JSON.parse(localStorage.getItem("equipas")) || [];
  equipas = equipas.filter((equipa) => equipa.nome !== equipaParaRemover); // Remover a equipa pelo nome
  localStorage.setItem("equipas", JSON.stringify(equipas));

  fecharPopupConfirmarRemoverEquipa();
  fecharPopupGerirEquipa();
  renderizarEquipas();
}
// Adicionar um novo membro à equipa
function adicionarMembro() {
  const novoMembro = document.getElementById("novoMembro").value.trim();
  const nomeEquipa = document.getElementById("gerirEquipaForm").getAttribute("data-equipa");

  if (!novoMembro) {
    exibirMensagemErro("Por favor, insira o nome do novo membro.");
    return;
  }

  const equipas = JSON.parse(localStorage.getItem("equipas")) || [];
  const equipa = equipas.find((e) => e.nome === nomeEquipa);

  equipa.membros.push(novoMembro);
  localStorage.setItem("equipas", JSON.stringify(equipas));

  abrirPopupGerirEquipa(nomeEquipa);
  document.getElementById("novoMembro").value = "";
}
// Alternar a seleção de amigos
function toggleSelection(button) {
  if (button.classList.contains("selected")) {
    button.classList.remove("selected");
  } else {
    button.classList.add("selected");
  }
}

// Filtrar amigos na lista com base no texto digitado
function filtrarAmigos() {
  const input = document.getElementById("pesquisarAmigos").value.toLowerCase();
  const amigos = document.querySelectorAll(".amigos-list .selectable");

  amigos.forEach((amigo) => {
    const nome = amigo.textContent.toLowerCase();
    if (nome.includes(input)) {
      amigo.style.display = "block";
    } else {
      amigo.style.display = "none";
    }
  });
}
// Remover um membro da equipa
function removerMembro(nomeEquipa, index) {
  const equipas = JSON.parse(localStorage.getItem("equipas")) || [];
  const equipa = equipas.find((e) => e.nome === nomeEquipa);

  equipa.membros.splice(index, 1); // Remover o membro pelo índice
  localStorage.setItem("equipas", JSON.stringify(equipas));

  abrirPopupGerirEquipa(nomeEquipa);
}

// Salvar alterações na equipa
function salvarAlteracoes() {
  const novoNomeEquipa = document.getElementById("novoNomeEquipa").value.trim();
  const nomeEquipaAtual = document.getElementById("gerirEquipaForm").getAttribute("data-equipa");

  if (!novoNomeEquipa) {
    exibirMensagemErro("Por favor, insira um nome para a equipa.");
    return;
  }

  const equipas = JSON.parse(localStorage.getItem("equipas")) || [];
  const equipa = equipas.find((e) => e.nome === nomeEquipaAtual);

  equipa.nome = novoNomeEquipa; // Atualizar o nome da equipa
  localStorage.setItem("equipas", JSON.stringify(equipas));

  fecharPopupGerirEquipa();
  renderizarEquipas();

  // Exibir mensagem de sucesso
  exibirMensagemSucesso("Alterações feitas com sucesso!");
}

// Função para exibir uma mensagem de sucesso
function exibirMensagemSucesso(mensagem) {
  const mensagemSucesso = document.createElement("div");
  mensagemSucesso.className = "mensagem-sucesso";
  mensagemSucesso.textContent = mensagem;

  document.body.appendChild(mensagemSucesso);

  // Remover a mensagem após 3 segundos
  setTimeout(() => {
    mensagemSucesso.remove();
  }, 3000);
}
function adicionarAmigo() {
  const amigoId = document.getElementById("amigoId").value.trim();
  const amigoTelefone = document.getElementById("amigoTelefone").value.trim();

  if (!amigoId && !amigoTelefone) {
    exibirMensagemErro("Por favor, preencha todos os campos para adicionar um amigo.",form);
    return;
  }

  // Adicionar o amigo (simulação, pode ser salvo no localStorage ou enviado para um servidor)
  console.log(`Amigo adicionado: ID=${amigoId}, Telefone=${amigoTelefone}`);

  // Limpar os campos do formulário
  document.getElementById("amigoId").value = "";
  document.getElementById("amigoTelefone").value = "";

  // Exibir o pop-up de confirmação
  abrirPopupConfirmarAdicionarAmigo();
}
  // Abrir o pop-up de confirmação para adicionar amigo
  function abrirPopupConfirmarAdicionarAmigo() {
    document.getElementById("popupConfirmarAdicionarAmigo").style.display = "block";
  }
  
  // Fechar o pop-up de confirmação para adicionar amigo
  function fecharPopupConfirmarAdicionarAmigo() {
    document.getElementById("popupConfirmarAdicionarAmigo").style.display = "none";
  }
  // Abrir o pop-up de Adicionar Amigos
  function abrirPopupAdicionarAmigo() {
    const popup = document.getElementById("popupAdicionarAmigo");
    if (popup) {
      popup.style.display = "block";
    }
  }
  // Abrir o pop-up de erro
function abrirPopupErroAdicionarAmigo(mensagem) {
  const popup = document.getElementById("popupErroAdicionarAmigo");
  const mensagemErro = document.getElementById("mensagemErroAdicionarAmigo");

  if (mensagemErro) {
    mensagemErro.textContent = mensagem; // Atualizar a mensagem de erro
  }

  if (popup) {
    popup.style.display = "block";
  }
}

// Fechar o pop-up de erro
function fecharPopupErroAdicionarAmigo() {
  const popup = document.getElementById("popupErroAdicionarAmigo");
  if (popup) {
    popup.style.display = "none";
  }
}
  // Fechar o pop-up de Adicionar Amigos
  function fecharPopupAdicionarAmigo() {
    const popup = document.getElementById("popupAdicionarAmigo");
    if (popup) {
      popup.style.display = "none";
    }
  
  }
    function atualizarRestricoes() {
      const desporto = document.getElementById("desporto").value;
      const restricoes = document.getElementById("restricoesDesporto");
    
      const limites = {
        "futebol 11": "Mínimo: 11 jogadores, Máximo: 22 jogadores.",
        "futebol 5": "Mínimo: 5 jogadores, Máximo: 10 jogadores.",
        "futebol 7": "Mínimo: 7 jogadores, Máximo: 14 jogadores.",
        "futsal": "Mínimo: 5 jogadores, Máximo: 12 jogadores.",
        "andebol": "Mínimo: 7 jogadores, Máximo: 14 jogadores.",
        "Padel": "Mínimo: 2 jogadores, Máximo: 4 jogadores.",
        "Ténis": "Mínimo: 1 jogador, Máximo: 2 jogadores.",
        "basquetebol": "Mínimo: 5 jogadores, Máximo: 12 jogadores.",
        "voleibol": "Mínimo: 6 jogadores, Máximo: 12 jogadores.",
        "Outro": "Sem restrições específicas.",
      };
    
      restricoes.textContent = limites[desporto] || "";
    }
    
  // Inicializar a página
document.addEventListener("DOMContentLoaded", () => {
  renderizarEquipas();
});