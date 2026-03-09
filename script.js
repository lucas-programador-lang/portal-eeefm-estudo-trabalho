// ==========================
// URL DO BACKEND
// ==========================

const API = "https://portal-escola-backend.onrender.com"


// ==========================
// PEGAR TOKEN
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
// CADASTRAR ALUNO
// ==========================

async function cadastrarAluno(e){

e.preventDefault()

if(!verificarLogin()) return

let nome = document.getElementById("nomeAluno")?.value
let cpf = document.getElementById("cpfAluno")?.value.replace(/\D/g,'')
let senha = document.getElementById("senhaAluno")?.value

try{

let res = await fetch(API + "/aluno",{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+getToken()
},

body:JSON.stringify({nome,cpf,senha})

})

if(!res.ok) throw new Error("Erro servidor")

let data = await res.json()

if(data.success){

alert("Aluno cadastrado!")

document.getElementById("nomeAluno").value=""
document.getElementById("cpfAluno").value=""
document.getElementById("senhaAluno").value=""

carregarAlunos()

}else{

alert("Erro ao cadastrar aluno")

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

let res = await fetch(API + "/professor",{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+getToken()
},

body:JSON.stringify({nome,cpf,senha,disciplina})

})

if(!res.ok) throw new Error("Erro servidor")

let data = await res.json()

if(data.success){

alert("Professor cadastrado!")

document.getElementById("nomeProfessor").value=""
document.getElementById("cpfProfessor").value=""
document.getElementById("senhaProfessor").value=""
document.getElementById("disciplinaProfessor").value=""

carregarProfessores()

}else{

alert("Erro ao cadastrar professor")

}

}catch(err){

alert("Erro ao conectar com servidor")

}

}


// ==========================
// LOGIN ALUNO
// ==========================

async function loginAluno(){

let cpf = document.getElementById("cpf")?.value.replace(/\D/g,'')
let senha = document.getElementById("senha")?.value

try{

let res = await fetch(API + "/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({cpf,senha})

})

let data = await res.json()

if(data.success){

localStorage.setItem("token",data.token)
localStorage.setItem("tipo","aluno")
localStorage.setItem("usuario",JSON.stringify(data.usuario))

window.location="alunos.html"

}else{

alert("CPF ou senha incorretos")

}

}catch(err){

alert("Erro ao conectar com servidor")

}

}


// ==========================
// LOGIN PROFESSOR
// ==========================

async function loginProfessor(){

let cpf = document.getElementById("cpf")?.value.replace(/\D/g,'')
let senha = document.getElementById("senha")?.value

try{

let res = await fetch(API + "/login-professor",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({cpf,senha})

})

let data = await res.json()

if(data.success){

localStorage.setItem("token",data.token)
localStorage.setItem("tipo","professor")
localStorage.setItem("usuario",JSON.stringify(data.usuario))

window.location="professores.html"

}else{

alert("CPF ou senha inválidos")

}

}catch(err){

alert("Erro ao conectar com servidor")

}

}


// ==========================
// LISTAR ALUNOS
// ==========================

async function carregarAlunos(){

let tabela = document.getElementById("tabelaAlunos")

if(!tabela) return

try{

let res = await fetch(API + "/alunos",{

headers:{
"Authorization":"Bearer "+getToken()
}

})

let alunos = await res.json()

tabela.innerHTML = `
<tr>
<th>ID</th>
<th>Nome</th>
<th>CPF</th>
</tr>
`

alunos.forEach(a=>{

tabela.innerHTML += `
<tr>
<td>${a.id}</td>
<td>${a.nome}</td>
<td>${a.cpf}</td>
</tr>
`

})

}catch(err){

console.log("Erro ao carregar alunos")

}

}


// ==========================
// PUBLICAR AVISO
// ==========================

async function publicarAviso(e){

e.preventDefault()

let titulo = document.getElementById("tituloAviso")?.value
let conteudo = document.getElementById("textoAviso")?.value

try{

let res = await fetch(API + "/publicacao",{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+getToken()
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

document.getElementById("tituloAviso").value=""
document.getElementById("textoAviso").value=""

carregarPublicacoes()

}

}catch(err){

alert("Erro ao conectar com servidor")

}

}


// ==========================
// PUBLICAR NOTÍCIA
// ==========================

async function publicarNoticia(e){

e.preventDefault()

let titulo = document.getElementById("tituloNoticia")?.value
let conteudo = document.getElementById("conteudoNoticia")?.value
let imagem = document.getElementById("imagemNoticia")?.value

try{

let res = await fetch(API + "/publicacao",{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+getToken()
},

body:JSON.stringify({
titulo,
conteudo,
imagem,
tipo:"noticia"
})

})

let data = await res.json()

if(data.success){

alert("Notícia publicada!")

document.getElementById("tituloNoticia").value=""
document.getElementById("conteudoNoticia").value=""
document.getElementById("imagemNoticia").value=""

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

let res = await fetch(API + "/publicacoes")

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

let res = await fetch(API + "/publicacao/"+id,{

method:"DELETE",

headers:{
"Authorization":"Bearer "+getToken()
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

localStorage.removeItem("token")
localStorage.removeItem("tipo")
localStorage.removeItem("usuario")
localStorage.removeItem("adminLogado")

window.location="login-admin.html"

}


// ==========================
// INICIAR SISTEMA
// ==========================

window.onload=function(){

carregarAlunos()
carregarPublicacoes()

}
