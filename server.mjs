import cors from "cors";
import { createConnection } from "mysql2";
import dotenv from "dotenv";
import express from "express";
import pkg from "body-parser";

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
    console.error("Erro ao conectar ao banco de dados:", err);
  } else {
    console.log("Conectado ao banco de dados");
  }
});

app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Permitir apenas este domínio
  })
);

// Middleware para analisar solicitações JSON
app.use(json());

// Record Attendance
app.post("/attendance", (req, res) => {
  const { aluno_id, data, presente } = req.body;
  const attendance = { aluno_id, data, presente };
  connection.query(
    "INSERT INTO attendance SET ?",
    attendance,
    (err, results) => {
      if (err) {
        console.error("Erro ao registrar chamada:", err);
        res.status(500).send("Erro interno do servidor");
      } else {
        res.send("Chamada registrada com sucesso");
      }
    }
  );
});

// Read Attendance
app.get("/attendance", (req, res) => {
  connection.query("SELECT * FROM chamadas", (err, results) => {
    if (err) {
      console.error("Erro ao buscar chamadas:", err);
      res.status(500).send("Erro interno do servidor");
    } else {
      res.json(results);
    }
  });
});

// Update Attendance
app.put("/attendance/:id", (req, res) => {
  const id = req.params.id;
  const newAttendance = req.body;
  connection.query(
    "UPDATE chamadas SET ? WHERE id = ?",
    [newAttendance, id],
    (err, results) => {
      if (err) {
        console.error("Erro ao atualizar chamada:", err);
        res.status(500).send("Erro interno do servidor");
      } else {
        res.send("Chamada atualizada com sucesso");
      }
    }
  );
});

// Delete Attendance
app.delete("/attendance/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM chamadas WHERE id = ?", id, (err, results) => {
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
  const students = { nome, email };
  connection.query("INSERT INTO students SET ?", students, (err, results) => {
    if (err) {
      console.error("Erro ao adicionar students:", err);
      res.status(500).send("Erro interno do servidor");
    } else {
      // Aqui deu certo a inserção, porém, é necessário pegar a lista de alunos atualizada e
      // devolver pro front-end renderizar novamente
      connection.query("SELECT * FROM students", (err, results) => {
        if (err) {
          console.error("Erro ao obter students:", err);
          res.status(500).send("Erro interno do servidor");
        } else {
          // Enviar a lista de alunos como resposta em formato JSON
          res.send(results);
        }
      });
    }
  });
});

// Read students
app.get("/students", (req, res) => {
  connection.query("SELECT * FROM students", (err, results) => {
    if (err) {
      console.error("Erro ao buscar students:", err);
      res.status(500).send("Erro interno do servidor");
    } else {
      res.json(results);
    }
  });
});

// Update students
app.put("/students/:id", (req, res) => {
  const id = req.params.id;
  const newStudents = req.body;
  connection.query(
    "UPDATE students SET ? WHERE id = ?",
    [newStudents, id],
    (err, results) => {
      if (err) {
        console.error("Erro ao atualizar aluno:", err);
        res.status(500).send("Erro interno do servidor");
      } else {
        res.send("Aluno atualizado com sucesso");
      }
    }
  );
});

// Delete students
app.delete("/students/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM students WHERE id = ?", id, (err, results) => {
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
  connection.query(
    "UPDATE students SET attendance = 1 WHERE id = ?",
    id,
    (err, results) => {
      if (err) {
        console.error("Erro ao marcar presença:", err);
        res.status(500).send("Erro interno do servidor");
      } else {
        res.send("Presença marcada com sucesso");
      }
    }
  );
});

// Raise server
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
