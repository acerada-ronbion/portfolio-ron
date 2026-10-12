// Particle system with mouse repulsion and particle-particle collision
(function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    document.body.insertBefore(canvas, document.body.firstChild);
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouseX = null, mouseY = null;
    const PARTICLE_COUNT = 70;
    const REPULSION_FORCE = 0.8;
    const REPULSION_RADIUS = 120;
    const COLLISION_DAMP = 0.9;
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.2;
            this.vy = (Math.random() - 0.5) * 1.2;
            this.size = Math.random() * 2.5 + 1.2;
            this.alpha = Math.random() * 0.5 + 0.3;
            this.color = Math.random() > 0.6 ? '#3b82f6' : '#8b5cf6';
        }
        
        update() {
            if (mouseX !== null && mouseY !== null) {
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.hypot(dx, dy);
                if (dist < REPULSION_RADIUS && dist > 0.1) {
                    const force = (1 - dist / REPULSION_RADIUS) * REPULSION_FORCE;
                    const angle = Math.atan2(dy, dx);
                    this.vx += Math.cos(angle) * force * 0.15;
                    this.vy += Math.sin(angle) * force * 0.15;
                }
            }
            this.x += this.vx;
            this.y += this.vy;
            if (this.x - this.size < 0) {
                this.x = this.size;
                this.vx *= -COLLISION_DAMP;
            }
            if (this.x + this.size > width) {
                this.x = width - this.size;
                this.vx *= -COLLISION_DAMP;
            }
            if (this.y - this.size < 0) {
                this.y = this.size;
                this.vy *= -COLLISION_DAMP;
            }
            if (this.y + this.size > height) {
                this.y = height - this.size;
                this.vy *= -COLLISION_DAMP;
            }
            const maxSpeed = 3;
            if (Math.abs(this.vx) > maxSpeed) this.vx *= 0.98;
            if (Math.abs(this.vy) > maxSpeed) this.vy *= 0.98;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = this.color;
            ctx.fill();
        }
    }
    
    function handleCollisions() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.hypot(dx, dy);
                const minDist = p1.size + p2.size;
                if (dist < minDist) {
                    const angle = Math.atan2(dy, dx);
                    const overlap = minDist - dist;
                    const moveX = Math.cos(angle) * overlap * 0.5;
                    const moveY = Math.sin(angle) * overlap * 0.5;
                    p1.x += moveX;
                    p1.y += moveY;
                    p2.x -= moveX;
                    p2.y -= moveY;
                    const vRelX = p1.vx - p2.vx;
                    const vRelY = p1.vy - p2.vy;
                    const dot = vRelX * Math.cos(angle) + vRelY * Math.sin(angle);
                    if (dot < 0) {
                        const e = COLLISION_DAMP;
                        const imp = (1 + e) * dot / 2;
                        p1.vx -= imp * Math.cos(angle);
                        p1.vy -= imp * Math.sin(angle);
                        p2.vx += imp * Math.cos(angle);
                        p2.vy += imp * Math.sin(angle);
                    }
                }
            }
        }
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }
    
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.08 * (1 - dist/100)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i % height);
            ctx.lineTo(width, i % height);
            ctx.stroke();
        }
        particles.forEach(p => p.update());
        handleCollisions();
        particles.forEach(p => p.draw());
        drawLines();
        ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
        for (let i = 0; i < 30; i++) {
            const t = Date.now() / 3000;
            const x = (Math.sin(t + i) * 0.5 + 0.5) * width;
            const y = (Math.cos(t * 0.7 + i) * 0.5 + 0.5) * height;
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        requestAnimationFrame(animate);
    }
    
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }
    
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        clearTimeout(window.mouseTimeout);
        window.mouseTimeout = setTimeout(() => {
            mouseX = null;
            mouseY = null;
        }, 100);
    });
    resizeCanvas();
    animate();
})();

document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 4 + 'px';
        cursor.style.top = e.clientY - 4 + 'px';
    });
    const interactive = document.querySelectorAll('a, button, .btn, .project-card, .glass-card');
    interactive.forEach(el => {
        el.addEventListener('mouseenter', () => { cursor.style.transform = 'scale(2.5)'; cursor.style.width = '12px'; cursor.style.height = '12px'; });
        el.addEventListener('mouseleave', () => { cursor.style.transform = 'scale(1)'; cursor.style.width = '8px'; cursor.style.height = '8px'; });
    });
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    function checkReveal() {
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) el.classList.add('revealed');
        });
    }
    window.addEventListener('scroll', checkReveal);
    checkReveal();
    const tiltCards = document.querySelectorAll('.tilt-card, .project-card, .glass-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 12;
            const rotateY = (centerX - x) / 12;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
    const track = document.getElementById('carouselTrack');
    if (track) {
        const slides = Array.from(track.children);
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        const dotsContainer = document.getElementById('carouselDots');
        let currentIndex = 0;
        let autoInterval;
        const slideWidth = slides[0]?.getBoundingClientRect().width + 24;
        function updateCarousel() {
            track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
            if (dotsContainer) {
                Array.from(dotsContainer.children).forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            }
        }
        function nextSlide() { currentIndex = (currentIndex + 1) % slides.length; updateCarousel(); }
        function prevSlide() { currentIndex = (currentIndex - 1 + slides.length) % slides.length; updateCarousel(); }
        function startAutoSlide() { autoInterval = setInterval(nextSlide, 4000); }
        function stopAutoSlide() { clearInterval(autoInterval); }
        if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoSlide(); prevSlide(); startAutoSlide(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoSlide(); nextSlide(); startAutoSlide(); });
        if (dotsContainer) {
            slides.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.classList.add('dot-indicator');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => { stopAutoSlide(); currentIndex = i; updateCarousel(); startAutoSlide(); });
                dotsContainer.appendChild(dot);
            });
        }
        updateCarousel();
        startAutoSlide();
        track.addEventListener('mouseenter', stopAutoSlide);
        track.addEventListener('mouseleave', startAutoSlide);
    }
    console.log('✅ Unselectable text + collision-aware particles active');
});