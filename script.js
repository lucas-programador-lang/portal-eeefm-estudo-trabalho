// ==========================
// URL BACKEND
// ==========================

const API = "https://portal-escola-backend.onrender.com"


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

document.getElementById("totalAlunos").innerText = dados.alunos || 0
document.getElementById("totalProfessores").innerText = dados.professores || 0
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

let nome = nomeAluno.value
let cpf = cpfAluno.value.replace(/\D/g,'')
let senha = senhaAluno.value

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

}else{

alert("Erro ao cadastrar")

}

}


// ==========================
// CADASTRAR PROFESSOR
// ==========================

async function cadastrarProfessor(e){

e.preventDefault()

let nome = nomeProfessor.value
let cpf = cpfProfessor.value.replace(/\D/g,'')
let senha = senhaProfessor.value
let disciplina = disciplinaProfessor.value

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

}else{

alert("Erro ao cadastrar professor")

}

}


// ==========================
// PUBLICAR AVISO
// ==========================

async function publicarAviso(e){

e.preventDefault()

let titulo = tituloAviso.value
let conteudo = textoAviso.value

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

alert("Erro ao publicar")

}

}


// ==========================
// PUBLICAR NOTICIA
// ==========================

async function publicarNoticia(e){

e.preventDefault()

let titulo = tituloNoticia.value
let subtitulo = subtituloNoticia.value
let conteudo = quill.root.innerHTML

let tituloFinal = subtitulo ? titulo+" - "+subtitulo : titulo

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

tituloNoticia.value=""
subtituloNoticia.value=""
quill.root.innerHTML=""

carregarPublicacoes()

}else{

alert("Erro ao publicar")

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

carregarDashboard()
carregarPublicacoes()

document.getElementById("formAluno")?.addEventListener("submit",cadastrarAluno)
document.getElementById("formProfessor")?.addEventListener("submit",cadastrarProfessor)
document.getElementById("formAviso")?.addEventListener("submit",publicarAviso)
document.getElementById("formNoticia")?.addEventListener("submit",publicarNoticia)

}
