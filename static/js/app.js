// 主应用控制器
class App {
    constructor() {
        this.currentSection = 'home';
        this.isInitialized = false;
        this.init();
    }

    async init() {
        console.log('开始初始化应用...');
        
        // 显示启动加载界面
        this.showGlobalLoader();
        
        try {
            // 初始化所有模块
            console.log('开始初始化模块...');
            await this.initializeModules();
            console.log('模块初始化完成');
            
            // 绑定全局事件
            console.log('开始绑定全局事件...');
            this.bindGlobalEvents();
            console.log('全局事件绑定完成');
            
            // 隐藏加载界面
            console.log('准备隐藏加载器...');
            setTimeout(() => {
                console.log('执行隐藏加载器');
                this.hideGlobalLoader();
                this.isInitialized = true;
                
                // 显示欢迎消息
                Utils.showMessage('羊肚菌AI检测系统已就绪！', 'success');
                console.log('应用初始化完成');
            }, 2000);
        } catch (error) {
            console.error('初始化过程中出现错误:', error);
            Utils.showMessage('系统初始化失败: ' + error.message, 'error');
            // 即使出错也要隐藏加载器
            this.hideGlobalLoader();
        }
    }

    async initializeModules() {
        try {
            console.log('开始加载模块...');
            // 等待所有模块初始化完成，设置超时时间
            await Promise.race([
                Promise.all([
                    this.loadParticles(),
                    this.initNavigation(),
                    this.loadChartLibrary()
                ]),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('初始化超时')), 10000)
                )
            ]);
            
            console.log('所有模块初始化完成');
        } catch (error) {
            console.error('模块初始化失败:', error);
            Utils.showMessage('系统初始化遇到问题，部分功能可能受限', 'warning');
            // 不要中断整个初始化过程
        }
    }

    loadParticles() {
        return new Promise((resolve) => {
            if (typeof particlesJS !== 'undefined') {
                console.log('Particles.js已存在');
                resolve();
            } else {
                console.log('等待Particles.js加载...');
                // 如果particles.js未加载，等待一段时间后继续
                setTimeout(() => {
                    console.log('Particles.js加载超时，继续初始化');
                    resolve();
                }, 2000);
            }
        });
    }

    loadChartLibrary() {
        return new Promise((resolve) => {
            // 检查Chart是否已经通过HTML引入
            if (typeof Chart !== 'undefined') {
                console.log('Chart.js已存在');
                resolve();
            } else {
                // 如果没有，则动态加载
                console.log('开始动态加载Chart.js');
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
                script.onload = () => {
                    console.log('Chart.js动态加载成功');
                    resolve();
                };
                script.onerror = () => {
                    console.log('Chart.js动态加载失败');
                    resolve(); // 即使失败也继续
                };
                // 设置超时
                setTimeout(() => {
                    console.log('Chart.js加载超时');
                    resolve();
                }, 3000);
                document.head.appendChild(script);
            }
        });
    }

    initNavigation() {
        try {
            // 绑定导航链接点击事件
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const section = e.target.getAttribute('data-section');
                    this.switchSection(section);
                });
            });

            // 绑定开始检测按钮
            document.getElementById('start-detection')?.addEventListener('click', () => {
                this.switchSection('detect');
            });

            // 初始化滚动监听
            this.initScrollHandler();
            console.log('导航初始化完成');
        } catch (error) {
            console.error('导航初始化失败:', error);
        }
    }

    switchSection(sectionName) {
        // 更新导航状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`)?.classList.add('active');

        // 切换内容区域
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}-section`)?.classList.add('active');

        // 更新当前区域
        this.currentSection = sectionName;

        // 添加切换动画
        this.animateSectionTransition(sectionName);

        // 触发区域特定初始化
        this.onSectionChange(sectionName);
    }

    animateSectionTransition(sectionName) {
        const section = document.getElementById(`${sectionName}-section`);
        if (section) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                section.style.transition = 'all 0.5s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            });
        }
    }

    onSectionChange(sectionName) {
        // 根据区域执行特定操作
        switch (sectionName) {
            case 'home':
                this.animateHomeStats();
                break;
            case 'detect':
                // 检测模块已自动初始化
                break;
            case 'analytics':
                // 分析模块已自动初始化
                break;
            case 'about':
                // 关于模块已自动初始化
                break;
        }

        // 发送分析事件
        this.trackSectionView(sectionName);
    }

    animateHomeStats() {
        // 首页统计数字动画
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach((element, index) => {
            setTimeout(() => {
                const target = parseInt(element.getAttribute('data-target'));
                animationManager.animateNumber(element, target, 1500);
            }, index * 300);
        });
    }

    initScrollHandler() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', Utils.throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const navbar = document.getElementById('navbar');
            
            if (navbar) {
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    // 向下滚动
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    // 向上滚动
                    navbar.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollTop = scrollTop;
        }, 100));
    }

    showGlobalLoader() {
        const loader = document.getElementById('global-loader');
        if (loader) {
            loader.style.display = 'flex';
        }
    }

    hideGlobalLoader() {
        const loader = document.getElementById('global-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }

    trackSectionView(sectionName) {
        // 这里可以集成数据分析工具
        console.log(`用户访问: ${sectionName}`);
        
        // 模拟发送分析数据
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: sectionName,
                page_location: `/${sectionName}`
            });
        }
    }

    // 系统工具方法
    showSystemInfo() {
        const info = `
