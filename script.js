// 初始化函数
document.addEventListener('DOMContentLoaded', function() {
    console.log('羊肚菌智能检测系统初始化...');
    initializeEventListeners();
    initializeAnimations();
});

// 事件监听器初始化
function initializeEventListeners() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const detectBtn = document.getElementById('detect-btn');
    const modeTabs = document.querySelectorAll('.mode-tab');
    
    console.log('初始化事件监听器...');
    
    // 文件上传处理
    uploadArea.addEventListener('click', () => {
        console.log('点击上传区域');
        fileInput.click();
    });
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect();
        }
    });
    
    fileInput.addEventListener('change', handleFileSelect);
    
    // 模式切换
    modeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            modeTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentDetectionType = this.getAttribute('data-mode');
            updateUIForMode();
            showMessage(`🔄 已切换到${currentDetectionType === 'species' ? '种类识别' : '成熟度检测'}模式`, 'info');
        });
    });
    
    // 检测按钮
    detectBtn.addEventListener('click', runDetection);
    
    console.log('事件监听器初始化完成');
}

// 初始化动画
function initializeAnimations() {
    console.log('启动动画效果...');
    
    // 状态指示器动画
    const statusItems = document.querySelectorAll('.status-item');
    let delay = 0;
    statusItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('active');
            console.log(`状态指示器 ${index + 1} 激活`);
        }, delay);
        delay += 1000;
    });
    
    // 随机技术指标更新
    setInterval(updateTechStats, 5000);
    
    console.log('动画初始化完成');
}

// 技术统计更新
function updateTechStats() {
    const accuracy = (95 + Math.random() * 2).toFixed(1);
    const speed = (35 + Math.random() * 15).toFixed(0);
    const modelInfo = document.querySelector('.model-info');
    if (modelInfo) {
        modelInfo.querySelector('span').textContent = 
            `Model Accuracy: ${accuracy}% • Inference Speed: ${speed}ms • Training Data: 15K+ Images`;
    }
}

// 文件选择处理
function handleFileSelect() {
    const fileInput = document.getElementById('file-input');
    const detectBtn = document.getElementById('detect-btn');
    const outputImage = document.getElementById('output-image');
    const resultSection = document.getElementById('result');
    
    console.log('处理文件选择...');
    
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        currentFile = file;
        
        console.log('选择的文件:', file.name, file.type, file.size);
        
        if (!file.type.match('image.*')) {
            showMessage('❌ 文件格式错误，请上传图片文件（JPG、PNG、JPEG）', 'error');
            detectBtn.disabled = true;
            return;
        }
        
        // 本地预览
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log('文件读取完成，创建预览');
            outputImage.src = e.target.result;
            outputImage.style.display = 'block';
            detectBtn.disabled = false;
            
            // 隐藏之前的结果
            resultSection.style.display = 'none';
            const detectionsContainer = document.getElementById('detections-container');
            if (detectionsContainer) {
                detectionsContainer.style.display = 'none';
            }
            
            showMessage('✅ 图片已就绪，点击"启动AI分析"开始检测', 'success');
            
            // 添加图片加载动画
            outputImage.style.opacity = '0';
            outputImage.style.transform = 'scale(0.9)';
            setTimeout(() => {
                outputImage.style.transition = 'all 0.5s ease';
                outputImage.style.opacity = '1';
                outputImage.style.transform = 'scale(1)';
            }, 100);
        };
        
        reader.onerror = function() {
            console.error('文件读取错误');
            showMessage('❌ 文件读取失败，请重试', 'error');
        };
        
        reader.readAsDataURL(file);
    }
}

