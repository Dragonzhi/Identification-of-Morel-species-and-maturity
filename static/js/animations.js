// 高级动画控制系统
class AnimationManager {
    constructor() {
        this.observers = [];
        this.isAnimationsEnabled = Storage.get('animationsEnabled', true);
        this.initParticles();
    }

    // 初始化粒子背景
    initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: "#4ecca3" },
                    shape: { type: "circle" },
                    opacity: { value: 0.5, random: true },
                    size: { value: 3, random: true },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#4ecca3",
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { enable: true, mode: "repulse" },
                        onclick: { enable: true, mode: "push" },
                        resize: true
                    }
                }
            });
        }
    }

    // 数字计数动画
    animateNumber(element, target, duration = 2000) {
        if (!this.isAnimationsEnabled) {
            element.textContent = target;
            return;
        }

        const start = parseInt(element.textContent) || 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 缓动函数
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);
            
            element.textContent = Utils.formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = Utils.formatNumber(target);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // 类型打字机效果
    typewriter(element, text, speed = 50) {
        if (!this.isAnimationsEnabled) {
            element.textContent = text;
            return;
        }

        element.textContent = '';
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }

    // 创建波纹效果
    createRipple(event) {
        if (!this.isAnimationsEnabled) return;

        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) ripple.remove();

        button.appendChild(circle);
    }

    // 3D卡片悬停效果
    init3DCards() {
        document.addEventListener('mousemove', Utils.throttle((e) => {
            const cards = document.querySelectorAll('.card-3d');
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = (x - centerX) / 25;
                const rotateX = (centerY - y) / 25;
                
                card.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    scale3d(1.02, 1.02, 1.02)
                `;
            });
        }, 100));

        document.addEventListener('mouseleave', () => {
            const cards = document.querySelectorAll('.card-3d');
            cards.forEach(card => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // 滚动触发动画
    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // 切换动画状态
    toggleAnimations() {
        this.isAnimationsEnabled = !this.isAnimationsEnabled;
        Storage.set('animationsEnabled', this.isAnimationsEnabled);
        
        Utils.showMessage(
            `动画效果已${this.isAnimationsEnabled ? '开启' : '关闭'}`,
            this.isAnimationsEnabled ? 'success' : 'info'
        );
    }
}

// 初始化动画管理器
const animationManager = new AnimationManager();