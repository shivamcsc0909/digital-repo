/**
 * Digital Marketing Agency - Utility Functions
 * Common helper functions and utilities
 */

'use strict';

// ===== UTILITY NAMESPACE =====
const Utils = {
  // Browser and device detection
  browser: {},
  device: {},
  
  // Performance monitoring
  performance: {
    startTime: performance.now(),
    metrics: {}
  },
  
  // Cache for expensive operations
  cache: new Map(),
  
  init() {
    console.log('🔧 Utils - Initializing...');
    
    this.detectBrowser();
    this.detectDevice();
    this.setupPerformanceMonitoring();
    this.initServiceWorker();
    
    console.log('✅ Utils initialized');
  }
};

// ===== BROWSER DETECTION =====
Utils.detectBrowser = function() {
  const userAgent = navigator.userAgent;
  
  this.browser = {
    chrome: /chrome/i.test(userAgent) && !/edge/i.test(userAgent),
    firefox: /firefox/i.test(userAgent),
    safari: /safari/i.test(userAgent) && !/chrome/i.test(userAgent),
    edge: /edge/i.test(userAgent) || /edg/i.test(userAgent),
    ie: /msie|trident/i.test(userAgent),
    opera: /opera|opr/i.test(userAgent)
  };
  
  // Add browser class to body
  Object.keys(this.browser).forEach(browser => {
    if (this.browser[browser]) {
      document.body.classList.add(`browser-${browser}`);
    }
  });
};

// ===== DEVICE DETECTION =====
Utils.detectDevice = function() {
  const userAgent = navigator.userAgent;
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  this.device = {
    mobile: /android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || viewport.width <= 768,
    tablet: /ipad|android(?!.*mobile)|tablet/i.test(userAgent) || (viewport.width > 768 && viewport.width <= 1024),
    desktop: viewport.width > 1024,
    touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    ios: /iphone|ipad|ipod/i.test(userAgent),
    android: /android/i.test(userAgent),
    retina: window.devicePixelRatio > 1
  };
  
  // Add device classes to body
  Object.keys(this.device).forEach(device => {
    if (this.device[device]) {
      document.body.classList.add(`device-${device}`);
    }
  });
};

// ===== PERFORMANCE MONITORING =====
Utils.setupPerformanceMonitoring = function() {
  // Monitor page load time
  window.addEventListener('load', () => {
    this.performance.metrics.pageLoad = performance.now() - this.performance.startTime;
  });
  
  // Monitor DOM content loaded time
  document.addEventListener('DOMContentLoaded', () => {
    this.performance.metrics.domReady = performance.now() - this.performance.startTime;
  });
  
  // Monitor largest contentful paint
  if ('PerformanceObserver' in window) {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.performance.metrics.lcp = entry.startTime;
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Monitor first input delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.performance.metrics.fid = entry.processingStart - entry.startTime;
      }
    }).observe({ entryTypes: ['first-input'] });
  }
};

// ===== SERVICE WORKER =====
Utils.initServiceWorker = function() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registered:', registration.scope);
        })
        .catch(error => {
          console.log('ServiceWorker registration failed:', error);
        });
    });
  }
};

