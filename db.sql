CREATE DATABASE escola;

USE escola;

CREATE TABLE alunos (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100),
cpf VARCHAR(14),
senha VARCHAR(100)
);

CREATE TABLE notas (
id INT AUTO_INCREMENT PRIMARY KEY,
aluno_id INT,
disciplina VARCHAR(100),
nota DECIMAL(4,2)
);

INSERT INTO alunos (nome,cpf,senha)
VALUES ("João Silva","12345678900","1234");

INSERT INTO notas (aluno_id,disciplina,nota)
VALUES
(1,"Matemática",8.5),
(1,"Português",9.0),
(1,"História",7.5);
