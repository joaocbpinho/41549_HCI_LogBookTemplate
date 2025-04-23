// Função para voltar à página anterior
function voltar() {
    window.history.back();
  }
  
  // Exemplo de funcionalidade para alternar entre abas
  document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab-btn");
  
    tabButtons.forEach(button => {
      button.addEventListener("click", () => {
        tabButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        // Aqui você pode adicionar lógica para alternar entre "Feitas por ti" e "Mais Recentes"
      });
    });
  });