/* =========================
   TURMAS
========================= */

CREATE TABLE IF NOT EXISTS turmas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(50) NOT NULL
);

/* =========================
   ALUNOS
========================= */

CREATE TABLE IF NOT EXISTS alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    turma_id INT,
    FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL
);

/* =========================
   PROFESSORES
========================= */

CREATE TABLE IF NOT EXISTS professores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    disciplina VARCHAR(100),
    turma_id INT,
    FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL
);

/* =========================
   NOTAS
========================= */

CREATE TABLE IF NOT EXISTS notas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno_id INT NOT NULL,
    disciplina VARCHAR(100) NOT NULL,
    nota DECIMAL(4,2),
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE
);

/* =========================
   PUBLICAÇÕES (ESSENCIAL)
========================= */

CREATE TABLE IF NOT EXISTS publicacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT,
    imagem TEXT,
    tipo VARCHAR(50),
    data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* =========================
   DADOS INICIAIS
========================= */

-- Nota: No SQLite/D1 não usamos SET FOREIGN_KEY_CHECKS. 
-- Para limpar em produção, use comandos DELETE antes de rodar os INSERTs se necessário.

INSERT INTO turmas (nome) VALUES ("1º Ano A");
INSERT INTO turmas (nome) VALUES ("2º Ano B");
INSERT INTO turmas (nome) VALUES ("3º Ano C");

/* SENHAS COM HASH (bcrypt já gerado) */

INSERT INTO alunos (nome, cpf, senha, turma_id) VALUES 
("João Silva", "12345678900", "$2b$10$7a7vZQF7Y9h0L9yXJH7B8uQ9J5n3h7f1QvZkz2bW8F7x9kXk1aY1S", 1);
INSERT INTO alunos (nome, cpf, senha, turma_id) VALUES 
("Maria Souza", "98765432100", "$2b$10$7a7vZQF7Y9h0L9yXJH7B8uQ9J5n3h7f1QvZkz2bW8F7x9kXk1aY1S", 1);
INSERT INTO alunos (nome, cpf, senha, turma_id) VALUES 
("Pedro Santos", "11122233344", "$2b$10$7a7vZQF7Y9h0L9yXJH7B8uQ9J5n3h7f1QvZkz2bW8F7x9kXk1aY1S", 2);

INSERT INTO professores (nome, cpf, senha, disciplina, turma_id) VALUES 
("Carlos Oliveira", "22233344455", "$2b$10$7a7vZQF7Y9h0L9yXJH7B8uQ9J5n3h7f1QvZkz2bW8F7x9kXk1aY1S", "Matemática", 1);
INSERT INTO professores (nome, cpf, senha, disciplina, turma_id) VALUES 
("Ana Costa", "33344455566", "$2b$10$7a7vZQF7Y9h0L9yXJH7B8uQ9J5n3h7f1QvZkz2bW8F7x9kXk1aY1S", "Português", 2);

/* NOTAS */

INSERT INTO notas (aluno_id, disciplina, nota) VALUES (1, "Matemática", 8.5);
INSERT INTO notas (aluno_id, disciplina, nota) VALUES (1, "Português", 9.0);
INSERT INTO notas (aluno_id, disciplina, nota) VALUES (2, "Matemática", 7.8);
INSERT INTO notas (aluno_id, disciplina, nota) VALUES (3, "Matemática", 6.9);
