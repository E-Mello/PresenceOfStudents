const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuração do banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'seu_usuario',
  password: 'sua_senha',
  database: 'sua_base_de_dados',
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
app.use(bodyParser.json());

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
