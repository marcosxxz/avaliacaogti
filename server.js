import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();

// 🔹 Libera o Netlify acessar
app.use(cors({ origin: "https://avali-gti2025.netlify.app" }));
app.use(express.json());

// 🔹 Salvar respostas
app.post("/salvar", (req, res) => {
  fs.appendFileSync("respostas.json", JSON.stringify(req.body) + "\n");
  res.json({ ok: true });
});

// 🔹 Calcular resultados (médias)
app.get("/resultados", (req, res) => {
  if (!fs.existsSync("respostas.json")) return res.json({});

  const linhas = fs.readFileSync("respostas.json", "utf-8")
    .trim()
    .split("\n")
    .map(l => JSON.parse(l));

  const soma = {};
  const count = {};

  linhas.forEach(resp => {
    for (const [key, val] of Object.entries(resp)) {
      const num = Number(val);
      if (!isNaN(num)) {
        soma[key] = (soma[key] || 0) + num;
        count[key] = (count[key] || 0) + 1;
      }
    }
  });

  const medias = {};
  for (const key in soma) {
    medias[key] = soma[key] / count[key];
  }

  res.json(medias);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server rodando na porta ${PORT}`));
