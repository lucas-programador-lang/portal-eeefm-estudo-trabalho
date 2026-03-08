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

let res = await fetch(API + "/aluno",{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+getToken()
},
body:JSON.stringify({nome,cpf,senha})
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
let senha = document.getElementById("senhaProfessor").value
let disciplina = document.getElementById("disciplinaProfessor").value

let res = await fetch(API + "/professor",{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+getToken()
},
body:JSON.stringify({nome,cpf,senha,disciplina})
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

}


// ==========================
// LISTAR ALUNOS
// ==========================

async function carregarAlunos(){

let tabela = document.getElementById("tabelaAlunos")

if(!tabela) return

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
"Content-Type":"application/json",
"Authorization":"Bearer "+getToken()
},
body:JSON.stringify({aluno_id,disciplina,nota})
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

let alunoID = JSON.parse(localStorage.getItem("usuario")).id

let res = await fetch(API + "/boletim/" + alunoID,{
headers:{
"Authorization":"Bearer "+getToken()
}
})

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

}


// ==========================
// LOGOUT
// ==========================

function logout(){

localStorage.removeItem("token")
localStorage.removeItem("usuario")
localStorage.removeItem("tipo")

window.location="login.html"

}


// ==========================
// INICIALIZAÇÃO
// ==========================

window.onload=function(){

carregarBoletim()
carregarAlunos()

}
