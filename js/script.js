// Verifica se o usuário está logado
window.onload = function () {
  // Verifica se o usuário está logado
  if (!localStorage.getItem("loggedIn")) {
    window.location.href = "../index.html";
  }
};

// Fazer logout
document.getElementById("logoutButton").onclick = function () {
  // Limpa o status de login
  localStorage.removeItem("loggedIn");
  // Redireciona para a página de login
  window.location.href = "../index.html";
};
