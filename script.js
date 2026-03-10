// ==========================
// URL BACKEND
// ==========================
const API = "https://portal-escola-backend.onrender.com"


// ==========================
// MOSTRAR SEÇÕES DO MENU
// ==========================
function mostrar(sec){
  document.querySelectorAll(".section").forEach(function(s){
    s.classList.remove("active")
  })

  const el = document.getElementById(sec)
  if(el){
    el.classList.add("active")
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
  if(!getToken()){
    alert("Sessão expirada")
    window.location="login-admin.html"
    return false
  }
  return true
}


// ==========================
// FORMATAR CPF
// ==========================
function formatarCPF(campo){
  let cpf = campo.value.replace(/\D/g,'')

  cpf = cpf.replace(/(\d{3})(\d)/,"$1.$2")
  cpf = cpf.replace(/(\d{3})(\d)/,"$1.$2")
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/,"$1-$2")

  campo.value = cpf
}


// ==========================
// DASHBOARD
// ==========================
async function carregarDashboard(){

  try{

    let res = await fetch(API+"/dashboard",{
      headers:{
        Authorization:"Bearer "+getToken()
      }
    })

    let dados = await res.json()

    if(document.getElementById("totalAlunos"))
      document.getElementById("totalAlunos").innerText = dados.alunos || 0

    if(document.getElementById("totalProfessores"))
      document.getElementById("totalProfessores").innerText = dados.professores || 0

    if(document.getElementById("totalPublicacoes"))
      document.getElementById("totalPublicacoes").innerText = dados.publicacoes || 0

  }catch{
    console.log("Erro dashboard")
  }

}


// ==========================
// CADASTRAR ALUNO
// ==========================
async function cadastrarAluno(e){

  e.preventDefault()

  let nome = document.getElementById("nomeAluno").value
  let cpf = document.getElementById("cpfAluno").value.replace(/\D/g,'')
  let senha = document.getElementById("senhaAluno").value

  try{

    let res = await fetch(API+"/aluno",{

      method:"POST",

      headers:{
        "Content-Type":"application/json",
        Authorization:"Bearer "+getToken()
      },

      body:JSON.stringify({nome,cpf,senha})

    })

    let data = await res.json()

    if(data.success){
      alert("Aluno cadastrado")
      e.target.reset()
      carregarDashboard()
    }else{
      alert("Erro ao cadastrar aluno")
    }

  }catch{
    alert("Erro de conexão com servidor")
  }

}


// ==========================
// CADASTRAR PROFESSOR
// ==========================
async function cadastrarProfessor(e){

  e.preventDefault()

  let nome = document.getElementById("nomeProfessor").value
  let cpf = document.getElementById("cpfProfessor").value.replace(/\D/g,'')
  let senha = document.getElementById("senhaProfessor").value
  let disciplina = document.getElementById("disciplinaProfessor").value

  try{

    let res = await fetch(API+"/professor",{

      method:"POST",

      headers:{
        "Content-Type":"application/json",
        Authorization:"Bearer "+getToken()
      },

      body:JSON.stringify({nome,cpf,senha,disciplina})

    })

    let data = await res.json()

    if(data.success){
      alert("Professor cadastrado")
      e.target.reset()
      carregarDashboard()
    }else{
      alert("Erro ao cadastrar professor")
    }

  }catch{
    alert("Erro de conexão com servidor")
  }

}


// ==========================
// PUBLICAR AVISO
// ==========================
async function publicarAviso(e){

  e.preventDefault()

  let titulo = document.getElementById("tituloAviso").value
  let conteudo = document.getElementById("textoAviso").value

  try{

    let res = await fetch(API+"/publicacao",{

      method:"POST",

      headers:{
        "Content-Type":"application/json",
        Authorization:"Bearer "+getToken()
      },

      body:JSON.stringify({
        titulo,
        conteudo,
        tipo:"aviso"
      })

    })

    let data = await res.json()

    if(data.success){
      alert("Aviso publicado")
      e.target.reset()
      carregarPublicacoes()
    }else{
      alert("Erro ao publicar aviso")
    }

  }catch{
    alert("Erro de conexão com servidor")
  }

}


// ==========================
// PUBLICAR NOTÍCIA
// ==========================
async function publicarNoticia(e){

  e.preventDefault()

  let titulo = document.getElementById("tituloNoticia").value
  let subtitulo = document.getElementById("subtituloNoticia").value

  let conteudo = ""
  if(window.quill){
    conteudo = quill.root.innerHTML
  }

  let tituloFinal = subtitulo ? titulo+" - "+subtitulo : titulo

  try{

    let res = await fetch(API+"/publicacao",{

      method:"POST",

      headers:{
        "Content-Type":"application/json",
        Authorization:"Bearer "+getToken()
      },

      body:JSON.stringify({
        titulo:tituloFinal,
        conteudo,
        tipo:"noticia"
      })

    })

    let data = await res.json()

    if(data.success){

      alert("Notícia publicada")

      document.getElementById("tituloNoticia").value=""
      document.getElementById("subtituloNoticia").value=""

      if(window.quill){
        quill.root.innerHTML=""
      }

      carregarPublicacoes()

    }else{
      alert("Erro ao publicar notícia")
    }

  }catch{
    alert("Erro de conexão com servidor")
  }

}


// ==========================
// CARREGAR PUBLICAÇÕES
// ==========================
async function carregarPublicacoes(){

  let tabela = document.getElementById("listaPublicacoes")
  if(!tabela) return

  let res = await fetch(API+"/publicacoes")
  let dados = await res.json()

  tabela.innerHTML=""

  dados.forEach(p=>{

    tabela.innerHTML+=`

    <tr>
      <td>${p.id}</td>
      <td>${p.titulo}</td>
      <td>${p.tipo}</td>
      <td>${new Date(p.data_publicacao).toLocaleDateString()}</td>
      <td>
        <button onclick="excluirPublicacao(${p.id})">Excluir</button>
      </td>
    </tr>

    `
  })

}


// ==========================
// EXCLUIR PUBLICAÇÃO
// ==========================
async function excluirPublicacao(id){

  if(!confirm("Excluir publicação?")) return

  await fetch(API+"/publicacao/"+id,{
    method:"DELETE",
    headers:{
      Authorization:"Bearer "+getToken()
    }
  })

  carregarPublicacoes()

}


// ==========================
// LOGOUT
// ==========================
function logout(){
  localStorage.clear()
  window.location="login-admin.html"
}


// ==========================
// INICIAR
// ==========================
window.onload=function(){

  if(!verificarLogin()) return

  carregarDashboard()
  carregarPublicacoes()

  const fAluno = document.getElementById("formAluno")
  if(fAluno) fAluno.addEventListener("submit", cadastrarAluno)

  const fProfessor = document.getElementById("formProfessor")
  if(fProfessor) fProfessor.addEventListener("submit", cadastrarProfessor)

  const fAviso = document.getElementById("formAviso")
  if(fAviso) fAviso.addEventListener("submit", publicarAviso)

  const fNoticia = document.getElementById("formNoticia")
  if(fNoticia) fNoticia.addEventListener("submit", publicarNoticia)

}
