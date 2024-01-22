// Adicione um evento de clique aos links da barra lateral para carregar o conteúdo da página no main.main-content
document.querySelectorAll(".sidebar a").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    // Captura o hash da URL do link clicado
    const pageHash = this.getAttribute("href");

    // Carrega o conteúdo da página no div .main-content
    fetch(`${pageHash}.html`)
      .then((response) => response.text())
      .then((content) => {
        // Substitui apenas o conteúdo dentro da .main-content
        document.querySelector(".main-content").innerHTML = content;

        // Verifica se a página carregada é a de alunos
        if (pageHash === "./student-control") {
          // Chama a função para carregar e renderizar os alunos
          carregarAlunos();
        }
      });
  });
});

// Carrega o conteúdo da página inicial ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  const pageHash = window.location.hash.slice(1) || "welcome"; // Remove o primeiro caractere (#) se presente
  fetch(`${pageHash}.html`)
    .then((response) => response.text())
    .then((content) => {
      // Substitui apenas o conteúdo dentro da .main-content
      document.querySelector(".main-content").innerHTML = content;
    });
});
