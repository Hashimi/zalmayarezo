(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('✅ DOM Loaded.');
        
        // ===== Language Toggle =====
        const dariBtn = document.getElementById('lang-dari');
        const enBtn = document.getElementById('lang-en');
        
        function getStorage(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch(e) { return fallback; } }
        function setStorage(key, value) { try { localStorage.setItem(key, value); } catch(e) {} }
        
        const savedLang = getStorage('zalmay-lang', 'dari');
        
        function switchLang(lang) {
            console.log(`🌐 Language: ${lang}`);
            
            // Update HTML attributes
            if (lang === 'en') {
                document.documentElement.setAttribute('lang', 'en-US');
                document.documentElement.setAttribute('dir', 'ltr');
            } else {
                document.documentElement.setAttribute('lang', 'fa-AF');
                document.documentElement.setAttribute('dir', 'rtl');
            }
            
            // Toggle body class for CSS visibility
            document.body.classList.toggle('lang-en', lang === 'en');
            document.body.classList.toggle('lang-dari', lang === 'dari');
            
            // Update inline text
            document.querySelectorAll('[data-dari]').forEach(el => {
                el.textContent = lang === 'en' ? (el.getAttribute('data-en') || el.getAttribute('data-dari')) : el.getAttribute('data-dari');
            });
            
            // Update buttons
            if (dariBtn) dariBtn.classList.toggle('active', lang === 'dari');
            if (enBtn) enBtn.classList.toggle('active', lang === 'en');
            
            document.title = lang === 'en' ? 'Zalmay Arezo Residential Complex' : 'مجتمع رهایشی ذلمی آروز';
            setStorage('zalmay-lang', lang);
            window.currentLang = lang;
        }
        
        if (dariBtn && enBtn) {
            dariBtn.addEventListener('click', e => { e.preventDefault(); switchLang('dari'); });
            enBtn.addEventListener('click', e => { e.preventDefault(); switchLang('en'); });
            switchLang(savedLang);
        }
        
        // ===== Mobile Nav =====
        const navToggle = document.getElementById('navToggle');
        const navList = document.querySelector('.nav-list');
        if (navToggle && navList) {
            navToggle.addEventListener('click', () => {
                navList.classList.toggle('active');
                navToggle.querySelector('i').className = navList.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            });
            navList.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => {
                navList.classList.remove('active');
                navToggle.querySelector('i').className = 'fas fa-bars';
            }));
        }
        
        // ===== Header Scroll =====
        const header = document.querySelector('.header');
        function updateHeader() {
            if (!header) return;
            const hero = document.getElementById('home');
            if (!hero) return;
            header.classList.toggle('scrolled', window.scrollY + 80 > hero.offsetHeight * 0.3);
        }
        window.addEventListener('scroll', updateHeader);
        updateHeader();
        
        // ===== Scroll Animations =====
        if ('IntersectionObserver' in window) {
            const obs = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) { entry.target.classList.add('fade-in'); obs.unobserve(entry.target); }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            document.querySelectorAll('.section, .project-card, .service-card').forEach(el => obs.observe(el));
        }
        
        // ===== Back to Top =====
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.scrollY > 400));
            backToTop.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
        }
        
        // ===== Smooth Scroll =====
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) window.scrollTo({ top: target.offsetTop - header.offsetHeight, behavior: 'smooth' });
            });
        });
        
        // ===== Contact Form =====
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const fd = Object.fromEntries(new FormData(this));
                if (!fd.name || !fd.phone || !fd.message) {
                    alert(window.currentLang === 'en' ? 'Please fill required fields.' : 'لطفاً فیلدهای ضروری را پر کنید.');
                    return;
                }
                const btn = this.querySelector('button[type="submit"]');
                const orig = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + (window.currentLang === 'en' ? 'Sending...' : 'در حال ارسال...');
                btn.disabled = true;
                setTimeout(() => {
                    alert(window.currentLang === 'en' ? 'Message sent!' : 'پیام ارسال شد!');
                    this.reset(); btn.innerHTML = orig; btn.disabled = false;
                }, 1200);
            });
        }
        
        // ===== Lightbox =====
        document.querySelectorAll('.project-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const lb = document.createElement('div');
                lb.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:2000;cursor:zoom-out;';
                const img = document.createElement('img');
                img.src = this.href;
                img.style.cssText = 'max-width:90%;max-height:90%;border-radius:8px;box-shadow:0 10px 40px rgba(0,0,0,0.5);';
                lb.appendChild(img);
                document.body.appendChild(lb);
                lb.addEventListener('click', () => document.body.removeChild(lb));
            });
        });
        
        // ===== Mobile Video Fallback =====
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo && /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            heroVideo.style.display = 'none';
            const hero = document.querySelector('.hero');
            hero.style.backgroundImage = `url('${heroVideo.poster}')`;
            hero.style.backgroundSize = 'cover'; hero.style.backgroundPosition = 'center';
        }
        
        window.currentLang = savedLang;
    });
})();