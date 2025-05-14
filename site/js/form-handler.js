/**
 * Form submission handler with enhanced validation
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("my-form");
    if (!form) return;

    // Field validation
    const validateField = (field, errorElement, validationFn) => {
        const isValid = validationFn(field.value);
        const formField = field.closest('.form-field');
        
        if (!isValid) {
            formField.classList.add('error');
            errorElement.classList.remove('hidden');
            return false;
        } else {
            formField.classList.remove('error');
            errorElement.classList.add('hidden');
            return true;
        }
    };

    // Add validation on blur for each required field
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const privacyField = document.getElementById('privacy-policy');
    
    if (nameField) {
        const nameError = document.getElementById('name-error');
        nameField.addEventListener('blur', () => {
            validateField(nameField, nameError, value => value.trim().length > 0);
        });
    }
    
    if (emailField) {
        const emailError = document.getElementById('email-error');
        emailField.addEventListener('blur', () => {
            validateField(emailField, emailError, value => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            });
        });
    }
    
    if (phoneField) {
        const phoneError = document.getElementById('phone-error');
        phoneField.addEventListener('blur', () => {
            validateField(phoneField, phoneError, value => {
                const digits = value.replace(/\D/g, '');
                return digits.length >= 10;
            });
        });
    }
    
    if (privacyField) {
        const privacyError = document.getElementById('privacy-error');
        privacyField.addEventListener('change', () => {
            validateField(privacyField, privacyError, value => privacyField.checked);
        });
    }

    // Form submission handler
    async function handleSubmit(event) {
        event.preventDefault();
        const status = document.getElementById("my-form-status");
        
        // Validate all fields
        let isValid = true;
        
        if (nameField && document.getElementById('name-error')) {
            isValid = validateField(
                nameField, 
                document.getElementById('name-error'), 
                value => value.trim().length > 0
            ) && isValid;
        }
        
        if (emailField && document.getElementById('email-error')) {
            isValid = validateField(
                emailField, 
                document.getElementById('email-error'), 
                value => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(value);
                }
            ) && isValid;
        }
        
        if (phoneField && document.getElementById('phone-error')) {
            isValid = validateField(
                phoneField, 
                document.getElementById('phone-error'), 
                value => {
                    const digits = value.replace(/\D/g, '');
                    return digits.length >= 10;
                }
            ) && isValid;
        }
        
        if (privacyField && document.getElementById('privacy-error')) {
            isValid = validateField(
                privacyField, 
                document.getElementById('privacy-error'), 
                value => privacyField.checked
            ) && isValid;
        }
        
        if (!isValid) {
            return;
        }
        
        // Submit if valid
        try {
            const data = new FormData(event.target);
            const submitButton = document.getElementById("my-form-button");
            
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Submitting...";
            }
            
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                if (status) status.innerHTML = "Thanks for your submission!";
                form.reset();
            } else {
                const responseData = await response.json();
                if (status) {
                    if (responseData && responseData.errors) {
                        status.innerHTML = responseData.errors.map(error => error.message).join(", ");
                    } else {
                        status.innerHTML = "Oops! There was a problem submitting your form.";
                    }
                }
            }
        } catch (error) {
            if (status) status.innerHTML = "Oops! There was a problem submitting your form.";
            console.error("Form submission error:", error);
        } finally {
            const submitButton = document.getElementById("my-form-button");
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Submit Application";
            }
        }
    }

    form.addEventListener("submit", handleSubmit);
}); 