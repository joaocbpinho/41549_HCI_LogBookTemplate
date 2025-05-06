async function carregarEExibirReservasIndex() {
  const listaReservasContainer = document.getElementById('listaReservas');
  if (!listaReservasContainer) {
    console.error("Elemento #listaReservas não encontrado no DOM.");
    return;
  }

  listaReservasContainer.innerHTML = '<p>A carregar as suas próximas reservas...</p>';
  listaReservasContainer.classList.remove('cards');

  const userIdLogado = "prototipoUser"; // Para corresponder ao que campo.js guarda
  // Em um sistema real, isso viria de um login consistente:
  // const userIdLogado = localStorage.getItem('userIdLogado'); 

  if (!userIdLogado) {
    listaReservasContainer.innerHTML = '<p>Faça login para ver as suas reservas.</p>';
    return;
  }

  try {
    const responseCampos = await fetch('../campo/campos.json'); // Caminho relativo ao index.html que chama este script
    if (!responseCampos.ok) throw new Error(`Erro ao carregar campos: ${responseCampos.status}`);
    const todosOsCamposIndex = await responseCampos.json();

    const reservasGuardadas = localStorage.getItem('todasReservas');
    let todasReservas = [];
    if (reservasGuardadas) {
      todasReservas = JSON.parse(reservasGuardadas);
      console.log("[reservasindex.js] Reservas carregadas do localStorage para Index:", todasReservas);
    } else {
      console.log("[reservasindex.js] Nenhuma reserva encontrada no localStorage para a página Index.");
    }

    const reservasUsuario = todasReservas.filter(reserva => reserva.userId === userIdLogado);
    console.log(`[reservasindex.js] Filtrando para userId: ${userIdLogado}, encontradas:`, reservasUsuario);

    const agora = new Date();

    // Função auxiliar para converter data e hora da reserva para um objeto Date
    function criarObjetoDateDaReserva(dataStr, horaInicioStr) {
        try {
            if (!dataStr || !horaInicioStr || !dataStr.includes('/') || !horaInicioStr.includes(':')) {
                return null; // Retorna null para indicar falha
            }

            const partesData = dataStr.split('/'); // Espera [DD, MM, YYYY]
            const partesHora = horaInicioStr.split(':'); // Espera [HH, MM]

            if (partesData.length !== 3 || partesHora.length !== 2) {
                return null;
            }

            const ano = parseInt(partesData[2]);
            const mes = parseInt(partesData[1]) - 1; // Mês em JavaScript é 0-indexado
            const dia = parseInt(partesData[0]);
            const hora = parseInt(partesHora[0]);
            const minuto = parseInt(partesHora[1]);

            if (isNaN(ano) || isNaN(mes) || isNaN(dia) || isNaN(hora) || isNaN(minuto)) {
                return null;
            }

            const dataObj = new Date(ano, mes, dia, hora, minuto);
            if (isNaN(dataObj.getTime())) {
                return null;
            }
            return dataObj;
        } catch (e) {
            console.error('[reservasindex.js] Erro ao criar objeto Date da reserva:', dataStr, horaInicioStr, e);
            return null;
        }
    }

    const reservasFuturas = reservasUsuario.filter(reserva => {
        let horaDeInicioParaUsar = reserva.horario ? reserva.horario.split(' - ')[0].trim() : null; 

        if (!horaDeInicioParaUsar) {
            console.warn("[reservasindex.js] Reserva sem 'horario' definido ou em formato incorreto:", reserva);
            return false;
        }
        
        const dataReserva = criarObjetoDateDaReserva(reserva.data, horaDeInicioParaUsar);
        return dataReserva && dataReserva > agora;
    });

    reservasFuturas.sort((a, b) => {
        const horaInicioA = a.horario ? a.horario.split(' - ')[0].trim() : null;
        const horaInicioB = b.horario ? b.horario.split(' - ')[0].trim() : null;

        const dataA = criarObjetoDateDaReserva(a.data, horaInicioA);
        const dataB = criarObjetoDateDaReserva(b.data, horaInicioB);

        if (!dataA && !dataB) return 0;
        if (!dataA) return 1; // Coloca 'a' (inválida) depois de 'b'
        if (!dataB) return -1; // Coloca 'b' (inválida) antes de 'a'

        return dataA - dataB;
    });

    const proximasReservasParaMostrar = reservasFuturas.slice(0, 3);

    renderizarListaReservasIndex(proximasReservasParaMostrar, todosOsCamposIndex, listaReservasContainer);

  } catch (error) {
    console.error("Erro ao carregar ou processar reservas para o Index:", error);
    listaReservasContainer.innerHTML = '<p>Ocorreu um erro ao carregar as suas reservas.</p>';
  }
}

function renderizarListaReservasIndex(reservasParaMostrar, camposInfo, container) {
  container.innerHTML = ''; // Limpa o container
  container.classList.remove('cards'); // Remove a classe 'cards' por defeito

  if (reservasParaMostrar.length === 0) {
    const mensagemSemReservas = document.createElement('p');
    mensagemSemReservas.textContent = 'Nenhuma reserva futura encontrada.';
    container.appendChild(mensagemSemReservas);
  } else {
    container.classList.add('cards'); 
    reservasParaMostrar.forEach(reserva => {
      const campoDetalhes = camposInfo.find(campo => campo.id.toString() === reserva.campoId.toString());
      const nomeCampo = reserva.nomeCampo || (campoDetalhes ? campoDetalhes.nome : 'Campo Desconhecido'); // Usa nomeCampo da reserva se existir

      const cardReserva = document.createElement('div');
      cardReserva.className = 'card'; 

      let dataFormatada = reserva.data; 
      const horarioDisplay = reserva.horario || 'N/D';
      const desportoDisplay = reserva.desporto || (campoDetalhes ? campoDetalhes.desportos?.join(', ') : 'N/D'); // Pega desporto do campo se não houver na reserva

      cardReserva.innerHTML = `
        <div class="card-content">
          <h3>${nomeCampo}</h3>
          <p><strong>Data:</strong> ${dataFormatada}</p>
          <p><strong>Hora:</strong> ${horarioDisplay}</p>
          <p><strong>Desporto:</strong> ${desportoDisplay}</p>
        </div>
      `;
      container.appendChild(cardReserva);
    });
  }

  // Adiciona o card "Ver todas as reservas"
  const cardVerTodas = document.createElement("div");
  cardVerTodas.className = "card add-card view-all-reservas-card";
  cardVerTodas.innerHTML = `
    <div class="add-card-content">📅 Ver todas as reservas</div>
  `;
  cardVerTodas.title = 'Ver todas as suas reservas';
  cardVerTodas.style.cursor = 'pointer';
  cardVerTodas.onclick = () => window.location.href = '../reservas/reservas.html';
  container.appendChild(cardVerTodas);
}

// Adicione um listener para chamar a função de carregamento quando o DOM estiver pronto,
// caso este script seja carregado de forma independente e não dependa de outro DOMContentLoaded.
// Se index/script.js já tem um DOMContentLoaded que chama carregarEExibirReservasIndex,
// esta parte pode não ser necessária aqui, e a chamada seria feita a partir do script principal.
// Por agora, vamos assumir que será chamado do script principal.
// document.addEventListener('DOMContentLoaded', carregarEExibirReservasIndex);