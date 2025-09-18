const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve o index.html

// rota para salvar respostas
app.post("/salvar", (req, res) => {
  const dados = req.body;
  fs.appendFileSync("respostas.json", JSON.stringify(dados) + "\n");
  res.send({ status: "ok" });
});

// inicia servidor
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
