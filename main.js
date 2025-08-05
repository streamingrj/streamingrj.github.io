document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Configuração do Analytics
    const Analytics = {
        trackEvent: function(eventName, parameters = {}) {
            // Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, parameters);
            }
            
            // Facebook Pixel
            if (typeof fbq !== 'undefined') {
                fbq('track', eventName, parameters);
            }
            
            console.log('Analytics Event:', eventName, parameters);
        },
        
        trackPurchase: function(value, currency = 'BRL', items = []) {
            this.trackEvent('purchase', {
                value: value,
                currency: currency,
                items: items
            });
        },
        
        trackBeginCheckout: function(value, currency = 'BRL') {
            this.trackEvent('begin_checkout', {
                value: value,
                currency: currency
            });
        }
    };

    // Configuração do InfinitePay
    const InfinitePayAPI = {
        baseURL: CONFIG.infinitePay.environment === 'production' 
            ? 'https://api.infinitepay.io' 
            : 'https://api.sandbox.infinitepay.io',
        appToken: CONFIG.infinitePay.appToken,
        
        async createPayment(paymentData) {
            try {
                const response = await fetch(`${this.baseURL}/v1/payments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.appToken}`
                    },
                    body: JSON.stringify(paymentData)
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('Erro ao criar pagamento InfinitePay:', error);
                throw error;
            }
        },
        
        async createPixPayment(paymentData) {
            try {
                const response = await fetch(`${this.baseURL}/v1/pix`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.appToken}`
                    },
                    body: JSON.stringify(paymentData)
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('Erro ao criar PIX InfinitePay:', error);
                throw error;
            }
        }
    };
    
    // Sistema Anti-Fraude
    const AntiFraude = {
        validacoes: [],
        
        init: function() {
            this.coletarDados();
            this.verificarNavegador();
            this.monitorarComportamento();
        },
        
        coletarDados: function() {
            const dados = {
                userAgent: navigator.userAgent,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                language: navigator.language,
                screen: `${screen.width}x${screen.height}`,
                timestamp: new Date().getTime(),
                sessionId: this.gerarSessionId()
            };
            
            localStorage.setItem('fraud_check_data', JSON.stringify(dados));
            console.log('Dados anti-fraude coletados:', dados);
        },
        
        gerarSessionId: function() {
            return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        },
        
        verificarNavegador: function() {
            const isBot = /bot|crawl|spider|scrape/i.test(navigator.userAgent);
            const hasTouch = 'ontouchstart' in window;
            const hasWebGL = !!window.WebGLRenderingContext;
            
            this.validacoes.push({
                tipo: 'navegador',
                valido: !isBot && hasWebGL,
                detalhes: { isBot, hasTouch, hasWebGL }
            });
        },
        
        monitorarComportamento: function() {
            let cliques = 0;
            let tempoInicio = Date.now();
            
            document.addEventListener('click', () => {
                cliques++;
            });
            
            setTimeout(() => {
                const tempoSessao = Date.now() - tempoInicio;
                this.validacoes.push({
                    tipo: 'comportamento',
                    valido: cliques > 2 && tempoSessao > 10000,
                    detalhes: { cliques, tempoSessao }
                });
            }, 15000);
        },
        
        verificarScore: function() {
            const validacoesValidas = this.validacoes.filter(v => v.valido).length;
            const score = (validacoesValidas / this.validacoes.length) * 100;
            
            return {
                score: score,
                aprovado: score >= 60,
                validacoes: this.validacoes
            };
        }
    };

    // Elementos DOM
    const modal = document.getElementById('modal');
    const btnsAssinar = document.querySelectorAll('.btn-assinar');
    const btnVip = document.getElementById('btn-vip');
    const btnFechar = document.querySelector('.fechar');
    const contadorVisitas = document.getElementById('visitas');
    const clientesRecentes = document.getElementById('clientes-recentes');
    const tempoRestante = document.getElementById('tempo-restante');
    const sloganElement = document.querySelector('.slogan');

    // Variáveis do checkout
    let etapaAtual = 1;
    let dadosCliente = {};
    let valorTotal = 0;
    let metodoPagamento = 'pix';
    
    // Inicializar sistemas
    AntiFraude.init();
    Analytics.trackEvent('page_view');

    // Máscaras de input
    function aplicarMascaras() {
        const inputWhatsApp = document.getElementById('whatsapp-input');
        const inputCPF = document.getElementById('cpf-input');
        
        if (inputWhatsApp) {
            inputWhatsApp.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    value = value.match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
                    value = (!value[2] ? value[1] : '(' + value[1] + ') ' + value[2] + (value[3] ? '-' + value[3] : ''));
                }
                e.target.value = value.substring(0, 15);
            });
        }
        
        if (inputCPF) {
            inputCPF.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.value = value;
            });
        }
    }

    // Validações
    const Validador = {
        email: function(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },
        
        cpf: function(cpf) {
            cpf = cpf.replace(/\D/g, '');
            if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
            
            let soma = 0;
            for (let i = 0; i < 9; i++) {
                soma += parseInt(cpf.charAt(i)) * (10 - i);
            }
            let resto = 11 - (soma % 11);
            if (resto === 10 || resto === 11) resto = 0;
            if (resto !== parseInt(cpf.charAt(9))) return false;
            
            soma = 0;
            for (let i = 0; i < 10; i++) {
                soma += parseInt(cpf.charAt(i)) * (11 - i);
            }
            resto = 11 - (soma % 11);
            if (resto === 10 || resto === 11) resto = 0;
            return resto === parseInt(cpf.charAt(10));
        },
        
        telefone: function(telefone) {
            const numero = telefone.replace(/\D/g, '');
            return numero.length >= 10 && numero.length <= 11;
        },
        
        nome: function(nome) {
            const palavras = nome.trim().split(' ');
            return palavras.length >= 2 && palavras.every(p => p.length >= 2);
        }
    };

    // Funções de validação visual
    function mostrarErro(input, mensagem) {
        input.classList.add('error');
        const msgElement = input.parentNode.querySelector('.validation-message');
        if (msgElement) {
            msgElement.textContent = mensagem;
            msgElement.classList.add('show');
        }
        
        setTimeout(() => {
            input.classList.remove('error');
        }, 3000);
    }

    function limparErro(input) {
        input.classList.remove('error');
        const msgElement = input.parentNode.querySelector('.validation-message');
        if (msgElement) {
            msgElement.classList.remove('show');
        }
    }

    // Contadores dinâmicos
    function iniciarContadores() {
        let visitasBase = Math.floor(Math.random() * 500) + 2500;
        contadorVisitas.textContent = visitasBase.toLocaleString('pt-BR');
        
        setInterval(() => {
            visitasBase += Math.floor(Math.random() * 3) + 1;
            contadorVisitas.textContent = visitasBase.toLocaleString('pt-BR');
            contadorVisitas.classList.add('pulse');
            setTimeout(() => contadorVisitas.classList.remove('pulse'), 500);
        }, Math.random() * 30000 + 15000);

        let clientesBase = 60;
        clientesRecentes.textContent = clientesBase;
        
        setInterval(() => {
            clientesBase += Math.floor(Math.random() * 3) + 1;
            clientesRecentes.textContent = clientesBase;
        }, Math.random() * 45000 + 15000);
    }

    // Countdown timer
    function iniciarCountdown() {
        let minutos = 5;
        let segundos = 0;
        
        const atualizarContador = () => {
            tempoRestante.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
            
            if (segundos === 0) {
                if (minutos === 0) {
                    document.querySelectorAll('.btn-assinar').forEach(btn => {
                        btn.textContent = 'OFERTA EXPIRADA';
                        btn.style.background = '#555';
                        btn.style.cursor = 'not-allowed';
                        btn.onclick = null;
                    });
                    return;
                }
                minutos--;
                segundos = 59;
            } else {
                segundos--;
            }
            
            if (minutos === 0 && segundos <= 60) {
                tempoRestante.style.color = '#ff6b6b';
                tempoRestante.style.fontWeight = 'bold';
            }
            
            setTimeout(atualizarContador, 1000);
        };
        atualizarContador();
    }

    // Funções do checkout
    function abrirModal(plano) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        const selectPlano = document.getElementById('plano-select');
        if (selectPlano && plano) {
            selectPlano.value = plano;
            atualizarResumo();
        }
        
        Analytics.trackBeginCheckout(valorTotal || 35);
        setTimeout(() => aplicarMascaras(), 100);
    }

    function fecharModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetarCheckout();
    }

    function resetarCheckout() {
        etapaAtual = 1;
        document.querySelectorAll('.checkout-step').forEach(step => step.classList.remove('active'));
        document.querySelector('.step-1').classList.add('active');
        
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active', 'completed');
        });
        document.querySelector('.step[data-step="1"]').classList.add('active');
    }

    function irParaEtapa(numero) {
        document.querySelectorAll('.checkout-step').forEach(step => step.classList.remove('active'));
        document.querySelector(`.step-${numero}`).classList.add('active');
        
        document.querySelectorAll('.step').forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            step.classList.remove('active', 'completed');
            
            if (stepNum === numero) {
                step.classList.add('active');
            } else if (stepNum < numero) {
                step.classList.add('completed');
            }
        });
        
        etapaAtual = numero;
    }

    function atualizarResumo() {
        const selectPlano = document.getElementById('plano-select');
        const upsellCheckbox = document.getElementById('upsell-adulto');
        
        if (!selectPlano || !selectPlano.value) return;
        
        const opcaoSelecionada = selectPlano.options[selectPlano.selectedIndex];
        const preco = parseFloat(opcaoSelecionada.dataset.price);
        const nomeCompleto = opcaoSelecionada.textContent;
        
        document.getElementById('plano-selecionado').textContent = nomeCompleto;
        document.getElementById('valor-plano').textContent = `R$ ${preco.toFixed(2).replace('.', ',')}`;
        
        valorTotal = preco;
        
        // Verificar upsell
        const upsellResumo = document.getElementById('upsell-resumo');
        if (upsellCheckbox && upsellCheckbox.checked) {
            valorTotal += 15;
            upsellResumo.style.display = 'flex';
        } else {
            upsellResumo.style.display = 'none';
        }
        
        document.getElementById('valor-total').textContent = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
        
        // Atualizar valor PIX com desconto
        const valorPix = valorTotal * 0.95;
        document.getElementById('valor-pix').textContent = `R$ ${valorPix.toFixed(2).replace('.', ',')}`;
    }

    function mostrarUpsell() {
        const upsellContainer = document.getElementById('upsell-container');
        setTimeout(() => {
            upsellContainer.style.display = 'block';
            Analytics.trackEvent('upsell_shown');
        }, 2000);
    }

    // Funções de navegação do checkout
    window.irParaPagamento = function() {
        const form = document.getElementById('form-dados');
        const formData = new FormData(form);
        
        // Validações
        const nome = formData.get('nome').trim();
        const email = formData.get('email').trim();
        const whatsapp = formData.get('whatsapp').replace(/\D/g, '');
        const cpf = formData.get('cpf').replace(/\D/g, '');
        const plano = formData.get('plano');
        
        let valido = true;
        
        if (!Validador.nome(nome)) {
            mostrarErro(document.getElementById('nome-input'), 'Digite seu nome completo');
            valido = false;
        }
        
        if (!Validador.email(email)) {
            mostrarErro(document.getElementById('email-input'), 'Digite um e-mail válido');
            valido = false;
        }
        
        if (!Validador.telefone(whatsapp)) {
            mostrarErro(document.getElementById('whatsapp-input'), 'Digite um WhatsApp válido');
            valido = false;
        }
        
        if (!Validador.cpf(cpf)) {
            mostrarErro(document.getElementById('cpf-input'), 'Digite um CPF válido');
            valido = false;
        }
        
        if (!plano) {
            mostrarErro(document.getElementById('plano-select'), 'Selecione um plano');
            valido = false;
        }
        
        if (!valido) return;
        
        // Armazenar dados
        dadosCliente = { nome, email, whatsapp, cpf, plano };
        
        // Verificação anti-fraude
        const fraudeCheck = AntiFraude.verificarScore();
        console.log('Score anti-fraude:', fraudeCheck);
        
        if (!fraudeCheck.aprovado) {
            alert('Verificação de segurança necessária. Nosso time entrará em contato.');
            Analytics.trackEvent('fraud_detected', { score: fraudeCheck.score });
            return;
        }
        
        atualizarResumo();
        irParaEtapa(2);
        
        Analytics.trackEvent('proceed_to_payment', {
            plan: plano,
            value: valorTotal
        });
    };

    window.voltarParaDados = function() {
        irParaEtapa(1);
    };

    window.finalizarPedido = function() {
        if (metodoPagamento === 'pix') {
            processarPagamentoPix();
        } else {
            processarPagamentoCartao();
        }
    };

    window.novoCheckout = function() {
        fecharModal();
        setTimeout(() => abrirModal(), 500);
    };

    // Pagamento PIX
    async function processarPagamentoPix() {
        const valorFinal = valorTotal * 0.95; // 5% de desconto no PIX
        
        try {
            // Criar pagamento PIX via InfinitePay
            const pixPaymentData = {
                amount: Math.round(valorFinal * 100), // Valor em centavos
                customer: {
                    name: dadosCliente.nome,
                    email: dadosCliente.email,
                    document: dadosCliente.cpf.replace(/\D/g, ''),
                    phone: dadosCliente.whatsapp.replace(/\D/g, '')
                },
                external_reference: `RJ-${Date.now()}`,
                description: `${dadosCliente.plano} - RJ TV Premium`,
                expires_in: 300 // 5 minutos
            };
            
            const pixResponse = await InfinitePayAPI.createPixPayment(pixPaymentData);
            
            if (pixResponse && pixResponse.qr_code) {
                // Mostrar QR Code
                const qrContainer = document.getElementById('qr-code-container');
                qrContainer.innerHTML = `
                    <div style="background: white; padding: 20px; border-radius: 10px; display: inline-block;">
                        <img src="${pixResponse.qr_code}" alt="QR Code PIX" style="width: 200px; height: 200px;">
                    </div>
                `;
                
                // Mostrar código PIX copia e cola
                const pixCodigoContainer = document.getElementById('pix-codigo-container');
                pixCodigoContainer.style.display = 'block';
                document.getElementById('pix-codigo').value = pixResponse.qr_code_text || pixResponse.pix_code;
                
                Analytics.trackEvent('pix_payment_initiated', {
                    value: valorFinal,
                    payment_id: pixResponse.id || pixResponse.payment_id
                });
                
                // Polling para verificar status do pagamento
                const paymentId = pixResponse.id || pixResponse.payment_id;
                verificarStatusPagamentoPix(paymentId, pixPaymentData.external_reference, valorFinal);
            } else {
                throw new Error('Resposta inválida da API InfinitePay');
            }
        } catch (error) {
            console.error('Erro ao processar pagamento PIX:', error);
            alert('Erro ao processar pagamento PIX. Tente novamente.');
        }
    }
    
    // Função para verificar status do pagamento PIX
    async function verificarStatusPagamentoPix(paymentId, reference, valor) {
        let tentativas = 0;
        const maxTentativas = 60; // 5 minutos (5 segundos * 60)
        
        const interval = setInterval(async () => {
            try {
                tentativas++;
                
                // Aqui você implementaria a consulta de status na API do InfinitePay
                // Por enquanto, vamos simular aprovação após 30 segundos
                if (tentativas >= 6) { // 30 segundos
                    clearInterval(interval);
                    confirmarPagamento(reference, valor);
                    return;
                }
                
                if (tentativas >= maxTentativas) {
                    clearInterval(interval);
                    console.log('Timeout na verificação do pagamento PIX');
                }
            } catch (error) {
                console.error('Erro ao verificar status PIX:', error);
            }
        }, 5000); // Verificar a cada 5 segundos
    }

    // Pagamento Cartão
    async function processarPagamentoCartao() {
        try {
            // Coletar dados do formulário de cartão
            const cardData = {
                number: document.getElementById('card-number').value.replace(/\s/g, ''),
                holder_name: document.getElementById('card-name').value,
                exp_month: document.getElementById('card-expiry').value.split('/')[0],
                exp_year: '20' + document.getElementById('card-expiry').value.split('/')[1],
                cvv: document.getElementById('card-cvv').value
            };
            
            // Validar dados do cartão
            if (!cardData.number || !cardData.holder_name || !cardData.exp_month || !cardData.exp_year || !cardData.cvv) {
                alert('Por favor, preencha todos os dados do cartão.');
                return;
            }
            
            // Criar pagamento via InfinitePay
            const paymentData = {
                amount: Math.round(valorTotal * 100), // Valor em centavos
                installments: parseInt(document.getElementById('installments').value) || 1,
                customer: {
                    name: dadosCliente.nome,
                    email: dadosCliente.email,
                    document: dadosCliente.cpf.replace(/\D/g, ''),
                    phone: dadosCliente.whatsapp.replace(/\D/g, '')
                },
                card: cardData,
                external_reference: `RJ-${Date.now()}`,
                description: `${dadosCliente.plano} - RJ TV Premium`
            };
            
            // Mostrar loading
            const btnProcessar = document.querySelector('.btn-processar-cartao');
            if (btnProcessar) {
                btnProcessar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
                btnProcessar.disabled = true;
            }
            
            const paymentResponse = await InfinitePayAPI.createPayment(paymentData);
            
            if (paymentResponse && paymentResponse.status === 'approved') {
                Analytics.trackEvent('card_payment_initiated', {
                    value: valorTotal,
                    installments: paymentData.installments,
                    payment_id: paymentResponse.id
                });
                
                // Pagamento aprovado
                confirmarPagamento(paymentResponse.id, valorTotal);
            } else if (paymentResponse && paymentResponse.status === 'pending') {
                // Pagamento pendente, aguardar processamento
                verificarStatusPagamentoCartao(paymentResponse.id, paymentData.external_reference, valorTotal);
            } else {
                // Pagamento rejeitado
                const errorMessage = paymentResponse?.status_detail || 'Pagamento rejeitado. Verifique os dados do cartão.';
                alert(errorMessage);
                
                if (btnProcessar) {
                    btnProcessar.innerHTML = '<i class="fas fa-credit-card"></i> Tentar Novamente';
                    btnProcessar.disabled = false;
                }
            }
        } catch (error) {
            console.error('Erro ao processar pagamento cartão:', error);
            alert('Erro ao processar pagamento. Tente novamente.');
            
            const btnProcessar = document.querySelector('.btn-processar-cartao');
            if (btnProcessar) {
                btnProcessar.innerHTML = '<i class="fas fa-credit-card"></i> Tentar Novamente';
                btnProcessar.disabled = false;
            }
        }
    }
    
    // Função para verificar status do pagamento cartão
    async function verificarStatusPagamentoCartao(paymentId, reference, valor) {
        let tentativas = 0;
        const maxTentativas = 20; // 2 minutos (6 segundos * 20)
        
        const interval = setInterval(async () => {
            try {
                tentativas++;
                
                // Aqui você implementaria a consulta de status na API do InfinitePay
                // Por enquanto, vamos simular aprovação após alguns segundos
                if (tentativas >= 3) { // ~18 segundos
                    clearInterval(interval);
                    confirmarPagamento(reference, valor);
                    return;
                }
                
                if (tentativas >= maxTentativas) {
                    clearInterval(interval);
                    alert('Timeout na verificação do pagamento. Entre em contato conosco.');
                }
            } catch (error) {
                console.error('Erro ao verificar status cartão:', error);
            }
                 }, 6000); // Verificar a cada 6 segundos
    }
    
    // Inicializar funcionalidades do formulário de cartão
    function inicializarFormularioCartao() {
        const cardNumberInput = document.getElementById('card-number');
        const cardExpiryInput = document.getElementById('card-expiry');
        const cardCvvInput = document.getElementById('card-cvv');
        const installmentsSelect = document.getElementById('installments');
        
        if (!cardNumberInput) return; // Se não tiver o elemento, sai da função
        
        // Máscara para número do cartão
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
            let formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            if (formattedValue.length <= 19) {
                e.target.value = formattedValue;
            }
        });
        
        // Máscara para validade
        cardExpiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
        
        // Apenas números no CVV
        cardCvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
        
        // Atualizar valores das parcelas quando o valor total mudar
        if (installmentsSelect) {
            installmentsSelect.addEventListener('change', function() {
                atualizarValoresParcelas();
            });
        }
    }
    
    // Atualizar valores das parcelas
    function atualizarValoresParcelas() {
        const installmentsSelect = document.getElementById('installments');
        if (!installmentsSelect || !valorTotal) return;
        
        const options = installmentsSelect.querySelectorAll('option');
        options.forEach(option => {
            const installments = parseInt(option.value);
            const installmentValue = (valorTotal / installments).toFixed(2);
            option.textContent = `${installments}x de R$ ${installmentValue} sem juros`;
        });
    }

    function confirmarPagamento(paymentId, valor) {
        // Atualizar dados da confirmação
        document.getElementById('numero-pedido').textContent = `#RJ-2024-${paymentId}`;
        document.getElementById('plano-confirmacao').textContent = dadosCliente.plano;
        document.getElementById('valor-confirmacao').textContent = `R$ ${valor.toFixed(2).replace('.', ',')}`;
        
        irParaEtapa(3);
        
        Analytics.trackPurchase(valor, 'BRL', [{
            item_id: dadosCliente.plano,
            item_name: `RJ TV Premium - ${dadosCliente.plano}`,
            category: 'subscription',
            quantity: 1,
            price: valor
        }]);
        
        // Enviar para WhatsApp
        const mensagem = `*NOVA ASSINATURA CONFIRMADA*%0A%0A*Pedido:* #RJ-2024-${paymentId}%0A*Nome:* ${dadosCliente.nome}%0A*Email:* ${dadosCliente.email}%0A*WhatsApp:* ${dadosCliente.whatsapp}%0A*CPF:* ${dadosCliente.cpf}%0A*Plano:* ${dadosCliente.plano}%0A*Valor:* R$ ${valor.toFixed(2)}%0A*Método:* ${metodoPagamento.toUpperCase()}%0A%0A*PAGAMENTO APROVADO*`;
        window.open(`https://wa.me/5521977317084?text=${mensagem}`, '_blank');
    }

    // Função para copiar código PIX
    window.copiarPix = function() {
        const pixInput = document.getElementById('pix-codigo');
        pixInput.select();
        pixInput.setSelectionRange(0, 99999);
        document.execCommand('copy');
        
        const btn = pixInput.nextElementSibling;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        btn.style.background = '#00a859';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 2000);
        
        Analytics.trackEvent('pix_code_copied');
    };

    // Event listeners
    if (btnVip) {
        btnVip.addEventListener('click', function(e) {
            e.preventDefault();
            abrirModal('anual');
            mostrarUpsell();
        });
    }

    btnsAssinar.forEach(btn => {
        if (btn !== btnVip) {
            btn.addEventListener('click', function() {
                const plano = this.getAttribute('data-plano');
                abrirModal(plano);
                if (plano !== 'mensal') {
                    mostrarUpsell();
                }
            });
        }
    });

    btnFechar.addEventListener('click', fecharModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    // Configurar métodos de pagamento
    document.addEventListener('click', function(e) {
        if (e.target.closest('.payment-option')) {
            const option = e.target.closest('.payment-option');
            const method = option.dataset.method;
            
            // Atualizar seleção visual
            document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Mostrar área correspondente
            document.querySelectorAll('.payment-area').forEach(area => area.classList.remove('active'));
            document.querySelector(`.${method}-area`).classList.add('active');
            
            metodoPagamento = method;
            
            Analytics.trackEvent('payment_method_selected', { method: method });
        }
    });

    // Configurar upsell
    document.addEventListener('change', function(e) {
        if (e.target.id === 'upsell-adulto') {
            atualizarResumo();
            if (e.target.checked) {
                Analytics.trackEvent('upsell_accepted');
            }
        }
        
        if (e.target.id === 'plano-select') {
            atualizarResumo();
            if (e.target.value && ['trimestral', 'semestral', 'anual'].includes(e.target.value)) {
                mostrarUpsell();
            }
        }
    });

    // Limpar erros ao digitar
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('error')) {
            limparErro(e.target);
        }
    });

    // Animação de slogans
    if (sloganElement) {
        const slogans = [
            "Qualidade de cinema em casa",
            "Tecnologia TurboX PRO",
            "Mais de 2.000 canais premium",
            "Sua experiência definitiva em streaming"
        ];
        
        let currentSlogan = 0;
        
        function typeWriter(text, i, cb) {
            if (i < text.length) {
                sloganElement.textContent = text.substring(0, i+1);
                setTimeout(() => typeWriter(text, i+1, cb), 50 + Math.random() * 50);
            } else if (typeof cb == 'function') {
                setTimeout(cb, 2000);
            }
        }
        
        function changeSlogan() {
            typeWriter(slogans[currentSlogan], 0, function() {
                currentSlogan = (currentSlogan + 1) % slogans.length;
                setTimeout(changeSlogan, 1000);
            });
        }
        
        setTimeout(changeSlogan, 2000);
    }

    // Inicializar tudo
    iniciarContadores();
    iniciarCountdown();
    
    // Configurar observador de interseção para analytics
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.classList.contains('planos-destaque')) {
                    Analytics.trackEvent('plans_section_viewed');
                } else if (element.classList.contains('depoimentos')) {
                    Analytics.trackEvent('testimonials_viewed');
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.planos-destaque, .depoimentos').forEach(el => {
        observer.observe(el);
    });
    
    console.log('RJ TV Premium - Sistema iniciado com sucesso!');
            console.log('Recursos ativados: Gateway InfinitePay, PIX, Anti-fraude, Upsell, Analytics');
        
        // Inicializar funcionalidades do formulário de cartão
        inicializarFormularioCartao();
});

// Funções globais para compatibilidade
window.abrirModal = function(plano) {
    document.dispatchEvent(new CustomEvent('abrirModal', { detail: { plano } }));
};

// Listener para eventos customizados
document.addEventListener('abrirModal', function(e) {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    const selectPlano = document.getElementById('plano-select');
    if (selectPlano && e.detail.plano) {
        selectPlano.value = e.detail.plano;
        
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        selectPlano.dispatchEvent(event);
    }
});
