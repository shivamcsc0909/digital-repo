/**
 * Digital Marketing Agency - Animation Controllers
 * Advanced animations and interactive effects
 */

'use strict';

// ===== ANIMATION CONTROLLER =====
const AnimationController = {
  observers: [],
  particles: [],
  isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  
  init() {
    console.log('🎬 Animation Controller - Initializing...');
    
    if (this.isReducedMotion) {
      console.log('⚡ Reduced motion preference detected - using minimal animations');
      return;
    }
    
    this.initScrollAnimations();
    this.initHoverEffects();
    this.initParticleEffects();
    this.initFloatingElements();
    this.initTextAnimations();
    this.initImageAnimations();
    this.initCardAnimations();
    this.initButtonAnimations();
    this.initServiceAnimations();
    this.initTimelineAnimations();
    this.initCounterAnimations();
    this.initProgressAnimations();
    this.initParallaxEffects();
    this.initMorphingEffects();
    
    console.log('✅ Animation Controller initialized');
  },
  
  // ===== SCROLL ANIMATIONS =====
  initScrollAnimations() {
    const animateElements = document.querySelectorAll('[data-animate]');
    
    if (animateElements.length === 0) return;
    
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animation = element.getAttribute('data-animate');
          const delay = element.getAttribute('data-delay') || 0;
          
          setTimeout(() => {
            this.triggerAnimation(element, animation);
          }, parseInt(delay));
          
          scrollObserver.unobserve(element);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(el => {
      scrollObserver.observe(el);
    });
    
    this.observers.push(scrollObserver);
  },
  
  triggerAnimation(element, animation) {
    element.classList.add('animate-' + animation);
    
    // Custom animations
    switch (animation) {
      case 'slide-up':
        this.slideUp(element);
        break;
      case 'slide-down':
        this.slideDown(element);
        break;
      case 'slide-left':
        this.slideLeft(element);
        break;
      case 'slide-right':
        this.slideRight(element);
        break;
      case 'scale-in':
        this.scaleIn(element);
        break;
      case 'fade-in':
        this.fadeIn(element);
        break;
      case 'rotate-in':
        this.rotateIn(element);
        break;
      case 'bounce-in':
        this.bounceIn(element);
        break;
    }
  },
  
  // ===== ANIMATION METHODS =====
  slideUp(element) {
    element.style.transform = 'translateY(50px)';
    element.style.opacity = '0';
    element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    requestAnimationFrame(() => {
      element.style.transform = 'translateY(0)';
      element.style.opacity = '1';
    });
  },
  
  slideDown(element) {
    element.style.transform = 'translateY(-50px)';
    element.style.opacity = '0';
    element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    requestAnimationFrame(() => {
      element.style.transform = 'translateY(0)';
      element.style.opacity = '1';
    });
  },
  
  slideLeft(element) {
    element.style.transform = 'translateX(50px)';
    element.style.opacity = '0';
    element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    requestAnimationFrame(() => {
      element.style.transform = 'translateX(0)';
      element.style.opacity = '1';
    });
  },
  
  slideRight(element) {
    element.style.transform = 'translateX(-50px)';
    element.style.opacity = '0';
    element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    requestAnimationFrame(() => {
      element.style.transform = 'translateX(0)';
      element.style.opacity = '1';
    });
  },
  
  scaleIn(element) {
    element.style.transform = 'scale(0.8)';
    element.style.opacity = '0';
    element.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    
    requestAnimationFrame(() => {
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
    });
  },
  
  fadeIn(element) {
    element.style.opacity = '0';
    element.style.transition = 'opacity 1s ease-out';
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  },
  
  rotateIn(element) {
    element.style.transform = 'rotate(-180deg) scale(0.8)';
    element.style.opacity = '0';
    element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    requestAnimationFrame(() => {
      element.style.transform = 'rotate(0deg) scale(1)';
      element.style.opacity = '1';
    });
  },
  
  bounceIn(element) {
    element.style.transform = 'scale(0.3)';
    element.style.opacity = '0';
    element.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    
    requestAnimationFrame(() => {
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
    });
  },
  
  // ===== HOVER EFFECTS =====
  initHoverEffects() {
    // Magnetic buttons
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => this.magneticEffect(e, element));
      element.addEventListener('mouseleave', () => this.resetMagnetic(element));
    });
    
    // Tilt cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => this.tiltEffect(e, card));
      card.addEventListener('mouseleave', () => this.resetTilt(card));
    });
    
    // Glitch effect
    const glitchElements = document.querySelectorAll('.glitch-effect');
    
    glitchElements.forEach(element => {
      element.addEventListener('mouseenter', () => this.glitchEffect(element));
    });
  },
  
  magneticEffect(e, element) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    element.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  },
  
  resetMagnetic(element) {
    element.style.transform = 'translate(0px, 0px)';
  },
  
  tiltEffect(e, element) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / centerY * -10;
    const rotateY = (x - centerX) / centerX * 10;
    
  tiltEffect(e, element) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / centerY * -10;
    const rotateY = (x - centerX) / centerX * 10;
    
    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  },
  
  resetTilt(element) {
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  },
  
  glitchEffect(element) {
    element.classList.add('glitching');
    setTimeout(() => {
      element.classList.remove('glitching');
    }, 500);
  },
  
  // ===== PARTICLE EFFECTS =====
  initParticleEffects() {
    const particleContainers = document.querySelectorAll('.particles-container');
    
    particleContainers.forEach(container => {
      this.createParticleSystem(container);
    });
  },
  
  createParticleSystem(container) {
    const particleCount = parseInt(container.getAttribute('data-particle-count')) || 50;
    const particleColor = container.getAttribute('data-particle-color') || '#2563eb';
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: ${particleColor};
        border-radius: 50%;
        pointer-events: none;
        animation: float ${3 + Math.random() * 4}s infinite ease-in-out;
        animation-delay: ${Math.random() * 2}s;
      `;
      
      this.randomizeParticle(particle, container);
      container.appendChild(particle);
      this.particles.push(particle);
    }
  },
  
  randomizeParticle(particle, container) {
    const x = Math.random() * container.offsetWidth;
    const y = Math.random() * container.offsetHeight;
    
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.animationDuration = (3 + Math.random() * 4) + 's';
  },
  
  // ===== FLOATING ELEMENTS =====
  initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
      const amplitude = parseInt(element.getAttribute('data-amplitude')) || 20;
      const speed = parseFloat(element.getAttribute('data-speed')) || 1;
      
      this.animateFloating(element, amplitude, speed, index * 0.5);
    });
  },
  
  animateFloating(element, amplitude, speed, delay) {
    let start = performance.now() + delay * 1000;
    
    const animate = (currentTime) => {
      const elapsed = (currentTime - start) / 1000;
      const y = Math.sin(elapsed * speed) * amplitude;
      
      element.style.transform = `translateY(${y}px)`;
      requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  },
  
  // ===== TEXT ANIMATIONS =====
  initTextAnimations() {
    this.initTypewriter();
    this.initTextReveal();
    this.initSplitText();
  },
  
  initTypewriter() {
    const typewriterElements = document.querySelectorAll('.typewriter-effect');
    
    typewriterElements.forEach(element => {
      const text = element.textContent;
      const speed = parseInt(element.getAttribute('data-speed')) || 50;
      
      element.textContent = '';
      element.style.borderRight = '2px solid currentColor';
      
      this.typewriterEffect(element, text, speed);
    });
  },
  
  typewriterEffect(element, text, speed) {
    let i = 0;
    const timer = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;
      
      if (i > text.length) {
        clearInterval(timer);
        this.blinkCursor(element);
      }
    }, speed);
  },
  
  blinkCursor(element) {
    setInterval(() => {
      element.style.borderRightColor = 
        element.style.borderRightColor === 'transparent' ? 'currentColor' : 'transparent';
    }, 500);
  },
  
  initTextReveal() {
    const revealElements = document.querySelectorAll('.text-reveal-effect');
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.textRevealAnimation(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
    this.observers.push(revealObserver);
  },
  
  textRevealAnimation(element) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #2563eb;
      transform: translateX(-100%);
      z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(overlay);
    
    // First animation - reveal
    overlay.style.transition = 'transform 0.8s cubic-bezier(0.77, 0, 0.175, 1)';
    overlay.style.transform = 'translateX(0%)';
    
    setTimeout(() => {
      // Second animation - hide
      overlay.style.transform = 'translateX(100%)';
      
      setTimeout(() => {
        overlay.remove();
      }, 800);
    }, 400);
  },
  
  initSplitText() {
    const splitTextElements = document.querySelectorAll('.split-text');
    
    splitTextElements.forEach(element => {
      this.splitTextAnimation(element);
    });
  },
  
  splitTextAnimation(element) {
    const text = element.textContent;
    const words = text.split(' ');
    
    element.innerHTML = '';
    
    words.forEach((word, index) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.overflow = 'hidden';
      
      const letters = word.split('');
      letters.forEach((letter, letterIndex) => {
        const letterSpan = document.createElement('span');
        letterSpan.textContent = letter;
        letterSpan.style.display = 'inline-block';
        letterSpan.style.transform = 'translateY(100%)';
        letterSpan.style.transition = `transform 0.6s cubic-bezier(0.77, 0, 0.175, 1) ${(index * 0.1 + letterIndex * 0.02)}s`;
        
        wordSpan.appendChild(letterSpan);
      });
      
      // Add space after word
      if (index < words.length - 1) {
        const space = document.createElement('span');
        space.innerHTML = '&nbsp;';
        wordSpan.appendChild(space);
      }
      
      element.appendChild(wordSpan);
    });
    
    // Trigger animation when element is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const letters = entry.target.querySelectorAll('span span');
          letters.forEach(letter => {
            letter.style.transform = 'translateY(0%)';
          });
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(element);
    this.observers.push(observer);
  },
  
  // ===== IMAGE ANIMATIONS =====
  initImageAnimations() {
    this.initImageReveal();
    this.initImageParallax();
    this.initImageHover();
  },
  
  initImageReveal() {
    const imageRevealElements = document.querySelectorAll('.image-reveal');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.imageRevealAnimation(entry.target);
          imageObserver.unobserve(entry.target);
        }
      });
    });
    
    imageRevealElements.forEach(el => imageObserver.observe(el));
    this.observers.push(imageObserver);
  },
  
  imageRevealAnimation(element) {
    const img = element.querySelector('img');
    if (!img) return;
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, #2563eb, #10b981);
      z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(overlay);
    
    img.style.transform = 'scale(1.2)';
    img.style.transition = 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    setTimeout(() => {
      overlay.style.transition = 'transform 1s cubic-bezier(0.77, 0, 0.175, 1)';
      overlay.style.transform = 'translateX(100%)';
      img.style.transform = 'scale(1)';
      
      setTimeout(() => {
        overlay.remove();
      }, 1000);
    }, 200);
  },
  
  initImageParallax() {
    const parallaxImages = document.querySelectorAll('.parallax-image');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxImages.forEach(img => {
        const rate = scrolled * -0.3;
        img.style.transform = `translate3d(0, ${rate}px, 0)`;
      });
    });
  },
  
  initImageHover() {
    const hoverImages = document.querySelectorAll('.hover-zoom');
    
    hoverImages.forEach(container => {
      const img = container.querySelector('img');
      if (!img) return;
      
      container.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.1)';
      });
      
      container.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
      });
    });
  },
  
  // ===== CARD ANIMATIONS =====
  initCardAnimations() {
    const cards = document.querySelectorAll('.animated-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.cardHoverAnimation(card, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.cardHoverAnimation(card, false);
      });
    });
  },
  
  cardHoverAnimation(card, isHover) {
    const shadow = isHover ? '0 20px 40px rgba(0,0,0,0.15)' : '0 4px 6px rgba(0,0,0,0.1)';
    const transform = isHover ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)';
    
    card.style.boxShadow = shadow;
    card.style.transform = transform;
  },
  
  // ===== BUTTON ANIMATIONS =====
  initButtonAnimations() {
    this.initPulseButtons();
    this.initWaveButtons();
    this.initMorphButtons();
  },
  
  initPulseButtons() {
    const pulseButtons = document.querySelectorAll('.pulse-btn');
    
    pulseButtons.forEach(btn => {
      setInterval(() => {
        btn.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
          btn.style.animation = '';
        }, 600);
      }, 3000);
    });
  },
  
  initWaveButtons() {
    const waveButtons = document.querySelectorAll('.wave-btn');
    
    waveButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const wave = document.createElement('span');
        wave.style.cssText = `
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          width: ${size}px;
          height: ${size}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: wave-effect 0.6s ease-out;
          pointer-events: none;
        `;
        
        btn.appendChild(wave);
        
        setTimeout(() => {
          wave.remove();
        }, 600);
      });
    });
  },
  
  initMorphButtons() {
    const morphButtons = document.querySelectorAll('.morph-btn');
    
    morphButtons.forEach(btn => {
      const originalText = btn.textContent;
      const hoverText = btn.getAttribute('data-hover-text') || originalText;
      
      btn.addEventListener('mouseenter', () => {
        btn.textContent = hoverText;
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.textContent = originalText;
      });
    });
  },
  
  // ===== SERVICE ANIMATIONS =====
  initServiceAnimations() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach((card, index) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              this.serviceCardAnimation(entry.target);
            }, index * 200);
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(card);
      this.observers.push(observer);
    });
  },
  
  serviceCardAnimation(card) {
    const icon = card.querySelector('.service-icon');
    const title = card.querySelector('.service-title');
    const description = card.querySelector('.service-description');
    
    if (icon) {
      icon.style.animation = 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    }
    
    if (title) {
      setTimeout(() => {
        title.style.animation = 'fadeInUp 0.6s ease-out';
      }, 200);
    }
    
    if (description) {
      setTimeout(() => {
        description.style.animation = 'fadeInUp 0.6s ease-out';
      }, 400);
    }
  },
  
  // ===== TIMELINE ANIMATIONS =====
  initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.animation = 'slideInLeft 0.8s ease-out forwards';
            }, index * 300);
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(item);
      this.observers.push(observer);
    });
  },
  
  // ===== COUNTER ANIMATIONS =====
  initCounterAnimations() {
    const counters = document.querySelectorAll('.animated-counter');
    
    counters.forEach(counter => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateNumber(entry.target);
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(counter);
      this.observers.push(observer);
    });
  },
  
  animateNumber(element) {
    const target = parseInt(element.getAttribute('data-target')) || 0;
    const duration = parseInt(element.getAttribute('data-duration')) || 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toLocaleString();
    }, 16);
  },
  
  // ===== PROGRESS ANIMATIONS =====
  initProgressAnimations() {
    const progressBars = document.querySelectorAll('.animated-progress');
    
    progressBars.forEach(bar => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateProgress(entry.target);
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(bar);
      this.observers.push(observer);
    });
  },
  
  animateProgress(progressBar) {
    const target = parseInt(progressBar.getAttribute('data-progress')) || 0;
    const duration = 2000;
    let current = 0;
    
    const timer = setInterval(() => {
      current += 1;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      progressBar.style.width = current + '%';
    }, duration / target);
  },
  
  // ===== PARALLAX EFFECTS =====
  initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    });
  },
  
  // ===== MORPHING EFFECTS =====
  initMorphingEffects() {
    const morphShapes = document.querySelectorAll('.morph-shape');
    
    morphShapes.forEach(shape => {
      let morphTimer;
      
      const startMorphing = () => {
        morphTimer = setInterval(() => {
          const randomPath = this.generateRandomPath();
          shape.style.clipPath = randomPath;
        }, 2000);
      };
      
      const stopMorphing = () => {
        clearInterval(morphTimer);
        shape.style.clipPath = '';
      };
      
      shape.addEventListener('mouseenter', startMorphing);
      shape.addEventListener('mouseleave', stopMorphing);
    });
  },
  
  generateRandomPath() {
    const points = [];
    for (let i = 0; i < 6; i++) {
      points.push(`${Math.random() * 100}% ${Math.random() * 100}%`);
    }
    return `polygon(${points.join(', ')})`;
  },
  
  // ===== CLEANUP =====
  destroy() {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers = [];
    this.particles = [];
  }
};

// ===== CSS ANIMATIONS INJECTION =====
const animationStyles = `
  @keyframes wave-effect {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @keyframes slideInLeft {
    from {
      transform: translateX(-100px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .glitching {
    animation: glitch 0.5s infinite;
  }
  
  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  AnimationController.init();
});

// ===== CLEANUP ON UNLOAD =====
window.addEventListener('beforeunload', () => {
  AnimationController.destroy();
});

// Export for global access
window.AnimationController = AnimationController;