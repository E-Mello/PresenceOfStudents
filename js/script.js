// Verifica se o usuário está logado
window.onload = function () {
  // Verifica se o usuário está logado
  if (!localStorage.getItem("loggedIn")) {
    window.location.href = "../index.html";
  }
};

// Adicione um evento de clique aos links da barra lateral para carregar o conteúdo da página no main.main-content
document.querySelectorAll(".sidebar a").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault(); // Evita que o link carregue a página

    // Carrega o conteúdo da página no div .main-content
    fetch(this.href)
      .then((response) => response.text())
      .then((content) => {
        document.querySelector(".main-content").innerHTML = content;
      });
  });
});

// Fazer logout
document.getElementById("logoutButton").onclick = function () {
  // Limpa o status de login
  localStorage.removeItem("loggedIn");
  // Redireciona para a página de login
  window.location.href = "../index.html";
};

// Carrega os alunos quando a página é carregada
document.addEventListener("DOMContentLoaded", (event) => {
  carregarAlunos();
});

//Constants
let students = {};

function adicionarAluno() {
  // Lógica para adicionar um aluno (usando AJAX/fetch para interagir com o back-end)
}

function carregarAlunos() {
  // Lógica para carregar a lista de alunos do back-end (usando AJAX/fetch)
  // Make a GET request using the Fetch API
  fetch("http://localhost:3000/students")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((userData) => {
      // Process the retrieved user data
      students = userData;
      console.log("User Data:", userData);
      renderizarAlunos();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function renderizarAlunos() {
  const tabela = document.getElementById("alunosTable");
  students.forEach((student) => {
    const row = tabela.insertRow();
    const cellId = row.insertCell(0);
    const cellNome = row.insertCell(1);
    const cellPresenca = row.insertCell(2);
    const cellAcoes = row.insertCell(3);

    cellId.innerHTML = student.id;
    cellNome.innerHTML = student.nome;
    cellPresenca.innerHTML = student.presenca ? "Presente" : "Ausente";
    cellAcoes.innerHTML =
      '<button onclick="removerAluno(' + student.id + ')">Remover</button>';
  });
}

function editarAluno(id) {
  // Lógica para editar um aluno (usando AJAX/fetch)
}

function excluirAluno(id) {
  // Lógica para excluir um aluno (usando AJAX/fetch)
}

function marcarPresenca(id) {
  // Lógica para marcar a presença de um aluno (usando AJAX/fetch)
}

// Carregar alunos quando a página é carregada
document.addEventListener("DOMContentLoaded", () => {
  carregarAlunos();
});
