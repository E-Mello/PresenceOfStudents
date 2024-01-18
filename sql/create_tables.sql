CREATE TABLE Aluno (
    id INT AUTO_INCREMENT, nome VARCHAR(100), email VARCHAR(100), PRIMARY KEY (id)
);

CREATE TABLE Presenca (
    id INT AUTO_INCREMENT, aluno_id INT, data DATE, presente BOOLEAN, PRIMARY KEY (id), FOREIGN KEY (aluno_id) REFERENCES Aluno (id)
);