// ===== DOM UTILITIES =====
Utils.dom = {
  // Query selector with caching
  $(selector, useCache = true) {
    if (useCache && Utils.cache.has(selector)) {
      return Utils.cache.get(selector);
    }
    
    const element = document.querySelector(selector);
    if (useCache && element) {
      Utils.cache.set(selector, element);
    }
    
    return element;
  },
  
  // Query selector all
  $$(selector) {
    return Array.from(document.querySelectorAll(selector));
  },
  
  // Create element with attributes
  create(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    Object.keys(attributes).forEach(key => {
      if (key === 'className') {
        element.className = attributes[key];
      } else if (key === 'dataset') {
        Object.assign(element.dataset, attributes[key]);
      } else {
        element.setAttribute(key, attributes[key]);
      }
    });
    
    if (content) {
      element.innerHTML = content;
    }
    
    return element;
  },
  
  // Check if element is in viewport
  isInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
      rect.top >= -threshold &&
      rect.left >= -threshold &&
      rect.bottom <= windowHeight + threshold &&
      rect.right <= windowWidth + threshold
    );
  },
  
  // Get element's position relative to document
  getPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset,
      width: rect.width,
      height: rect.height
    };
  },
  
  // Smooth scroll to element
  scrollTo(element, offset = 0, duration = 800) {
    const targetPosition = this.getPosition(element).top - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = Utils.easing.easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    requestAnimationFrame(animation);
  },
  
  // Add class with animation
  addClass(element, className, duration = 300) {
    element.style.transition = `all ${duration}ms ease`;
    element.classList.add(className);
  },
  
  // Remove class with animation
  removeClass(element, className, duration = 300) {
    element.style.transition = `all ${duration}ms ease`;
    element.classList.remove(className);
  },
  
  // Toggle class
  toggleClass(element, className) {
    element.classList.toggle(className);
  },
  
  // Get computed style
  getStyle(element, property) {
    return window.getComputedStyle(element)[property];
  },
  
  // Set multiple styles
  setStyles(element, styles) {
    Object.assign(element.style, styles);
  }
};

// ===== ANIMATION & EASING =====
Utils.easing = {
  linear: (t, b, c, d) => c * t / d + b,
  easeInQuad: (t, b, c, d) => c * (t /= d) * t + b,
  easeOutQuad: (t, b, c, d) => -c * (t /= d) * (t - 2) + b,
  easeInOutQuad: (t, b, c, d) => {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * (--t * (t - 2) - 1) + b;
  },
  easeInCubic: (t, b, c, d) => c * (t /= d) * t * t + b,
  easeOutCubic: (t, b, c, d) => c * ((t = t / d - 1) * t * t + 1) + b,
  easeInOutCubic: (t, b, c, d) => {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  },
  easeOutElastic: (t, b, c, d) => {
    let s = 1.70158;
    let p = 0;
    let a = c;
    if (t === 0) return b;
    if ((t /= d) === 1) return b + c;
    if (!p) p = d * 0.3;
    if (a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
  }
};

// ===== STRING UTILITIES =====
Utils.string = {
  // Capitalize first letter
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  // Convert to camelCase
  camelCase(str) {
    return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
  },
  
  // Convert to kebab-case
  kebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  },
  
  // Truncate string
  truncate(str, length, suffix = '...') {
    if (str.length <= length) return str;
    return str.substring(0, length) + suffix;
  },
  
  // Remove HTML tags
  stripHtml(str) {
    return str.replace(/<[^>]*>/g, '');
  },
  
  // Slugify string
  slugify(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
  
  // Escape HTML
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },
  
  // Generate random string
  random(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};

// ===== NUMBER UTILITIES =====
Utils.number = {
  // Format number with commas
  format(num, decimals = 0) {
    return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  
  // Convert to percentage
  toPercentage(num, decimals = 1) {
    return (num * 100).toFixed(decimals) + '%';
  },
  
  // Clamp number between min and max
  clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  },
  
  // Linear interpolation
  lerp(start, end, factor) {
    return start + (end - start) * factor;
  },
  
  // Map number from one range to another
  map(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  },
  
  // Generate random number between min and max
  random(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
  },
  
  // Round to nearest multiple
  roundToNearest(num, multiple) {
    return Math.round(num / multiple) * multiple;
  }
};

// ===== DATE UTILITIES =====
Utils.date = {
  // Format date
  format(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  },
  
  // Get relative time (e.g., "2 hours ago")
  timeAgo(date) {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return this.format(date, 'MMM DD, YYYY');
  },
  
  // Check if date is today
  isToday(date) {
    const today = new Date();
    const checkDate = new Date(date);
    return today.toDateString() === checkDate.toDateString();
  },
  
  // Add days to date
  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
};

// ===== URL UTILITIES =====
Utils.url = {
  // Get URL parameters
  getParams() {
    const params = {};
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams) {
      params[key] = value;
    }
    return params;
  },
  
  // Get specific parameter
  getParam(name, defaultValue = null) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name) || defaultValue;
  },
  
  // Update URL parameter without reload
  setParam(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
  },
  
  // Remove URL parameter
  removeParam(name) {
    const url = new URL(window.location);
    url.searchParams.delete(name);
    window.history.pushState({}, '', url);
  },
  
  // Build query string from object
  buildQuery(params) {
    return Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
  }
};

