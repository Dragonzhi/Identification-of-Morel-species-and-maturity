// 关于系统模块
class AboutModule {
    constructor() {
        this.systemInfo = {};
        this.init();
    }

    init() {
        this.renderAboutInterface();
        this.initSystemStatus();
        this.loadSystemInfo();
    }

    renderAboutInterface() {
        const section = document.getElementById('about-section');
        section.innerHTML = `
            <div class="about-container">
                <div class="about-header">
                    <h2 class="gradient-text">系统信息</h2>
                    <p class="section-subtitle">深入了解羊肚菌智能检测系统的技术架构与特性</p>
                </div>

                <div class="about-content">
                    <!-- 系统状态 -->
                    <div class="status-section">
                        <h3><i class="fas fa-heart-pulse"></i>系统状态</h3>
                        <div class="status-grid">
                            <div class="status-card">
                                <div class="status-indicator online"></div>
                                <div class="status-info">
                                    <div class="status-title">API服务</div>
                                    <div class="status-value">运行中</div>
                                </div>
                                <i class="fas fa-server status-icon"></i>
                            </div>
                            <div class="status-card">
                                <div class="status-indicator online"></div>
                                <div class="status-info">
                                    <div class="status-title">模型服务</div>
                                    <div class="status-value">已加载</div>
                                </div>
                                <i class="fas fa-brain status-icon"></i>
                            </div>
                            <div class="status-card">
                                <div class="status-indicator online"></div>
                                <div class="status-info">
                                    <div class="status-title">数据库</div>
                                    <div class="status-value">连接正常</div>
                                </div>
                                <i class="fas fa-database status-icon"></i>
                            </div>
                            <div class="status-card">
                                <div class="status-indicator online"></div>
                                <div class="status-info">
                                    <div class="status-title">存储服务</div>
                                    <div class="status-value">68% 使用率</div>
                                </div>
                                <i class="fas fa-hard-drive status-icon"></i>
                            </div>
                        </div>
                    </div>

                    <!-- 技术架构 -->
                    <div class="architecture-section">
                        <h3><i class="fas fa-sitemap"></i>技术架构</h3>
                        <div class="architecture-diagram">
                            <div class="arch-layer">
                                <div class="arch-title">前端展示层</div>
                                <div class="arch-components">
                                    <div class="arch-component">
                                        <i class="fab fa-html5"></i>
                                        <span>HTML5/CSS3</span>
                                    </div>
                                    <div class="arch-component">
                                        <i class="fab fa-js"></i>
                                        <span>JavaScript ES6+</span>
                                    </div>
                                    <div class="arch-component">
                                        <i class="fas fa-chart-line"></i>
                                        <span>Chart.js</span>
                                    </div>
                                </div>
                            </div>
                            <div class="arch-layer">
                                <div class="arch-title">业务逻辑层</div>
                                <div class="arch-components">
                                    <div class="arch-component">
                                        <i class="fab fa-python"></i>
                                        <span>Flask框架</span>
                                    </div>
                                    <div class="arch-component">
                                        <i class="fas fa-robot"></i>
                                        <span>YOLOv8算法</span>
                                    </div>
                                    <div class="arch-component">
                                        <i class="fas fa-cogs"></i>
                                        <span>OpenCV</span>
                                    </div>
                                </div>
                            </div>
                            <div class="arch-layer">
                                <div class="arch-title">数据存储层</div>
                                <div class="arch-components">
                                    <div class="arch-component">
                                        <i class="fas fa-database"></i>
                                        <span>SQLite</span>
                                    </div>
                                    <div class="arch-component">
                                        <i class="fas fa-folder"></i>
                                        <span>文件系统</span>
                                    </div>
                                    <div class="arch-component">
                                        <i class="fas fa-memory"></i>
                                        <span>Redis缓存</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 系统信息 -->
                    <div class="info-grid">
                        <div class="info-card">
                            <h4><i class="fas fa-microchip"></i>硬件信息</h4>
                            <div class="info-list">
                                <div class="info-item">
                                    <span class="info-label">CPU使用率:</span>
                                    <span class="info-value">
                                        <span id="cpu-usage">0%</span>
                                        <div class="progress-bar">
                                            <div class="progress-fill" id="cpu-progress"></div>
                                        </div>
                                    </span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">内存使用:</span>
                                    <span class="info-value">
                                        <span id="memory-usage">0%</span>
                                        <div class="progress-bar">
                                            <div class="progress-fill" id="memory-progress"></div>
                                        </div>
                                    </span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">GPU加速:</span>
                                    <span class="info-value" id="gpu-status">检测中...</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">存储空间:</span>
                                    <span class="info-value" id="storage-info">计算中...</span>
                                </div>
                            </div>
                        </div>

                        <div class="info-card">
                            <h4><i class="fas fa-code-branch"></i>软件版本</h4>
                            <div class="info-list">
                                <div class="info-item">
                                    <span class="info-label">系统版本:</span>
                                    <span class="info-value" id="system-version">v2.1.0</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">模型版本:</span>
                                    <span class="info-value" id="model-version">YOLOv8.0.0</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">最后更新:</span>
                                    <span class="info-value" id="last-update">2024-01-20</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">API版本:</span>
                                    <span class="info-value" id="api-version">v1.3.2</span>
                                </div>
                            </div>
                        </div>

                        <div class="info-card">
                            <h4><i class="fas fa-chart-bar"></i>性能指标</h4>
                            <div class="info-list">
                                <div class="info-item">
                                    <span class="info-label">平均响应时间:</span>
                                    <span class="info-value" id="avg-response">156ms</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">今日检测数:</span>
                                    <span class="info-value" id="today-detections">247</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">准确率:</span>
                                    <span class="info-value" id="system-accuracy">89.2%</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">正常运行:</span>
                                    <span class="info-value" id="uptime">99.8%</span>
                                </div>
                            </div>
                        </div>

                        <div class="info-card">
                            <h4><i class="fas fa-shield-alt"></i>安全状态</h4>
                            <div class="info-list">
                                <div class="info-item">
                                    <span class="info-label">SSL证书:</span>
                                    <span class="info-value security-good">
                                        <i class="fas fa-check-circle"></i>有效
                                    </span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">防火墙:</span>
                                    <span class="info-value security-good">
                                        <i class="fas fa-check-circle"></i>已启用
                                    </span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">数据加密:</span>
                                    <span class="info-value security-good">
                                        <i class="fas fa-check-circle"></i>AES-256
                                    </span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">最后扫描:</span>
                                    <span class="info-value" id="last-scan">2小时前</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 模型信息 -->
                    <div class="models-section">
                        <h3><i class="fas fa-robot"></i>AI模型信息</h3>
                        <div class="models-grid">
                            <div class="model-card">
                                <div class="model-header">
                                    <i class="fas fa-seedling model-icon"></i>
                                    <div class="model-info">
                                        <h4>种类识别模型</h4>
                                        <span class="model-version">v2.1.0</span>
                                    </div>
                                    <div class="model-status online">在线</div>
                                </div>
                                <div class="model-stats">
                                    <div class="model-stat">
                                        <span class="stat-label">准确率</span>
                                        <span class="stat-value">92.3%</span>
                                    </div>
                                    <div class="model-stat">
                                        <span class="stat-label">推理速度</span>
                                        <span class="stat-value">45ms</span>
                                    </div>
                                    <div class="model-stat">
                                        <span class="stat-label">训练数据</span>
                                        <span class="stat-value">15K+</span>
                                    </div>
                                </div>
                                <div class="model-classes">
                                    <span class="classes-label">支持类别:</span>
                                    <div class="classes-tags">
                                        <span class="class-tag">黑脉羊肚菌</span>
                                        <span class="class-tag">梯棱羊肚菌</span>
                                        <span class="class-tag">尖顶羊肚菌</span>
                                        <span class="class-tag">+5更多</span>
                                    </div>
                                </div>
                            </div>

                            <div class="model-card">
                                <div class="model-header">
                                    <i class="fas fa-chart-line model-icon"></i>
                                    <div class="model-info">
                                        <h4>成熟度分析模型</h4>
                                        <span class="model-version">v1.8.2</span>
                                    </div>
                                    <div class="model-status online">在线</div>
                                </div>
                                <div class="model-stats">
                                    <div class="model-stat">
                                        <span class="stat-label">准确率</span>
                                        <span class="stat-value">87.6%</span>
                                    </div>
                                    <div class="model-stat">
                                        <span class="stat-label">推理速度</span>
                                        <span class="stat-value">38ms</span>
                                    </div>
                                    <div class="model-stat">
                                        <span class="stat-label">训练数据</span>
                                        <span class="stat-value">12K+</span>
                                    </div>
                                </div>
                                <div class="model-classes">
                                    <span class="classes-label">成熟度等级:</span>
                                    <div class="classes-tags">
                                        <span class="class-tag">未成熟</span>
                                        <span class="class-tag">成熟中</span>
                                        <span class="class-tag">已成熟</span>
                                        <span class="class-tag">过成熟</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 系统操作 -->
                    <div class="actions-section">
                        <h3><i class="fas fa-tools"></i>系统维护</h3>
                        <div class="actions-grid">
                            <button class="action-btn" id="clear-cache">
                                <i class="fas fa-broom"></i>
                                <span>清理缓存</span>
                            </button>
                            <button class="action-btn" id="export-logs">
                                <i class="fas fa-download"></i>
                                <span>导出日志</span>
                            </button>
                            <button class="action-btn" id="system-check">
                                <i class="fas fa-stethoscope"></i>
                                <span>系统诊断</span>
                            </button>
                            <button class="action-btn" id="toggle-animations">
                                <i class="fas fa-play"></i>
                                <span>切换动画</span>
                            </button>
                            <button class="action-btn" id="refresh-status">
                                <i class="fas fa-sync-alt"></i>
                                <span>刷新状态</span>
                            </button>
                            <button class="action-btn" id="backup-data">
                                <i class="fas fa-save"></i>
                                <span>数据备份</span>
                            </button>
                        </div>
                    </div>

                    <!-- 开发者信息 -->
                    <div class="developer-section">
                        <h3><i class="fas fa-code"></i>开发者信息</h3>
                        <div class="developer-card">
                            <div class="developer-avatar">
                                <i class="fas fa-user-astronaut"></i>
                            </div>
                            <div class="developer-info">
                                <h4>AI视觉研发团队</h4>
                                <p>专注于计算机视觉与深度学习技术在农业领域的应用研究</p>
                                <div class="developer-stats">
                                    <div class="dev-stat">
                                        <i class="fas fa-calendar"></i>
                                        <span>项目周期: 6个月</span>
                                    </div>
                                    <div class="dev-stat">
                                        <i class="fas fa-code"></i>
                                        <span>代码行数: 15,247</span>
                                    </div>
                                    <div class="dev-stat">
                                        <i class="fas fa-bug"></i>
                                        <span>测试覆盖率: 92%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindActions();
    }

    initSystemStatus() {
        // 模拟系统状态监控
        this.updateSystemMetrics();
        setInterval(() => this.updateSystemMetrics(), 5000);
    }

    updateSystemMetrics() {
        // 模拟动态系统指标
        const cpuUsage = Math.floor(Math.random() * 30) + 10;
        const memoryUsage = Math.floor(Math.random() * 40) + 30;
        const todayDetections = Math.floor(Math.random() * 50) + 200;

        // 更新CPU使用率
        const cpuProgress = document.getElementById('cpu-progress');
        const cpuText = document.getElementById('cpu-usage');
        if (cpuProgress && cpuText) {
            cpuProgress.style.width = `${cpuUsage}%`;
            cpuText.textContent = `${cpuUsage}%`;
        }

        // 更新内存使用率
        const memoryProgress = document.getElementById('memory-progress');
        const memoryText = document.getElementById('memory-usage');
        if (memoryProgress && memoryText) {
            memoryProgress.style.width = `${memoryUsage}%`;
            memoryText.textContent = `${memoryUsage}%`;
        }

        // 更新今日检测数
        const todayElement = document.getElementById('today-detections');
        if (todayElement) {
            animationManager.animateNumber(todayElement, todayDetections, 1000);
        }

        // 更新GPU状态
        const gpuStatus = document.getElementById('gpu-status');
        if (gpuStatus) {
            gpuStatus.innerHTML = '<i class="fas fa-check-circle" style="color: #4ecca3;"></i> CUDA 可用';
        }

        // 更新存储信息
        const storageInfo = document.getElementById('storage-info');
        if (storageInfo) {
            const used = Math.floor(Math.random() * 200) + 300;
            const total = 1024;
            const percent = Math.round((used / total) * 100);
            storageInfo.textContent = `${used}MB / ${total}MB (${percent}%)`;
        }
    }

    loadSystemInfo() {
        // 模拟加载系统信息
        setTimeout(() => {
            this.systemInfo = {
                version: 'v2.1.0',
                modelVersion: 'YOLOv8.0.0',
                lastUpdate: '2024-01-20',
                apiVersion: 'v1.3.2',
                accuracy: '89.2%',
                uptime: '99.8%',
                lastScan: '2小时前'
            };

            this.updateInfoDisplay();
        }, 1000);
    }

    updateInfoDisplay() {
        // 更新系统信息显示
        const elements = {
            'system-version': this.systemInfo.version,
            'model-version': this.systemInfo.modelVersion,
            'last-update': this.systemInfo.lastUpdate,
            'api-version': this.systemInfo.apiVersion,
            'system-accuracy': this.systemInfo.accuracy,
            'uptime': this.systemInfo.uptime,
            'last-scan': this.systemInfo.lastScan
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    bindActions() {
        // 绑定操作按钮事件
        document.getElementById('clear-cache')?.addEventListener('click', () => this.clearCache());
        document.getElementById('export-logs')?.addEventListener('click', () => this.exportLogs());
        document.getElementById('system-check')?.addEventListener('click', () => this.runSystemCheck());
        document.getElementById('toggle-animations')?.addEventListener('click', () => this.toggleAnimations());
        document.getElementById('refresh-status')?.addEventListener('click', () => this.refreshStatus());
        document.getElementById('backup-data')?.addEventListener('click', () => this.backupData());
    }

    clearCache() {
        Utils.showMessage('正在清理系统缓存...', 'info');
        
        // 模拟清理过程
        setTimeout(() => {
            Storage.remove('detectionHistory');
            Storage.remove('analysisData');
            Utils.showMessage('系统缓存清理完成！', 'success');
        }, 1500);
    }

    exportLogs() {
        Utils.showMessage('正在导出系统日志...', 'info');
        
        // 模拟日志导出
        setTimeout(() => {
            const logData = this.generateLogData();
            Utils.downloadFile(logData, `system-logs-${new Date().toISOString().split('T')[0]}.txt`, 'text/plain');
            Utils.showMessage('系统日志导出完成！', 'success');
        }, 2000);
    }

    generateLogData() {
        return `羊肚菌检测系统日志
生成时间: ${new Date().toLocaleString('zh-CN')}
系统版本: ${this.systemInfo.version}
运行状态: 正常

=== 最近操作记录 ===
${new Date().toLocaleString()}: 用户执行系统状态检查
${new Date().toLocaleString()}: 模型服务运行正常
${new Date().toLocaleString()}: 完成批量图片处理

=== 性能指标 ===
平均响应时间: 156ms
今日检测数量: 247次
系统准确率: 89.2%
CPU使用率: 23%
内存使用率: 45%

=== 安全状态 ===
SSL证书: 有效
防火墙: 已启用
最后安全扫描: 2小时前
`;
    }

    runSystemCheck() {
        Utils.showMessage('开始系统诊断检查...', 'info');
        
        const steps = [
            { name: '检查API服务', delay: 500 },
            { name: '验证模型状态', delay: 800 },
            { name: '测试数据库连接', delay: 600 },
            { name: '检查存储空间', delay: 400 },
            { name: '验证安全配置', delay: 700 }
        ];

        let currentStep = 0;

        const runNextStep = () => {
            if (currentStep < steps.length) {
                const step = steps[currentStep];
                Utils.showMessage(`系统诊断: ${step.name}`, 'info');
                
                setTimeout(() => {
                    currentStep++;
                    runNextStep();
                }, step.delay);
            } else {
                Utils.showMessage('系统诊断完成！所有服务运行正常。', 'success');
            }
        };

        runNextStep();
    }

    toggleAnimations() {
        animationManager.toggleAnimations();
    }

    refreshStatus() {
        Utils.showMessage('刷新系统状态...', 'info');
        this.updateSystemMetrics();
        this.loadSystemInfo();
        
        setTimeout(() => {
            Utils.showMessage('系统状态已更新！', 'success');
        }, 1000);
    }

    backupData() {
        Utils.showMessage('开始数据备份...', 'info');
        
        // 模拟备份过程
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                Utils.showMessage('数据备份完成！', 'success');
            }
            Utils.showMessage(`数据备份进度: ${Math.round(progress)}%`, 'info');
        }, 300);
    }
}

// 初始化关于模块
const aboutModule = new AboutModule();