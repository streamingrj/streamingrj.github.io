RJ TV Premium - Landing Page Completa

Uma landing page profissional para serviços de IPTV com sistema completo de pagamentos, analytics e conversão.
🚀 Funcionalidades Implementadas
✅ Gateway de Pagamento (InfinitePay)

    Integração completa com SDK oficial
    Pagamento via cartão de crédito
    Parcelamento em até 12x sem juros
    Processamento seguro

✅ Sistema PIX

    QR Code dinâmico
    Código copia e cola
    Desconto de 5% automático
    Confirmação em tempo real

✅ Checkout Otimizado

    3 etapas intuitivas (Dados → Pagamento → Confirmação)
    Validação em tempo real
    Máscaras automáticas (CPF, telefone)
    UX/UI moderna e responsiva

✅ Upsell Estratégico

    Oferta de canais adultos premium
    Aparece dinamicamente baseado no plano
    Tracking de conversão
    Design persuasivo

✅ Sistema Anti-Fraude

    Análise comportamental
    Verificação de navegador
    Score de confiabilidade
    Bloqueio automático de bots

✅ Selos de Segurança

    SSL Secure
    Reclame Aqui (nota 9.2/10)
    Compra Segura
    PIX Disponível

✅ Analytics Completo

    Google Analytics 4
    Facebook Pixel
    Tracking de eventos personalizados
    Funil de conversão completo

🛠️ Configuração
1. InfinitePay

    Acesse o InfinitePay ou entre em contato para criar sua conta
    Obtenha suas credenciais de API
    Copie seu App Token
    Edite o arquivo config.js:

infinitePay: {
    appToken: 'YOUR-INFINITEPAY-APP-TOKEN-HERE', // Seu App Token aqui
    environment: 'sandbox', // 'sandbox' para teste, 'production' para produção
    currency: 'BRL'
}

2. Google Analytics

    Crie uma propriedade no Google Analytics
    Copie o Measurement ID (formato: G-XXXXXXXXXX)
    Atualize o config.js:

googleAnalytics: {
    measurementId: 'G-XXXXXXXXXX', // Seu ID aqui
    enabled: true
}

    Atualize também no index.html (linha 22):

<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>

3. Facebook Pixel

    Crie um pixel no Facebook Business
    Copie o Pixel ID
    Atualize o config.js:

facebookPixel: {
    pixelId: '1234567890123456', // Seu Pixel ID aqui
    enabled: true
}

    Atualize também no index.html (linha 35):

fbq('init', '1234567890123456'); // Seu Pixel ID aqui

4. Configuração PIX

Atualize os dados da sua empresa no config.js:

pix: {
    desconto: 0.05, // 5% de desconto
    chavePixEmpresa: 'sua-chave@empresa.com',
    nomeEmpresa: 'SUA EMPRESA LTDA',
    cidadeEmpresa: 'SUA CIDADE'
}

5. WhatsApp

Atualize o número do WhatsApp no config.js:

whatsapp: {
    number: '5511999999999', // Seu número com código do país
    defaultMessage: 'Olá! Tenho interesse no RJ TV Premium.'
}

📊 Eventos de Analytics Rastreados
Eventos Padrão:

    page_view - Visualização da página
    begin_checkout - Início do checkout
    proceed_to_payment - Prosseguir para pagamento
    purchase - Compra realizada
    upsell_shown - Upsell exibido
    upsell_accepted - Upsell aceito
    payment_method_selected - Método de pagamento selecionado
    pix_payment_initiated - Pagamento PIX iniciado
    card_payment_initiated - Pagamento cartão iniciado
    pix_code_copied - Código PIX copiado
    fraud_detected - Fraude detectada
    plans_section_viewed - Seção de planos visualizada
    testimonials_viewed - Depoimentos visualizados

🔒 Sistema Anti-Fraude

O sistema coleta automaticamente:

    User Agent do navegador
    Timezone do usuário
    Idioma do navegador
    Resolução da tela
    Tempo de sessão
    Número de cliques
    Verificação WebGL
    Detecção de bots

Score mínimo padrão: 60/100 (configurável no config.js)
💰 Preços dos Planos (Configurável)

planos: {
    mensal: { valor: 35.00, nome: 'Plano Mensal' },
    trimestral: { valor: 75.00, nome: 'Plano Trimestral' },
    semestral: { valor: 159.90, nome: 'Plano Semestral' },
    anual: { valor: 249.90, nome: 'Plano Anual VIP' }
}

🎯 Funil de Conversão

    Landing Page - Apresentação dos planos
    Formulário - Captura de dados
    Upsell - Oferta estratégica
    Pagamento - PIX ou Cartão
    Confirmação - Página de sucesso
    WhatsApp - Entrega do produto

📱 Responsividade

    Layout otimizado para mobile
    Checkout adaptativo
    Botões touch-friendly
    Formulários responsivos

🔧 Arquivos Principais

    index.html - Estrutura principal
    style.css - Estilos e responsividade
    main.js - Lógica do checkout e pagamentos
    config.js - Configurações personalizáveis

🚀 Deploy

    Configure todas as chaves nos arquivos
    Teste em ambiente de sandbox
    Mude environment: 'production' no InfinitePay
    Faça upload para seu servidor
    Configure SSL (obrigatório para pagamentos)

📞 Suporte

Para dúvidas sobre implementação, entre em contato através do WhatsApp configurado na página.

Desenvolvido com foco em conversão e performance ⚡
