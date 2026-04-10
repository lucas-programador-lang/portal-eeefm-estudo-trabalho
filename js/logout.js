/* ==========================================================
   FUNÇÃO DE LOGOUT - EEEFM ESTUDO E TRABALHO
   ========================================================== */

function logout() {
    // 1. Notificação amigável (Opcional, mas melhora a UX)
    console.log("Encerrando sessão segura...");

    // 2. Limpeza de dados de login
    // Remove as chaves específicas que você usou nos outros arquivos
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    
    // Mantendo os seus originais por segurança (caso existam em versões antigas)
    localStorage.removeItem("alunoID");
    localStorage.removeItem("professorLogado");

    /* DICA PARA PRODUÇÃO: 
       Se quiser limpar absolutamente TUDO do site de uma vez, 
       você pode usar: localStorage.clear();
    */

    // 3. Redirecionamento para a página inicial
    // Usamos .href para garantir compatibilidade total com todos os navegadores
    window.location.href = "index.html";
}
