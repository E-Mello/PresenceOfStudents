import { createConnection } from 'mysql2';
import dotenv from 'dotenv';
import express from 'express';
import pkg from 'body-parser';

const app = express();
const port = 3000;
const { json } = pkg;
dotenv.config();

// Configuração do banco de dados
const connection = createConnection({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

// Conectar ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados');
  }
});

// Middleware para analisar solicitações JSON
app.use(json());

// Rotas CRUD para Alunos
app.post('/alunos', (req, res) => {
  const aluno = req.body;
  connection.query('INSERT INTO alunos SET ?', aluno, (err, results) => {
    if (err) {
      console.error('Erro ao adicionar aluno:', err);
      res.status(500).send('Erro interno do servidor');
    } else {
      res.status(201).send('Aluno adicionado com sucesso');
    }
  });
});

app.get('/alunos', (req, res) => {
  connection.query('SELECT * FROM alunos', (err, results) => {
    if (err) {
      console.error('Erro ao buscar alunos:', err);
      res.status(500).send('Erro interno do servidor');
    } else {
      res.json(results);
    }
  });
});

app.put('/alunos/:id', (req, res) => {
  const id = req.params.id;
  const novoAluno = req.body;
  connection.query('UPDATE alunos SET ? WHERE id = ?', [novoAluno, id], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar aluno:', err);
      res.status(500).send('Erro interno do servidor');
    } else {
      res.send('Aluno atualizado com sucesso');
    }
  });
});

app.delete('/alunos/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM alunos WHERE id = ?', id, (err, results) => {
    if (err) {
      console.error('Erro ao excluir aluno:', err);
      res.status(500).send('Erro interno do servidor');
    } else {
      res.send('Aluno excluído com sucesso');
    }
  });
});

// Marcar presença
app.post('/marcar-presenca/:id', (req, res) => {
  const id = req.params.id;
  connection.query('UPDATE alunos SET presenca = 1 WHERE id = ?', id, (err, results) => {
    if (err) {
      console.error('Erro ao marcar presença:', err);
      res.status(500).send('Erro interno do servidor');
    } else {
      res.send('Presença marcada com sucesso');
    }
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
