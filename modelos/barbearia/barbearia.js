/**
 * Barbearia Exemplo - Interações do Modelo de Demonstração
 * Fidela Web
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Controle do Modal de Demonstração
  const modalBackdrop = document.getElementById('demoModalBackdrop');
  const modalCloseBtn = document.getElementById('demoModalClose');
  const modalDismissBtn = document.getElementById('demoModalDismiss');
  let lastFocusedElement = null;

  function openDemoModal(triggerElement) {
    if (!modalBackdrop) return;
    lastFocusedElement = triggerElement || document.activeElement;
    modalBackdrop.classList.add('is-active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Foca no botão principal de ação do modal
    const primaryBtn = modalBackdrop.querySelector('.demo-modal__actions a');
    if (primaryBtn) {
      primaryBtn.focus();
    }
  }

  function closeDemoModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  // Interceptar todos os botões de agendar
  const scheduleButtons = document.querySelectorAll('[data-action="agendar"]');
  scheduleButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDemoModal(btn);
    });
  });

  // Fechar modal pelos botões internos
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeDemoModal);
  }
  if (modalDismissBtn) {
    modalDismissBtn.addEventListener('click', closeDemoModal);
  }

  // Fechar clicando no fundo escuro
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeDemoModal();
      }
    });
  }

  // Fechar com a tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('is-active')) {
      closeDemoModal();
    }
  });

  // 2. Menu Mobile do Cabeçalho
  const menuToggle = document.getElementById('menuToggle');
  const siteNav = document.getElementById('siteNav');

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Fechar ao clicar em qualquer link de navegação
    const navLinks = siteNav.querySelectorAll('.site-nav__link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
});
