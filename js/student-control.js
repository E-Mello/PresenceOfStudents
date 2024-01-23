//Constants
let students = {};
let idStudentEdit = 0;
let nameStudentEdit = "";
let emailStudentEdit = "";

// Carrega os alunos quando a página é carregada
document.addEventListener("DOMContentLoaded", (event) => {
  // Aqui, você poderia verificar se está na página de alunos antes de chamar a função
  if (window.location.hash === "./student-control") {
    carregarAlunos();
  }
});

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

      // Renderiza os alunos após o término da requisição
      renderizarAlunos();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function limparCampos() {
  // Limpa os campos antes de adicionar um novo aluno
  document.getElementById("nome").value = "";
  document.getElementById("email").value = "";
}

function limparTabela() {
  // Limpa a tabela de alunos antes de renderizar novos dados
  const tabela = document.getElementById("alunosTable");
  tabela.innerHTML = "";
}

function renderizarAlunos() {
  limparCampos();
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
        '<div class="thAcoes">' +
        '<button class="thAcoesEdit" onclick="openModalEdit(' +
        student.id +
        ')">Editar</button>' +
        '<button class="thAcoesDel" onclick="excluirAluno(' +
        student.id +
        ')">Remover</button>' +
        "</div>";
    });
  } else {
    console.error("Tabela não encontrada na DOM.");
  }
}

async function adicionarAluno() {
  try {
    // Lógica para adicionar um aluno (usando AJAX/fetch para interagir com o back-end)
    const response = await fetch("http://localhost:3000/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    // Print do retorno
    console.log("Response Data:", response);

    // Recarregar os alunos
    carregarAlunos();
    console.log("Aluno adicionado com sucesso!");
  } catch (error) {
    console.error("Error:", error);
  }
}

function limparModal() {
  idStudentEdit = 0;
  nameStudentEdit = "teste";
  emailStudentEdit = "teste";
}

function openModalEdit(id) {
  const student = students.find((student) => student.id === id);
  if (student) {
    console.log("Abrindo modal para edição do aluno: " + id);
    console.log("Aluno: " + student.nome);
    console.log("Email: " + student.email);
    idStudentEdit = id;
    nameStudentEdit = student.nome;
    emailStudentEdit = student.email;
    document.getElementById("modalEdit").style.display = "block";
    document.querySelector("#editNome").value = nameStudentEdit;
    document.querySelector("#editEmail").value = emailStudentEdit;
  } else {
    console.error("Estudante não encontrado: " + id);
  }
}

function fecharModalEdit() {
  limparModal();
  document.getElementById("modalEdit").style.display = "none";
}

async function editarAluno() {
  // Lógica para editar um aluno (usando AJAX/fetch)
  try {
    const response = await fetch(
      "http://localhost:3000/students/" + idStudentEdit,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: document.querySelector("#editNome").value,
          email: document.querySelector("#editEmail").value,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Print do retorno
    console.log("Response Data:", response);

    // Limpa a tabela
    limparTabela();
    // Recarregar os alunos
    carregarAlunos();
    fecharModalEdit();
    console.log("Aluno adicionado com sucesso!");
  } catch (error) {
    console.error("Error:", error);
  }
}

async function excluirAluno(id) {
  // Lógica para excluir um aluno (usando AJAX/fetch)
  try {
    const response = await fetch("http://localhost:3000/students/" + id, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    // Print do retorno
    console.log("Response Data:", response);

    // Limpa a tabela
    limparTabela();
    // Recarregar os alunos
    carregarAlunos();
    console.log("Aluno adicionado com sucesso!");
  } catch (error) {
    console.error("Error:", error);
  }
}
