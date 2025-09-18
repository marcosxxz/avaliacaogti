import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();

// 🔹 libera o Netlify acessar
app.use(cors({ origin: "https://avali-gti2025.netlify.app" }));
app.use(express.json());

// 🔹 Mapeamento texto → número
const escala5 = {
  "Muito Insatisfatório": 1,
  "Insatisfatório": 2,
  "Regular": 3,
  "Satisfatório": 4,
  "Muito Satisfatório": 5,

  "Nunca": 1,
  "Raramente": 2,
  "Às vezes": 3,
  "Frequentemente": 4,
  "Sempre": 5,

  "Totalmente Desconfortável": 1,
  "Desconfortável": 2,
  "Neutro": 3,
  "Confortável": 4,
  "Muito Confortável": 5,

  "Não oferece apoio": 1,
  "Apoio insuficiente": 2,
  "Apoio adequado": 3,
  "Apoio bom": 4,
  "Apoio excelente": 5
};

// 🔹 Salvar respostas (convertendo)
app.post("/salvar", (req, res) => {
  const entrada = req.body;
  const convertido = {};

  for (const [key, val] of Object.entries(entrada)) {
    if (escala5[val]) {
      convertido[key] = escala5[val]; // texto → número
    } else if (!isNaN(Number(val))) {
      convertido[key] = Number(val);  // número já enviado
    } else {
      convertido[key] = val;          // feedback textual ou outro campo
    }
  }

  fs.appendFileSync("respostas.json", JSON.stringify(convertido) + "\n");
  res.json({ ok: true });
});

// 🔹 Calcular médias
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
      if (typeof val === "number") {
        soma[key] = (soma[key] || 0) + val;
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
