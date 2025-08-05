// Configurações do RJ TV Premium
// ⚠️ IMPORTANTE: Substitua os valores de exemplo pelas suas chaves reais

const CONFIG = {
    // Mercado Pago
    mercadoPago: {
        publicKey: 'TEST-your-public-key-here', // Substitua pela sua chave pública
        sandbox: true, // Mude para false em produção
        currency: 'BRL'
    },
    
    // Google Analytics
    googleAnalytics: {
        measurementId: 'GA_MEASUREMENT_ID', // Substitua pelo seu Measurement ID (ex: G-XXXXXXXXXX)
        enabled: true
    },
    
    // Facebook Pixel
    facebookPixel: {
        pixelId: 'YOUR_PIXEL_ID', // Substitua pelo seu Pixel ID
        enabled: true
    },
    
    // WhatsApp
    whatsapp: {
        number: '5521977317084', // Número do WhatsApp (com código do país)
        defaultMessage: 'Olá! Tenho interesse no RJ TV Premium.'
    },
    
    // Sistema Anti-Fraude
    antiFraude: {
        scoreMinimo: 60, // Score mínimo para aprovação (0-100)
        tempoMinimoSessao: 10000, // Tempo mínimo em milissegundos
        cliquesMinimos: 2, // Número mínimo de cliques
        enabled: true
    },
    
    // Preços dos planos
    planos: {
        mensal: {
            valor: 35.00,
            nome: 'Plano Mensal',
            descricao: 'Acesso completo por 1 mês'
        },
        trimestral: {
            valor: 75.00,
            nome: 'Plano Trimestral',
            descricao: 'Acesso completo por 3 meses + 15 dias grátis'
        },
        semestral: {
            valor: 159.90,
            nome: 'Plano Semestral',
            descricao: 'Acesso completo por 6 meses'
        },
        anual: {
            valor: 249.90,
            nome: 'Plano Anual VIP',
            descricao: 'Acesso completo por 12 meses + 2 meses grátis'
        }
    },
    
    // Upsell
    upsell: {
        canaisAdultos: {
            valor: 15.00,
            nome: 'Canais Adultos Premium',
            descricao: 'Conteúdo exclusivo para adultos'
        }
    },
    
    // PIX
    pix: {
        desconto: 0.05, // 5% de desconto
        chavePixEmpresa: 'empresa@rjtvpremium.com', // Sua chave PIX
        nomeEmpresa: 'RJ TV PREMIUM LTDA',
        cidadeEmpresa: 'SAO PAULO'
    },
    
    // Configurações gerais
    geral: {
        tempoExpiracaoOferta: 300, // 5 minutos em segundos
        intervaloAtualizacaoContadores: {
            min: 15000, // 15 segundos
            max: 45000  // 45 segundos
        }
    }
};

// Exportar configurações
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// Para uso no navegador
window.CONFIG = CONFIG;