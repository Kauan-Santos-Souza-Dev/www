(function () {
  "use strict";

  var doc = document;
  var cfg = window.FIDELA_CONFIG || {};
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  function $(sel, root) { return (root || doc).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }
  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

  /* ---------- Contatos a partir do config.js ---------- */
  var phone = String(cfg.whatsapp || "").replace(/\D/g, "");
  if (phone) {
    var waUrl = "https://wa.me/" + phone;
    if (cfg.whatsappMessage) { waUrl += "?text=" + encodeURIComponent(cfg.whatsappMessage); }
    $all("[data-wa]").forEach(function (a) {
      a.href = waUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    });
  }
  if (cfg.whatsappLabel) {
    $all("[data-phone-text]").forEach(function (el) { el.textContent = cfg.whatsappLabel; });
  }

  var ig = String(cfg.instagram || "").replace(/^@/, "").replace(/[^A-Za-z0-9._]/g, "");
  if (ig) {
    $all("[data-ig]").forEach(function (a) {
      a.href = "https://www.instagram.com/" + ig + "/";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    });
    $all("[data-ig-text]").forEach(function (el) { el.textContent = "@" + ig; });
  }

  if (cfg.email) {
    $all("[data-email-text]").forEach(function (el) { el.textContent = cfg.email; });
  }

  /* ---------- Ano no rodapé ---------- */
  $all("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Menu no celular ---------- */
  var toggle = $(".menu-toggle");
  var menu = $("#menu");
  function setMenu(open) {
    if (!toggle || !menu) { return; }
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menu.classList.toggle("is-open", open);
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    $all("a", menu).forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Copiar e-mail ---------- */
  var copyBtn = $("[data-copy-email]");
  var status = $("[data-copy-status]");
  var statusTimer = null;

  function fallbackCopy(text) {
    try {
      var ta = doc.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      doc.body.appendChild(ta);
      ta.select();
      var ok = doc.execCommand("copy");
      doc.body.removeChild(ta);
      return ok;
    } catch (err) {
      return false;
    }
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  if (copyBtn) {
    var original = copyBtn.textContent;
    copyBtn.addEventListener("click", function () {
      var emailEl = $("[data-email-text]");
      var text = cfg.email || (emailEl ? emailEl.textContent.trim() : "");
      if (!text) { return; }
      copyText(text).then(function (ok) {
        if (status) {
          status.textContent = ok
            ? "E-mail copiado."
            : "Não foi possível copiar. Selecione o e-mail e copie manualmente.";
        }
        if (ok) { copyBtn.textContent = "E-mail copiado"; }
        clearTimeout(statusTimer);
        statusTimer = setTimeout(function () {
          copyBtn.textContent = original;
          if (status) { status.textContent = ""; }
        }, 3500);
      });
    });
  }

  /* ---------- Movimento ao rolar ---------- */
  var header = $("[data-header]");
  var hero = $(".hero");
  var steps = $(".steps");
  var stepItems = $all(".steps li");
  var ticking = false;

  if (reduce) {
    stepItems.forEach(function (li) { li.classList.add("is-active"); });
  }

  function update() {
    ticking = false;
    var y = window.pageYOffset || doc.documentElement.scrollTop || 0;

    if (header) { header.classList.toggle("is-scrolled", y > 8); }

    var max = Math.max(doc.documentElement.scrollHeight - (window.innerHeight || 0), 1);
    doc.documentElement.style.setProperty("--scroll", clamp(y / max, 0, 1).toFixed(4));

    if (reduce) { return; }

    if (hero) {
      var p = clamp(y / Math.max(hero.offsetHeight, 1), 0, 1);
      hero.style.setProperty("--p", p.toFixed(3));
    }

    if (steps) {
      var vh = window.innerHeight || 800;
      var rect = steps.getBoundingClientRect();
      var trigger = vh * 0.7;
      var prog = clamp((trigger - rect.top) / Math.max(rect.height, 1), 0, 1);
      steps.style.setProperty("--fill", prog.toFixed(3));
      stepItems.forEach(function (li) {
        li.classList.toggle("is-active", li.getBoundingClientRect().top < trigger);
      });
    }
  }

  /* ---------- Entrada dos blocos ao rolar ---------- */
  if (!reduce && "IntersectionObserver" in window) {
    doc.documentElement.classList.add("reveal-on");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    $all(".reveal, .reveal-stagger > *").forEach(function (el) { io.observe(el); });
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
})();
