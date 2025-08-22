// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const leadModal = document.getElementById('leadModal');
  const modalClose = leadModal.querySelector('.modal-close');
  const btnContinue = document.getElementById('btnContinue');
  const btnBack = document.getElementById('btnBack');
  const btnSend = document.getElementById('btnSend');
  const ctaOpen = document.getElementById('ctaOpen');
  const planButtons = Array.from(document.querySelectorAll('.plan-btn'));
  const dots = Array.from(document.querySelectorAll('.modal-steps .dot'));
  const steps = Array.from(document.querySelectorAll('.step'));
  const deviceSelect = document.getElementById('device');
  const smartTvFields = document.getElementById('smartTvFields');
  const phoneFields = document.getElementById('phoneFields');
  const fullName = document.getElementById('fullName');
  const whatsInput = document.getElementById('whats');

  let preselectedPlan = ''; // Mantém plano quando clicam no card

  // Utility: open/close modal and set step
  function openLeadModal(step = 1, plan = '') {
    preselectedPlan = plan || '';
    showStep(1); // Sempre abrir na ETAPA 1 por padrão
    leadModal.classList.add('open');
    leadModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // foco para campo nome:
    setTimeout(() => { try { fullName.focus(); } catch (e) {} }, 120);
  }

  function closeLeadModal() {
    leadModal.classList.remove('open');
    leadModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    preselectedPlan = ''; // limpar seleção ao fechar
  }

  function showStep(n) {
    steps.forEach((s, idx) => {
      const stepIndex = idx + 1;
      if (stepIndex === n) s.classList.add('active'); else s.classList.remove('active');
    });
    dots.forEach(d => d.classList.toggle('active', Number(d.dataset.step) === n));
  }

  // Validate Step 1 before proceeding
  function validateStep1() {
    const name = fullName.value.trim();
    const phoneDigits = whatsInput.value.replace(/\D/g, '');
    const device = deviceSelect.value;

    if (!name) { alert('Por favor informe seu nome completo.'); fullName.focus(); return false; }
    if (phoneDigits.length < 10) { alert('Informe um número de WhatsApp válido (DDD + número).'); whatsInput.focus(); return false; }
    if (!device) { alert('Selecione o aparelho que vai usar.'); deviceSelect.focus(); return false; }

    if (device === 'Smart TV') {
      const brand = document.getElementById('tvBrand')?.value?.trim() || '';
      const model = document.getElementById('tvModel')?.value?.trim() || '';
      if (!brand || !model) { alert('Para Smart TV, informe marca e modelo.'); document.getElementById('tvBrand')?.focus(); return false; }
    } else if (device === 'Celular') {
      const os = document.querySelector('input[name="phoneOS"]:checked');
      if (!os) { alert('Selecione se o celular é Android ou iOS.'); return false; }
    }

    // Store basic info locally (light)
    try {
      localStorage.setItem('lead:name', name);
      localStorage.setItem('lead:phone', whatsInput.value);
    } catch (e) { /* ignore */ }

    return true;
  }

  // Apply conditional fields on device change
  function updateConditionalFields() {
    const val = deviceSelect.value;
    smartTvFields.style.display = val === 'Smart TV' ? '' : 'none';
    phoneFields.style.display = val === 'Celular' ? '' : 'none';
  }

  // Mask WhatsApp input (Brazilian style)
  function maskWhats() {
    let v = whatsInput.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length > 10) v = `${v.slice(0, 10)}-${v.slice(10)}`;
    whatsInput.value = v;
  }

  // Intent behavior: enable/disable plans
  function applyIntentBehavior() {
    const intent = document.querySelector('input[name="intent"]:checked')?.value || 'Teste';
    const planRadios = document.querySelectorAll('input[name="plan"]');
    planRadios.forEach(r => {
      r.disabled = intent === 'Teste';
      r.closest('.plan-chip')?.classList.toggle('disabled', intent === 'Teste');
      if (intent === 'Teste') r.checked = false;
    });
    // if intent is Assinar and preselectedPlan exists, mark it
    if (intent === 'Assinar' && preselectedPlan) preselectPlanChip(preselectedPlan);
  }

  function preselectPlanChip(planName) {
    const radios = Array.from(document.querySelectorAll('input[name="plan"]'));
    const target = radios.find(r => r.value === planName);
    if (target && !target.disabled) target.checked = true;
  }

  // Build message and send to WhatsApp
  function sendLeadToWhatsApp() {
    if (!validateStep1()) return;
    const name = fullName.value.trim();
    const phone = whatsInput.value.trim();
    const device = deviceSelect.value;
    let details = '';

    if (device === 'Smart TV') {
      const brand = document.getElementById('tvBrand').value.trim();
      const model = document.getElementById('tvModel').value.trim();
      details = `Marca: ${brand}\nModelo: ${model}`;
    } else if (device === 'Celular') {
      const os = document.querySelector('input[name="phoneOS"]:checked')?.value || '';
      details = `Sistema: ${os}`;
    }

    const intent = document.querySelector('input[name="intent"]:checked')?.value || 'Teste';
    let planText = '';
    if (intent === 'Assinar') {
      const selected = document.querySelector('input[name="plan"]:checked');
      if (!selected) { alert('Escolha um plano para continuar.'); return; }
      planText = `Plano: ${selected.value} • R$${Number(selected.dataset.price).toFixed(2)}`;
    }

    const message = [
      'Olá! Quero atendimento.',
      '',
      `Nome: ${name}`,
      `WhatsApp: ${phone}`,
      `Aparelho: ${device}`,
      details ? `Detalhes: ${details}` : null,
      `Ação: ${intent}`,
      planText ? planText : null,
      '',
      'Observação: Estou ciente da taxa de R$15 a R$20 para ativação (1x ao ano).'
    ].filter(Boolean).join('\n');

    const url = 'https://wa.me/5521977317084?text=' + encodeURIComponent(message);
    window.open(url, '_blank');
    closeLeadModal();
  }

  // Attach events
  // open by CTA (this will open step 1)
  ctaOpen?.addEventListener('click', () => openLeadModal(1, ''));

  // plan buttons: store plan & open modal in step1 (do NOT jump to step2)
  planButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.plan || '';
      openLeadModal(1, plan); // abre ETAPA 1 sempre, com preselectedPlan guardado
    });
  });

  // close modal
  modalClose.addEventListener('click', closeLeadModal);
  leadModal.addEventListener('click', (e) => {
    if (e.target === leadModal) closeLeadModal();
  });

  // continue to step 2 (after validation)
  btnContinue.addEventListener('click', () => {
    if (!validateStep1()) return;
    // if preselectedPlan exists, set intent=Assinar
    if (preselectedPlan) {
      const intendAssinar = document.querySelector('input[name="intent"][value="Assinar"]');
      if (intendAssinar) intendAssinar.checked = true;
    }
    applyIntentBehavior();
    // if there is a preselected plan and intent is Assinar, preselect after enabling
    if (preselectedPlan) preselectPlanChip(preselectedPlan);
    showStep(2);
  });

  btnBack.addEventListener('click', () => {
    showStep(1);
  });

  btnSend.addEventListener('click', sendLeadToWhatsApp);

  // device conditional fields
  deviceSelect.addEventListener('change', updateConditionalFields);

  // mask WhatsApp input
  whatsInput.addEventListener('input', maskWhats);

  // intent change
  document.querySelectorAll('input[name="intent"]').forEach(r => r.addEventListener('change', applyIntentBehavior));

  // init: load saved values
  try {
    const savedName = localStorage.getItem('lead:name');
    const savedPhone = localStorage.getItem('lead:phone');
    if (savedName) fullName.value = savedName;
    if (savedPhone) whatsInput.value = savedPhone;
  } catch (e) { /* ignore */ }

  // NAV menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  // FAQ toggles
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => q.closest('.faq-card').classList.toggle('open'));
  });

  // Video carousel simple
  const slides = Array.from(document.querySelectorAll('.video-slide'));
  let slideIndex = 0;
  function showSlide(i) {
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    // pause all videos
    document.querySelectorAll('.video-slide video').forEach(v => v.pause());
  }
  document.getElementById('nextVideo')?.addEventListener('click', () => { slideIndex = (slideIndex + 1) % slides.length; showSlide(slideIndex); });
  document.getElementById('prevVideo')?.addEventListener('click', () => { slideIndex = (slideIndex - 1 + slides.length) % slides.length; showSlide(slideIndex); });

  // Counters fake
  function updateCounters() {
    document.getElementById('visitors').innerText = Math.floor(Math.random() * 100) + 150;
    document.getElementById('subscribers').innerText = Math.floor(Math.random() * 1000) + 2500;
  }
  updateCounters();
  setInterval(updateCounters, 5000);

  // Back to top
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('show', window.scrollY > 600);
  });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Theme toggle (persist)
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const applyTheme = (t) => root.setAttribute('data-theme', t);
  const savedTheme = localStorage.getItem('rj_theme');
  if (savedTheme) applyTheme(savedTheme);
  themeToggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('rj_theme', next);
  });

  // ---------------------------
  // AUTOPLAY: abrir modal automaticamente na ETAPA 1 no carregamento
  // (pequeno delay para não assustar o usuário)
  // ---------------------------
  setTimeout(() => {
    // Se o usuário já tem o modal aberto escondido por algum motivo, não forçar
    if (!leadModal.classList.contains('open')) {
      openLeadModal(1, '');
    }
  }, 900);
});
