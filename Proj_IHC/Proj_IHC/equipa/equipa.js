// Abrir o pop-up de criar equipa
function abrirPopupCriarEquipa() {
    document.getElementById("popupCriarEquipa").style.display = "block";
  }
  
  // Fechar o pop-up de criar equipa
  function fecharPopupCriarEquipa() {
    document.getElementById("popupCriarEquipa").style.display = "none";
  }
  
  // Abrir o pop-up de adicionar amigos
  function abrirPopupAdicionarAmigo() {
    document.getElementById("popupAdicionarAmigo").style.display = "block";
  }
  
  // Fechar o pop-up de adicionar amigos
  function fecharPopupAdicionarAmigo() {
    document.getElementById("popupAdicionarAmigo").style.display = "none";
  }
  
  // Abrir o pop-up de gerir equipa
  function abrirPopupGerirEquipa(equipa) {
    document.getElementById("popupGerirEquipa").style.display = "block";
  }
  
  // Fechar o pop-up de gerir equipa
  function fecharPopupGerirEquipa() {
    document.getElementById("popupGerirEquipa").style.display = "none";
  }
  
  // Criar uma nova equipa
  function criarEquipa() {
    const nomeEquipa = document.getElementById("nomeEquipa").value;
    const amigosSelecionados = Array.from(
      document.querySelectorAll(".amigos-list .selectable.selected")
    ).map((button) => button.textContent);
  
    if (!nomeEquipa) {
      alert("Por favor, insira um nome para a equipa.");
      return;
    }
  
    alert(`Equipa "${nomeEquipa}" criada com os membros: ${amigosSelecionados.join(", ")}`);
    fecharPopupCriarEquipa();
    document.getElementById("criarEquipaForm").reset();
  }
  
  // Adicionar um amigo
  function adicionarAmigo() {
    const amigoId = document.getElementById("amigoId").value;
    const amigoTelefone = document.getElementById("amigoTelefone").value;
  
    if (!amigoId && !amigoTelefone) {
      alert("Por favor, insira o ID ou o número de telemóvel do amigo.");
      return;
    }
  
    alert(`Amigo adicionado com sucesso!`);
    fecharPopupAdicionarAmigo();
    document.getElementById("adicionarAmigoForm").reset();
  }

  // Alternar seleção de botões
function toggleSelection(button) {
    button.classList.toggle("selected");
  }
  
  // Criar uma nova equipa
  function criarEquipa() {
    const nomeEquipa = document.getElementById("nomeEquipa").value;
    const amigosSelecionados = Array.from(
      document.querySelectorAll(".amigos-list .selectable.selected")
    ).map((button) => button.textContent);
  
    if (!nomeEquipa) {
      alert("Por favor, insira um nome para a equipa.");
      return;
    }
  
    alert(`Equipa "${nomeEquipa}" criada com os membros: ${amigosSelecionados.join(", ")}`);
    fecharPopupCriarEquipa();
    document.getElementById("criarEquipaForm").reset();
  }

  // Abrir o pop-up de confirmação para adicionar amigo
function abrirPopupConfirmarAdicionarAmigo() {
    document.getElementById("popupConfirmarAdicionarAmigo").style.display = "block";
  }
  
  // Fechar o pop-up de confirmação para adicionar amigo
  function fecharPopupConfirmarAdicionarAmigo() {
    document.getElementById("popupConfirmarAdicionarAmigo").style.display = "none";
  }
  
  // Abrir o pop-up de confirmação para criar equipa
  function abrirPopupConfirmarCriarEquipa() {
    document.getElementById("popupConfirmarCriarEquipa").style.display = "block";
  }
  
  // Fechar o pop-up de confirmação para criar equipa
  function fecharPopupConfirmarCriarEquipa() {
    document.getElementById("popupConfirmarCriarEquipa").style.display = "none";
  }
  
  // Modificar a função de adicionar amigo para abrir o pop-up de confirmação
  function adicionarAmigo() {
    const amigoId = document.getElementById("amigoId").value;
    const amigoTelefone = document.getElementById("amigoTelefone").value;
  
    if (!amigoId && !amigoTelefone) {
      alert("Por favor, insira o ID ou o número de telemóvel do amigo.");
      return;
    }
  
    // Simular adição de amigo
    alert(`Amigo adicionado com sucesso!`);
    fecharPopupAdicionarAmigo();
    abrirPopupConfirmarAdicionarAmigo();
    document.getElementById("adicionarAmigoForm").reset();
  }
  
  // Modificar a função de criar equipa para abrir o pop-up de confirmação
  function criarEquipa() {
    const nomeEquipa = document.getElementById("nomeEquipa").value;
    const amigosSelecionados = Array.from(
      document.querySelectorAll(".amigos-list .selectable.selected")
    ).map((button) => button.textContent);
  
    if (!nomeEquipa) {
      alert("Por favor, insira um nome para a equipa.");
      return;
    }
  
    // Simular criação de equipa
    alert(`Equipa "${nomeEquipa}" criada com os membros: ${amigosSelecionados.join(", ")}`);
    fecharPopupCriarEquipa();
    abrirPopupConfirmarCriarEquipa();
    document.getElementById("criarEquipaForm").reset();
  }

  // Atualizar restrições com base no desporto selecionado
function atualizarRestricoes() {
    const desporto = document.getElementById("desporto").value;
    const restricoes = document.getElementById("restricoesDesporto");
  
    if (desporto === "futebol") {
      restricoes.textContent = "Mínimo: 5 jogadores, Máximo: 10 jogadores.";
    } else if (desporto === "basquetebol") {
      restricoes.textContent = "Mínimo: 5 jogadores, Máximo: 12 jogadores.";
    } else if (desporto === "voleibol") {
      restricoes.textContent = "Mínimo: 6 jogadores, Máximo: 12 jogadores.";
    } else {
      restricoes.textContent = "";
    }
  }
  
  // Filtrar amigos na lista com base na pesquisa
  function filtrarAmigos() {
    const pesquisa = document.getElementById("pesquisarAmigos").value.toLowerCase();
    const amigos = document.querySelectorAll("#listaAmigos .selectable");
  
    amigos.forEach((amigo) => {
      const nome = amigo.textContent.toLowerCase();
      amigo.style.display = nome.includes(pesquisa) ? "block" : "none";
    });
  }
  
  // Alternar seleção de amigos
  function toggleSelection(button) {
    button.classList.toggle("selected");
  }
  
  // Criar uma nova equipa
  function criarEquipa() {
    const nomeEquipa = document.getElementById("nomeEquipa").value;
    const desporto = document.getElementById("desporto").value;
    const amigosSelecionados = Array.from(
      document.querySelectorAll(".amigos-list .selectable.selected, .amigos-recentes .selectable.selected")
    ).map((button) => button.textContent);
  
    if (!nomeEquipa) {
      alert("Por favor, insira um nome para a equipa.");
      return;
    }
  
    if (!desporto) {
      alert("Por favor, selecione um desporto.");
      return;
    }
  
    if (amigosSelecionados.length === 0) {
      alert("Por favor, selecione pelo menos um amigo.");
      return;
    }
  
    alert(`Equipa "${nomeEquipa}" criada para o desporto "${desporto}" com os membros: ${amigosSelecionados.join(", ")}`);
    fecharPopupCriarEquipa();
    document.getElementById("criarEquipaForm").reset();
  }