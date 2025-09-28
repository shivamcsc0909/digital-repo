/**
 * Digital Marketing Agency - Form Handler
 * Contact form validation and submission handling
 */

'use strict';

// ===== FORM HANDLER =====
const FormHandler = {
  forms: new Map(),
  validators: new Map(),
  
  init() {
    console.log('📝 Form Handler - Initializing...');
    
    this.setupValidators();
    this.initContactForm();
    this.initNewsletterForm();
    this.initQuoteForm();
    this.initCallbackForm();
    this.bindFormEvents();
    
    console.log('✅ Form Handler initialized');
  },
  
  // ===== SETUP VALIDATORS =====
  setupValidators() {
    this.validators.set('email', {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    });
    
    this.validators.set('phone', {
      pattern: /^[\+]?[1-9][\d]{0,15}$/,
      message: 'Please enter a valid phone number'
    });
    
    this.validators.set('url', {
      pattern: /^https?:\/\/.+\..+/,
      message: 'Please enter a valid URL'
    });
    
    this.validators.set('required', {
      test: (value) => value.trim().length > 0,
      message: 'This field is required'
    });
    
    this.validators.set('minLength', {
      test: (value, min) => value.trim().length >= min,
      message: (min) => `Minimum ${min} characters required`
    });
    
    this.validators.set('maxLength', {
      test: (value, max) => value.trim().length <= max,
      message: (max) => `Maximum ${max} characters allowed`
    });
  },
  
  // ===== CONTACT FORM =====
  initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const formConfig = {
      submitUrl: '/api/contact',
      successMessage: 'Thank you! We\'ll get back to you within 24 hours.',
      errorMessage: 'Sorry, something went wrong. Please try again.',
      fields: {
        firstName: { required: true, minLength: 2 },
        lastName: { required: true, minLength: 2 },
        email: { required: true, type: 'email' },
        phone: { type: 'phone' },
        company: { minLength: 2 },
        website: { type: 'url' },
        service: { required: true },
        budget: {},
        message: { required: true, minLength: 10, maxLength: 1000 },
        privacy: { required: true, type: 'checkbox' }
      }
    };
    
    this.forms.set('contact', {
      element: contactForm,
      config: formConfig,
      isSubmitting: false
    });
    
    this.setupFormValidation(contactForm, formConfig);
  },
  
  // ===== NEWSLETTER FORM =====
  initNewsletterForm() {
    const newsletterForms = document.querySelectorAll('#newsletterForm, .newsletter-form');
    
    newsletterForms.forEach(form => {
      const formConfig = {
        submitUrl: '/api/newsletter',
        successMessage: 'Successfully subscribed to our newsletter!',
        errorMessage: 'Subscription failed. Please try again.',
        fields: {
          email: { required: true, type: 'email' }
        }
      };
      
      this.forms.set(`newsletter-${Date.now()}`, {
        element: form,
        config: formConfig,
        isSubmitting: false
      });
      
      this.setupFormValidation(form, formConfig);
    });
  },
  
  // ===== QUOTE FORM =====
  initQuoteForm() {
    const quoteForm = document.getElementById('quoteForm');
    if (!quoteForm) return;
    
    const formConfig = {
      submitUrl: '/api/quote',
      successMessage: 'Quote request submitted! We\'ll send you a detailed proposal soon.',
      errorMessage: 'Failed to submit quote request. Please try again.',
      fields: {
        name: { required: true, minLength: 2 },
        email: { required: true, type: 'email' },
        phone: { required: true, type: 'phone' },
        company: { required: true, minLength: 2 },
        website: { type: 'url' },
        services: { required: true, type: 'checkbox-group' },
        budget: { required: true },
        timeline: { required: true },
        description: { required: true, minLength: 20, maxLength: 2000 }
      }
    };
    
    this.forms.set('quote', {
      element: quoteForm,
      config: formConfig,
      isSubmitting: false
    });
    
    this.setupFormValidation(quoteForm, formConfig);
  },
  
  // ===== CALLBACK FORM =====
  initCallbackForm() {
    const callbackForm = document.getElementById('callbackForm');
    if (!callbackForm) return;
    
    const formConfig = {
      submitUrl: '/api/callback',
      successMessage: 'Callback request submitted! We\'ll call you within 2 business hours.',
      errorMessage: 'Failed to submit callback request. Please try again.',
      fields: {
        name: { required: true, minLength: 2 },
        phone: { required: true, type: 'phone' },
        preferredTime: { required: true },
        timezone: { required: true }
      }
    };
    
    this.forms.set('callback', {
      element: callbackForm,
      config: formConfig,
      isSubmitting: false
    });
    
    this.setupFormValidation(callbackForm, formConfig);
  },
  
  // ===== FORM VALIDATION SETUP =====
  setupFormValidation(form, config) {
    const fields = form.querySelectorAll('input, select, textarea');
    
    fields.forEach(field => {
      // Real-time validation
      field.addEventListener('blur', () => {
        this.validateField(field, config.fields[field.name]);
      });
      
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) {
          this.validateField(field, config.fields[field.name]);
        }
      });
      
      // Character counter for textareas
      if (field.tagName === 'TEXTAREA') {
        this.addCharacterCounter(field, config.fields[field.name]);
      }
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit(form, config);
    });
  },
  
  // ===== FIELD VALIDATION =====
  validateField(field, rules) {
    if (!rules) return true;
    
    const value = field.type === 'checkbox' ? field.checked : field.value;
    const errors = [];
    
    // Required validation
    if (rules.maxLength && value.trim().length > rules.maxLength) {
      const validator = this.validators.get('maxLength');
      errors.push(validator.message(rules.maxLength));
    }
    
    // Display errors or clear them
    if (errors.length > 0) {
      this.showFieldError(field, errors[0]);
      return false;
    } else {
      this.clearFieldError(field);
      return true;
    }
  },
  
  // ===== ERROR DISPLAY =====
  showFieldError(field, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    
    let errorElement = field.parentNode.querySelector('.invalid-feedback');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'invalid-feedback';
      field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  },
  
  clearFieldError(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    
    const errorElement = field.parentNode.querySelector('.invalid-feedback');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  },
  
  // ===== CHARACTER COUNTER =====
  addCharacterCounter(field, rules) {
    if (!rules.maxLength) return;
    
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
      font-size: 0.8rem;
      color: #6b7280;
      text-align: right;
      margin-top: 0.25rem;
    `;
    
    field.parentNode.appendChild(counter);
    
    const updateCounter = () => {
      const remaining = rules.maxLength - field.value.length;
      counter.textContent = `${field.value.length}/${rules.maxLength}`;
      
      if (remaining < 50) {
        counter.style.color = '#ef4444';
      } else if (remaining < 100) {
        counter.style.color = '#f59e0b';
      } else {
        counter.style.color = '#6b7280';
      }
    };
    
    field.addEventListener('input', updateCounter);
    updateCounter();
  },
  
  // ===== FORM SUBMISSION =====
  handleFormSubmit(form, config) {
    const formData = this.forms.get(this.getFormKey(form));
    
    if (formData.isSubmitting) return;
    
    // Validate all fields
    const isValid = this.validateForm(form, config);
    if (!isValid) {
      this.scrollToFirstError(form);
      return;
    }
    
    formData.isSubmitting = true;
    this.showSubmittingState(form);
    
    // Collect form data
    const data = this.collectFormData(form);
    
    // Submit form
    this.submitForm(form, config, data)
      .then(response => {
        this.handleSubmitSuccess(form, config, response);
      })
      .catch(error => {
        this.handleSubmitError(form, config, error);
      })
      .finally(() => {
        formData.isSubmitting = false;
        this.hideSubmittingState(form);
      });
  },
  
  validateForm(form, config) {
    let isValid = true;
    
    Object.keys(config.fields).forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        const fieldValid = this.validateField(field, config.fields[fieldName]);
        if (!fieldValid) isValid = false;
      }
    });
    
    return isValid;
  },
  
  collectFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      if (data[key]) {
        // Handle multiple values (checkboxes)
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }
    
    // Add timestamp and source
    data.timestamp = new Date().toISOString();
    data.source = 'website';
    data.userAgent = navigator.userAgent;
    data.referrer = document.referrer;
    
    return data;
  },
  
  async submitForm(form, config, data) {
    // Since we can't make real API calls, simulate the submission
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success/failure based on email
        if (data.email && data.email.includes('test@')) {
          reject(new Error('Test email address'));
        } else {
          resolve({ success: true, id: Date.now() });
        }
      }, 2000);
    });
  },
  
  handleSubmitSuccess(form, config, response) {
    this.showSuccessMessage(form, config.successMessage);
    this.resetForm(form);
    this.trackFormSubmission(form, 'success');
    
    // Trigger success event
    form.dispatchEvent(new CustomEvent('formSubmitSuccess', {
      detail: { response, config }
    }));
  },
  
  handleSubmitError(form, config, error) {
    console.error('Form submission error:', error);
    this.showErrorMessage(form, config.errorMessage);
    this.trackFormSubmission(form, 'error', error.message);
    
    // Trigger error event
    form.dispatchEvent(new CustomEvent('formSubmitError', {
      detail: { error, config }
    }));
  },
  
  // ===== UI STATE MANAGEMENT =====
  showSubmittingState(form) {
    const submitBtn = form.querySelector('[type="submit"]');
    if (!submitBtn) return;
    
    submitBtn.disabled = true;
    submitBtn.dataset.originalText = submitBtn.textContent;
    
    const loadingText = submitBtn.dataset.loadingText || 'Sending...';
    submitBtn.innerHTML = `
      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      ${loadingText}
    `;
    
    form.classList.add('submitting');
  },
  
  hideSubmittingState(form) {
    const submitBtn = form.querySelector('[type="submit"]');
    if (!submitBtn) return;
    
    submitBtn.disabled = false;
    submitBtn.textContent = submitBtn.dataset.originalText || 'Submit';
    
    form.classList.remove('submitting');
  },
  
  showSuccessMessage(form, message) {
    this.showMessage(form, message, 'success');
  },
  
  showErrorMessage(form, message) {
    this.showMessage(form, message, 'error');
  },
  
  showMessage(form, message, type) {
    // Remove existing messages
    const existingMessages = form.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageElement = document.createElement('div');
    messageElement.className = `form-message alert alert-${type === 'success' ? 'success' : 'danger'}`;
    messageElement.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
      ${message}
    `;
    
    form.insertBefore(messageElement, form.firstChild);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      messageElement.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => {
        messageElement.remove();
      }, 300);
    }, 5000);
    
    // Scroll to message
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },
  
  scrollToFirstError(form) {
    const firstError = form.querySelector('.is-invalid');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstError.focus();
    }
  },
  
  resetForm(form) {
    form.reset();
    
    // Clear validation states
    const fields = form.querySelectorAll('.is-valid, .is-invalid');
    fields.forEach(field => {
      field.classList.remove('is-valid', 'is-invalid');
    });
    
    // Hide error messages
    const errorMessages = form.querySelectorAll('.invalid-feedback');
    errorMessages.forEach(msg => {
      msg.style.display = 'none';
    });
  },
  
  // ===== FORM EVENTS =====
  bindFormEvents() {
    // Auto-save form data (optional)
    this.forms.forEach((formData, key) => {
      if (formData.config.autoSave) {
        this.setupAutoSave(formData.element, key);
      }
    });
    
    // File upload handling
    this.setupFileUploads();
    
    // Dynamic field updates
    this.setupDynamicFields();
  },
  
  setupAutoSave(form, formKey) {
    const fields = form.querySelectorAll('input, select, textarea');
    
    fields.forEach(field => {
      field.addEventListener('input', debounce(() => {
        this.saveFormData(form, formKey);
      }, 1000));
    });
    
    // Load saved data on init
    this.loadFormData(form, formKey);
  },
  
  saveFormData(form, formKey) {
    const data = this.collectFormData(form);
    localStorage.setItem(`form_${formKey}`, JSON.stringify(data));
  },
  
  loadFormData(form, formKey) {
    const savedData = localStorage.getItem(`form_${formKey}`);
    if (!savedData) return;
    
    try {
      const data = JSON.parse(savedData);
      Object.keys(data).forEach(key => {
        const field = form.querySelector(`[name="${key}"]`);
        if (field && field.type !== 'password') {
          field.value = data[key];
        }
      });
    } catch (error) {
      console.warn('Failed to load saved form data:', error);
    }
  },
  
  setupFileUploads() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        this.handleFileUpload(e.target);
      });
    });
  },
  
  handleFileUpload(input) {
    const files = Array.from(input.files);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
    
    files.forEach(file => {
      // Validate file size
      if (file.size > maxSize) {
        this.showFieldError(input, 'File size must be less than 10MB');
        return;
      }
      
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        this.showFieldError(input, 'File type not allowed');
        return;
      }
      
      this.clearFieldError(input);
    });
  },
  
  setupDynamicFields() {
    // Budget range updates
    const budgetSelects = document.querySelectorAll('select[name="budget"]');
    budgetSelects.forEach(select => {
      select.addEventListener('change', (e) => {
        this.updateServiceOptions(e.target);
      });
    });
    
    // Service selection updates
    const serviceCheckboxes = document.querySelectorAll('input[name="services[]"]');
    serviceCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateBudgetEstimate();
      });
    });
  },
  
  updateServiceOptions(budgetSelect) {
    const budget = budgetSelect.value;
    const serviceContainer = budgetSelect.form.querySelector('.services-container');
    
    if (!serviceContainer) return;
    
    // Show/hide premium services based on budget
    const premiumServices = serviceContainer.querySelectorAll('.premium-service');
    premiumServices.forEach(service => {
      if (budget === 'enterprise' || budget === '10000+') {
        service.style.display = 'block';
      } else {
        service.style.display = 'none';
        const checkbox = service.querySelector('input[type="checkbox"]');
        if (checkbox) checkbox.checked = false;
      }
    });
  },
  
  updateBudgetEstimate() {
    const checkboxes = document.querySelectorAll('input[name="services[]"]:checked');
    const estimateElement = document.querySelector('.budget-estimate');
    
    if (!estimateElement) return;
    
    const servicePrices = {
      'seo': 1500,
      'ppc': 2000,
      'social-media': 1200,
      'web-development': 5000,
      'content-marketing': 800,
      'email-marketing': 600
    };
    
    let total = 0;
    checkboxes.forEach(checkbox => {
      total += servicePrices[checkbox.value] || 0;
    });
    
    estimateElement.textContent = `Estimated Budget: ${total.toLocaleString()}/month`;
  },
  
  // ===== ANALYTICS =====
  trackFormSubmission(form, status, error = null) {
    const formName = form.id || form.className || 'unknown';
    
    // Google Analytics (if available)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submit', {
        'form_name': formName,
        'status': status,
        'error': error
      });
    }
    
    // Custom tracking
    console.log('Form Submission:', {
      form: formName,
      status: status,
      error: error,
      timestamp: new Date().toISOString()
    });
  },
  
  // ===== UTILITIES =====
  getFormKey(form) {
    for (let [key, formData] of this.forms) {
      if (formData.element === form) {
        return key;
      }
    }
    return null;
  },
  
  // ===== API METHODS =====
  getForm(formId) {
    return this.forms.get(formId);
  },
  
  validateFormById(formId) {
    const formData = this.forms.get(formId);
    if (!formData) return false;
    
    return this.validateForm(formData.element, formData.config);
  },
  
  submitFormById(formId) {
    const formData = this.forms.get(formId);
    if (!formData) return;
    
    this.handleFormSubmit(formData.element, formData.config);
  },
  
  // ===== CLEANUP =====
  destroy() {
    this.forms.clear();
    this.validators.clear();
  }
};

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// ===== CSS INJECTION =====
const formStyles = `
  .form-message {
    margin-bottom: 1rem;
    animation: fadeIn 0.3s ease-in;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-10px); }
  }
  
  .is-invalid {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
  }
  
  .is-valid {
    border-color: #28a745 !important;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25) !important;
  }
  
  .invalid-feedback {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  
  .character-counter {
    transition: color 0.3s ease;
  }
  
  .submitting {
    pointer-events: none;
    opacity: 0.8;
  }
  
  .spinner-border-sm {
    width: 0.875rem;
    height: 0.875rem;
    border-width: 0.125rem;
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = formStyles;
document.head.appendChild(styleSheet);

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  FormHandler.init();
});

// ===== GLOBAL ACCESS =====
window.FormHandler = FormHandler;required) {
      if (field.type === 'checkbox' && !field.checked) {
        errors.push('This field is required');
      } else if (field.type === 'checkbox-group') {
        const checkboxes = field.form.querySelectorAll(`input[name="${field.name}"]:checked`);
        if (checkboxes.length === 0) {
          errors.push('Please select at least one option');
        }
      } else if (!value || value.trim().length === 0) {
        errors.push('This field is required');
      }
    }
    
    // Skip other validations if field is empty and not required
    if (!value && !rules.required) {
      this.clearFieldError(field);
      return true;
    }
    
    // Type validations
    if (rules.type && value) {
      const validator = this.validators.get(rules.type);
      if (validator && validator.pattern && !validator.pattern.test(value)) {
        errors.push(validator.message);
      }
    }
    
    // Length validations
    if (rules.minLength && value.trim().length < rules.minLength) {
      const validator = this.validators.get('minLength');
      errors.push(validator.message(rules.minLength));
    }
    
    if (rules.maxLength && value.trim().length > rules.maxLength) {
      const validator = this.validators.get('maxLength');
      errors.push(validator.message(rules.maxLength));
    }
    
    // Display errors or clear them
    if (errors.length > 0) {
      this.showFieldError(field, errors[0]);
      return false;
    } else {
      this.clearFieldError(field);
      return true;
    }
  },
  
  // ===== ERROR DISPLAY =====
  showFieldError(field, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    
    let errorElement = field.parentNode.querySelector('.invalid-feedback');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'invalid-feedback';
      field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  },
  
  clearFieldError(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    
    const errorElement = field.parentNode.querySelector('.invalid-feedback');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  },
  
  // ===== CHARACTER COUNTER =====
  addCharacterCounter(field, rules) {
    if (!rules.maxLength) return;
    
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
      font-size: 0.8rem;
      color: #6b7280;
      text-align: right;
      margin-top: 0.25rem;
    `;
    
    field.parentNode.appendChild(counter);
    
    const updateCounter = () => {
      const remaining = rules.maxLength - field.value.length;
      counter.textContent = `${field.value.length}/${rules.maxLength}`;
      
      if (remaining < 50) {
        counter.style.color = '#ef4444';
      } else if (remaining < 100) {
        counter.style.color = '#f59e0b';
      } else {
        counter.style.color = '#6b7280';
      }
    };
    
    field.addEventListener('input', updateCounter);
    updateCounter();
  },
  
  // ===== FORM SUBMISSION =====
  handleFormSubmit(form, config) {
    const formData = this.forms.get(this.getFormKey(form));
    
    if (formData.isSubmitting) return;
    
    // Validate all fields
    const isValid = this.validateForm(form, config);
    if (!isValid) {
      this.scrollToFirstError(form);
      return;
    }
    
    formData.isSubmitting = true;
    this.showSubmittingState(form);
    
    // Collect form data
    const data = this.collectFormData(form);
    
    // Submit form
    this.submitForm(form, config, data)
      .then(response => {
        this.handleSubmitSuccess(form, config, response);
      })
      .catch(error => {
        this.handleSubmitError(form, config, error);
      })
      .finally(() => {
        formData.isSubmitting = false;
        this.hideSubmittingState(form);
      });   
    },  
    