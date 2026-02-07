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

// Elementos para animar
const animatedElements = [
  '.area-card',
  '.diferencial', 
  '.depoimento',
  '.valor',
  '.area-detail',
  '.artigo-card',
  '.insight-card',
  '.sobre__image',
  '.sobre__content',
  '.newsletter__content',
  '.newsletter__form',
  '.section__header',
  '.stat'
];

animatedElements.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });
});

// Elementos com animação especial (fade-in classes)
document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
  observer.observe(el);
});

const style = document.createElement('style');
style.textContent = '.is-visible { opacity: 1 !important; transform: translateY(0) translateX(0) scale(1) !important; }';
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
      // Submeter o formulário para o PHP
      this.submit();
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

// ========================================
// NEWSLETTER FORM
// ========================================
const newsletterForm = document.querySelector('.newsletter__form');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const emailInput = this.querySelector('.newsletter__input');
    const email = emailInput.value.trim();
    
    if (!email || !isValidEmail(email)) {
      emailInput.style.borderColor = '#dc2626';
      emailInput.focus();
      return;
    }
    
    // Simular envio (substituir por integração real depois)
    const btn = this.querySelector('.newsletter__btn');
    const originalText = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.textContent = '✓ Inscrito!';
      btn.style.background = '#059669';
      emailInput.value = '';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1000);
  });
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// ========================================
// COUNTER ANIMATION (Stats)
// ========================================
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const finalValue = target.textContent;
      
      // Se for número, anima
      if (/^\d+/.test(finalValue)) {
        const numValue = parseInt(finalValue);
        let current = 0;
        const increment = numValue / 30;
        const suffix = finalValue.replace(/[\d]/g, '');
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= numValue) {
            target.textContent = finalValue;
            clearInterval(timer);
          } else {
            target.textContent = Math.floor(current) + suffix;
          }
        }, 30);
      }
      
      counterObserver.unobserve(target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat__number').forEach(el => {
  counterObserver.observe(el);
});
