// ==========================
// URL DO BACKEND (RENDER)
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

if(!nome || !cpf){
alert("Preencha todos os campos")
return
}

let res = await fetch(API + "/aluno",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
nome:nome,
cpf:cpf,
senha:"1234"
})

})

let data = await res.json()

if(data.success){

alert("Aluno cadastrado!")

}else{

alert("Erro ao cadastrar aluno")

}

}


// ==========================
// CADASTRAR PROFESSOR
// ==========================

async function cadastrarProfessor(e){

e.preventDefault()

let nome = document.getElementById("nomeProfessor").value
let cpf = document.getElementById("cpfProfessor").value.replace(/\D/g,'')
let disciplina = document.getElementById("disciplinaProfessor").value

let res = await fetch(API + "/professor",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
nome:nome,
cpf:cpf,
senha:"1234",
disciplina:disciplina
})

})

let data = await res.json()

if(data.success){

alert("Professor cadastrado!")

}else{

alert("Erro ao cadastrar professor")

}

}


// ==========================
// LOGIN ALUNO
// ==========================

async function loginAluno(){

let cpf = document.getElementById("cpf").value.replace(/\D/g,'')
let senha = document.getElementById("senha").value

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

}


// ==========================
// LOGIN PROFESSOR
// ==========================

async function loginProfessor(){

let cpf = document.getElementById("cpf").value.replace(/\D/g,'')
let senha = document.getElementById("senha").value

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

}


// ==========================
// LISTAR ALUNOS
// ==========================

async function carregarAlunos(){

let tabela = document.getElementById("tabelaAlunos")

if(!tabela) return

let res = await fetch(API + "/alunos")

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

}


// ==========================
// REGISTRAR NOTA
// ==========================

async function registrarNota(e){

e.preventDefault()

let aluno_id = document.getElementById("idAluno").value
let disciplina = document.getElementById("disciplinaNota").value
let nota = document.getElementById("notaAluno").value

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

}else{

alert("Erro ao registrar nota")

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

soma += n.nota

})

let media = 0

if(notas.length > 0){
media = (soma/notas.length).toFixed(1)
}

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

}


// ==========================
// EXPORTAR BOLETIM PDF
// ==========================

function exportarPDF(){

let conteudo = document.querySelector(".boletim-container")

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
