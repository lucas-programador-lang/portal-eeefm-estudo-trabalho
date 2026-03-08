/* =========================
   CRIAR BANCO
========================= */

CREATE DATABASE IF NOT EXISTS escola;
USE escola;


/* =========================
   TABELA TURMAS
========================= */

CREATE TABLE turmas (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(50) NOT NULL
);


/* =========================
   TABELA ALUNOS
========================= */

CREATE TABLE alunos (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
cpf VARCHAR(14) UNIQUE NOT NULL,
senha VARCHAR(100) NOT NULL,
turma_id INT,
FOREIGN KEY (turma_id) REFERENCES turmas(id)
);


/* =========================
   TABELA PROFESSORES
========================= */

CREATE TABLE professores (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
cpf VARCHAR(14) UNIQUE NOT NULL,
senha VARCHAR(100) NOT NULL,
disciplina VARCHAR(100),
turma_id INT,
FOREIGN KEY (turma_id) REFERENCES turmas(id)
);


/* =========================
   TABELA NOTAS
========================= */

CREATE TABLE notas (
id INT AUTO_INCREMENT PRIMARY KEY,
aluno_id INT NOT NULL,
disciplina VARCHAR(100) NOT NULL,
nota DECIMAL(4,2),
FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);


/* =========================
   DADOS DE EXEMPLO
========================= */

/* TURMAS */

INSERT INTO turmas (nome) VALUES
("1º Ano A"),
("2º Ano B"),
("3º Ano C");


/* ALUNOS */

INSERT INTO alunos (nome,cpf,senha,turma_id) VALUES
("João Silva","12345678900","1234",1),
("Maria Souza","98765432100","1234",1),
("Pedro Santos","11122233344","1234",2);


/* PROFESSORES */

INSERT INTO professores (nome,cpf,senha,disciplina,turma_id) VALUES
("Carlos Oliveira","22233344455","1234","Matemática",1),
("Ana Costa","33344455566","1234","Português",2);


/* NOTAS */

INSERT INTO notas (aluno_id,disciplina,nota) VALUES
(1,"Matemática",8.5),
(1,"Português",9.0),
(1,"História",7.5),
(2,"Matemática",7.8),
(2,"Português",8.2),
(3,"Matemática",6.9);
