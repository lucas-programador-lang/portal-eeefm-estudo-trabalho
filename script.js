// ==========================
// URL BACKEND
// ==========================
const API = "https://portal-escola-backend.onrender.com"


// ==========================
// ANIMAÇÃO ENTRE SEÇÕES
// ==========================
function mostrar(sec){

document.querySelectorAll(".section").forEach(s=>{
s.classList.remove("active")
s.classList.remove("fade")
})

const el = document.getElementById(sec)

if(el){
el.classList.add("active")

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
// LOGOUT AUTOMÁTICO
// ==========================
function verificarLogin(){

const token = getToken()

if(!token){
window.location="login-admin.html"
return false
}

return true
}


// ==========================
// FETCH PADRÃO
// ==========================
async function apiFetch(url, options={}){

try{

const res = await fetch(API+url,{
...options,
headers:{
"Content-Type":"application/json",
Authorization:"Bearer "+getToken(),
...(options.headers || {})
}
})

if(res.status === 401){
logout()
return null
}

return await res.json()

}catch(err){

console.log("Erro API:",err)
alert("Erro de conexão com servidor")
return null

}

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

let dados = await apiFetch("/dashboard")

if(!dados) return

if(document.getElementById("totalAlunos"))
document.getElementById("totalAlunos").innerText = dados.alunos || 0

if(document.getElementById("totalProfessores"))
document.getElementById("totalProfessores").innerText = dados.professores || 0

if(document.getElementById("totalPublicacoes"))
document.getElementById("totalPublicacoes").innerText = dados.publicacoes || 0

}


// ==========================
// CADASTRAR ALUNO
// ==========================
async function cadastrarAluno(e){

e.preventDefault()

let nome = document.getElementById("nomeAluno").value
let cpf = document.getElementById("cpfAluno").value.replace(/\D/g,'')
let senha = document.getElementById("senhaAluno").value

let data = await apiFetch("/aluno",{
method:"POST",
body:JSON.stringify({nome,cpf,senha})
})

if(!data) return

if(data.success){

alert("✅ Aluno cadastrado")

e.target.reset()
carregarDashboard()

}else{

alert(data.erro || "Erro ao cadastrar")

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

let data = await apiFetch("/professor",{
method:"POST",
body:JSON.stringify({nome,cpf,senha,disciplina})
})

if(!data) return

if(data.success){

alert("✅ Professor cadastrado")

e.target.reset()
carregarDashboard()

}else{

alert(data.erro || "Erro ao cadastrar")

}

}


// ==========================
// PUBLICAR AVISO
// ==========================
async function publicarAviso(e){

e.preventDefault()

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

e.target.reset()

carregarPublicacoes()
carregarDashboard()

}else{

alert("Erro ao publicar")

}

}


// ==========================
// PUBLICAR NOTÍCIA
// ==========================
async function publicarNoticia(e){

e.preventDefault()

let titulo = document.getElementById("tituloNoticia").value
let subtitulo = document.getElementById("subtituloNoticia").value

let conteudo = window.quill ? quill.root.innerHTML : ""

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
document.getElementById("subtituloNoticia").value=""

if(window.quill){
quill.root.innerHTML=""
}

carregarPublicacoes()
carregarDashboard()

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

try{

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

}catch{
console.log("Erro publicações")
}

}


// ==========================
// EXCLUIR PUBLICAÇÃO
// ==========================
async function excluirPublicacao(id){

if(!confirm("Excluir publicação?")) return

await apiFetch("/publicacao/"+id,{
method:"DELETE"
})

carregarPublicacoes()
carregarDashboard()

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
