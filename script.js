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
// CADASTRAR ALUNO (MYSQL)
// ==========================

async function cadastrarAluno(e){

e.preventDefault()

let nome = document.getElementById("nomeAluno").value
let cpf = document.getElementById("cpfAluno").value.replace(/\D/g,'')

if(!nome || !cpf){
alert("Preencha todos os campos")
return
}

let res = await fetch(API + "/cadastrar-aluno",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
nome:nome,
cpf:cpf
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
// LOGIN ALUNO
// ==========================

async function loginSistema(){

let cpf = document.getElementById("cpf").value.replace(/\D/g,'')

let res = await fetch(API + "/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({cpf})

})

let data = await res.json()

if(data.success){

localStorage.setItem("alunoID",data.aluno.id)

window.location = "alunos.html"

}else{

alert("Aluno não encontrado")

}

}



// ==========================
// CARREGAR BOLETIM
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
// INICIALIZAÇÃO
// ==========================

window.onload=function(){

carregarBoletim()
carregarCalendario()

}
