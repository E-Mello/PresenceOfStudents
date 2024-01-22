function registrarPresenca() {
  // Obtém o nome do aluno
  var nomeAluno = document.getElementById("nome-aluno").value;

  // Verifica se o nome do aluno não está vazio
  if (nomeAluno.trim() === "") {
    alert("Por favor, insira o nome do aluno.");
    return;
  }

  // Cria um elemento de lista para o aluno
  var novoItem = document.createElement("li");
  novoItem.textContent = nomeAluno;

  // Adiciona o aluno à lista de alunos presentes
  document.getElementById("alunos-presentes").appendChild(novoItem);

  // Limpa o campo do nome do aluno
  document.getElementById("nome-aluno").value = "";
}
