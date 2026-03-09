// ==========================
// URL DO BACKEND
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

const token = getToken()

if(!token){

alert("Sessão expirada. Faça login novamente.")
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

if(document.getElementById("totalNotas"))
document.getElementById("totalNotas").innerText = dados.notas || 0

}catch(e){

console.log("Erro dashboard")

}

}


// ==========================
// CADASTRAR ALUNO
// ==========================

async function cadastrarAluno(e){

e.preventDefault()

if(!verificarLogin()) return

let nome = document.getElementById("nomeAluno")?.value
let cpf = document.getElementById("cpfAluno")?.value.replace(/\D/g,'')
let senha = document.getElementById("senhaAluno")?.value

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

alert("Aluno cadastrado!")

e.target.reset()

}

}catch(err){

alert("Erro ao conectar com servidor")

}

}


// ==========================
// CADASTRAR PROFESSOR
// ==========================

async function cadastrarProfessor(e){

e.preventDefault()

if(!verificarLogin()) return

let nome = document.getElementById("nomeProfessor")?.value
let cpf = document.getElementById("cpfProfessor")?.value.replace(/\D/g,'')
let senha = document.getElementById("senhaProfessor")?.value
let disciplina = document.getElementById("disciplinaProfessor")?.value

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

alert("Professor cadastrado!")

e.target.reset()

}

}catch(err){

alert("Erro ao conectar com servidor")

}

}


// ==========================
// UPLOAD IMAGEM
// ==========================

async function uploadImagem(file){

let formData = new FormData()

formData.append("imagem",file)

let res = await fetch(API+"/upload",{

method:"POST",

headers:{
Authorization:"Bearer "+getToken()
},

body:formData

})

let data = await res.json()

return data.url

}


// ==========================
// PUBLICAR AVISO
// ==========================

async function publicarAviso(e){

e.preventDefault()

let titulo = document.getElementById("tituloAviso")?.value
let conteudo = document.getElementById("textoAviso")?.value

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
imagem:"",
tipo:"aviso"

})

})

let data = await res.json()

if(data.success){

alert("Aviso publicado!")

e.target.reset()

carregarPublicacoes()

}

}catch(err){

alert("Erro ao conectar com servidor")

}

}


// ==========================
// PUBLICAR NOTICIA
// ==========================

async function publicarNoticia(e){

e.preventDefault()

let titulo = document.getElementById("tituloNoticia")?.value
let subtitulo = document.getElementById("subtituloNoticia")?.value

let conteudo = ""

if(window.quill){
conteudo = quill.root.innerHTML
}

let imagem = ""

let imgInput = document.getElementById("imagemUpload")

if(imgInput && imgInput.files.length){

imagem = await uploadImagem(imgInput.files[0])

}

try{

let res = await fetch(API+"/publicacao",{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:"Bearer "+getToken()
},

body:JSON.stringify({

titulo: titulo+" - "+subtitulo,
conteudo,
imagem,
tipo:"noticia"

})

})

let data = await res.json()

if(data.success){

alert("Notícia publicada!")

document.getElementById("tituloNoticia").value=""
document.getElementById("subtituloNoticia").value=""

if(window.quill){
quill.root.innerHTML=""
}

carregarPublicacoes()

}

}catch(err){

alert("Erro ao conectar com servidor")

}

}


// ==========================
// LISTAR PUBLICAÇÕES
// ==========================

async function carregarPublicacoes(){

let tabela = document.getElementById("tabelaPublicacoes")

if(!tabela) return

try{

let res = await fetch(API+"/publicacoes")

let publicacoes = await res.json()

tabela.innerHTML = `

<tr>
<th>ID</th>
<th>Título</th>
<th>Tipo</th>
<th>Data</th>
<th>Ações</th>
</tr>

`

publicacoes.forEach(p=>{

tabela.innerHTML += `

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

}catch(err){

console.log("Erro ao carregar publicações")

}

}


// ==========================
// EXCLUIR PUBLICAÇÃO
// ==========================

async function excluirPublicacao(id){

if(!confirm("Excluir publicação?")) return

try{

let res = await fetch(API+"/publicacao/"+id,{

method:"DELETE",

headers:{
Authorization:"Bearer "+getToken()
}

})

let data = await res.json()

if(data.success){

alert("Publicação excluída")

carregarPublicacoes()

}

}catch(err){

alert("Erro ao conectar com servidor")

}

}


// ==========================
// LOGOUT
// ==========================

function logout(){

localStorage.clear()

window.location="login-admin.html"

}


// ==========================
// INICIAR SISTEMA
// ==========================

window.onload=function(){

carregarDashboard()
carregarPublicacoes()

}
