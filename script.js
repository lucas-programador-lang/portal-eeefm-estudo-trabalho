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

if(!token){
window.location="login-admin.html"
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

const res = await fetch(API+url,{
...options,
headers:{
...(isFormData ? {} : {"Content-Type":"application/json"}),
Authorization:"Bearer "+getToken(),
...(options.headers || {})
}
})

if(res.status === 401){
logout()
return null
}

if(!res.ok){
const text = await res.text()
console.log("Erro servidor:", text)
throw new Error("Erro servidor")
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

document.getElementById("totalAlunos").innerText = dados.alunos || 0
document.getElementById("totalProfessores").innerText = dados.professores || 0
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

alert("✅ Aluno cadastrado com sucesso")

e.target.reset()
carregarDashboard()

}else{

alert(data.erro || "Erro ao cadastrar aluno")

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

alert("✅ Professor cadastrado com sucesso")

e.target.reset()
carregarDashboard()

}else{

alert(data.erro || "Erro ao cadastrar professor")

}

}


// ==========================
// PUBLICAR AVISO (CORRIGIDO)
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

alert(data.erro || "Erro ao publicar aviso")

}

}


// ==========================
// PUBLICAR NOTÍCIA (CORRIGIDO)
// ==========================
async function publicarNoticia(e){

e.preventDefault()

let titulo = document.getElementById("tituloNoticia").value
let subtitulo = document.getElementById("subtituloNoticia").value

// 🔥 CORREÇÃO AQUI
let conteudo = (window.quill && quill.root) ? quill.root.innerHTML : ""

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

if(!dados) return

tabela.innerHTML=""

dados.forEach(p=>{

tabela.innerHTML+=`
<tr>
<td>${p.id}</td>
<td>${p.titulo}</td>
<td>${p.tipo}</td>
<td>${p.data_publicacao ? new Date(p.data_publicacao).toLocaleDateString() : "-"}</td>
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
