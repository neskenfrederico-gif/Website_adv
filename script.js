// ========================================
// MENU MOBILE
// ========================================
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fechar ao clicar em link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ========================================
// HEADER SCROLL
// ========================================
const header = document.getElementById('header');

if (header) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }, { passive: true });
}

// ========================================
// SMOOTH SCROLL PARA LINKS INTERNOS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerHeight = document.getElementById('header')?.offsetHeight || 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ========================================
// ANIMACAO DE ENTRADA (Intersection Observer)
// ========================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.area-card, .diferencial, .depoimento, .valor, .area-detail, .artigo-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

const style = document.createElement('style');
style.textContent = '.is-visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);

// ========================================
// VALIDACAO DE FORMULARIO (contato.html)
// ========================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = this.querySelector('[name="nome"]');
    const email = this.querySelector('[name="email"]');
    const telefone = this.querySelector('[name="telefone"]');
    const mensagem = this.querySelector('[name="mensagem"]');
    const privacidade = this.querySelector('[name="privacidade"]');

    let isValid = true;

    // Limpar erros
    this.querySelectorAll('.error').forEach(el => el.remove());
    this.querySelectorAll('.input--error').forEach(el => el.classList.remove('input--error'));

    if (!nome.value.trim()) {
      showError(nome, 'Por favor, informe seu nome.');
      isValid = false;
    }

    if (!email.value.trim() || !isValidEmail(email.value)) {
      showError(email, 'Por favor, informe um email valido.');
      isValid = false;
    }

    if (!telefone.value.trim()) {
      showError(telefone, 'Por favor, informe seu telefone.');
      isValid = false;
    }

    if (!mensagem.value.trim()) {
      showError(mensagem, 'Por favor, escreva sua mensagem.');
      isValid = false;
    }

    if (privacidade && !privacidade.checked) {
      showError(privacidade.parentElement, 'Voce precisa aceitar a politica de privacidade.');
      isValid = false;
    }

    if (isValid) {
      const successMsg = document.createElement('div');
      successMsg.className = 'form-success';
      successMsg.innerHTML = '<p>Mensagem enviada com sucesso! Entrarei em contato em breve.</p>';
      this.appendChild(successMsg);
      this.reset();

      setTimeout(() => {
        successMsg.remove();
      }, 5000);
    }
  });

  function showError(input, message) {
    input.classList.add('input--error');
    const error = document.createElement('span');
    error.className = 'error';
    error.textContent = message;
    input.parentElement.appendChild(error);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// ========================================
// MASCARA DE TELEFONE
// ========================================
document.querySelectorAll('input[name="telefone"]').forEach(input => {
  input.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length <= 10) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }

    e.target.value = value.substring(0, 15);
  });
});

// ========================================
// FILTRO DE ARTIGOS
// ========================================
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const filter = this.dataset.filter;

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    document.querySelectorAll('.artigo-card').forEach(card => {
      if (filter === 'todos' || card.dataset.category === filter) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ========================================
// ANO ATUAL NO FOOTER
// ========================================
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});