系统版本: ${CONFIG.UI.THEME.PRIMARY}
用户代理: ${navigator.userAgent}
屏幕分辨率: ${screen.width}x${screen.height}
语言: ${navigator.language}
在线状态: ${navigator.onLine ? '在线' : '离线'}
        `;
        console.log('系统信息:', info);
    }

    handleGlobalError() {
        window.addEventListener('error', (event) => {
            console.error('全局错误:', event.error);
            Utils.showMessage('系统遇到意外错误', 'error');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('未处理的Promise拒绝:', event.reason);
            Utils.showMessage('异步操作失败', 'error');
        });
    }
}

// 添加CSS样式（动态注入）
const dynamicStyles = `
/* 关于页面特定样式 */
.about-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.status-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
}

.status-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
}

.status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.status-indicator.online {
    background: #4ecca3;
    box-shadow: 0 0 10px rgba(78, 204, 163, 0.5);
}

.status-info {
    flex: 1;
}

.status-title {
    font-size: 0.9rem;
    color: #bbbbbb;
    margin-bottom: 0.25rem;
}

.status-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: #ffffff;
}

.status-icon {
    font-size: 1.5rem;
    color: #4ecca3;
}

/* 架构图样式 */
.architecture-diagram {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 15px;
    padding: 2rem;
    margin-bottom: 3rem;
}

.arch-layer {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    border-left: 4px solid #4ecca3;
}

.arch-layer:last-child {
    margin-bottom: 0;
}

.arch-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #4ecca3;
}

.arch-components {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.arch-component {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    transition: all 0.3s ease;
}

.arch-component:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(5px);
}

.arch-component i {
    font-size: 1.25rem;
    color: #00b4d8;
}

/* 信息网格 */
.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.info-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 1.5rem;
}

.info-card h4 {
    color: #4ecca3;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.info-list {
    space-y: 1rem;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-item:last-child {
    border-bottom: none;
}

.info-label {
    color: #bbbbbb;
    font-size: 0.9rem;
}

.info-value {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
}

.progress-bar {
    width: 60px;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4ecca3, #00b4d8);
    border-radius: 3px;
    transition: width 0.3s ease;
}

.security-good {
    color: #4ecca3;
}

/* 模型卡片 */
.models-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.model-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 1.5rem;
}

.model-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.model-icon {
    font-size: 2rem;
    color: #4ecca3;
}

.model-info {
    flex: 1;
}

.model-info h4 {
    margin: 0;
    color: #ffffff;
}

.model-version {
    color: #bbbbbb;
    font-size: 0.8rem;
}

.model-status {
    padding: 0.25rem 0.75rem;
    background: rgba(78, 204, 163, 0.2);
    color: #4ecca3;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}

.model-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.model-stat {
    text-align: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
}

.stat-label {
    display: block;
    font-size: 0.8rem;
    color: #bbbbbb;
    margin-bottom: 0.5rem;
}

.stat-value {
    display: block;
    font-size: 1.1rem;
    font-weight: 600;
    color: #ffffff;
}

.model-classes {
    margin-top: 1rem;
}

.classes-label {
    display: block;
    color: #bbbbbb;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.classes-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.class-tag {
    padding: 0.25rem 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    font-size: 0.8rem;
    color: #ffffff;
}

/* 操作按钮 */
.actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
}

.action-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 1rem;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.action-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    border-color: #4ecca3;
}

.action-btn i {
    font-size: 1.5rem;
    color: #4ecca3;
}

/* 开发者信息 */
.developer-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
}

.developer-avatar {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #4ecca3, #00b4d8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: white;
}

.developer-info {
    flex: 1;
}

.developer-info h4 {
    margin: 0 0 0.5rem 0;
    color: #ffffff;
}

.developer-info p {
    color: #bbbbbb;
    margin-bottom: 1rem;
    line-height: 1.5;
}

.developer-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
}

.dev-stat {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #bbbbbb;
    font-size: 0.9rem;
}

.dev-stat i {
    color: #4ecca3;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .about-container {
        padding: 1rem;
    }
    
    .status-grid,
    .info-grid,
    .models-grid {
        grid-template-columns: 1fr;
    }
    
    .arch-components {
        grid-template-columns: 1fr;
    }
    
    .developer-card {
        flex-direction: column;
        text-align: center;
    }
    
    .actions-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
`;

// 注入动态样式
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});