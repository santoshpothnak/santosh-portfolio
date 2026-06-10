document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Dynamic Copyright Year
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // 3. Mobile Navigation Drawer Toggle
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const openIcon = document.querySelector('.menu-icon-open');
  const closeIcon = document.querySelector('.menu-icon-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu() {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    
    if (!isExpanded) {
      // Open Menu
      mobileDrawer.style.display = 'block';
      mobileDrawer.setAttribute('aria-hidden', 'false');
      setTimeout(() => mobileDrawer.classList.add('active'), 10);
      
      openIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // Stop scrolling background
    } else {
      // Close Menu
      mobileDrawer.classList.remove('active');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      setTimeout(() => mobileDrawer.style.display = 'none', 300);
      
      openIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
      document.body.style.overflow = 'auto'; // Restore scrolling
    }
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking links
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileToggle.getAttribute('aria-expanded') === 'true') {
          toggleMobileMenu();
        }
      });
    });
  }

  // 4. Smooth Scroll Active Nav Link Highlight
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 150) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // 5. Scroll-driven Reveal Fade-in Animations
  sections.forEach(section => {
    // Avoid fading out the hero section to keep initial load instantaneous
    if (section.getAttribute('id') !== 'hero') {
      section.classList.add('fade-in-reveal');
    }
  });

  // Setup observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.05, // Lower threshold ensures tall sections trigger quickly on mobile
    rootMargin: '0px 0px -20px 0px'
  });

  const revealElements = document.querySelectorAll('.fade-in-reveal');
  revealElements.forEach(el => revealObserver.observe(el));

  // 6. Projects Tab Filtering System
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active class on buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterVal = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          
          if (filterVal === 'all' || cardCategory === filterVal) {
            // Show
            card.classList.remove('filter-hide');
            // Trigger animation immediately for filtered items
            setTimeout(() => {
              card.classList.add('revealed');
            }, 50);
          } else {
            // Hide
            card.classList.add('filter-hide');
            card.classList.remove('revealed');
          }
        });
      });
    });
  }

  // 7. Interactive Contact Form Handler with Production Web3Forms Support
  const contactForm = document.getElementById('portfolio-contact-form');
  const formFeedback = document.getElementById('form-feedback-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.btn-submit');
      const submitText = submitBtn.querySelector('span');
      const originalText = submitText.textContent;
      
      const nameVal = document.getElementById('form-name').value.trim();
      const emailVal = document.getElementById('form-email').value.trim();
      const messageVal = document.getElementById('form-message').value.trim();
      const accessKeyInput = contactForm.querySelector('input[name="access_key"]');

      if (!nameVal || !emailVal || !messageVal) {
        showFeedback('Please fill out all fields.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitText.textContent = 'Sending...';

      // Check if user has entered a Web3Forms Key
      if (accessKeyInput && accessKeyInput.value && accessKeyInput.value !== 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
        const formData = new FormData(contactForm);
        
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          submitBtn.disabled = false;
          submitText.textContent = originalText;
          
          if (data.success) {
            showFeedback(`Thank you, ${nameVal}! Your message has been sent successfully. Santosh will contact you shortly.`, 'success');
            contactForm.reset();
          } else {
            showFeedback(data.message || 'Something went wrong. Please check your credentials and try again.', 'error');
          }
        })
        .catch(err => {
          submitBtn.disabled = false;
          submitText.textContent = originalText;
          showFeedback('Server connection error. Please try again or email directly.', 'error');
        });
      } else {
        // Fallback simulation for offline/local previews
        setTimeout(() => {
          submitBtn.disabled = false;
          submitText.textContent = originalText;
          
          showFeedback(`Thank you, ${nameVal}! (Local Preview Demo) Your message was captured. To enable real email delivery directly to your inbox, simply register for a free Access Key at Web3Forms.com and paste it into index.html!`, 'success');
          contactForm.reset();
        }, 1500);
      }
    });
  }

  function showFeedback(message, type) {
    if (!formFeedback) return;
    
    formFeedback.textContent = message;
    formFeedback.className = 'form-feedback';
    
    if (type === 'success') {
      formFeedback.classList.add('success');
    } else {
      formFeedback.classList.add('error');
    }
    
    formFeedback.classList.remove('hidden');

    if (type === 'success') {
      setTimeout(() => {
        formFeedback.classList.add('hidden');
      }, 8000);
    }
  }

  // 8. Particle Constellation Network Animation
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    
    // Mouse interaction coordinates
    let mouse = {
      x: null,
      y: null,
      radius: 120 // Radius around mouse to connect nodes
    };

    // Listen to mouse movement
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    // Clear mouse coordinates when leaving page
    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Detect if mobile/tablet to optimize particle count
    function getParticleCount() {
      const isMobile = window.innerWidth < 768;
      return isMobile ? 35 : 85;
    }

    // Set canvas dimensions
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Re-init particles on resize to fit the new boundaries
      initParticles();
    }

    // Debounced resize handler for performance
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 200);
    });

    // Particle Class definition
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        // Faint color options matching Gemini (cyan / violet / blue)
        const colors = [
          'rgba(139, 246, 255, 0.45)', // Cyan
          'rgba(197, 163, 255, 0.4)',  // Violet
          'rgba(138, 180, 248, 0.4)'   // Blue
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Random size (small, subtle dots)
        this.size = Math.random() * 1.5 + 0.8;
        
        // Random velocity (slow floating movement)
        const speedMultiplier = window.innerWidth < 768 ? 0.3 : 0.45;
        this.vx = (Math.random() - 0.5) * speedMultiplier;
        this.vy = (Math.random() - 0.5) * speedMultiplier;
      }

      update() {
        // Handle screen edges bounce
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        // Move particle
        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Create particle array
    function initParticles() {
      particles = [];
      const count = getParticleCount();
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    // Connect particles with faint lines
    function drawConnections() {
      const maxDistance = 115; // Max distance to draw connection line
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < maxDistance) {
            // Opacity decreases as distance increases
            const opacity = (1 - dist / maxDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Faint gradient look by drawing lines based on p1 color
            ctx.strokeStyle = p1.color.replace('0.45', opacity).replace('0.4', opacity);
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Draw connections to mouse if active (only on desktop/pointer screens)
        if (mouse.x !== null && mouse.y !== null && window.innerWidth >= 768) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < mouse.radius) {
            const opacity = (1 - dist / mouse.radius) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(139, 246, 255, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    // Main Loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update & Draw particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      // Draw lines
      drawConnections();
      
      animationFrameId = requestAnimationFrame(animate);
    }

    // Startup
    resizeCanvas();
    animate();
  }
});
