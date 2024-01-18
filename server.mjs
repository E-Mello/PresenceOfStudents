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

// Create students
app.post('/students', (req, res) => {
  const { nome, email } = req.body;
  const students = { nome, email };
  connection.query('INSERT INTO students SET ?', students, (err, results) => {
    if (err) {
      console.error('Erro ao adicionar students:', err);
      res.status(500).send('Erro interno do servidor');
    } else {
      res.status(201).send('students adicionado com sucesso');
      console.log('students adicionado com sucesso');
    }
  });
});

// Read students
app.get('/students', (req, res) => {
  connection.query('SELECT * FROM students', (err, results) => {
    if (err) {
      console.error('Erro ao buscar students:', err);
      res.status(500).send('Erro interno do servidor');
    } else {
      res.json(results);
      res.status(200).send('students buscado com sucesso');
    }
  });
});

// Update students
app.put('/students/:id', (req, res) => {
  const id = req.params.id;
  const newStudents = req.body;
  connection.query('UPDATE students SET ? WHERE id = ?', [newStudents, id], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar students:', err);
      res.status(500).send('Erro interno do servidor');
    } else {
      res.send('students atualizado com sucesso');
    }
  });
});

// Delete students
app.delete('/students/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM students WHERE id = ?', id, (err, results) => {
    if (err) {
      console.error('Erro ao excluir students:', err);
      res.status(500).send('Erro interno do servidor');
    } else {
      res.send('students excluído com sucesso');
    }
  });
});

// Mark attendance
app.post('/mark-attendance/:id', (req, res) => {
  const id = req.params.id;
  connection.query('UPDATE students SET attendance = 1 WHERE id = ?', id, (err, results) => {
    if (err) {
      console.error('Erro ao marcar presença:', err);
      res.status(500).send('Erro interno do servidor');
    } else {
      res.send('Presença marcada com sucesso');
    }
  });
});

// Raise server
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
