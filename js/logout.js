function logout(){

// apagar dados de login
localStorage.removeItem("alunoID")
localStorage.removeItem("professorLogado")

// voltar para página inicial
window.location="index.html"

}
