// ===============================
// FORMATA CPF
// ===============================

function formatarCPF(campo){

let cpf = campo.value.replace(/\D/g,'')

cpf = cpf.replace(/(\d{3})(\d)/,"$1.$2")
cpf = cpf.replace(/(\d{3})(\d)/,"$1.$2")
cpf = cpf.replace(/(\d{3})(\d{1,2})$/,"$1-$2")

campo.value = cpf

}


// ===============================
// CADASTRO DE ALUNOS
// ===============================

function cadastrarAluno(e){

e.preventDefault()

let nome = document.getElementById("nomeAluno").value
let cpf = document.getElementById("cpfAluno").value.replace(/\D/g,'')

if(nome=="" || cpf==""){
alert("Preencha todos os campos")
return
}

let alunos = JSON.parse(localStorage.getItem("alunos")) || []

alunos.push({
nome:nome,
cpf:cpf,
notas:[]
})

localStorage.setItem("alunos",JSON.stringify(alunos))

alert("Aluno cadastrado!")

mostrarAlunos()

}


// ===============================
// MOSTRAR ALUNOS CADASTRADOS
// ===============================

function mostrarAlunos(){

let tabela = document.getElementById("tabelaAlunos")

if(!tabela) return

let alunos = JSON.parse(localStorage.getItem("alunos")) || []

tabela.innerHTML = `
<tr>
<th>Nome</th>
<th>CPF</th>
</tr>
`

alunos.forEach(a=>{

tabela.innerHTML += `
<tr>
<td>${a.nome}</td>
<td>${a.cpf}</td>
</tr>
`

})

}


// ===============================
// LOGIN DO ALUNO
// ===============================

function login(){

let cpf = document.getElementById("cpf").value.replace(/\D/g,'')

let alunos = JSON.parse(localStorage.getItem("alunos")) || []

let aluno = alunos.find(a => a.cpf === cpf)

if(aluno){

localStorage.setItem("alunoLogado",JSON.stringify(aluno))

window.location="alunos.html"

}else{

alert("Aluno não encontrado")

}

}


// ===============================
// SISTEMA DE BOLETIM
// ===============================

function carregarBoletim(){

let tabela = document.getElementById("tabela")

if(!tabela) return

let aluno = JSON.parse(localStorage.getItem("alunoLogado"))

if(!aluno){
return
}

let notas = aluno.notas.length ? aluno.notas : [

{disciplina:"Matemática",nota:8.5},
{disciplina:"Português",nota:9.0},
{disciplina:"História",nota:7.5}

]

let soma = 0

notas.forEach(n=>{

tabela.innerHTML += `
<tr>
<td>${n.disciplina}</td>
<td>${n.nota}</td>
</tr>
`

soma += n.nota

})

let media = (soma/notas.length).toFixed(1)

tabela.innerHTML += `
<tr>
<td><strong>Média Final</strong></td>
<td><strong>${media}</strong></td>
</tr>
`

}


// ===============================
// INICIAR SISTEMA
// ===============================

window.onload=function(){

mostrarAlunos()
carregarBoletim()

}
