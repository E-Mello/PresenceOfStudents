//Constants
let students = {};

// Carrega os alunos quando a página é carregada
document.addEventListener("DOMContentLoaded", (event) => {
  // Aqui, você poderia verificar se está na página de alunos antes de chamar a função
  if (window.location.hash === "./student-control") {
    carregarAlunos();
  }
  // Inicia a observação quando o DOM é carregado
  observarConteudo();
});

// Função para carregar os alunos quando o conteúdo de main-content muda
function observarConteudo() {
  const mainContent = document.querySelector(".main-content");

  // Cria um MutationObserver para observar mudanças no conteúdo
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // Verifica se a mutação está relacionada ao conteúdo de main-content
      if (mutation.target === mainContent) {
        // Verifica se a página "student-control" está sendo exibida
        if (window.location.hash === "./student-control") {
          // Chama a função para carregar e renderizar os alunos
          carregarAlunos();
        }
      }
    });
  });

  // Configurações para observar mudanças no conteúdo
  const config = { childList: true, subtree: true };

  // Inicia a observação no elemento main-content
  observer.observe(mainContent, config);
}

function carregarAlunos() {
  // Lógica para carregar a lista de alunos do back-end (usando AJAX/fetch)
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

      // Limpa a tabela antes de renderizar os alunos
      limparTabela();

      // Renderiza os alunos após o término da requisição
      renderizarAlunos();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function limparTabela() {
  // Limpa a tabela de alunos antes de renderizar novos dados
  const tabela = document.getElementById("alunosTable");
  tabela.innerHTML =
    "<thead><tr><th>ID</th><th>Nome</th><th>Presença</th><th>Ações</th></tr></thead><tbody></tbody>";
}

function renderizarAlunos() {
  const tabela = document.getElementById("alunosTable");

  if (tabela) {
    // Verifica se a tabela existe
    students.forEach((student) => {
      const row = tabela.insertRow();
      const cellId = row.insertCell(0);
      const cellNome = row.insertCell(1);
      const cellEmail = row.insertCell(2);
      const cellAcoes = row.insertCell(3);

      cellId.innerHTML = student.id;
      cellNome.innerHTML = student.nome;
      cellEmail.innerHTML = student.email;
      cellAcoes.innerHTML =
        '<button onclick="removerAluno(' +
        student.id +
        ')">Remover</button>' +
        '<button onclick="editarAluno(' +
        student.id +
        ')">Editar</button>';
    });
  } else {
    console.error("Tabela não encontrada no DOM.");
  }
}

function adicionarAluno() {
  // Lógica para adicionar um aluno (usando AJAX/fetch para interagir com o back-end)
}

function editarAluno(id) {
  // Lógica para editar um aluno (usando AJAX/fetch)
}

function excluirAluno(id) {
  // Lógica para excluir um aluno (usando AJAX/fetch)
}
