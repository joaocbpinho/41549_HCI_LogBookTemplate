async function carregarEExibirReservasIndex() {
  const listaReservasContainer = document.getElementById('listaReservas');
  if (!listaReservasContainer) {
    console.error("Elemento #listaReservas não encontrado no DOM.");
    return;
  }

  listaReservasContainer.innerHTML = '<p>A carregar as suas próximas reservas e convites...</p>';
  listaReservasContainer.classList.remove('cards');

  const userIdLogado = "prototipoUser"; 

  if (!userIdLogado) {
    listaReservasContainer.innerHTML = '<p>Faça login para ver as suas reservas e convites.</p>';
    return;
  }

  try {
    const responseCampos = await fetch('../campo/campos.json'); 
    if (!responseCampos.ok) throw new Error(`Erro ao carregar campos: ${responseCampos.status}`);
    const todosOsCamposIndex = await responseCampos.json();

    const reservasGuardadas = localStorage.getItem('todasReservas');
    let todasAsReservasDoStorage = [];
    if (reservasGuardadas) {
      todasAsReservasDoStorage = JSON.parse(reservasGuardadas);
    }

    // Adicionar tipo 'reserva' às reservas existentes
    const reservasFormatadas = todasAsReservasDoStorage
      .filter(reserva => reserva.userId === userIdLogado)
      .map(reserva => ({ ...reserva, tipo: 'reserva' }));

    // SIMULAÇÃO DE CONVITES PENDENTES (para este protótipo)
    // No futuro, estes viriam de um sistema de notificações/convites
    const convitesPendentesSimulados = [
      {
        id: 'convite-idx-1',
        tipo: 'convite', // Identificador
        nomeCampo: 'Estádio Municipal', // Nome do campo
        campoId: 'c2', // ID do campo correspondente em campos.json, se aplicável
        data: '15/07/2025', // Formato DD/MM/YYYY
        horario: '19:00',   // Formato HH:MM (hora de início)
        convidadoPor: 'Equipa "Os Campeões"',
        precoParaSi: 10.00,
        desporto: 'Futebol' // Adicionar desporto se quiser mostrar
      }
      // Removido o segundo convite simulado que estava aqui
    ];

    // Combinar reservas e convites
    const itensCombinados = [...reservasFormatadas, ...convitesPendentesSimulados];

    const agora = new Date();

    // Função auxiliar para converter data e hora para um objeto Date
    function criarObjetoDateDaReserva(dataStr, horaInicioStr) {
        try {
            if (!dataStr || !horaInicioStr || !dataStr.includes('/') || !horaInicioStr.includes(':')) {
                // console.warn('[reservasindex.js] Data ou hora inválida para criar objeto Date:', dataStr, horaInicioStr);
                return null; 
            }
            const partesData = dataStr.split('/'); 
            const partesHora = horaInicioStr.split(':'); 
            if (partesData.length !== 3 || partesHora.length !== 2) return null;
            
            const ano = parseInt(partesData[2]);
            const mes = parseInt(partesData[1]) - 1; 
            const dia = parseInt(partesData[0]);
            const hora = parseInt(partesHora[0]);
            const minuto = parseInt(partesHora[1]);
            if (isNaN(ano) || isNaN(mes) || isNaN(dia) || isNaN(hora) || isNaN(minuto)) return null;
            
            const dataObj = new Date(ano, mes, dia, hora, minuto);
            return isNaN(dataObj.getTime()) ? null : dataObj;
        } catch (e) {
            console.error('[reservasindex.js] Erro ao criar objeto Date:', dataStr, horaInicioStr, e);
            return null;
        }
    }

    const itensFuturos = itensCombinados.filter(item => {
        // Para convites, o 'horario' já é a hora de início. Para reservas, pode ser um intervalo.
        let horaDeInicioParaUsar = item.horario ? (item.horario.includes(' - ') ? item.horario.split(' - ')[0].trim() : item.horario.trim()) : null;
        
        if (!horaDeInicioParaUsar) {
            // console.warn("[reservasindex.js] Item sem 'horario' definido ou em formato incorreto:", item);
            return false;
        }
        const dataItem = criarObjetoDateDaReserva(item.data, horaDeInicioParaUsar);
        return dataItem && dataItem > agora;
    });

    itensFuturos.sort((a, b) => {
        let horaInicioA = a.horario ? (a.horario.includes(' - ') ? a.horario.split(' - ')[0].trim() : a.horario.trim()) : null;
        let horaInicioB = b.horario ? (b.horario.includes(' - ') ? b.horario.split(' - ')[0].trim() : b.horario.trim()) : null;

        const dataA = criarObjetoDateDaReserva(a.data, horaInicioA);
        const dataB = criarObjetoDateDaReserva(b.data, horaInicioB);

        if (!dataA && !dataB) return 0;
        if (!dataA) return 1; 
        if (!dataB) return -1;
        return dataA - dataB;
    });

    const proximosItensParaMostrar = itensFuturos.slice(0, 3); // Mostrar os 3 próximos (reservas ou convites)

    renderizarListaItensIndex(proximosItensParaMostrar, todosOsCamposIndex, listaReservasContainer);

  } catch (error) {
    console.error("Erro ao carregar ou processar reservas e convites para o Index:", error);
    listaReservasContainer.innerHTML = '<p>Ocorreu um erro ao carregar os seus compromissos.</p>';
  }
}

