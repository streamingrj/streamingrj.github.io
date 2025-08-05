const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mapeamento dos links de pagamento da InfinitePay
const paymentLinks = {
    mensal: "https://pay.infinitepay.io/link-do-plano-mensal",
    mensal_com_adulto: "https://pay.infinitepay.io/link-do-plano-mensal-com-adulto",
    trimestral: "https://pay.infinitepay.io/link-do-plano-trimestral",
    trimestral_com_adulto: "https://pay.infinitepay.io/link-do-plano-trimestral-com-adulto",
    semestral: "https://pay.infinitepay.io/link-do-plano-semestral",
    semestral_com_adulto: "https://pay.infinitepay.io/link-do-plano-semestral-com-adulto",
    anual: "https://pay.infinitepay.io/link-do-plano-anual",
    anual_com_adulto: "https://pay.infinitepay.io/link-do-plano-anual-com-adulto"
};

app.post("/api/checkout", (req, res) => {
    const { nome, email, whatsapp, cpf, plano, upsell } = req.body;

    let chave = plano;
    if (upsell === "true") {
        chave += "_com_adulto";
    }

    const linkPagamento = paymentLinks[chave];

    if (!linkPagamento) {
        return res.status(400).json({ erro: "Plano inválido ou link não configurado." });
    }

    return res.json({ url: linkPagamento });
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});