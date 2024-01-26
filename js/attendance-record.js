function closeDialog() {
  document.querySelector("dialog").close();
}

document.addEventListener("DOMContentLoaded", function () {
  fetchStudentsAndRenderSelect();
});

// Função para buscar alunos do banco de dados e renderizar no select
async function fetchStudentsAndRenderSelect() {
  try {
    // URL da API para buscar os alunos
    const apiUrl = "http://localhost:3000/students";

    // Elemento select
    const selectElement = document.querySelector("select");

    // Limpar as opções existentes
    if (selectElement) {
      selectElement.innerHTML = "<option value=''>Selecione...</option>";
      // Restante do código para preencher as opções...
    } else {
      console.error("Elemento com ID 'name' não encontrado.");
    }

    // Fetch para obter alunos
    const response = await fetch(apiUrl, {
      method: "GET",
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
    // Iterar sobre os alunos e adicionar opções ao select
    data.forEach((student) => {
      const optionElement = document.createElement("option");
      optionElement.value = student.id; // Supondo que você tenha um campo 'id' no objeto aluno
      optionElement.textContent = student.name; // Supondo que você tenha um campo 'name' no objeto aluno
      selectElement.appendChild(optionElement);
    });
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
  }
}

// Chamar a função para buscar alunos assim que a página carregar
document.addEventListener("DOMContentLoaded", fetchStudentsAndRenderSelect);

// Função para registrar a chamada e fechar o diálogo
function recordAndClose() {
  // Lógica para registrar a chamada
  // ...

  // Fechar o diálogo
  closeDialog();
}
