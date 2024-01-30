import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import pg from "pg"; // Importe Pool ao invés de createConnection
import pkg from "body-parser";

const { Pool } = pg;
const app = express();
const port = 3000;
const { json } = pkg;
dotenv.config();

// Middleware para permitir qualquer origem
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Configuração do banco de dados
const pool = new Pool({
  database: process.env.POSTGRES_DATABASE,
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432,
  ssl: { rejectUnauthorized: false },
});

// Middleware para analisar solicitações JSON
app.use(json());

// Record Attendance
app.post("/attendance", (req, res) => {
  const { aluno_id, data, presente } = req.body;
  const query =
    "INSERT INTO attendance (aluno_id, data, presente) VALUES ($1, $2, $3)";
  const values = [aluno_id, data, presente];
  pool.query(query, values, (err, results) => {
    if (err) {
      console.error("Erro ao registrar chamada:", err);
      res.status(500).send("Erro interno do servidor");
    } else {
      res.send("Chamada registrada com sucesso");
    }
  });
});

// Read Attendance
app.get("/attendance", (req, res) => {
  const query = "SELECT * FROM attendance";
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar chamadas:", err);
      res.status(500).send("Erro interno do servidor");
    } else {
      res.json(results.rows);
    }
  });
});

// Update Attendance
app.put("/attendance/:id", (req, res) => {
  const id = req.params.id;
  const newAttendance = req.body;
  const query =
    "UPDATE attendance SET aluno_id = $1, data = $2, presente = $3 WHERE id = $4";
  const values = [...Object.values(newAttendance), id];
  pool.query(query, values, (err, results) => {
    if (err) {
      console.error("Erro ao atualizar chamada:", err);
      res.status(500).send("Erro interno do servidor");
    } else {
      res.send("Chamada atualizada com sucesso");
    }
  });
});

// Delete Attendance
app.delete("/attendance/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM attendance WHERE id = $1";
  const values = [id];
  pool.query(query, values, (err, results) => {
    if (err) {
      console.error("Erro ao deletar chamada:", err);
      res.status(500).send("Erro interno do servidor");
    } else {
      res.send("Chamada deletada com sucesso");
    }
  });
});

// Create students
app.post("/students", (req, res) => {
  const { nome, email } = req.body;
  const query = "INSERT INTO students (nome, email) VALUES ($1, $2)";
  const values = [nome, email];
  pool.query(query, values, (err, results) => {
    if (err) {
      console.error("Erro ao adicionar students:", err);
      res.status(500).send("Erro interno do servidor");
    } else {
      // Aqui deu certo a inserção, porém, é necessário pegar a lista de alunos atualizada e
      // devolver pro front-end renderizar novamente
      const selectQuery = "SELECT * FROM students";
      pool.query(selectQuery, (err, results) => {
        if (err) {
          console.error("Erro ao obter students:", err);
          res.status(500).send("Erro interno do servidor");
        } else {
          // Enviar a lista de alunos como resposta em formato JSON
          res.send(results.rows);
        }
      });
    }
  });
});

// Read students
app.get("/students", (req, res) => {
  const query = "SELECT * FROM students";
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar students:", err);
      res.status(500).send("Erro interno do servidor");
    } else {
      res.json(results.rows);
    }
  });
});

// Update students
app.put("/students/:id", (req, res) => {
  const id = req.params.id;
  const newStudents = req.body;
  const query = "UPDATE students SET nome = $1, email = $2 WHERE id = $3";
  const values = [...Object.values(newStudents), id];
  pool.query(query, values, (err, results) => {
    if (err) {
      console.error("Erro ao atualizar aluno:", err);
      res.status(500).send("Erro interno do servidor");
    } else {
      res.send("Aluno atualizado com sucesso");
    }
  });
});

// Delete students
app.delete("/students/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM students WHERE id = $1";
  const values = [id];
  pool.query(query, values, (err, results) => {
    if (err) {
      console.error("Erro ao excluir students:", err);
      res.status(500).send("Erro interno do servidor");
    } else {
      res.send("students excluído com sucesso");
    }
  });
});

// Mark attendance
app.post("/mark-attendance/:id", (req, res) => {
  const id = req.params.id;
  const query = "UPDATE students SET attendance = 1 WHERE id = $1";
  const values = [id];
  pool.query(query, values, (err, results) => {
    if (err) {
      console.error("Erro ao marcar presença:", err);
      res.status(500).send("Erro interno do servidor");
    } else {
      res.send("Presença marcada com sucesso");
    }
  });
});

// Raise server
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