// ===== STORAGE UTILITIES =====
Utils.storage = {
  // Local storage with JSON support
  set(key, value, expiry = null) {
    const item = {
      value: value,
      expiry: expiry ? Date.now() + expiry : null
    };
    localStorage.setItem(key, JSON.stringify(item));
  },
  
  get(key, defaultValue = null) {
    try {
      const item = JSON.parse(localStorage.getItem(key));
      if (!item) return defaultValue;
      
      if (item.expiry && Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return defaultValue;
      }
      
      return item.value;
    } catch (e) {
      return defaultValue;
    }
  },
  
  remove(key) {
    localStorage.removeItem(key);
  },
  
  clear() {
    localStorage.clear();
  },
  
  // Session storage
  session: {
    set(key, value) {
      sessionStorage.setItem(key, JSON.stringify(value));
    },
    
    get(key, defaultValue = null) {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        return defaultValue;
      }
    },
    
    remove(key) {
      sessionStorage.removeItem(key);
    },
    
    clear() {
      sessionStorage.clear();
    }
  }
};

// ===== VALIDATION UTILITIES =====
Utils.validate = {
  email(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },
  
  phone(phone) {
    const regex = /^[\+]?[1-9][\d]{0,15}$/;
    return regex.test(phone.replace(/\s/g, ''));
  },
  
  url(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  creditCard(number) {
    // Luhn algorithm
    const digits = number.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  },
  
  required(value) {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },
  
  minLength(value, min) {
    return value && value.length >= min;
  },
  
  maxLength(value, max) {
    return !value || value.length <= max;
  },
  
  pattern(value, regex) {
    return !value || regex.test(value);
  }
};

// ===== ASYNC UTILITIES =====
Utils.async = {
  // Debounce function
  debounce(func, wait, immediate = false) {
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
  },
  
  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // Sleep function
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  // Retry function with exponential backoff
  async retry(fn, maxAttempts = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxAttempts) throw error;
        await this.sleep(delay * Math.pow(2, attempt - 1));
      }
    }
  },
  
  // Timeout wrapper
  timeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), ms)
      )
    ]);
  }
};

// ===== EVENT UTILITIES =====
Utils.events = {
  // Custom event emitter
  emitter: {
    events: {},
    
    on(event, callback) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(callback);
    },
    
    off(event, callback) {
      if (this.events[event]) {
        this.events[event] = this.events[event].filter(cb => cb !== callback);
      }
    },
    
    emit(event, data) {
      if (this.events[event]) {
        this.events[event].forEach(callback => callback(data));
      }
    },
    
    once(event, callback) {
      const wrapper = (data) => {
        callback(data);
        this.off(event, wrapper);
      };
      this.on(event, wrapper);
    }
  },
  
  // Wait for event
  waitFor(element, event) {
    return new Promise(resolve => {
      element.addEventListener(event, resolve, { once: true });
    });
  },
  
  // Delegate event
  delegate(parent, selector, event, callback) {
    parent.addEventListener(event, (e) => {
      if (e.target.matches(selector)) {
        callback(e);
      }
    });
  }
};

// ===== COPY TO CLIPBOARD =====
Utils.clipboard = {
  async copy(text) {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
      }
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  },
  
  async read() {
    if (navigator.clipboard) {
      try {
        return await navigator.clipboard.readText();
      } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
        return null;
      }
    }
    return null;
  }
};

