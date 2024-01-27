function closeDialog() {
  document.querySelector("dialog").close();
}

// Função para buscar alunos do banco de dados e renderizar no select
async function fetchStudentsAndRenderSelect() {
  try {
    // Elemento select
    const selectElement = document.getElementById("selectName");
    console.log("selectElement:", selectElement);

    // Limpar as opções existentes
    selectElement.innerHTML = "<option value=''>Selecione...</option>";

    // Verifique se a função está sendo chamada
    console.log("Chamando fetchStudentsAndRenderSelect");

    // Fetch para obter alunos
    const response = await fetch("http://localhost:3000/students", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const students = await response.json();
    console.log("Students:", students);

    // Iterar sobre os alunos e adicionar opções ao select
    students.forEach((student) => {
      const optionElement = document.createElement("option");
      optionElement.value = student.id; // Supondo que você tenha um campo 'id' no objeto aluno
      optionElement.textContent = student.nome; // Supondo que você tenha um campo 'name' no objeto aluno
      optionElement.setAttribute("data-student-id", student.id); // Atributo personalizado para armazenar o ID
      selectElement.appendChild(optionElement);
    });
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
  }
}

function limparCampos() {
  document.getElementById("date").value = "";
  document.getElementById("selectName").value = "";
}

// Função para enviar os dados de chamada para o servidor
async function recordAndClose() {
  // Obtém o ID do aluno selecionado
  const selectElement = document.getElementById("selectName");
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const studentId = selectedOption.getAttribute("data-student-id");

  // Obtém a data selecionada
  const selectedDate = document.getElementById("date").value;

  // Verifica se um aluno foi selecionado
  if (!studentId) {
    throw new Error("Selecione um aluno antes de registrar a chamada.");
  }

  // Verifica se uma data foi selecionada
  if (!selectedDate) {
    throw new Error("Selecione uma data antes de registrar a chamada.");
  }

  try {
    const response = await fetch("http://localhost:3000/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aluno_id: studentId,
        data: selectedDate,
        presente: true,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao enviar dados de chamada para o servidor");
    }

    // Print do retorno
    console.log("Response Data:", response);

    // Recarrega a tabela de presença
    loadAttendanceTable();
    closeDialog();
    limparCampos();
    console.log("Chamada registrada com sucesso no banco de dados.");
  } catch (error) {
    console.error("Erro ao enviar dados de chamada para o servidor:", error);
    console.error("Detalhes do erro:", await response.text());
  }
}

// Chama a função assim que a página carrega
document.addEventListener("DOMContentLoaded", loadAttendanceTable);

// Função para carregar chamadas ao carregar a página
function loadAttendanceTable() {
  const tabela = document.getElementById("attendanceTable");

  if (tabela) {
    // Verifica se a tabela existe
    students.forEach((student) => {
      const row = tabela.insertRow();
      const cellNome = row.insertCell(0);
      const cellPresence = row.insertCell(1);
      const cellDtAttendance = row.insertCell(2);
      const cellAcoes = row.insertCell(3);

      cellNome.innerHTML = student.nome;
      cellPresence.innerHTML = student.presente;
      cellDtAttendance.innerHTML = student.data;
      cellAcoes.innerHTML =
        '<div class="thAcoes">' +
        '<button class="thAcoesEdit" onclick="openDialogEdit(' +
        student.id +
        ')">Editar Chamada</button>' +
        '<button class="thAcoesDel" onclick="delAttendance(' +
        student.id +
        ')">Remover Chamada</button>' +
        "</div>";
    });
  } else {
    console.error("Tabela não encontrada na DOM.");
  }
}
