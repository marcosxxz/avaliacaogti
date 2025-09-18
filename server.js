import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors({ origin: "https://avali-gti2025.netlify.app" }));
app.use(express.json());

app.post("/salvar", (req, res) => {
  fs.appendFileSync("respostas.json", JSON.stringify(req.body) + "\n");
  res.json({ ok: true });
});

app.get("/resultados", (req, res) => {
  if (!fs.existsSync("respostas.json")) return res.json({});
  const linhas = fs.readFileSync("respostas.json", "utf-8")
    .trim().split("\n").map(l => JSON.parse(l));

  // calculando média de cada campo
  const soma = {};
  const count = {};
  linhas.forEach(resp => {
    for (const [key, val] of Object.entries(resp)) {
      if (!isNaN(Number(val))) {
        soma[key] = (soma[key] || 0) + Number(val);
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

app.listen(3000, () => console.log("✅ Server rodando"));
