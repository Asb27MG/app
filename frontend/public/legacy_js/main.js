/* APLICAR TEMA INMEDIATO Y MOSTRAR CUANDO ESTÉ LISTO */
(function () {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  } else {
    document.body.classList.remove("light-mode");
  }

  document.body.classList.add("theme-ready");
})();


// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", function() {

  // ========== TEMA DÍA/NOCHE ==========
  // ========== TEMA DÍA/NOCHE (APPLE SWITCH) ==========
const themeToggle = document.getElementById("themeButton");

function setLightMode() {
  document.body.classList.add("light-mode");
  localStorage.setItem("theme", "light");
  themeToggle.checked = true;
}

function setDarkMode() {
  document.body.classList.remove("light-mode");
  localStorage.setItem("theme", "dark");
  themeToggle.checked = false;
}

// Cargar tema guardado
if (localStorage.getItem("theme") === "light") {
  setLightMode();
} else {
  setDarkMode();
}

if (themeToggle) {
  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      setLightMode();
    } else {
      setDarkMode();
    }
  });
}

  // Listener para cambiar tema
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      if (document.body.classList.contains("light-mode")) {
        setDarkMode();
      } else {
        setLightMode();
      }
    });
  }

  // ========== MENÚ HAMBURGUESA ==========
  const menuToggle = document.getElementById("menuToggle");
  const sideMenu = document.getElementById("sideMenu");

  if (menuToggle && sideMenu) {
    console.log("✓ Menu toggle y side menu encontrados");
    
    // Abrir/cerrar menú
   menuToggle.addEventListener("click", () => {
  const isActive = sideMenu.classList.toggle("active");

  if (isActive) {
    document.body.classList.add("menu-open");
  } else {
    document.body.classList.remove("menu-open");
  }
});

    // Cerrar menú al hacer clic en un enlace
   document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", e => {

    const href = link.getAttribute("href");

    // Solo prevenir si es un ancla interna (#)
    if (href.startsWith("#")) {
      e.preventDefault();
    }

  });
});

    // Cerrar menú al hacer clic en el botón de cotización
    const abrirFormularioBtn = sideMenu.querySelector("#abrirFormulario");
    if (abrirFormularioBtn) {
      abrirFormularioBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        sideMenu.classList.remove("active");
      });
    }

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".navbar") && !e.target.closest(".side-menu")) {
        sideMenu.classList.remove("active");
      }
    });
  }

  // ========== FORMULARIO COTIZACIÓN ==========
  const abrirFormulario = document.getElementById("abrirFormulario");
  const cotizacionPanel = document.getElementById("cotizacionPanel");

  if (abrirFormulario && cotizacionPanel) {
    console.log("✓ Formulario de cotización encontrado");
    const offcanvasInstance = new bootstrap.Offcanvas(cotizacionPanel);
    
    abrirFormulario.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      offcanvasInstance.show();
    });
  }

});

// Observador para animaciones de scroll
document.addEventListener("DOMContentLoaded", function() {
  const fadeElements = document.querySelectorAll(".fade-left, .fade-right");

  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add("show");
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => fadeObserver.observe(el));
  }
});

// Helper para mostrar alertas
window.showAlert = function(message, type = 'success', timeout = 4000, containerSelector = 'body') {
    try {
        const container = document.querySelector(containerSelector) || document.body;
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3 shadow`;
        alert.style.zIndex = 1080;
        alert.setAttribute('role', 'alert');
        alert.innerText = message;
        container.appendChild(alert);
        setTimeout(() => {
            alert.classList.add('fade');
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        }, timeout);
        return alert;
    } catch (e) {
        console.error('showAlert error', e);
        return null;
    }
};

// ===== CERRAR MENÚ SI SE ABRE COTIZACIÓN =====
const abrirFormulario = document.getElementById("abrirFormulario");
const sideMenu = document.getElementById("sideMenu");
const menuToggle = document.getElementById("menuToggle");

if (abrirFormulario) {
  abrirFormulario.addEventListener("click", () => {
    sideMenu.classList.remove("active");
  });
}
// ===== NAVBAR SCROLL =====
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".custom-navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ===== ANIMACIÓN SCROLL CORPORATIVO =====

const corporativoSection = document.querySelector(".corporativo-section");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && corporativoSection) {
      corporativoSection.classList.add("visible");
    }
  });
}, { threshold: 0.3 });

if (corporativoSection) {
  observer.observe(corporativoSection);
}

// ===== ANIMACIÓN AFILIADAS =====

const afiliadasSection = document.querySelector(".afiliadas-section");

const observerAfiliadas = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && afiliadasSection) {
      afiliadasSection.classList.add("visible");
    }
  });
}, { threshold: 0.2 });

if (afiliadasSection) {
  observerAfiliadas.observe(afiliadasSection);
}


window.addEventListener("scroll", function() {
    const navbar = document.querySelector(".custom-navbar");

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});
/* ============================= */
/* FIX DESTELLO DE TEMA */
/* ============================= */

/* ============================= */
/* OCULTAR PRELOADER */
/* ============================= */

window.addEventListener("load", function () {
  const loader = document.getElementById("pageLoader");

  setTimeout(() => {
    loader.classList.add("hidden");
  }, 900); // pequeña espera fluida
});




const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".service-content");

tabs.forEach(tab => {

  tab.addEventListener("click", () => {

    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));

    tab.classList.add("active");

    document.getElementById(tab.dataset.tab)
      .classList.add("active");

  });

});

  // ===== HERO ARROW: scroll to services and reveal =====
  document.addEventListener('DOMContentLoaded', () => {
    const heroArrow = document.querySelector('.hero-arrow');
    const servicesSection = document.querySelector('.services-section');

    if (servicesSection) {
      // ensure hidden on load (CSS controls initial state)
      servicesSection.classList.remove('visible');

      // reveal when section enters viewport
      const servicesObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            servicesSection.classList.add('visible');
          }
        });
      }, { threshold: 0.12 });

      servicesObserver.observe(servicesSection);
    }

    if (heroArrow && servicesSection) {
      heroArrow.addEventListener('click', (e) => {
        e.preventDefault();
        servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // small delay to let scroll start, then ensure visible
        setTimeout(() => servicesSection.classList.add('visible'), 350);
      });
    }
  });

  // ===== HERO ARROW CONTACTO: scroll and reveal form =====
  document.addEventListener('DOMContentLoaded', () => {
    const heroArrow = document.querySelector('.hero-arrow');
    const contactoSection = document.querySelector('.contacto-section');

    if (contactoSection) {
      // ensure hidden on load
      contactoSection.classList.remove('visible');

      // reveal when section enters viewport
      const contactoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            contactoSection.classList.add('visible');
          }
        });
      }, { threshold: 0.12 });

      contactoObserver.observe(contactoSection);
    }

    if (heroArrow && contactoSection) {
      heroArrow.addEventListener('click', (e) => {
        e.preventDefault();
        contactoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => contactoSection.classList.add('visible'), 350);
      });
    }
  });

