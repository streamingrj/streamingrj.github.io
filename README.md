# RJ TV Streaming

![RJ TV Streaming](https://img.shields.io/badge/Status-Ativo-brightgreen) ![Version](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-Proprietário-red)

## 📺 Sobre o Projeto

RJ TV Streaming é uma plataforma completa para venda de serviços de streaming premium. O site oferece uma experiência moderna e responsiva para clientes que desejam acessar mais de 500 canais de TV, filmes e séries em qualidade Full HD.

### ✨ Principais Características

- **Design Moderno**: Interface moderna com gradientes e animações suaves
- **Responsivo**: Funciona perfeitamente em todos os dispositivos
- **Sistema de Pagamento**: Integração com InfinitePay para processamento seguro
- **WhatsApp Integration**: Comunicação direta com clientes via WhatsApp
- **Video Carousel**: Depoimentos de clientes em formato de carrossel
- **Modal de Compra**: Sistema completo de seleção e customização de planos

## 🚀 Funcionalidades

### 🎯 Seções Principais
- **Hero Section**: Apresentação impactante com call-to-action
- **Canais**: Showcase das categorias de conteúdo disponível
- **Planos**: 4 opções de assinatura (Mensal, Trimestral, Semestral, Anual)
- **Depoimentos**: Carrossel de vídeos de clientes
- **FAQ**: Perguntas frequentes com sistema expansível
- **Contadores Dinâmicos**: Estatísticas em tempo real

### 💰 Sistema de Planos
- **Mensal**: R$ 35,00/mês
- **Trimestral**: R$ 75,00 (economia de R$ 30)
- **Semestral**: R$ 159,90 (economia de R$ 50)
- **Anual**: R$ 249,90 (economia de R$ 170)

### 🛒 Recursos de Compra
- Seleção de dispositivo principal
- Telas adicionais (R$ 2,00 cada)
- Conteúdo adulto opcional (+R$ 15,00)
- Cálculo automático de totais
- Integração com gateway de pagamento

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica moderna
- **CSS3**: Animações, gradientes e layout responsivo
- **JavaScript ES6**: Funcionalidades interativas
- **Font Awesome**: Iconografia profissional
- **InfinitePay**: Gateway de pagamento
- **WhatsApp API**: Integração para comunicação

## 📁 Estrutura do Projeto

```
rj-tv-streaming/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos principais
├── js/
│   └── main.js         # Scripts e funcionalidades
├── videos/             # Vídeos de depoimentos
│   ├── cliente1.mp4
│   ├── cliente2.mp4
│   ├── thumb1.jpg
│   └── thumb2.jpg
└── README.md           # Documentação
```

## 🎨 Paleta de Cores

```css
--primary: #6a11cb      /* Roxo principal */
--secondary: #2575fc    /* Azul secundário */
--accent: #00bfa5       /* Verde destaque */
--dark: #121212         /* Fundo escuro */
--darker: #0a0a0a       /* Fundo mais escuro */
```

## ⚙️ Configuração e Instalação

### Pré-requisitos
- Servidor web (Apache, Nginx ou similar)
- Navegador moderno com suporte a ES6
- Conexão com internet para CDNs externos

### Instalação
1. Clone ou baixe os arquivos do projeto
2. Configure seu servidor web para servir os arquivos
3. Verifique se todos os caminhos de arquivos estão corretos
4. Configure os links de pagamento no arquivo `main.js`

### Configuração dos Pagamentos
No arquivo `main.js`, atualize o objeto `PAYMENT_LINKS` com seus próprios links:

```javascript
const PAYMENT_LINKS = {
  'Mensal_false': 'seu-link-aqui',
  'Mensal_true': 'seu-link-aqui',
  // ... outros links
};
```

## 📱 Funcionalidades Mobile

- **Menu Hambúrguer**: Navegação otimizada para mobile
- **Touch Gestures**: Suporte a gestos em carrosseis
- **Máscaras de Input**: Formatação automática de telefone
- **Layout Responsivo**: Adaptação automática para diferentes telas

## 🔧 Personalização

### Alterando Cores
Modifique as variáveis CSS no arquivo `style.css`:
```css
:root {
  --primary: sua-cor-aqui;
  --secondary: sua-cor-aqui;
  /* ... */
}
```

### Adicionando Novos Planos
1. Adicione o HTML no arquivo `index.html`
2. Configure os preços no JavaScript
3. Adicione o link de pagamento correspondente

### Modificando Conteúdo
- Textos: Edite diretamente no arquivo `index.html`
- Imagens: Substitua os arquivos na pasta correspondente
- Vídeos: Adicione novos vídeos na pasta `videos/`

## 📊 Analytics e Tracking

### Contadores Dinâmicos
- Visitantes online (atualizado a cada 5 segundos)
- Assinantes ativos (números simulados)
- Conteúdos disponíveis (valor fixo)

### Eventos Trackáveis
- Cliques em planos
- Submissões de formulário
- Aberturas de modal
- Clicks no WhatsApp

## 🔒 Segurança

### Medidas Implementadas
- Validação de formulários no frontend
- Sanitização de inputs de telefone
- Links de pagamento seguros
- Comunicação via HTTPS recomendada

## 🌐 Compatibilidade

### Navegadores Suportados
- Chrome 70+
- Firefox 60+
- Safari 12+
- Edge 79+

### Dispositivos Testados
- Desktop (1920x1080 e superiores)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 📞 Suporte

### Contatos de Suporte
- **WhatsApp**: (21) 97731-7084
- **Email**: streamingtvrj@gmail.com
- **Horário**: 24 horas por dia

### Problemas Conhecidos
- Vídeos podem não carregar em conexões lentas
- Formulário requer JavaScript ativado
- Alguns recursos podem não funcionar no IE

## 🚦 Status do Projeto

- ✅ **Funcional**: Site totalmente operacional
- ✅ **Responsivo**: Adaptado para todos os dispositivos
- ✅ **Integrado**: Pagamentos e WhatsApp funcionando
- 🔄 **Em Desenvolvimento**: Novos recursos sendo adicionados

## 📈 Roadmap Futuro

- [ ] Painel administrativo
- [ ] Sistema de cupons de desconto
- [ ] Chat online integrado
- [ ] App mobile nativo
- [ ] Dashboard de cliente

## 🤝 Contribuição

Este é um projeto proprietário. Para sugestões ou melhorias, entre em contato através dos canais de suporte.

## 📄 Licença

Este projeto é propriedade exclusiva da RJ TV Streaming. Todos os direitos reservados.

---

**Desenvolvido com ❤️ para RJ TV Streaming**

*Última atualização: Janeiro 2025*
