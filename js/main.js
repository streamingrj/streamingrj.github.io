const PAYMENT_LINKS = {
  'Mensal_false': 'https://invoice.infinitepay.io/plans/rjtv_streaming/ffqmT1haP',
  'Mensal_true': 'https://invoice.infinitepay.io/plans/rjtv_streaming/211e8ae50p',
  'Trimestral_false': 'https://invoice.infinitepay.io/plans/rjtv_streaming/ksqiMKaBH',
  'Trimestral_true': 'https://invoice.infinitepay.io/plans/rjtv_streaming/VFudGM6Tb',
  'Semestral_false': 'https://invoice.infinitepay.io/plans/rjtv_streaming/634s4LkRYB',
  'Semestral_true': 'https://invoice.infinitepay.io/plans/rjtv_streaming/634zeY0p6B',
  'Anual_false': 'https://invoice.infinitepay.io/plans/rjtv_streaming/CVA6Gru1n',
  'Anual_true': 'https://invoice.infinitepay.io/plans/rjtv_streaming/1VlkshE9nr'
};


let selectedPlan = '';

// Menu Mobile
document.querySelector('.menu-toggle').addEventListener('click', function() {
  document.querySelector('.nav-links').classList.toggle('active');
});

// Máscara de Telefone
const phoneInput = document.getElementById('clientPhone');
phoneInput.addEventListener('input', function() {
  let value = phoneInput.value.replace(/\D/g, '');
  
  if (value.length > 11) {
    value = value.slice(0, 11);
  }
  
  if (value.length > 2) {
    value = `(${value.slice(0,2)}) ${value.slice(2)}`;
  }
  
  if (value.length > 10) {
    value = `${value.slice(0,10)}-${value.slice(10)}`;
  }
  
  phoneInput.value = value;
});

// Modal Functions
function openModal(plan) {
  selectedPlan = plan;
  document.getElementById('planSummary').innerText = `Plano: ${plan}`;
  document.getElementById('purchaseModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
  calculateTotal(); // Inicializar o cálculo
}

function closeModal() {
  document.getElementById('purchaseModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Função para calcular o total
function calculateTotal() {
  const planPrices = {
    'Mensal': 35.00,
    'Trimestral': 75.00,
    'Semestral': 159.90,
    'Anual': 249.90
  };
  
  const additionalScreens = parseInt(document.getElementById('additionalScreens').value);
  const additionalPrice = additionalScreens * 2;
  const basePrice = planPrices[selectedPlan];
  const upsell = document.getElementById('upsellAdult').checked;
  const upsellPrice = upsell ? 15.00 : 0;
  const total = basePrice + additionalPrice + upsellPrice;
  
  document.getElementById('screensSummary').innerText = `Telas Adicionais: ${additionalScreens} (R$${additionalPrice.toFixed(2)})`;
  document.getElementById('adultSummary').innerText = upsell ? `Conteúdo Adulto: Sim (R$15,00)` : `Conteúdo Adulto: Não`;
  document.getElementById('totalSummary').innerText = `Total: R$${total.toFixed(2)}`;
}

// Form Submission - CORREÇÃO IMPLEMENTADA
document.getElementById('purchaseForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('clientName').value;
  const phone = document.getElementById('clientPhone').value;
  const device = document.getElementById('clientDevice').value;
  const additionalScreens = parseInt(document.getElementById('additionalScreens').value);
  const upsell = document.getElementById('upsellAdult').checked;
  
  // Simple Validation
  if (!name || !phone || !device) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }
  
  if (phone.replace(/\D/g, '').length < 11) {
    alert('Por favor, insira um número de WhatsApp válido.');
    return;
  }
  
  localStorage.setItem('orderData', JSON.stringify({ 
    name, 
    phone, 
    device, 
    plan: selectedPlan, 
    additionalScreens,
    upsell: upsell 
  }));
  
  const key = `${selectedPlan}_${upsell}`;
  const paymentWindow = window.open(PAYMENT_LINKS[key], '_blank');
  
  // Fechar modal
  closeModal();
  
  // Exibir a barra "Já paguei" após 1 segundo
  setTimeout(() => {
    document.getElementById('paidBar').classList.add('show');
  }, 1000);
  
  // Focar na nova janela
  if (paymentWindow) {
    paymentWindow.focus();
  }
});

// WhatsApp Integration
function sendWhatsApp() {
  const order = JSON.parse(localStorage.getItem('orderData'));
  if (!order) {
    alert('Nenhum pedido encontrado. Por favor, complete a compra primeiro.');
    return;
  }
  
  const message = `Olá! Já paguei.\n\n` +
                 `*Plano:* ${order.plan}\n` +
                 `*Telas Adicionais:* ${order.additionalScreens}\n` +
                 `*Conteúdo Adulto:* ${order.upsell ? 'Sim' : 'Não'}\n` +
                 `*Nome:* ${order.name}\n` +
                 `*WhatsApp:* ${order.phone}\n` +
                 `*Aparelho Principal:* ${order.device}\n\n` +
                 `Por favor, ative meu acesso.`;
  
  window.open(`https://wa.me/5521977317084?text=${encodeURIComponent(message)}`, '_blank');
}

// Video Carousel
let currentVideoIndex = 0;
const videoItems = document.querySelectorAll('.video-item');
const totalVideos = videoItems.length;

function showVideo(index) {
  // Pausar todos os vídeos antes de mudar
  document.querySelectorAll('.video-item video').forEach(video => {
    video.pause();
  });
  
  // Remover classe ativa de todos os itens
  videoItems.forEach(item => {
    item.classList.remove('active');
  });
  
  // Adicionar classe ativa ao item atual
  videoItems[index].classList.add('active');
  currentVideoIndex = index;
}

function nextVideo() {
  let nextIndex = currentVideoIndex + 1;
  if (nextIndex >= totalVideos) nextIndex = 0;
  showVideo(nextIndex);
}

function prevVideo() {
  let prevIndex = currentVideoIndex - 1;
  if (prevIndex < 0) prevIndex = totalVideos - 1;
  showVideo(prevIndex);
}

// Event listeners para os controles
document.querySelector('.carousel-prev').addEventListener('click', prevVideo);
document.querySelector('.carousel-next').addEventListener('click', nextVideo);

// Inicializar o primeiro vídeo
showVideo(0);

// Contadores fake
function updateCounters() {
  document.getElementById('visitors').innerText = Math.floor(Math.random() * 100) + 150;
  document.getElementById('subscribers').innerText = Math.floor(Math.random() * 1000) + 2500;
}
setInterval(updateCounters, 5000);
updateCounters();

// Close modal when clicking outside
window.addEventListener('click', function(e) {
  const modal = document.getElementById('purchaseModal');
  if (e.target === modal) {
    closeModal();
  }
});
// FAQ Accordion Functionality - ADICIONAR NO MAIN.JS
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', function() {
    const faqCard = this.parentElement;
    const isActive = faqCard.classList.contains('active');
    
    // Fechar todas as outras FAQs
    document.querySelectorAll('.faq-card').forEach(card => {
      card.classList.remove('active');
    });
    
    // Abrir/fechar a FAQ clicada
    if (!isActive) {
      faqCard.classList.add('active');
    }
  });
});
