// Função para abrir detalhes de uma reserva
function abrirDetalhesReserva() {
    alert("Abrindo detalhes da reserva...");
  }
  
  // Função para cancelar presenças
  function cancelarPresencas() {
    alert("Presenças canceladas!");
  }
  
  // Função para cancelar uma reserva
  function cancelarReserva() {
    alert("Reserva cancelada!");
  }
  
  // Adicionar eventos aos botões
  document.addEventListener("DOMContentLoaded", () => {
    const detalhesBtns = document.querySelectorAll(".detalhes-btn");
    const cancelarPresencaBtns = document.querySelectorAll(".cancelar-presenca-btn");
    const cancelarReservaBtns = document.querySelectorAll(".cancelar-reserva-btn");
  
    detalhesBtns.forEach(btn => btn.addEventListener("click", abrirDetalhesReserva));
    cancelarPresencaBtns.forEach(btn => btn.addEventListener("click", cancelarPresencas));
    cancelarReservaBtns.forEach(btn => btn.addEventListener("click", cancelarReserva));
  });