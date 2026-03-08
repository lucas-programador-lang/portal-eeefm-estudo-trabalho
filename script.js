// ==========================
// FORMATAR CPF
// ==========================

function formatarCPF(campo){

let cpf=campo.value.replace(/\D/g,'')

cpf=cpf.replace(/(\d{3})(\d)/,"$1.$2")
cpf=cpf.replace(/(\d{3})(\d)/,"$1.$2")
cpf=cpf.replace(/(\d{3})(\d{1,2})$/,"$1-$2")

campo.value=cpf

}



// ==========================
// CADASTRAR ALUNO
// ==========================

function cadastrarAluno(e){

e.preventDefault()

let nome=document.getElementById("nomeAluno").value
let cpf=document.getElementById("cpfAluno").value.replace(/\D/g,'')

if(!nome || !cpf){
alert("Preencha todos os campos")
return
}

let alunos=JSON.parse(localStorage.getItem("alunos"))||[]

alunos.push({
nome:nome,
cpf:cpf,
notas:[]
})

localStorage.setItem("alunos",JSON.stringify(alunos))

alert("Aluno cadastrado!")

mostrarAlunos()

}



// ==========================
// CADASTRAR PROFESSOR
// ==========================

function cadastrarProfessor(e){

e.preventDefault()

let nome=document.getElementById("nomeProfessor").value
let disciplina=document.getElementById("disciplinaProfessor").value

let professores=JSON.parse(localStorage.getItem("professores"))||[]

professores.push({
nome:nome,
disciplina:disciplina
})

localStorage.setItem("professores",JSON.stringify(professores))

alert("Professor cadastrado!")

}



// ==========================
// REGISTRAR NOTA
// ==========================

function registrarNota(e){

e.preventDefault()

let cpf=document.getElementById("cpfNota").value.replace(/\D/g,'')
let disciplina=document.getElementById("disciplinaNota").value
let nota=parseFloat(document.getElementById("notaAluno").value)

let alunos=JSON.parse(localStorage.getItem("alunos"))||[]

let aluno=alunos.find(a=>a.cpf===cpf)

if(!aluno){

alert("Aluno não encontrado")
return

}

aluno.notas.push({
disciplina:disciplina,
nota:nota
})

localStorage.setItem("alunos",JSON.stringify(alunos))

alert("Nota registrada!")

}



// ==========================
// LOGIN ALUNO OU PROFESSOR
// ==========================

function loginSistema(){

let cpf=document.getElementById("cpf").value.replace(/\D/g,'')
let tipo=document.getElementById("tipoUsuario").value

if(tipo==="aluno"){

let alunos=JSON.parse(localStorage.getItem("alunos"))||[]

let aluno=alunos.find(a=>a.cpf===cpf)

if(aluno){

localStorage.setItem("alunoLogado",JSON.stringify(aluno))
window.location="alunos.html"

}else{

alert("Aluno não encontrado")

}

}



if(tipo==="professor"){

let professores=JSON.parse(localStorage.getItem("professores"))||[]

if(professores.length===0){

alert("Nenhum professor cadastrado ainda")
return

}

localStorage.setItem("professorLogado",cpf)

window.location="professores.html"

}

}



// ==========================
// BOLETIM
// ==========================

function carregarBoletim(){

let tabela=document.getElementById("tabela")

if(!tabela) return

let aluno=JSON.parse(localStorage.getItem("alunoLogado"))

if(!aluno) return

let soma=0

tabela.innerHTML=`
<tr>
<th>Disciplina</th>
<th>Nota</th>
</tr>
`

aluno.notas.forEach(n=>{

tabela.innerHTML+=`
<tr>
<td>${n.disciplina}</td>
<td>${n.nota}</td>
</tr>
`

soma+=n.nota

})

let media=0

if(aluno.notas.length>0){
media=(soma/aluno.notas.length).toFixed(1)
}

let situacao=media>=6?"Aprovado":"Reprovado"

tabela.innerHTML+=`

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

let conteudo=document.querySelector(".boletim-container")

let janela=window.open("","","width=800,height=600")

janela.document.write("<html><head><title>Boletim</title></head><body>")
janela.document.write(conteudo.innerHTML)
janela.document.write("</body></html>")

janela.document.close()
janela.print()

}



// ==========================
// MOSTRAR ALUNOS
// ==========================

function mostrarAlunos(){

let tabela=document.getElementById("tabelaAlunos")

if(!tabela) return

let alunos=JSON.parse(localStorage.getItem("alunos"))||[]

tabela.innerHTML=`
<tr>
<th>Nome</th>
<th>CPF</th>
</tr>
`

alunos.forEach(a=>{

tabela.innerHTML+=`
<tr>
<td>${a.nome}</td>
<td>${a.cpf}</td>
</tr>
`

})

}



// ==========================
// CALENDÁRIO ESCOLAR
// ==========================

function carregarCalendario(){

let calendario=document.getElementById("calendario")

if(!calendario) return

let eventos=[

{evento:"Início das aulas",data:"05/02"},
{evento:"Feira de Ciências",data:"20/04"},
{evento:"Recesso Escolar",data:"15/07"},
{evento:"Provas finais",data:"10/12"}

]

eventos.forEach(e=>{

calendario.innerHTML+=`
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

mostrarAlunos()
carregarBoletim()
carregarCalendario()

}
