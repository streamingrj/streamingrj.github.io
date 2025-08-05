const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mapear os links fixos da InfinitePay
const paymentLinks = {
    mensal: "https://sualink.com/mensal",
    mensal_com_adulto: "https://sualink.com/mensal-com-adulto",
    trimestral: "https://sualink.com/trimestral",
    trimestral_com_adulto: "https://sualink.com/trimestral-com-adulto",
    semestral: "https://sualink.com/semestral",
    semestral_com_adulto: "https://sualink.com/semestral-com-adulto",
    anual: "https://sualink.com/anual",
    anual_com_adulto: "https://sualink.com/anual-com-adulto",
};

// Endpoint para receber os dados do cliente
app.post("/api/checkout", (req, res) => {
    const { nome, email, whatsapp, cpf, plano, upsell } = req.body;

    // Determinar chave do plano
    let chave = plano;
    if (upsell === "true") {
        chave += "_com_adulto";
    }

    const linkPagamento = paymentLinks[chave];

    if (!linkPagamento) {
        return res.status(400).json({ erro: "Plano inválido ou link não configurado." });
    }

    // Redireciona para o link correto
    return res.json({ url: linkPagamento });
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
