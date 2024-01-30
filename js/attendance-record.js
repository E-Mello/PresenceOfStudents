// Constantes
let studentsAttendance = [];
let attendances = [];
let attendanceID = [];
let attendanceDate = "";
let attendancePresence = null;

function closeDialog() {
  document.querySelector("dialog").close();
}

// Carrega as presenças quando a página é carregada
document.addEventListener("DOMContentLoaded", (event) => {
  // Aqui, você poderia verificar se está na página de alunos antes de chamar a função
  if (window.location.hash === "./attendance-record") {
    readAttendances();
  }
});

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

    studentsAttendance = await response.json();
    console.log("Estudantes para serem apresentados:", studentsAttendance);

    // Iterar sobre os alunos e adicionar opções ao select
    studentsAttendance.forEach((student) => {
      const optionElement = document.createElement("option");
      optionElement.value = student.id;
      optionElement.textContent = student.nome;
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

async function readAttendances() {
  try {
    const response = await fetch("http://localhost:3000/attendance", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    attendances = await response.json();
    // Print do retorno
    console.log("Response Data:", response);

    // Renderiza a tabela de presença apenas o termino da requisição
    renderAttendanceTable();
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
  }
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

    clearTable();
    // Recarrega a tabela de presença
    readAttendances();
    closeDialog();
    limparCampos();
    console.log("Chamada registrada com sucesso no banco de dados.");
  } catch (error) {
    console.error("Erro ao enviar dados de chamada para o servidor:", error);
    console.error("Detalhes do erro:", await response.text());
  }
}

// Função para carregar chamadas ao carregar a página
function renderAttendanceTable() {
  // Agrupar as presenças por dia
  const attendancesByDay = {};
  attendances.forEach((attendance) => {
    if (!attendancesByDay[attendance.data]) {
      attendancesByDay[attendance.data] = [];
    }
    attendancesByDay[attendance.data].push(attendance);
  });

  // Criar acordeões dinamicamente
  const accordionContainer = document.getElementById("accordionContainer");

  Object.keys(attendancesByDay).forEach((day, index) => {
    const accordion = document.createElement("div");
    accordion.className = "accordion";
    accordion.textContent = day;
    accordion.onclick = () => toggleAccordion(`panel${index + 1}`);

    const panel = document.createElement("div");
    panel.className = "panel";
    panel.id = `panel${index + 1}`;

    const tabela = document.createElement("table");
    tabela.innerHTML = `
        <thead>
          <tr>
            <th>Nome</th>
            <th>Presença</th>
            <th>Data da presença</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;

    // Adicionar acordeão e tabela ao contêiner
    accordionContainer.appendChild(accordion);
    accordionContainer.appendChild(panel);
    panel.appendChild(tabela);

    attendancesByDay[day].forEach((attendance) => {
      // Encontrar o aluno correspondente na lista de alunos
      const student = studentsAttendance.find(
        (student) => student.id === attendance.aluno_id
      );

      // Se o aluno não for encontrado, retorne para evitar erros
      if (!student) return;

      const row = tabela.insertRow();
      const cellNome = row.insertCell(0);
      const cellPresence = row.insertCell(1);
      const cellDtAttendance = row.insertCell(2);
      const cellAcoes = row.insertCell(3);

      // Use o nome do aluno em vez do nome da presença
      cellNome.innerHTML = student.nome;
      cellPresence.innerHTML = attendance.presente;
      cellDtAttendance.innerHTML = attendance.data;
      cellAcoes.innerHTML =
        '<div class="thAcoes">' +
        '<button class="thAcoesEdit" onclick="openDialogEdit(' +
        attendance.id +
        ')">Editar Chamada</button>' +
        '<button class="thAcoesDel" onclick="delAttendance(' +
        attendance.id +
        ')">Remover Chamada</button>' +
        "</div>";
    });
  });
}

function toggleAccordion(dayId) {
  var panel = document.getElementById(dayId);
  if (panel.style.display === "block") {
    panel.style.display = "none";
  } else {
    panel.style.display = "block";
  }
}

function openDialogEdit(id) {
  const dialog = document.getElementById("editDialog");
  dialog.showModal();
  console.log("Chamando openDialogEdit");
  const attendance = attendances.find((attendance) => attendance.id === id);
  if (!attendance) return;
  attendanceID = attendance.id;
  console.log("attendanceID:", attendanceID);
  attendanceDate = attendance.data;
  console.log("attendanceDate:", attendanceDate);
  attendancePresence = attendance.presente;
  console.log("attendancePresence:", attendancePresence);
}

function closeEditDialog() {
  document.querySelector("#editDialog").close();
}

async function editAttendance() {
  try {
    const response = await fetch(
      "http://localhost:3000/attendance/" + attendanceID,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: attendanceDate,
          presente: attendancePresence,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao editar chamada");
    }
    // Print do retorno
    console.log("Response Data:", response);

    // Limpa a tabela
    clearTable();

    // Recarrega a tabela de presença
    readAttendances();
    console.log("Chamada editada com sucesso no banco de dados.");
  } catch (error) {
    console.error("Erro ao editar chamada:", error);
  }
}

function clearTable() {
  const tabela = document.getElementById("attendanceTable");
  tabela.innerHTML = "";
}

async function delAttendance(id) {
  try {
    const response = await fetch(`http://localhost:3000/attendance/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao excluir chamada");
    }

    // Print do retorno
    console.log("Response Data:", response);

    // Limpa a tabela
    clearTable();

    // Recarrega a tabela de presença
    readAttendances();
    console.log("Chamada excluída com sucesso no banco de dados.");
  } catch (error) {
    console.error("Erro ao excluir chamada:", error);
    console.error("Detalhes do erro:", await response.text());
  }
}