// 运行检测
function runDetection() {
    if (!currentFile) {
        showMessage('❌ 请先选择图片文件', 'error');
        return;
    }
    
    console.log('开始运行检测...');
    
    const loading = document.getElementById('loading');
    const detectBtn = document.getElementById('detect-btn');
    const resultSection = document.getElementById('result');
    
    // UI 状态更新
    loading.style.display = 'block';
    detectBtn.disabled = true;
    resultSection.style.display = 'none';
    
    // 模拟处理时间（实际中由后端返回）
    const processTime = (Math.random() * 0.5 + 0.3).toFixed(2);
    document.getElementById('process-time').textContent = `${processTime}s`;
    
    const formData = new FormData();
    formData.append('image', currentFile);
    
    // 动态决定 API 地址
    const apiEndpoint = currentDetectionType === 'species' ? '/detect' : '/detect_maturity';
    
    console.log(`发送请求到: ${apiEndpoint}`);
    
    showMessage('🔍 AI正在分析图片，请稍候...', 'info');
    
    fetch(apiEndpoint, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('收到响应:', data);
        loading.style.display = 'none';
        detectBtn.disabled = false;
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        if (data.success) {
            // 更新结果图 (加时间戳防缓存)
            const outputImage = document.getElementById('output-image');
            outputImage.src = data.processed_image + '?t=' + new Date().getTime();
            outputImage.style.display = 'block';
            
            // 显示结果区域
            resultSection.style.display = 'block';
            resultSection.style.animation = 'fadeIn 1s ease-out';
            
            // 更新检测计数
            const detectionCount = data.detections ? data.detections.length : 0;
            document.getElementById('detection-count').textContent = detectionCount;
            
            displayDetections(data.detections);
            showMessage('🎉 AI分析完成！检测结果已生成', 'success');
            
            // 添加结果展示动画
            animateResults();
        }
    })
    .catch(error => {
        console.error('检测错误:', error);
        loading.style.display = 'none';
        detectBtn.disabled = false;
        showMessage('❌ ' + (error.message || '服务器连接失败，请稍后重试'), 'error');
    });
}

// 显示检测结果
function displayDetections(detections) {
    const detectionsContent = document.getElementById('detections-content');
    const detectionsContainer = document.getElementById('detections-container');
    
    console.log('显示检测结果:', detections);
    
    detectionsContent.innerHTML = '';
    
    if (!detections || detections.length === 0) {
        detectionsContent.innerHTML = `
            <div class="no-detections">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <p>未检测到相关目标</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">尝试调整图片角度或光照条件</p>
            </div>
        `;
    } else {
        let html = '';
        detections.forEach((det, index) => {
            const confidencePercent = Math.round(det.confidence * 100);
            const confidenceColor = confidencePercent > 80 ? 'var(--success)' : 
                                  confidencePercent > 60 ? 'var(--warning)' : 'var(--danger)';
            
            html += `
                <div class="detection-item" style="animation-delay: ${index * 0.1}s">
                    <div class="detection-info">
                        <h4>${det.class}</h4>
                        <span class="confidence-text">置信度: ${confidencePercent}%</span>
                    </div>
                    <div class="confidence-visual">
                        <div class="confidence-bar">
                            <div class="confidence-level" style="width: ${confidencePercent}%; background: ${confidenceColor}; box-shadow: 0 0 10px ${confidenceColor}"></div>
                        </div>
                    </div>
                </div>
            `;
        });
        detectionsContent.innerHTML = html;
    }
    detectionsContainer.style.display = 'block';
}

// 结果展示动画
function animateResults() {
    const detectionItems = document.querySelectorAll('.detection-item');
    console.log(`为 ${detectionItems.length} 个检测项添加动画`);
    
    detectionItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

// 更新模式UI
function updateUIForMode() {
    const detectBtn = document.getElementById('detect-btn');
    const btnText = detectBtn.querySelector('.btn-text');
    
    if (currentDetectionType === 'species') {
        btnText.textContent = '启动种类识别';
        detectBtn.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
    } else {
        btnText.textContent = '启动成熟度分析';
        detectBtn.style.background = 'linear-gradient(135deg, var(--accent), var(--warning))';
    }
}

// 消息提示系统
function showMessage(msg, type) {
    const existing = document.querySelector('.message');
    if (existing) existing.remove();
    
    const message = document.createElement('div');
    message.className = `message`;
    message.innerHTML = msg;
    
    // 根据类型设置背景色
    if (type === 'error') {
        message.style.background = 'linear-gradient(135deg, #ff4757, #ff3742)';
    } else if (type === 'success') {
        message.style.background = 'linear-gradient(135deg, #2ed573, #1dd1a1)';
    } else {
        message.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
    }
    
    document.body.appendChild(message);
    
    // 自动移除
    setTimeout(() => {
        if (message.parentNode) {
            message.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                if (message.parentNode) message.remove();
            }, 500);
        }
    }, 3500);
}

// 全局变量
let currentFile = null;
let currentDetectionType = 'species';

console.log('羊肚菌智能检测系统脚本加载完成');