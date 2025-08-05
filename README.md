# RJ TV Premium - Landing Page Completa

Uma landing page profissional para serviços de IPTV com sistema completo de pagamentos, analytics e conversão.

## 🚀 Funcionalidades Implementadas

### ✅ Gateway de Pagamento (Mercado Pago)
- Integração completa com SDK oficial
- Pagamento via cartão de crédito
- Parcelamento em até 12x sem juros
- Processamento seguro

### ✅ Sistema PIX
- QR Code dinâmico
- Código copia e cola
- Desconto de 5% automático
- Confirmação em tempo real

### ✅ Checkout Otimizado
- 3 etapas intuitivas (Dados → Pagamento → Confirmação)
- Validação em tempo real
- Máscaras automáticas (CPF, telefone)
- UX/UI moderna e responsiva

### ✅ Upsell Estratégico
- Oferta de canais adultos premium
- Aparece dinamicamente baseado no plano
- Tracking de conversão
- Design persuasivo

### ✅ Sistema Anti-Fraude
- Análise comportamental
- Verificação de navegador
- Score de confiabilidade
- Bloqueio automático de bots

### ✅ Selos de Segurança
- SSL Secure
- Reclame Aqui (nota 9.2/10)
- Compra Segura
- PIX Disponível

### ✅ Analytics Completo
- Google Analytics 4
- Facebook Pixel
- Tracking de eventos personalizados
- Funil de conversão completo

## 🛠️ Configuração

### 1. Mercado Pago

1. Acesse o [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Crie uma aplicação
3. Copie sua chave pública
4. Edite o arquivo `config.js`:

```javascript
mercadoPago: {
    publicKey: 'TEST-12345678-abcd-1234-abcd-123456789012', // Sua chave aqui
    sandbox: false, // true para teste, false para produção
    currency: 'BRL'
}
```

### 2. Google Analytics

1. Crie uma propriedade no [Google Analytics](https://analytics.google.com)
2. Copie o Measurement ID (formato: G-XXXXXXXXXX)
3. Atualize o `config.js`:

```javascript
googleAnalytics: {
    measurementId: 'G-XXXXXXXXXX', // Seu ID aqui
    enabled: true
}
```

4. Atualize também no `index.html` (linha 22):

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

### 3. Facebook Pixel

1. Crie um pixel no [Facebook Business](https://business.facebook.com)
2. Copie o Pixel ID
3. Atualize o `config.js`:

```javascript
facebookPixel: {
    pixelId: '1234567890123456', // Seu Pixel ID aqui
    enabled: true
}
```

4. Atualize também no `index.html` (linha 35):

```javascript
fbq('init', '1234567890123456'); // Seu Pixel ID aqui
```

### 4. Configuração PIX

Atualize os dados da sua empresa no `config.js`:

```javascript
pix: {
    desconto: 0.05, // 5% de desconto
    chavePixEmpresa: 'sua-chave@empresa.com',
    nomeEmpresa: 'SUA EMPRESA LTDA',
    cidadeEmpresa: 'SUA CIDADE'
}
```

### 5. WhatsApp

Atualize o número do WhatsApp no `config.js`:

```javascript
whatsapp: {
    number: '5511999999999', // Seu número com código do país
    defaultMessage: 'Olá! Tenho interesse no RJ TV Premium.'
}
```

## 📊 Eventos de Analytics Rastreados

### Eventos Padrão:
- `page_view` - Visualização da página
- `begin_checkout` - Início do checkout
- `proceed_to_payment` - Prosseguir para pagamento
- `purchase` - Compra realizada
- `upsell_shown` - Upsell exibido
- `upsell_accepted` - Upsell aceito
- `payment_method_selected` - Método de pagamento selecionado
- `pix_payment_initiated` - Pagamento PIX iniciado
- `card_payment_initiated` - Pagamento cartão iniciado
- `pix_code_copied` - Código PIX copiado
- `fraud_detected` - Fraude detectada
- `plans_section_viewed` - Seção de planos visualizada
- `testimonials_viewed` - Depoimentos visualizados

## 🔒 Sistema Anti-Fraude

O sistema coleta automaticamente:
- User Agent do navegador
- Timezone do usuário
- Idioma do navegador
- Resolução da tela
- Tempo de sessão
- Número de cliques
- Verificação WebGL
- Detecção de bots

Score mínimo padrão: 60/100 (configurável no `config.js`)

## 💰 Preços dos Planos (Configurável)

```javascript
planos: {
    mensal: { valor: 35.00, nome: 'Plano Mensal' },
    trimestral: { valor: 75.00, nome: 'Plano Trimestral' },
    semestral: { valor: 159.90, nome: 'Plano Semestral' },
    anual: { valor: 249.90, nome: 'Plano Anual VIP' }
}
```

## 🎯 Funil de Conversão

1. **Landing Page** - Apresentação dos planos
2. **Formulário** - Captura de dados
3. **Upsell** - Oferta estratégica
4. **Pagamento** - PIX ou Cartão
5. **Confirmação** - Página de sucesso
6. **WhatsApp** - Entrega do produto

## 📱 Responsividade

- Layout otimizado para mobile
- Checkout adaptativo
- Botões touch-friendly
- Formulários responsivos

## 🔧 Arquivos Principais

- `index.html` - Estrutura principal
- `style.css` - Estilos e responsividade
- `main.js` - Lógica do checkout e pagamentos
- `config.js` - Configurações personalizáveis

## 🚀 Deploy

1. Configure todas as chaves nos arquivos
2. Teste em ambiente de sandbox
3. Mude `sandbox: false` no Mercado Pago
4. Faça upload para seu servidor
5. Configure SSL (obrigatório para pagamentos)

## 📞 Suporte

Para dúvidas sobre implementação, entre em contato através do WhatsApp configurado na página.

---

**Desenvolvido com foco em conversão e performance ⚡**