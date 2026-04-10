/* ==========================================================
   EEEFM ESTUDO E TRABALHO - SCRIPT PRINCIPAL (BACKEND INTEGRATION)
   ========================================================== */

// ==========================
// URL BACKEND
// ==========================
const API = "https://portal-escola-backend.onrender.com"


// ==========================
// ANIMAÇÃO ENTRE SEÇÕES
// ==========================
function mostrar(sec){
    document.querySelectorAll(".section").forEach(s=>{
        s.classList.remove("active","fade")
    })

    const el = document.getElementById(sec)

    if(el){
        el.classList.add("active")
        // Pequeno delay para garantir que a transição de opacidade ocorra
        setTimeout(()=>{
            el.classList.add("fade")
        },50)
    }
}


// ==========================
// TOKEN
// ==========================
function getToken(){
    return localStorage.getItem("token")
}


// ==========================
// VERIFICAR LOGIN
// ==========================
function verificarLogin(){
    const token = getToken()
    const path = window.location.pathname;

    // BUG FIX: Evita loop de redirecionamento se já estiver na página de login
    if(!token && !path.includes("login")){
        window.location.href="login-admin.html"
        return false
    }
    return true
}


// ==========================
// FETCH PADRÃO (CORRIGIDO)
// ==========================
async function apiFetch(url, options={}){
    try{
        const isFormData = options.body instanceof FormData
        const token = getToken()

        // Montagem dinâmica de headers
        const headers = {
            ...(isFormData ? {} : {"Content-Type":"application/json"}),
            ...(token ? {Authorization:"Bearer "+token} : {}),
            ...(options.headers || {})
        }

        const res = await fetch(API+url,{
            ...options,
            headers: headers
        })

        // BUG FIX: Verificação de expiração de token (401 ou 403)
        if(res.status === 401 || res.status === 403){
            logout()
            return null
        }

        if(!res.ok){
            const text = await res.text()
            console.error("Erro servidor:", text)
            try { 
                const errData = JSON.parse(text);
                if(errData.erro) alert(errData.erro);
            } catch(e) {}
            return null
        }

        return await res.json()

    }catch(err){
        console.error("Erro API:",err)
        // Só exibe alert se não for erro de cancelamento de requisição
        if(err.name !== 'AbortError') {
            alert("Erro de conexão com servidor. Verifique sua internet.");
        }
        return null
    }
}


// ==========================
// FORMATAR CPF (MELHORADO)
// ==========================
function formatarCPF(campo){
    if(!campo) return
    let cpf = campo.value.replace(/\D/g,'')

    if(cpf.length > 11) cpf = cpf.slice(0, 11)

    cpf = cpf.replace(/(\d{3})(\d)/,"$1.$2")
    cpf = cpf.replace(/(\d{3})(\d)/,"$1.$2")
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/,"$1-$2")

    campo.value = cpf
}


// ==========================
// DASHBOARD
// ==========================
async function carregarDashboard(){
    let dados = await apiFetch("/dashboard")

    if(!dados) return

    if(document.getElementById("totalAlunos")) document.getElementById("totalAlunos").innerText = dados.alunos || 0
    if(document.getElementById("totalProfessores")) document.getElementById("totalProfessores").innerText = dados.professores || 0
    if(document.getElementById("totalPublicacoes")) document.getElementById("totalPublicacoes").innerText = dados.publicacoes || 0
}


// ==========================
// CADASTRAR ALUNO
// ==========================
async function cadastrarAluno(e){
    if(e) e.preventDefault()

    let nome = document.getElementById("nomeAluno").value
    let cpf = document.getElementById("cpfAluno").value.replace(/\D/g,'')
    let senha = document.getElementById("senhaAluno").value

    let data = await apiFetch("/aluno",{
        method:"POST",
        body:JSON.stringify({nome,cpf,senha})
    })

    if(!data) return

    if(data.success){
        alert("✅ Aluno cadastrado com sucesso")
        if(e) e.target.reset()
        carregarDashboard()
    }else{
        alert(data.erro || "Erro ao cadastrar aluno")
    }
}


