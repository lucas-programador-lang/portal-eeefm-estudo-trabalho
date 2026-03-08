function loginAluno(){
let ra=document.getElementById("ra").value;

if(ra==="123"){
document.getElementById("boletim").innerHTML=`

<h3>Boletim Escolar</h3>

<table>
<tr>
<th>Disciplina</th>
<th>Nota</th>
</tr>

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

</table>

`;
}else{
alert("Aluno não encontrado");
}
}

function enviarMatricula(){
alert("Pré-matrícula enviada com sucesso!");
}
