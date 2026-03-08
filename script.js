// LOGIN DO ALUNO

function login(){

let cpf=document.getElementById("cpf").value

// remove pontos e traços
cpf=cpf.replace(/\D/g,'')

if(cpf=="12345678900"){

localStorage.setItem("aluno","João Silva")

window.location="alunos.html"

}else{

alert("CPF não encontrado")

}

}



// FORMATAR CPF AUTOMATICAMENTE

function formatarCPF(campo){

let cpf=campo.value.replace(/\D/g,'')

cpf=cpf.replace(/(\d{3})(\d)/,"$1.$2")
cpf=cpf.replace(/(\d{3})(\d)/,"$1.$2")
cpf=cpf.replace(/(\d{3})(\d{1,2})$/,"$1-$2")

campo.value=cpf

}



// CARREGAR BOLETIM

window.onload=function(){

let tabela=document.getElementById("tabela")

if(!tabela) return

let notas=[

{disciplina:"Matemática",nota:8.5},
{disciplina:"Português",nota:9.0},
{disciplina:"História",nota:7.5},
{disciplina:"Geografia",nota:8.0},
{disciplina:"Ciências",nota:9.2}

]

let soma=0

notas.forEach(n=>{

tabela.innerHTML+=`
<tr>
<td>${n.disciplina}</td>
<td>${n.nota}</td>
</tr>
`

soma+=n.nota

})

let media=(soma/notas.length).toFixed(1)

tabela.innerHTML+=`

<tr>
<td><strong>Média Final</strong></td>
<td><strong>${media}</strong></td>
</tr>

`

}
