// Performance optimization
'use strict';

// Core game functionality
class CookieGame {
  constructor() {
    this.cookies = 0;
    this.multiplier = 1;
    this.init();
  }

  init() {
    // Initialize performance monitoring
    this.initPerformanceMonitoring();
    
    // Initialize lazy loading
    this.initLazyLoading();
    
    // Initialize service worker
    this.initServiceWorker();
    
    // Add event listeners
    this.addEventListeners();
  }

  initPerformanceMonitoring() {
    // Core Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Report to analytics
          console.log(`${entry.name}: ${entry.value}`);
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input-delay', 'cumulative-layout-shift'] });
    }
  }

  initLazyLoading() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  async initServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/service-worker.js');
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    }
  }

  addEventListeners() {
    // Cookie click handler with debounce
    const cookieElement = document.querySelector('.cookie');
    if (cookieElement) {
      let timeout;
      cookieElement.addEventListener('click', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.cookies += this.multiplier;
          this.updateDisplay();
        }, 50);
      });
    }

    // Save game state periodically
    setInterval(() => this.saveGame(), 60000);
  }

  updateDisplay() {
    const counter = document.querySelector('.cookie-counter');
    if (counter) {
      counter.textContent = this.formatNumber(this.cookies);
      // Update page title for better SEO
      document.title = `${this.formatNumber(this.cookies)} Cookies - Cookie Clicker`;
    }
  }

  formatNumber(num) {
    return new Intl.NumberFormat().format(num);
  }

  saveGame() {
    localStorage.setItem('cookieGame', JSON.stringify({
      cookies: this.cookies,
      multiplier: this.multiplier,
      lastSave: Date.now()
    }));
  }

  loadGame() {
    const savedGame = localStorage.getItem('cookieGame');
    if (savedGame) {
      const { cookies, multiplier } = JSON.parse(savedGame);
      this.cookies = cookies;
      this.multiplier = multiplier;
      this.updateDisplay();
    }
  }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const game = new CookieGame();
  game.loadGame();
}); 