/**
 * Fidela Web - Script Principal (Vanilla JS)
 * Sem frameworks, sem dependências, executável diretamente no navegador.
 */

// Adiciona a classe 'js' ao <html> para habilitar as animações suaves de entrada (Progressive Enhancement)
document.documentElement.classList.add('js');

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Verificação de Configuração e Constantes
  // --------------------------------------------------------------------------
  var config = window.SITE_CONFIG || {
    whatsappNumero: "5561981714067",
    whatsappMensagem: "Olá! Vim pelo site da Fidela Web e gostaria de saber mais.",
    whatsappMensagemPlano: "Olá! Tenho interesse no plano da Fidela Web.",
    telefone: "(61) 98171-4067",
    instagramUsuario: "fidelaweb",
    email: "fidelaweb@gmail.com",
    precoMensal: "R$ 79,90",
    mostrarPreco: true,
    modelos: []
  };

  var isPlaceholderWa = !config.whatsappNumero || config.whatsappNumero === "COLOCAR_NUMERO_AQUI";

  if (isPlaceholderWa) {
    console.warn(
      "⚠️ [Fidela Web] Atenção: O número de WhatsApp ainda não foi definido no arquivo js/config.js. " +
      "Por favor, abra 'js/config.js' e insira seu número com DDD (apenas dígitos, ex: '5561999998888')."
    );
  }

  // Função para montar a URL do WhatsApp
  function buildWhatsAppUrl(mensagem) {
    var msgCodificada = encodeURIComponent(mensagem || config.whatsappMensagem);
    if (isPlaceholderWa) {
      // Se ainda for placeholder, direciona para o gerador ou wa.me básico
      return "https://wa.me/?text=" + msgCodificada;
    }
    return "https://wa.me/" + config.whatsappNumero.replace(/\D/g, '') + "?text=" + msgCodificada;
  }

  // --------------------------------------------------------------------------
  // 2. Inicialização dos Dados Editáveis na Página
  // --------------------------------------------------------------------------
  function setupConfigData() {
    // Links gerais do WhatsApp
    var waUrlGeral = buildWhatsAppUrl(config.whatsappMensagem);
    var waButtons = document.querySelectorAll('.js-btn-whatsapp');
    waButtons.forEach(function (btn) {
      btn.setAttribute('href', waUrlGeral);
      if (isPlaceholderWa) {
        btn.addEventListener('click', function (e) {
          console.warn("Clique em botão WhatsApp: número ainda está como placeholder em js/config.js.");
        });
      }
    });

    // Link do botão do Plano
    var waUrlPlano = buildWhatsAppUrl(config.whatsappMensagemPlano);
    var planoButtons = document.querySelectorAll('.js-btn-plano');
    planoButtons.forEach(function (btn) {
      btn.setAttribute('href', waUrlPlano);
    });

    // Instagram
    var instaLink = document.getElementById('contactInstagramLink');
    if (instaLink) {
      var usuarioInsta = config.instagramUsuario || 'fidelaweb';
      instaLink.setAttribute('href', 'https://instagram.com/' + usuarioInsta);
      instaLink.textContent = '@' + usuarioInsta;
    }

    // E-mail
    var emailLink = document.getElementById('contactEmailLink');
    var emailText = document.getElementById('contactEmailText');
    var emailVal = config.email || 'fidelaweb@gmail.com';
    if (emailLink) {
      emailLink.setAttribute('href', 'mailto:' + emailVal);
      emailLink.textContent = emailVal;
    }
    if (emailText) {
      emailText.textContent = emailVal;
    }

    // Telefone
    var phoneLink = document.getElementById('contactPhoneLink');
    if (phoneLink) {
      var telDisplay = config.telefone || '(61) 98171-4067';
      var telDigits = (config.whatsappNumero || '5561981714067').replace(/\D/g, '');
      phoneLink.setAttribute('href', 'tel:+' + telDigits);
      phoneLink.textContent = telDisplay;
    }

    // Preço do Plano
    var priceDisplay = document.getElementById('pricingPriceDisplay');
    var contactDisplay = document.getElementById('pricingContactDisplay');
    var priceAmount = document.getElementById('pricingAmount');

    if (config.mostrarPreco) {
      if (priceDisplay) priceDisplay.style.display = 'flex';
      if (contactDisplay) contactDisplay.style.display = 'none';
      if (priceAmount) priceAmount.textContent = config.precoMensal || 'R$ 79,90';
    } else {
      if (priceDisplay) priceDisplay.style.display = 'none';
      if (contactDisplay) contactDisplay.style.display = 'block';
    }

    // Ano no Rodapé
    var anoElement = document.getElementById('anoAtual');
    if (anoElement) {
      anoElement.textContent = new Date().getFullYear();
    }
  }

  // --------------------------------------------------------------------------
  // 3. Renderização Dinâmica da Vitrine de Modelos
  // --------------------------------------------------------------------------
  function renderModelos() {
    var grid = document.getElementById('modelosGrid');
    if (!grid || !config.modelos || !config.modelos.length) return;

    // Limpa conteúdo pré-existente
    grid.innerHTML = '';

    config.modelos.forEach(function (item, index) {
      var temUrl = item.url && item.url.trim() !== '';
      var cardTag = temUrl ? 'a' : 'div';
      var card = document.createElement(cardTag);
      card.className = 'modelo-card card reveal';
      card.style.setProperty('--delay', (0.15 * (index + 1)) + 's');

      if (temUrl) {
        card.setAttribute('href', item.url);
        card.setAttribute('target', '_blank');
        card.setAttribute('rel', 'noopener noreferrer');
        card.setAttribute('aria-label', item.nome + ' - Ver modelo em nova aba');
      }

      // Estilo de prévia ilustrada em CSS
      var previewDecorHtml = '';
      if (item.nome.toLowerCase().indexOf('barbearia') !== -1) {
        previewDecorHtml = '<div class="barber-pole-decor" aria-hidden="true"></div>';
      } else {
        previewDecorHtml = '<div class="store-bag-decor" aria-hidden="true"></div>';
      }

      var badgeOrActionHtml = temUrl
        ? '<span class="modelo-link-action">Acessar modelo &rarr;</span>'
        : '<span class="badge-em-breve">Em breve</span>';

      card.innerHTML =
        '<div class="modelo-preview" aria-hidden="true">' +
        '<div class="modelo-preview-screen">' +
        previewDecorHtml +
        '<div class="modelo-preview-text"></div>' +
        '</div>' +
        '</div>' +
        '<div class="modelo-card-content">' +
        '<div class="modelo-card-header">' +
        '<h3 class="modelo-card-title">' + escapeHtml(item.nome) + '</h3>' +
        (!temUrl ? badgeOrActionHtml : '') +
        '</div>' +
        '<p class="modelo-card-desc">' + escapeHtml(item.descricao) + '</p>' +
        (temUrl ? badgeOrActionHtml : '') +
        '</div>';

      grid.appendChild(card);
    });
  }

  // Prevenção simples contra XSS para textos dinâmicos
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // --------------------------------------------------------------------------
  // 4. Copiar E-mail com Acessibilidade e Fallback
  // --------------------------------------------------------------------------
  function setupEmailCopy() {
    var btnCopy = document.getElementById('btnCopyEmail');
    var liveFeedback = document.getElementById('emailCopyFeedback');
    var emailText = document.getElementById('contactEmailText');

    if (!btnCopy || !emailText) return;

    btnCopy.addEventListener('click', function () {
      var emailEl = document.getElementById('contactEmailLink') || emailText;
      var textoParaCopiar = config.email || (emailEl ? emailEl.textContent.trim() : 'fidelaweb@gmail.com');

      // Fallback para cópia
      function copyFallback(text) {
        var tempInput = document.createElement('textarea');
        tempInput.value = text;
        tempInput.setAttribute('readonly', '');
        tempInput.style.position = 'absolute';
        tempInput.style.left = '-9999px';
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.warn('Fallback de cópia executado:', err);
        }
        document.body.removeChild(tempInput);
        showSuccess();
      }

      function showSuccess() {
        btnCopy.classList.add('copied');
        var labelSpan = btnCopy.querySelector('.copy-label-text');
        if (labelSpan) labelSpan.textContent = 'Copiado!';
        if (liveFeedback) {
          liveFeedback.textContent = 'Endereço de e-mail copiado para a área de transferência com sucesso.';
        }

        setTimeout(function () {
          btnCopy.classList.remove('copied');
          if (labelSpan) labelSpan.textContent = 'Copiar';
          if (liveFeedback) liveFeedback.textContent = '';
        }, 2500);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textoParaCopiar)
          .then(showSuccess)
          .catch(function () {
            copyFallback(textoParaCopiar);
          });
      } else {
        copyFallback(textoParaCopiar);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Header Fixo & Barra de Progresso de Leitura
  // --------------------------------------------------------------------------
  function setupHeaderAndScroll() {
    var header = document.getElementById('siteHeader');
    var progressBar = document.getElementById('scrollProgressBar');
    var heroBlob1 = document.getElementById('heroBlob1');
    var heroBlob2 = document.getElementById('heroBlob2');

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ticking = false;

    function onScroll() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      // 1. Barra de leitura
      if (progressBar && docHeight > 0) {
        var progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        progressBar.style.width = progress + '%';
      }

      // 2. Header sólido após 8px
      if (header) {
        if (scrollY > 8) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      }

      // 3. Parallax sutil nos blobs do Hero
      if (!prefersReducedMotion && (heroBlob1 || heroBlob2) && scrollY < 800) {
        var offset1 = scrollY * 0.12;
        var offset2 = scrollY * -0.08;
        if (heroBlob1) heroBlob1.style.transform = 'translate3d(0, ' + offset1 + 'px, 0)';
        if (heroBlob2) heroBlob2.style.transform = 'translate3d(0, ' + offset2 + 'px, 0)';
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    // Dispara uma vez na carga
    onScroll();
  }

  // --------------------------------------------------------------------------
  // 6. Menu Hambúrguer Mobile Acessível
  // --------------------------------------------------------------------------
  function setupMobileMenu() {
    var toggleBtn = document.getElementById('menuToggle');
    var mobileMenu = document.getElementById('mobileMenu');

    if (!toggleBtn || !mobileMenu) return;

    function openMenu() {
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.setAttribute('aria-label', 'Fechar menu de navegação');
      mobileMenu.classList.add('is-open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Abrir menu de navegação');
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', function () {
      var isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Fecha ao clicar em qualquer link do menu
    var menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    // Fecha ao pressionar tecla Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggleBtn.focus();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. Animações com IntersectionObserver (Scroll Reveal)
  // --------------------------------------------------------------------------
  function setupScrollAnimations() {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var reveals = document.querySelectorAll('.reveal');
    var timeline = document.getElementById('timeline');

    // Se preferir movimento reduzido, revela tudo imediatamente
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) {
        el.classList.add('is-visible');
      });
      if (timeline) timeline.classList.add('is-active');
      return;
    }

    // Observer para elementos com a classe .reveal
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Dispara apenas uma vez por elemento
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });

    // Observer para animar a linha da timeline da seção "Como funciona"
    if (timeline) {
      var timelineObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            timeline.classList.add('is-active');
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.2
      });
      timelineObserver.observe(timeline);
    }
  }

  // --------------------------------------------------------------------------
  // 8. Inicialização após carregamento do DOM
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    setupConfigData();
    renderModelos();
    setupEmailCopy();
    setupHeaderAndScroll();
    setupMobileMenu();
    setupScrollAnimations();
  });

})();
