function login(){

let cpf=document.getElementById("cpf").value

if(cpf=="12345678900"){

localStorage.setItem("aluno","João Silva")

window.location="alunos.html"

}else{

alert("CPF não encontrado")

}

}

window.onload=function(){

let nome=localStorage.getItem("aluno")

let tabela=document.getElementById("tabela")

if(tabela){

tabela.innerHTML+=`

<tr>
<td>Matemática</td>
<td>8.5</td>
</tr>

<tr>
<td>Português</td>
<td>9.0</td>
</tr>

<tr>
<td>História</td>
<td>7.5</td>
</tr>

`

}

}
