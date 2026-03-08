// ==========================
// URL DO BACKEND
// ==========================

const API = "https://portal-escola-backend.onrender.com"


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

let nome = document.getElementById("nomeAluno").value
let cpf = document.getElementById("cpfAluno").value.replace(/\D/g,'')
let senha = document.getElementById("senhaAluno").value

if(!nome || !cpf || !senha){
alert("Preencha todos os campos")
return
}

try{

let res = await fetch(API + "/aluno",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
nome:nome,
cpf:cpf,
senha:senha
})
})

let data = await res.json()

if(data.success){

alert("Aluno cadastrado!")

document.getElementById("nomeAluno").value=""
document.getElementById("cpfAluno").value=""
document.getElementById("senhaAluno").value=""

if(typeof carregarAlunos === "function"){
carregarAlunos()
}

if(typeof carregarDashboard === "function"){
carregarDashboard()
}

}else{

alert("Erro ao cadastrar aluno")

}

}catch(err){

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

if(!nome || !cpf || !senha || !disciplina){

alert("Preencha todos os campos")
return

}

try{

let res = await fetch(API + "/professor",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
nome:nome,
cpf:cpf,
senha:senha,
disciplina:disciplina
})
})

let data = await res.json()

if(data.success){

alert("Professor cadastrado!")

document.getElementById("nomeProfessor").value=""
document.getElementById("cpfProfessor").value=""
document.getElementById("senhaProfessor").value=""
document.getElementById("disciplinaProfessor").value=""

if(typeof carregarProfessores === "function"){
carregarProfessores()
}

if(typeof carregarDashboard === "function"){
carregarDashboard()
}

}else{

alert("Erro ao cadastrar professor")

}

}catch(err){

alert("Erro de conexão com servidor")

}

}


// ==========================
// LOGIN ALUNO
// ==========================

async function loginAluno(){

let cpf = document.getElementById("cpf").value.replace(/\D/g,'')
let senha = document.getElementById("senha").value

if(!cpf || !senha){

alert("Preencha CPF e senha")
return

}

try{

let res = await fetch(API + "/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
cpf:cpf,
senha:senha
})
})

let data = await res.json()

if(data.success){

localStorage.setItem("alunoID",data.aluno.id)
window.location="alunos.html"

}else{

alert("CPF ou senha incorretos")

}

}catch(err){

alert("Erro de conexão com servidor")

}

}


// ==========================
// LOGIN PROFESSOR
// ==========================

async function loginProfessor(){

let cpf = document.getElementById("cpf").value.replace(/\D/g,'')
let senha = document.getElementById("senha").value

if(!cpf || !senha){

alert("Preencha CPF e senha")
return

}

try{

let res = await fetch(API + "/login-professor",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
cpf:cpf,
senha:senha
})
})

let data = await res.json()

if(data.success){

localStorage.setItem("professorLogado",data.professor.id)
window.location="professores.html"

}else{

alert("CPF ou senha inválidos")

}

}catch(err){

alert("Erro de conexão com servidor")

}

}


// ==========================
// LISTAR ALUNOS
// ==========================

async function carregarAlunos(){

let tabela = document.getElementById("tabelaAlunos")

if(!tabela) return

try{

let res = await fetch(API + "/alunos")
let alunos = await res.json()

tabela.innerHTML = `
<tr>
<th>ID</th>
<th>Nome</th>
<th>CPF</th>
<th>Ações</th>
</tr>
`

alunos.forEach(a=>{

let botaoExcluir = ""

if(typeof excluirAluno === "function"){
botaoExcluir = `
<button class="btn btn-excluir" onclick="excluirAluno(${a.id})">
Excluir
</button>
`
}

tabela.innerHTML += `
<tr>
<td>${a.id}</td>
<td>${a.nome}</td>
<td>${a.cpf}</td>
<td>${botaoExcluir}</td>
</tr>
`

})

}catch(err){

console.log("Erro ao carregar alunos")

}

}


// ==========================
// REGISTRAR NOTA
// ==========================

async function registrarNota(e){

e.preventDefault()

let aluno_id = document.getElementById("idAluno").value
let disciplina = document.getElementById("disciplinaNota").value
let nota = document.getElementById("notaAluno").value

if(!aluno_id || !disciplina || !nota){

alert("Preencha todos os campos")
return

}

try{

let res = await fetch(API + "/nota",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
aluno_id,
disciplina,
nota
})
})

let data = await res.json()

if(data.success){

alert("Nota registrada!")

document.getElementById("idAluno").value=""
document.getElementById("disciplinaNota").value=""
document.getElementById("notaAluno").value=""

if(typeof carregarDashboard === "function"){
carregarDashboard()
}

}else{

alert("Erro ao registrar nota")

}

}catch(err){

alert("Erro de conexão com servidor")

}

}


// ==========================
// BOLETIM
// ==========================

async function carregarBoletim(){

let tabela = document.getElementById("tabela")

if(!tabela) return

let alunoID = localStorage.getItem("alunoID")

if(!alunoID) return

try{

let res = await fetch(API + "/boletim/" + alunoID)
let notas = await res.json()

let soma = 0

tabela.innerHTML = `
<tr>
<th>Disciplina</th>
<th>Nota</th>
</tr>
`

notas.forEach(n=>{

tabela.innerHTML += `
<tr>
<td>${n.disciplina}</td>
<td>${n.nota}</td>
</tr>
`

soma += Number(n.nota)

})

let media = notas.length ? (soma/notas.length).toFixed(1) : 0
let situacao = media >= 6 ? "Aprovado" : "Reprovado"

tabela.innerHTML += `
<tr>
<td><strong>Média</strong></td>
<td>${media}</td>
</tr>

<tr>
<td><strong>Situação</strong></td>
<td>${situacao}</td>
</tr>
`

}catch(err){

console.log("Erro ao carregar boletim")

}

}


// ==========================
// EXPORTAR BOLETIM PDF
// ==========================

function exportarPDF(){

let conteudo = document.querySelector(".boletim-container")

if(!conteudo) return

let janela = window.open("","","width=800,height=600")

janela.document.write("<html><head><title>Boletim</title></head><body>")
janela.document.write(conteudo.innerHTML)
janela.document.write("</body></html>")

janela.document.close()
janela.print()

}


// ==========================
// CALENDÁRIO ESCOLAR
// ==========================

function carregarCalendario(){

let calendario = document.getElementById("calendario")

if(!calendario) return

let eventos = [
{evento:"Início das aulas",data:"05/02"},
{evento:"Feira de Ciências",data:"20/04"},
{evento:"Recesso Escolar",data:"15/07"},
{evento:"Provas finais",data:"10/12"}
]

calendario.innerHTML = `
<tr>
<th>Evento</th>
<th>Data</th>
</tr>
`

eventos.forEach(e=>{

calendario.innerHTML += `
<tr>
<td>${e.evento}</td>
<td>${e.data}</td>
</tr>
`

})

}


// ==========================
// LOGOUT
// ==========================

function logout(){

localStorage.clear()
window.location="index.html"

}


// ==========================
// INICIALIZAÇÃO
// ==========================

window.onload=function(){

carregarBoletim()
carregarCalendario()
carregarAlunos()

}
