function realizarLogin() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // Adicione aqui a lógica de validação do usuário e senha
  if (username == "usuario" && password == "senha") {
    // Armazena o status de login
    localStorage.setItem("loggedIn", true);
    window.location.href = "./pages/home.html";
  } else {
    alert("Usuário ou senha incorretos!");
  }
}