// ==========================
// CADASTRAR PROFESSOR
// ==========================
async function cadastrarProfessor(e){
    if(e) e.preventDefault()

    let nome = document.getElementById("nomeProfessor").value
    let cpf = document.getElementById("cpfProfessor").value.replace(/\D/g,'')
    let senha = document.getElementById("senhaProfessor").value
    let disciplina = document.getElementById("disciplinaProfessor").value

    let data = await apiFetch("/professor",{
        method:"POST",
        body:JSON.stringify({nome,cpf,senha,disciplina})
    })

    if(!data) return

    if(data.success){
        alert("✅ Professor cadastrado com sucesso")
        if(e) e.target.reset()
        carregarDashboard()
    }else{
        alert(data.erro || "Erro ao cadastrar professor")
    }
}


// ==========================
// PUBLICAR AVISO
// ==========================
async function publicarAviso(e){
    if(e) e.preventDefault()

    let titulo = document.getElementById("tituloAviso").value
    let conteudo = document.getElementById("textoAviso").value

    let data = await apiFetch("/publicacao",{
        method:"POST",
        body:JSON.stringify({
            titulo,
            conteudo,
            tipo:"aviso"
        })
    })

    if(!data) return

    if(data.success){
        alert("✅ Aviso publicado")
        if(e) e.target.reset()
        carregarPublicacoes()
        carregarDashboard()
    }else{
        alert(data.erro || "Erro ao publicar aviso")
    }
}


// ==========================
// PUBLICAR NOTÍCIA
// ==========================
async function publicarNoticia(e){
    if(e) e.preventDefault()

    let titulo = document.getElementById("tituloNoticia").value
    let subtitulo = document.getElementById("subtituloNoticia") ? document.getElementById("subtituloNoticia").value : ""

    // Verificação de segurança para o Quill (Garante que busca o global)
    let conteudo = (window.quill && window.quill.root) ? window.quill.root.innerHTML : ""

    if(!conteudo || conteudo === "<p><br></p>") {
        alert("Por favor, preencha o conteúdo da notícia.");
        return;
    }

    let tituloFinal = subtitulo ? titulo+" - "+subtitulo : titulo

    let data = await apiFetch("/publicacao",{
        method:"POST",
        body:JSON.stringify({
            titulo:tituloFinal,
            conteudo,
            tipo:"noticia"
        })
    })

    if(!data) return

    if(data.success){
        alert("✅ Notícia publicada")
        document.getElementById("tituloNoticia").value=""
        if(document.getElementById("subtituloNoticia")) document.getElementById("subtituloNoticia").value=""

        if(window.quill){
            window.quill.root.innerHTML=""
        }

        carregarPublicacoes()
        carregarDashboard()
    }else{
        alert(data.erro || "Erro ao publicar notícia")
    }
}


// ==========================
// CARREGAR PUBLICAÇÕES
// ==========================
async function carregarPublicacoes(){
    let tabela = document.getElementById("listaPublicacoes")
    if(!tabela) return

    let dados = await apiFetch("/publicacoes")

    if(!dados || !Array.isArray(dados)) {
        tabela.innerHTML = "<tr><td colspan='5'>Nenhuma publicação encontrada.</td></tr>";
        return;
    }

    tabela.innerHTML=""

    dados.forEach(p=>{
        tabela.innerHTML+=`
        <tr>
        <td>${p.id}</td>
        <td>${p.titulo}</td>
        <td>${p.tipo}</td>
        <td>${p.data_publicacao ? new Date(p.data_publicacao).toLocaleDateString('pt-BR') : "-"}</td>
        <td>
        <button class="small-btn" onclick="excluirPublicacao(${p.id})">
        Excluir
        </button>
        </td>
        </tr>
        `
    })
}


// ==========================
// EXCLUIR PUBLICAÇÃO
// ==========================
async function excluirPublicacao(id){
    if(!confirm("Tem certeza que deseja excluir esta publicação?")) return

    let res = await apiFetch("/publicacao/"+id,{
        method:"DELETE"
    })

    if(res) {
        carregarPublicacoes()
        carregarDashboard()
    }
}


// ==========================
// LOGOUT
// ==========================
function logout(){
    localStorage.clear()
    window.location.href="login-admin.html"
}


// ==========================
// INICIAR
// ==========================
// BUG FIX: Adicionado fechamento correto das chaves e do onload
window.onload = function(){
    if(!verificarLogin()) return

    // BUG FIX: Verifica se os elementos existem antes de carregar dados 
    // Isso evita erros em páginas que não possuem dashboard ou tabelas
    if(document.getElementById("totalAlunos")) carregarDashboard();
    if(document.getElementById("listaPublicacoes")) carregarPublicacoes();
}
