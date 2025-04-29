document.addEventListener("DOMContentLoaded", () => {
    // Simular resultados disponíveis
    const resultados = [
      {
        nome: "Campo 1",
        data: "12 abril, 20h00 - 21h00",
        preco: "3,50€/jogador",
        localidade: "Aveiro",
        desporto: "Futebol",
        imagem: "../images/campo1.jpg",
      },
      {
        nome: "Campo 2",
        data: "10 abril, 22h30 - 23h30",
        preco: "4,99€/jogador",
        localidade: "Porto",
        desporto: "Basquetebol",
        imagem: "../images/campo2.jpg",
      },
      {
        nome: "Campo 3",
        data: "15 abril, 18h00 - 19h00",
        preco: "2,99€/jogador",
        localidade: "Aveiro",
        desporto: "Ténis",
        imagem: "../images/campo3.jpg",
      },
    ];
  
    // Carregar filtros do localStorage
    const filtros = JSON.parse(localStorage.getItem("filtros")) || {};
  
    // Filtrar resultados com base nos filtros
    const filtrados = resultados.filter((resultado) => {
      const correspondeLocalidade = !filtros.localidade || resultado.localidade.toLowerCase() === filtros.localidade.toLowerCase();
      const correspondeDesporto = !filtros.desporto || resultado.desporto.toLowerCase() === filtros.desporto.toLowerCase();
      return correspondeLocalidade && correspondeDesporto;
    });
  
    // Renderizar resultados
    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = ""; // Limpar resultados anteriores
  
    if (filtrados.length === 0) {
      resultsContainer.innerHTML = `<p>Nenhum resultado encontrado para os filtros aplicados.</p>`;
      return;
    }
  
    filtrados.forEach((resultado) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${resultado.imagem}" alt="${resultado.nome}">
        <h3>${resultado.nome}</h3>
        <p><strong>Data:</strong> ${resultado.data}</p>
        <p><strong>Preço:</strong> ${resultado.preco}</p>
        <p><strong>Localidade:</strong> ${resultado.localidade}</p>
        <p><strong>Desporto:</strong> ${resultado.desporto}</p>
        <div class="buttons">
          <button onclick="irParaDetalhes('${resultado.nome}')">Mais Detalhes</button>
        </div>
      `;
      resultsContainer.appendChild(card);
    });
  });
  
  // Função para redirecionar para a página de detalhes
  function irParaDetalhes(nomeCampo) {
    const url = `../campo/campo.html?campo=${encodeURIComponent(nomeCampo)}`;
    window.location.href = url;
  }