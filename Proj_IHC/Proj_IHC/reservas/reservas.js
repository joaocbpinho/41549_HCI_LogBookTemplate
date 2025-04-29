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

// Abrir a sidebar
function openProfileSidebar() {
    const sidebar = document.getElementById("profileSidebar");
    const overlay = document.getElementById("sidebarOverlay");
    sidebar.style.width = "250px";
    overlay.classList.add("active");
  }
  
  // Fechar a sidebar
  function closeProfileSidebar() {
    const sidebar = document.getElementById("profileSidebar");
    const overlay = document.getElementById("sidebarOverlay");
    sidebar.style.width = "0";
    overlay.classList.remove("active");
  }
  
  // Função de logout
  function fazerLogout() {
    alert("Logout efetuado!");
    closeProfileSidebar();
  }