document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const modal = document.getElementById('modal');
    const btnsAssinar = document.querySelectorAll('.btn-assinar');
    const btnVip = document.getElementById('btn-vip');
    const btnFechar = document.querySelector('.fechar');
    const form = document.getElementById('form-assinatura');
    const selectPlano = document.querySelector('select[name="plano"]');
    const inputWhatsApp = document.querySelector('input[name="whatsapp"]');
    const contadorVisitas = document.getElementById('visitas');
    const clientesRecentes = document.getElementById('clientes-recentes');
    const tempoRestante = document.getElementById('tempo-restante');
    const sloganElement = document.querySelector('.slogan');

    // Máscara de WhatsApp melhorada
    inputWhatsApp.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            value = value.match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            value = (!value[2] ? value[1] : '(' + value[1] + ') ' + value[2] + (value[3] ? '-' + value[3] : ''));
        }
        e.target.value = value.substring(0, 15);
    });

    // Contadores (simulação mais realista)
    function formatarNumero(num) {
        return num.toLocaleString('pt-BR');
    }

    // Visitas (número aleatório entre 2500-3000)
    let visitasBase = Math.floor(Math.random() * 500) + 2500;
    contadorVisitas.textContent = formatarNumero(visitasBase);
    
    // Atualiza visitas a cada 15-45 segundos (simulação)
    setInterval(() => {
        visitasBase += Math.floor(Math.random() * 3) + 1;
        contadorVisitas.textContent = formatarNumero(visitasBase);
        
        // Efeito sutil de atualização
        contadorVisitas.classList.add('pulse');
        setTimeout(() => {
            contadorVisitas.classList.remove('pulse');
        }, 500);
    }, Math.random() * 30000 + 15000);

    // Clientes recentes (simulação mais dinâmica)
    let clientesBase = 60; // Começa com 60 como na imagem
    clientesRecentes.textContent = clientesBase;
    
    setInterval(() => {
        // Incremento mais variável (1-3 por intervalo)
        clientesBase += Math.floor(Math.random() * 3) + 1;
        clientesRecentes.textContent = clientesBase;
        
        // Efeito de destaque quando atualiza
        clientesRecentes.classList.add('highlight');
        setTimeout(() => {
            clientesRecentes.classList.remove('highlight');
        }, 300);
    }, Math.random() * 45000 + 15000);

    // Contador regressivo melhorado (5 minutos)
    let minutos = 5;
    let segundos = 0;
    
    const atualizarContador = () => {
        tempoRestante.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        
        if (segundos === 0) {
            if (minutos === 0) {
                // Oferta expirada - estilo atualizado
                document.querySelectorAll('.btn-assinar').forEach(btn => {
                    btn.textContent = 'OFERTA EXPIRADA';
                    btn.style.background = '#555';
                    btn.style.color = '#999';
                    btn.style.cursor = 'not-allowed';
                    btn.style.border = '1px solid #777';
                    btn.onclick = null;
                });
                
                // Atualiza a barra de oferta
                const destaqueBar = document.querySelector('.destaque-bar');
                if (destaqueBar) {
                    destaqueBar.textContent = 'OFERTA ENCERRADA';
                    destaqueBar.style.background = '#333';
                }
                
                return;
            }
            minutos--;
            segundos = 59;
        } else {
            segundos--;
        }
        
        // Alerta nos últimos 60 segundos
        if (minutos === 0 && segundos <= 60) {
            tempoRestante.style.color = '#ff6b6b';
            tempoRestante.style.fontWeight = 'bold';
            
            // Pisca a cada segundo nos últimos 10 segundos
            if (segundos <= 10) {
                tempoRestante.style.animation = segundos % 2 === 0 ? 'none' : 'pulse 0.5s';
            }
        }
        
        setTimeout(atualizarContador, 1000);
    };
    atualizarContador();

    // Controle de vídeos melhorado
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.preload = 'metadata';
        video.playsInline = true;
        
        video.addEventListener('play', function() {
            // Pausa outros vídeos quando um começa
            videos.forEach(v => {
                if (v !== video && !v.paused) v.pause();
            });
            
            // Atualiza contador de visualizações
            const visitasAtual = parseInt(contadorVisitas.textContent.replace(/\D/g, ''));
            contadorVisitas.textContent = formatarNumero(visitasAtual + 1);
        });
    });

    // Função para abrir o modal
    function abrirModal(plano) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        if (selectPlano) {
            selectPlano.value = plano;
        }
        
        // Scroll suave para o modal
        setTimeout(() => {
            modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }

    // Configuração do botão VIP
    if (btnVip) {
        btnVip.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Efeito visual especial
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
            
            // Abre o modal com o plano anual selecionado
            abrirModal('anual');
        });
    }

    // Configuração dos outros botões de assinar
    btnsAssinar.forEach(btn => {
        if (btn !== btnVip) {
            btn.addEventListener('click', function() {
                if (!this.classList.contains('disabled')) {
                    const plano = this.getAttribute('data-plano');
                    abrirModal(plano);
                }
            });
        }
    });

    // Fechar modal
    btnFechar.addEventListener('click', fecharModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    function fecharModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Formulário com validação melhorada
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = this.querySelector('input[name="nome"]').value.trim();
        const email = this.querySelector('input[name="email"]').value.trim();
        const whatsapp = this.querySelector('input[name="whatsapp"]').value.replace(/\D/g, '');
        const plano = selectPlano ? selectPlano.value : '';
        
        // Validação aprimorada
        if (!nome || nome.split(' ').length < 2) {
            alert('Por favor, digite seu nome completo.');
            return;
        }
        
        if (!email || !email.includes('@') || !email.includes('.')) {
            alert('Por favor, digite um e-mail válido.');
            return;
        }
        
        if (whatsapp.length < 11) {
            alert('WhatsApp deve conter DDD + número com 9 dígitos.');
            return;
        }
        
        if (!plano) {
            alert('Por favor, selecione um plano.');
            return;
        }

        // Mensagem para WhatsApp formatada
        const planoText = {
            'mensal': 'Mensal - R$35',
            'trimestral': 'Trimestral (+15 dias) - R$75',
            'semestral': 'Semestral - R$159,90',
            'anual': 'Anual VIP (+2 meses) - R$249,90'
        }[plano];

        const mensagem = `*NOVA ASSINATURA RJ TV PREMIUM*%0A%0A*Nome:* ${nome}%0A*Email:* ${email}%0A*WhatsApp:* ${whatsapp}%0A*Plano:* ${planoText}%0A%0A*Tecnologia TurboX PRO Ativada*`;
        window.open(`https://wa.me/5521977317084?text=${mensagem}`, '_blank');
        
        // Feedback visual
        const btnSubmit = this.querySelector('button[type="submit"]');
        if (btnSubmit) {
            const originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<i class="fas fa-check"></i> CADASTRO CONCLUÍDO!';
            btnSubmit.style.background = '#00a859';
            
            setTimeout(() => {
                btnSubmit.innerHTML = originalText;
                btnSubmit.style.background = '';
                fecharModal();
                form.reset();
            }, 3000);
        } else {
            fecharModal();
            form.reset();
        }
    });

    // Efeitos visuais suaves
    const elementosDestaque = document.querySelectorAll('.fa-bolt, .fa-medal, .fa-crown, .fa-gem, .selo-premium');
    elementosDestaque.forEach(el => {
        setInterval(() => {
            el.style.transform = el.style.transform === 'scale(1.05)' ? 'scale(1)' : 'scale(1.05)';
            el.style.transition = 'transform 0.3s ease';
        }, Math.random() * 3000 + 2000);
    });

    // Animação de slogans (se existir o elemento)
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
        
        // Inicia a animação após 2 segundos
        setTimeout(changeSlogan, 2000);
    }
});
