/* =========================
   CRIAR BANCO
========================= */

CREATE DATABASE IF NOT EXISTS escola;
USE escola;

/* =========================
   TURMAS
========================= */

CREATE TABLE IF NOT EXISTS turmas (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(50) NOT NULL
);

/* =========================
   ALUNOS
========================= */

CREATE TABLE IF NOT EXISTS alunos (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
cpf VARCHAR(14) UNIQUE NOT NULL, -- Ajustado para suportar formatação caso necessário
senha VARCHAR(255) NOT NULL,
turma_id INT,
FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL
);

/* =========================
   PROFESSORES
========================= */

CREATE TABLE IF NOT EXISTS professores (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
cpf VARCHAR(14) UNIQUE NOT NULL, -- Ajustado para suportar formatação
senha VARCHAR(255) NOT NULL,
disciplina VARCHAR(100),
turma_id INT,
FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL
);

/* =========================
   NOTAS
========================= */

CREATE TABLE IF NOT EXISTS notas (
id INT AUTO_INCREMENT PRIMARY KEY,
aluno_id INT NOT NULL,
disciplina VARCHAR(100) NOT NULL,
nota DECIMAL(4,2),
FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE
);

/* =========================
   PUBLICAÇÕES (ESSENCIAL)
========================= */

CREATE TABLE IF NOT EXISTS publicacoes (
id INT AUTO_INCREMENT PRIMARY KEY,
titulo VARCHAR(255) NOT NULL,
conteudo TEXT,
imagem TEXT,
tipo VARCHAR(50),
data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* =========================
   DADOS INICIAIS
========================= */

-- Limpeza preventiva para evitar erros de duplicidade em re-execução
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE notas;
TRUNCATE TABLE alunos;
TRUNCATE TABLE professores;
TRUNCATE TABLE turmas;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO turmas (nome) VALUES
("1º Ano A"),
("2º Ano B"),
("3º Ano C");

/* SENHAS COM HASH (bcrypt já gerado) */

INSERT INTO alunos (nome,cpf,senha,turma_id) VALUES
("João Silva","12345678900","$2b$10$7a7vZQF7Y9h0L9yXJH7B8uQ9J5n3h7f1QvZkz2bW8F7x9kXk1aY1S",1),
("Maria Souza","98765432100","$2b$10$7a7vZQF7Y9h0L9yXJH7B8uQ9J5n3h7f1QvZkz2bW8F7x9kXk1aY1S",1),
("Pedro Santos","11122233344","$2b$10$7a7vZQF7Y9h0L9yXJH7B8uQ9J5n3h7f1QvZkz2bW8F7x9kXk1aY1S",2);

INSERT INTO professores (nome,cpf,senha,disciplina,turma_id) VALUES
("Carlos Oliveira","22233344455","$2b$10$7a7vZQF7Y9h0L9yXJH7B8uQ9J5n3h7f1QvZkz2bW8F7x9kXk1aY1S","Matemática",1),
("Ana Costa","33344455566","$2b$10$7a7vZQF7Y9h0L9yXJH7B8uQ9J5n3h7f1QvZkz2bW8F7x9kXk1aY1S","Português",2);

/* NOTAS */

INSERT INTO notas (aluno_id,disciplina,nota) VALUES
(1,"Matemática",8.5),
(1,"Português",9.0),
(2,"Matemática",7.8),
(3,"Matemática",6.9);
