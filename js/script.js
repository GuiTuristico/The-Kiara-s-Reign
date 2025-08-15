// ===== KIARAS REIGN - JAVASCRIPT FUNCIONALIDADES =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== INICIALIZACIÓN =====
    initializeNavigation();
    initializeFormValidation();
    initializeGalleryEffects();
    initializeScrollEffects();
    
    console.log('🦁 Kiaras Reign - Sistema inicializado correctamente');
});

// ===== NAVEGACIÓN ACTIVA =====
function initializeNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const linkPage = href.split('/').pop();
        
        // Remover clase active de todos los enlaces
        link.classList.remove('active');
        
        // Agregar clase active al enlace actual
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ===== VALIDACIÓN DE FORMULARIO =====
function initializeFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            if (validateForm()) {
                showSuccessMessage();
                contactForm.reset();
                contactForm.classList.remove('was-validated');
            } else {
                contactForm.classList.add('was-validated');
            }
        });
        
        // Validación en tiempo real
        const inputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
    }
}

// ===== VALIDACIÓN DE CAMPOS INDIVIDUALES =====
function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Limpiar estados anteriores
    field.classList.remove('is-valid', 'is-invalid');
    
    switch (fieldName) {
        case 'nombre':
            // REQUISITO: 3-40 caracteres, solo letras y espacios
            if (fieldValue.length < 3 || fieldValue.length > 40) {
                isValid = false;
                errorMessage = 'El nombre debe tener entre 3 y 40 caracteres.';
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(fieldValue)) {
                isValid = false;
                errorMessage = 'El nombre solo puede contener letras y espacios.';
            }
            break;
            
        case 'apellidos':
            // REQUISITO: 4-60 caracteres, solo letras y espacios
            if (fieldValue.length < 4 || fieldValue.length > 60) {
                isValid = false;
                errorMessage = 'Los apellidos deben tener entre 4 y 60 caracteres.';
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(fieldValue)) {
                isValid = false;
                errorMessage = 'Los apellidos solo pueden contener letras y espacios.';
            }
            break;
            
        case 'email':
            // REQUISITO: patrón xxxxxx@xxxxx.xxx
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(fieldValue)) {
                isValid = false;
                errorMessage = 'Por favor, introduce un correo electrónico válido.';
            }
            break;
            
        case 'telefono':
            // REQUISITO: exactamente 9 números
            if (!/^[0-9]{9}$/.test(fieldValue)) {
                isValid = false;
                errorMessage = 'El teléfono debe tener exactamente 9 números.';
            }
            break;
    }
    
    // Aplicar estado visual
    if (field.required && fieldValue === '') {
        field.classList.add('is-invalid');
        updateErrorMessage(field, 'Este campo es obligatorio.');
    } else if (isValid) {
        field.classList.add('is-valid');
        updateErrorMessage(field, '');
    } else {
        field.classList.add('is-invalid');
        updateErrorMessage(field, errorMessage);
    }
    
    return isValid;
}

// ===== ACTUALIZAR MENSAJE DE ERROR =====
function updateErrorMessage(field, message) {
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.textContent = message;
    }
}

// ===== VALIDACIÓN COMPLETA DEL FORMULARIO =====
function validateForm() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isFormValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

// ===== MENSAJE DE ÉXITO =====
function showSuccessMessage() {
    // Crear modal de éxito
    const successModal = document.createElement('div');
    successModal.className = 'modal fade';
    successModal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-body text-center p-5">
                    <div class="mb-4">
                        <i class="fas fa-check-circle text-success" style="font-size: 4rem;"></i>
                    </div>
                    <h3 class="fw-bold mb-3" style="color: #8B4513;">¡Mensaje Enviado!</h3>
                    <p class="lead text-muted mb-4">
                        Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos 
                        lo antes posible en las próximas 24 horas.
                    </p>
                    <button type="button" class="btn btn-lg px-4" style="background-color: #20B2AA; color: white;" data-bs-dismiss="modal">
                        <i class="fas fa-thumbs-up me-2"></i>Perfecto
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(successModal);
    
    const modal = new bootstrap.Modal(successModal);
    modal.show();
    
    // Limpiar modal después de cerrarlo
    successModal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(successModal);
    });
}

// ===== EFECTOS DE GALERÍA =====
function initializeGalleryEffects() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('h5').textContent;
            const description = this.querySelector('p').textContent;
            
            showImageModal(img.src, title, description);
        });
    });
}

// ===== MODAL DE IMAGEN =====
function showImageModal(imageSrc, title, description) {
    const imageModal = document.createElement('div');
    imageModal.className = 'modal fade';
    imageModal.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header border-0">
                    <h5 class="modal-title fw-bold" style="color: #8B4513;">${title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-0">
                    <img src="${imageSrc}" class="img-fluid w-100" alt="${title}">
                    <div class="p-4">
                        <p class="text-muted mb-0">${description}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(imageModal);
    
    const modal = new bootstrap.Modal(imageModal);
    modal.show();
    
    // Limpiar modal después de cerrarlo
    imageModal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(imageModal);
    });
}

// ===== EFECTOS DE SCROLL =====
function initializeScrollEffects() {
    // Animación de aparición de elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar cards y elementos de galería
    const animatedElements = document.querySelectorAll('.card, .gallery-item');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// ===== UTILIDADES ADICIONALES =====

// Smooth scroll para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Lazy loading para imágenes
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Inicializar lazy loading si hay imágenes con data-src
if (document.querySelectorAll('img[data-src]').length > 0) {
    lazyLoadImages();
}

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', function(e) {
    console.error('Error en Kiaras Reign:', e.error);
});

// ===== FUNCIONES GLOBALES =====
window.KiarasReign = {
    validateForm: validateForm,
    showSuccessMessage: showSuccessMessage,
    showImageModal: showImageModal
};