// ===== NOTIFICATION UTILITIES =====
Utils.notify = {
  // Show toast notification
  toast(message, type = 'info', duration = 3000) {
    const toast = Utils.dom.create('div', {
      className: `toast toast-${type}`,
      dataset: { duration }
    }, `
      <div class="toast-content">
        <i class="toast-icon fas fa-${this.getIcon(type)}"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `);
    
    // Add to page
    let container = Utils.dom.$('.toast-container');
    if (!container) {
      container = Utils.dom.create('div', { className: 'toast-container' });
      document.body.appendChild(container);
    }
    
    container.appendChild(toast);
    
    // Show animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    
    // Auto remove
    setTimeout(() => {
      this.removeToast(toast);
    }, duration);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
      this.removeToast(toast);
    });
    
    return toast;
  },
  
  removeToast(toast) {
    toast.classList.add('hide');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  },
  
  getIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  },
  
  // Show browser notification
  async push(title, options = {}) {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return null;
    }
    
    if (Notification.permission === 'granted') {
      return new Notification(title, options);
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        return new Notification(title, options);
      }
    }
    
    return null;
  }
};

// ===== FORM UTILITIES =====
Utils.form = {
  // Serialize form data
  serialize(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }
    
    return data;
  },
  
  // Reset form with animation
  reset(form, animate = true) {
    if (animate) {
      form.style.opacity = '0.5';
      setTimeout(() => {
        form.reset();
        form.style.opacity = '1';
      }, 150);
    } else {
      form.reset();
    }
  },
  
  // Validate form
  validate(form, rules) {
    const errors = {};
    
    Object.keys(rules).forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (!field) return;
      
      const value = field.value;
      const fieldRules = rules[fieldName];
      
      fieldRules.forEach(rule => {
        if (typeof rule === 'function') {
          const result = rule(value, field);
          if (result !== true) {
            if (!errors[fieldName]) errors[fieldName] = [];
            errors[fieldName].push(result);
          }
        }
      });
    });
    
    return Object.keys(errors).length === 0 ? null : errors;
  }
};

// ===== ANALYTICS UTILITIES =====
Utils.analytics = {
  // Track event
  track(event, data = {}) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', event, data);
    }
    
    // Custom tracking
    console.log('Analytics Event:', event, data);
  },
  
  // Track page view
  pageView(page = window.location.pathname) {
    this.track('page_view', { page_path: page });
  },
  
  // Track user interaction
  interaction(element, action = 'click') {
    this.track('user_interaction', {
      element_type: element.tagName.toLowerCase(),
      element_id: element.id || '',
      element_class: element.className || '',
      action: action
    });
  }
};

// ===== CSS INJECTION FOR UTILITIES =====
const utilsStyles = `
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .toast {
    min-width: 300px;
    padding: 0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  .toast.show {
    transform: translateX(0);
    opacity: 1;
  }
  
  .toast.hide {
    transform: translateX(100%);
    opacity: 0;
  }
  
  .toast-content {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    gap: 10px;
  }
  
  .toast-success {
    background: #d4edda;
    color: #155724;
    border-left: 4px solid #28a745;
  }
  
  .toast-error {
    background: #f8d7da;
    color: #721c24;
    border-left: 4px solid #dc3545;
  }
  
  .toast-warning {
    background: #fff3cd;
    color: #856404;
    border-left: 4px solid #ffc107;
  }
  
  .toast-info {
    background: #d1ecf1;
    color: #0c5460;
    border-left: 4px solid #17a2b8;
  }
  
  .toast-message {
    flex: 1;
  }
  
  .toast-close {
    background: none;
    border: none;
    font-size: 14px;
    cursor: pointer;
    opacity: 0.7;
    padding: 0;
    margin: 0;
  }
  
  .toast-close:hover {
    opacity: 1;
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = utilsStyles;
document.head.appendChild(styleSheet);

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  Utils.init();
});

// ===== GLOBAL ACCESS =====
window.Utils = Utils;

// ===== EXPORT INDIVIDUAL UTILITIES =====
window.$ = Utils.dom.$;
window.$ = Utils.dom.$;