// Renomeada para renderizarListaItensIndex para refletir que lida com reservas e convites
function renderizarListaItensIndex(itensParaMostrar, camposInfo, container) {
  container.innerHTML = ''; 
  container.classList.remove('cards'); 

  if (itensParaMostrar.length === 0) {
    const mensagemSemItens = document.createElement('p');
    mensagemSemItens.textContent = 'Nenhuma reserva futura ou convite pendente encontrado.';
    container.appendChild(mensagemSemItens);
  } else {
    container.classList.add('cards'); 
    itensParaMostrar.forEach(item => {
      const campoDetalhes = camposInfo.find(campo => campo.id.toString() === (item.campoId ? item.campoId.toString() : ''));
      const nomeCampo = item.nomeCampo || (campoDetalhes ? campoDetalhes.nome : 'Campo Desconhecido');

      const cardItem = document.createElement('div');
      cardItem.className = 'card'; 
      if (item.tipo === 'convite') {
        cardItem.classList.add('convite-index'); 
      }

      let dataFormatada = item.data; 
      try {
        const partesData = item.data.split('/');
        if (partesData.length === 3) {
          const dataObj = new Date(partesData[2], parseInt(partesData[1]) - 1, partesData[0]);
          if (!isNaN(dataObj.getTime())) {
            dataFormatada = dataObj.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' });
          }
        }
      } catch (e) { /* usa data original se falhar */ }

      const horarioDisplay = item.horario || 'N/D';
      
      let detalhesEspecificos = '';
      let etiquetaConviteHTML = ''; // Definir AQUI, no escopo do forEach, inicialmente vazia

      if (item.tipo === 'convite') {
        etiquetaConviteHTML = `<div class="convite-etiqueta">CONVITE</div>`; // Atribuir o HTML da etiqueta se for um convite
        const precoConvite = item.precoParaSi !== undefined ? `<p><strong>Preço para si:</strong> ${parseFloat(item.precoParaSi).toFixed(2)}€</p>` : '';
        const convidadoPor = item.convidadoPor ? `<p><strong>Convidado por:</strong> ${item.convidadoPor}</p>` : '';
        
        detalhesEspecificos = `
          ${convidadoPor}
          ${precoConvite}
        `;
        cardItem.style.cursor = 'pointer';
        cardItem.title = 'Ver detalhes do convite na página de Reservas';
        cardItem.onclick = () => window.location.href = '../reservas/reservas.html'; 
      } else { // É uma reserva
        const desportoDisplay = item.desporto || (campoDetalhes ? campoDetalhes.desportos?.join(', ') : 'N/D');
        detalhesEspecificos = `<p><strong>Desporto:</strong> ${desportoDisplay}</p>`;
      }

      // Construir o innerHTML do card
      cardItem.innerHTML = `
        <div class="card-content">
          <h3>${nomeCampo}</h3>
          ${etiquetaConviteHTML}
          <p><strong>Data:</strong> ${dataFormatada}</p>
          <p><strong>Hora:</strong> ${horarioDisplay}</p>
          ${detalhesEspecificos}
        </div>
      `;
      container.appendChild(cardItem);
    });
  }

  const cardVerTodas = document.createElement("div");
  cardVerTodas.className = "card add-card view-all-reservas-card";
  cardVerTodas.innerHTML = `
    <div class="add-card-content">📅 Ver todas as reservas e convites</div>
  `;
  cardVerTodas.title = 'Ver todas as suas reservas e convites';
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