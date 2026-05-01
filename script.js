(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const dariBtn = document.getElementById('lang-dari');
        const enBtn = document.getElementById('lang-en');

        function getStorage(key, fallback) {
            try {
                return localStorage.getItem(key) || fallback;
            } catch (e) {
                return fallback;
            }
        }

        function setStorage(key, value) {
            try {
                localStorage.setItem(key, value);
            } catch (e) {}
        }

        const savedLang = getStorage('zalmay-lang', 'dari');

        function switchLang(lang) {
            if (lang === 'en') {
                document.documentElement.setAttribute('lang', 'en-US');
                document.documentElement.setAttribute('dir', 'ltr');
            } else {
                document.documentElement.setAttribute('lang', 'fa-AF');
                document.documentElement.setAttribute('dir', 'rtl');
            }

            document.body.classList.toggle('lang-en', lang === 'en');
            document.body.classList.toggle('lang-dari', lang === 'dari');

            document.querySelectorAll('[data-dari]').forEach(el => {
                el.textContent = lang === 'en'
                    ? (el.getAttribute('data-en') || el.getAttribute('data-dari'))
                    : el.getAttribute('data-dari');
            });

            if (dariBtn) dariBtn.classList.toggle('active', lang === 'dari');
            if (enBtn) enBtn.classList.toggle('active', lang === 'en');

            document.title = lang === 'en'
                ? 'Zalmay Arezo Residential Complex'
                : 'مجتمع رهایشی ذلمی آروز';

            setStorage('zalmay-lang', lang);
            window.currentLang = lang;
        }

        if (dariBtn && enBtn) {
            dariBtn.addEventListener('click', e => {
                e.preventDefault();
                switchLang('dari');
            });

            enBtn.addEventListener('click', e => {
                e.preventDefault();
                switchLang('en');
            });

            switchLang(savedLang);
        }

// ===== Hero Video Fallback =====
const heroVideo = document.querySelector('.hero-video');

if (heroVideo) {
    const showFallback = () => {
        heroVideo.classList.add('video-failed');
        heroVideo.style.display = 'none';
    };

    heroVideo.addEventListener('error', showFallback);

    heroVideo.querySelectorAll('source').forEach(source => {
        source.addEventListener('error', showFallback);
    });

    heroVideo.addEventListener('loadeddata', () => {
        heroVideo.classList.add('video-loaded');
        heroVideo.style.display = 'block';
    });

    heroVideo.muted = true;
    heroVideo.play().catch(() => {
        heroVideo.controls = false;
    });
}



        const navToggle = document.getElementById('navToggle');
        const navList = document.querySelector('.nav-list');

        if (navToggle && navList) {
            navToggle.addEventListener('click', () => {
                navList.classList.toggle('active');
                const icon = navToggle.querySelector('i');
                if (icon) icon.className = navList.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            });

            navList.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navList.classList.remove('active');
                    const icon = navToggle.querySelector('i');
                    if (icon) icon.className = 'fas fa-bars';
                });
            });
        }

        const header = document.querySelector('.header');

        function updateHeader() {
            if (!header) return;
            const hero = document.getElementById('home');
            if (!hero) return;
            header.classList.toggle('scrolled', window.scrollY + 80 > hero.offsetHeight * 0.3);
        }

        window.addEventListener('scroll', updateHeader);
        updateHeader();

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            document.querySelectorAll('.section, .project-card, .service-card').forEach(el => {
                observer.observe(el);
            });
        } else {
            document.querySelectorAll('.section, .project-card, .service-card').forEach(el => {
                el.classList.add('fade-in');
            });
        }

        const backToTop = document.getElementById('backToTop');

        if (backToTop) {
            window.addEventListener('scroll', () => {
                backToTop.classList.toggle('visible', window.scrollY > 400);
            });

            backToTop.addEventListener('click', e => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (!href || href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                const offset = header ? header.offsetHeight : 0;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            });
        });

        const form = document.getElementById('contactForm');

        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();

                const formData = new FormData(this);

                if (!formData.get('name') || !formData.get('phone') || !formData.get('message')) {
                    alert(window.currentLang === 'en'
                        ? 'Please fill required fields.'
                        : 'لطفاً فیلدهای ضروری را پر کنید.');
                    return;
                }

                const btn = this.querySelector('button[type="submit"]');
                const originalText = btn ? btn.innerHTML : '';

                if (btn) {
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + (window.currentLang === 'en' ? 'Sending...' : 'در حال ارسال...');
                    btn.disabled = true;
                }

                try {
                    const response = await fetch(this.action, {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) throw new Error('Form failed');

                    alert(window.currentLang === 'en'
                        ? 'Message sent successfully!'
                        : 'پیام شما موفقانه ارسال شد!');

                    this.reset();
                } catch (error) {
                    alert(window.currentLang === 'en'
                        ? 'Message could not be sent. Please call or WhatsApp us.'
                        : 'پیام ارسال نشد. لطفاً از طریق تماس یا واتساپ با ما ارتباط بگیرید.');
                } finally {
                    if (btn) {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    }
                }
            });
        }

        document.querySelectorAll('.project-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const lightbox = document.createElement('div');
                lightbox.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:2000;cursor:zoom-out;padding:20px;';

                const img = document.createElement('img');
                img.src = this.href;
                img.alt = '';
                img.style.cssText = 'max-width:90%;max-height:90%;border-radius:8px;box-shadow:0 10px 40px rgba(0,0,0,0.5);';

                lightbox.appendChild(img);
                document.body.appendChild(lightbox);

                lightbox.addEventListener('click', () => {
                    document.body.removeChild(lightbox);
                });
            });
        });

        window.currentLang = savedLang;
    });
})();
