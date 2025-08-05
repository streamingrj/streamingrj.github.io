document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const modal = document.getElementById('modal');
    const btnsAssinar = document.querySelectorAll('.btn-assinar');
    const btnFechar = document.querySelector('.fechar');
    const form = document.getElementById('form-assinatura');
    const selectPlano = document.querySelector('select');

    // Abrir modal ao clicar em ASSINAR
    btnsAssinar.forEach(btn => {
        btn.addEventListener('click', function() {
            const plano = this.getAttribute('data-plano');
            modal.style.display = 'flex';
            
            // Atualiza o select no modal
            selectPlano.value = plano;
        });
    });

    // Fechar modal
    btnFechar.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Fechar ao clicar fora
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validação dos campos
        const nome = this.querySelector('input[name="nome"]').value.trim();
        const email = this.querySelector('input[name="email"]').value.trim();
        const whatsapp = this.querySelector('input[name="whatsapp"]').value.trim();
        const plano = selectPlano.value;
        
        if (!nome || !email || !whatsapp || !plano) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Mensagens personalizadas por plano
        let mensagem = '';
        switch(plano) {
            case 'mensal':
                mensagem = `Obrigado, ${nome}! Seu plano Mensal (R$35) será ativado em breve. Entraremos em contato pelo WhatsApp informado.`;
                break;
            case 'trimestral':
                mensagem = `Obrigado, ${nome}! Seu plano Trimestral (R$75) com +15 dias grátis será ativado em breve. Entraremos em contato pelo WhatsApp informado.`;
                break;
            case 'semestral':
                mensagem = `Obrigado, ${nome}! Seu plano Semestral (R$159,90) será ativado em breve. Entraremos em contato pelo WhatsApp informado.`;
                break;
            case 'anual':
                mensagem = `Obrigado, ${nome}! Seu plano Anual (R$249,90) com +2 meses grátis será ativado em breve. Entraremos em contato pelo WhatsApp informado.`;
                break;
            default:
                mensagem = `Obrigado, ${nome}! Seu plano será ativado em breve. Entraremos em contato pelo WhatsApp informado.`;
        }
        
        alert(mensagem);
        modal.style.display = 'none';
        form.reset();
    });
});