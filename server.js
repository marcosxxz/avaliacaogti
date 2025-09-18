import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();

// 🔹 Habilita CORS só para o seu site do Netlify
app.use(cors({
  origin: "https://avali-gti2025.netlify.app"
}));

app.use(express.json());

// rota salvar
app.post("/salvar", (req, res) => {
  fs.appendFileSync("respostas.json", JSON.stringify(req.body) + "\n");
  res.json({ ok: true });
});

// rota resultados
app.get("/resultados", (req, res) => {
  if (!fs.existsSync("respostas.json")) return res.json({ medias:{}, counts:{} });

  const linhas = fs.readFileSync("respostas.json", "utf-8")
    .trim()
    .split("\n")
    .map(l => JSON.parse(l));

  const soma = {}, count = {};
  linhas.forEach(resp => {
    for (const [key,val] of Object.entries(resp)) {
      if (typeof val === "number") {
        soma[key] = (soma[key]||0)+val;
        count[key] = (count[key]||0)+1;
      }
    }
  });

  const medias = {};
  for (const key in soma) medias[key] = soma[key]/count[key];

  res.json({ medias, counts: count });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server rodando na porta ${PORT}`));
