// Script para manejar forms de waitlist

// CONFIGURACIÓN - Cambiarás esto en Paso 3
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzyy5NxOReKifsQlGjwtlsWySHdkfoIMG_nvZIuBwzH5r4wPGRxX5M99wKoweWuTORp/exec';

// Handle form submission
function handleFormSubmit(formId, messageId) {
    const form = document.getElementById(formId);
    const message = document.getElementById(messageId);
    
    if (!form) return; // Safety check
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = form.querySelector('input[type="email"]').value;
        const button = form.querySelector('button');
        const originalText = button.innerHTML;
        
        // Loading state
        button.disabled = true;
        button.innerHTML = '⏳ Enviando...';
        
        try {
            // Enviar a Google Sheets
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: email,
                    timestamp: new Date().toISOString()
                })
            });
            
            // Success (no-cors siempre da success, pero está ok)
            message.className = 'mt-4 text-sm font-medium text-green-600';
            message.textContent = '✅ ¡Listo! Revisá tu email para confirmar.';
            form.reset();
            
            // Update counter
            updateWaitlistCount();
            
        } catch (error) {
            console.error('Error:', error);
            message.className = 'mt-4 text-sm font-medium text-red-600';
            message.textContent = '❌ Hubo un error. Intentá de nuevo.';
        } finally {
            button.disabled = false;
            button.innerHTML = originalText;
        }
    });
}

// Initialize both forms
document.addEventListener('DOMContentLoaded', () => {
    handleFormSubmit('waitlist-form', 'form-message');
    handleFormSubmit('waitlist-form-footer', 'form-message-footer');
    loadWaitlistCount();
});

// Update waitlist counter
function updateWaitlistCount() {
    const counter = document.getElementById('waitlist-count');
    if (counter) {
        const currentCount = parseInt(counter.textContent) || 0;
        counter.textContent = currentCount + 1;
        // Save to localStorage
        localStorage.setItem('waitlist-count', currentCount + 1);
    }
}

// Load waitlist count from localStorage
function loadWaitlistCount() {
    const counter = document.getElementById('waitlist-count');
    if (counter) {
        const saved = localStorage.getItem('waitlist-count');
        if (saved) {
            counter.textContent = saved;
        }
    }
}