// 高级数据分析模块
class AnalyticsModule {
    constructor() {
        this.charts = {};
        this.analysisData = Storage.get('analysisData', {
            dailyDetections: [],
            modelPerformance: [],
            categoryDistribution: {}
        });
        this.init();
    }

    init() {
        this.renderAnalyticsInterface();
        this.initCharts();
        this.loadDemoData();
    }

    renderAnalyticsInterface() {
        const section = document.getElementById('analytics-section');
        section.innerHTML = `
            <div class="analytics-container">
                <div class="analytics-header">
                    <h2 class="gradient-text">数据洞察分析</h2>
                    <p class="section-subtitle">深度挖掘检测数据，提供智能决策支持</p>
                </div>

                <div class="analytics-controls">
                    <div class="control-group">
                        <label>时间范围:</label>
                        <select id="time-range">
                            <option value="7d">最近7天</option>
                            <option value="30d" selected>最近30天</option>
                            <option value="90d">最近90天</option>
                            <option value="1y">最近1年</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>分析维度:</label>
                        <select id="analysis-dimension">
                            <option value="overview">概览分析</option>
                            <option value="performance">性能分析</option>
                            <option value="distribution">分布分析</option>
                            <option value="trends">趋势分析</option>
                        </select>
                    </div>
                    <button class="btn-primary" id="refresh-analytics">
                        <i class="fas fa-sync-alt"></i>刷新数据
                    </button>
                </div>

                <div class="metrics-grid">
                    <div class="metric-card card-3d">
                        <div class="metric-icon success">
                            <i class="fas fa-bullseye"></i>
                        </div>
                        <div class="metric-content">
                            <div class="metric-value" id="total-detections-count">0</div>
                            <div class="metric-label">总检测次数</div>
                            <div class="metric-trend positive">
                                <i class="fas fa-arrow-up"></i> 12.5%
                            </div>
                        </div>
                    </div>

                    <div class="metric-card card-3d">
                        <div class="metric-icon primary">
                            <i class="fas fa-crosshairs"></i>
                        </div>
                        <div class="metric-content">
                            <div class="metric-value" id="accuracy-rate">0%</div>
                            <div class="metric-label">平均准确率</div>
                            <div class="metric-trend positive">
                                <i class="fas fa-arrow-up"></i> 3.2%
                            </div>
                        </div>
                    </div>

                    <div class="metric-card card-3d">
                        <div class="metric-icon warning">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="metric-content">
                            <div class="metric-value" id="avg-processing-time">0ms</div>
                            <div class="metric-label">平均处理时间</div>
                            <div class="metric-trend negative">
                                <i class="fas fa-arrow-down"></i> 8.1%
                            </div>
                        </div>
                    </div>

                    <div class="metric-card card-3d">
                        <div class="metric-icon info">
                            <i class="fas fa-chart-bar"></i>
                        </div>
                        <div class="metric-content">
                            <div class="metric-value" id="categories-count">0</div>
                            <div class="metric-label">识别类别数</div>
                            <div class="metric-trend positive">
                                <i class="fas fa-arrow-up"></i> 5.7%
                            </div>
                        </div>
                    </div>
                </div>

                <div class="charts-grid">
                    <div class="chart-container large">
                        <div class="chart-header">
                            <h4><i class="fas fa-chart-line"></i>检测趋势分析</h4>
                            <div class="chart-actions">
                                <button class="btn-icon" data-chart="trend">
                                    <i class="fas fa-download"></i>
                                </button>
                            </div>
                        </div>
                        <canvas id="trend-chart"></canvas>
                    </div>

                    <div class="chart-container">
                        <div class="chart-header">
                            <h4><i class="fas fa-pie-chart"></i>种类分布</h4>
                        </div>
                        <canvas id="distribution-chart"></canvas>
                    </div>

                    <div class="chart-container">
                        <div class="chart-header">
                            <h4><i class="fas fa-gauge-high"></i>模型性能</h4>
                        </div>
                        <canvas id="performance-chart"></canvas>
                    </div>

                    <div class="chart-container">
                        <div class="chart-header">
                            <h4><i class="fas fa-clock-rotate-left"></i>时间分布</h4>
                        </div>
                        <canvas id="time-distribution-chart"></canvas>
                    </div>
                </div>

                <div class="insights-section">
                    <div class="insights-header">
                        <h3><i class="fas fa-lightbulb"></i>AI洞察建议</h3>
                    </div>
                    <div class="insights-grid">
                        <div class="insight-card">
                            <div class="insight-icon success">
                                <i class="fas fa-arrow-trend-up"></i>
                            </div>
                            <div class="insight-content">
                                <h4>检测量增长</h4>
                                <p>过去7天检测量增长15%，建议增加服务器资源以应对高峰时段</p>
                            </div>
                        </div>
                        <div class="insight-card">
                            <div class="insight-icon warning">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <div class="insight-content">
                                <h4>准确率波动</h4>
                                <p>成熟度检测准确率在夜间时段下降8%，建议优化光照条件判断</p>
                            </div>
                        </div>
                        <div class="insight-card">
                            <div class="insight-icon info">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="insight-content">
                                <h4>模型优化建议</h4>
                                <p>种类识别模型对"黑脉羊肚菌"识别率较低，建议增加训练数据</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    initCharts() {
        this.initTrendChart();
        this.initDistributionChart();
        this.initPerformanceChart();
        this.initTimeDistributionChart();
    }

    initTrendChart() {
        const ctx = document.getElementById('trend-chart').getContext('2d');
        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: '种类检测',
                        data: [],
                        borderColor: '#4ecca3',
                        backgroundColor: 'rgba(78, 204, 163, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: '成熟度检测',
                        data: [],
                        borderColor: '#00b4d8',
                        backgroundColor: 'rgba(0, 180, 216, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    initDistributionChart() {
        const ctx = document.getElementById('distribution-chart').getContext('2d');
        this.charts.distribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['黑脉羊肚菌', '梯棱羊肚菌', '尖顶羊肚菌', '其他'],
                datasets: [{
                    data: [35, 25, 20, 20],
                    backgroundColor: [
                        '#4ecca3',
                        '#00b4d8',
                        '#ff6b6b',
                        '#f9c74f'
                    ],
                    borderWidth: 2,
                    borderColor: '#1a1a2e'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    initPerformanceChart() {
        const ctx = document.getElementById('performance-chart').getContext('2d');
        this.charts.performance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['准确率', '召回率', 'F1分数', '速度', '稳定性'],
                datasets: [{
                    label: '种类模型',
                    data: [92, 88, 90, 85, 95],
                    backgroundColor: 'rgba(78, 204, 163, 0.2)',
                    borderColor: '#4ecca3',
                    pointBackgroundColor: '#4ecca3'
                }, {
                    label: '成熟度模型',
                    data: [85, 82, 83, 90, 88],
                    backgroundColor: 'rgba(0, 180, 216, 0.2)',
                    borderColor: '#00b4d8',
                    pointBackgroundColor: '#00b4d8'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: '#ffffff'
                        },
                        ticks: {
                            backdropColor: 'transparent',
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }

    initTimeDistributionChart() {
        const ctx = document.getElementById('time-distribution-chart').getContext('2d');
        this.charts.timeDistribution = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: '检测请求数',
                    data: [12, 8, 45, 68, 52, 38],
                    backgroundColor: 'rgba(78, 204, 163, 0.8)',
                    borderColor: '#4ecca3',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    loadDemoData() {
        // 模拟数据加载
        setTimeout(() => {
            this.updateMetrics();
            this.updateCharts();
        }, 1000);
    }

    updateMetrics() {
        animationManager.animateNumber(document.getElementById('total-detections-count'), 1247, 1500);
        animationManager.animateNumber(document.getElementById('accuracy-rate'), 89, 1500);
        animationManager.animateNumber(document.getElementById('avg-processing-time'), 156, 1500);
        animationManager.animateNumber(document.getElementById('categories-count'), 8, 1500);
    }

    updateCharts() {
        // 更新趋势图数据
        const trendData = this.generateTrendData();
        this.charts.trend.data.labels = trendData.labels;
        this.charts.trend.data.datasets[0].data = trendData.species;
        this.charts.trend.data.datasets[1].data = trendData.maturity;
        this.charts.trend.update();

        // 触发数字动画
        this.updateMetrics();
    }

    generateTrendData() {
        const labels = [];
        const species = [];
        const maturity = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
            
            species.push(Math.floor(Math.random() * 50) + 30);
            maturity.push(Math.floor(Math.random() * 40) + 20);
        }
        
        return { labels, species, maturity };
    }
}

// 初始化分析模块
const analyticsModule = new AnalyticsModule();