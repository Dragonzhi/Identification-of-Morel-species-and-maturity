// 高级检测模块
class DetectModule {
    constructor() {
        this.currentFile = null;
        // 使用 Storage.js 存取历史记录
        this.detectionHistory = Storage.get('detectionHistory', []);
        this.init();
    }

    init() {
        this.renderDetectionInterface();
        // 使用setTimeout确保DOM完全渲染后再绑定事件
        setTimeout(() => {
            this.bindEvents();
        }, 100);
    }

    // 渲染检测界面
    renderDetectionInterface() {
        const section = document.getElementById('detect-section');
        if (!section) {
            console.error('无法找到检测区域');
            return;
        }
        
        section.innerHTML = `
            <div class="detect-container">
                <div class="detect-header">
                    <h2 class="gradient-text">智能检测分析</h2>
                    <p class="section-subtitle">上传羊肚菌图片进行多维度AI分析</p>
                </div>

                <div class="detect-layout">
                    <!-- 左侧控制面板 -->
                    <div class="control-panel card-3d">
                        <div class="panel-section">
                            <h3><i class="fas fa-cog"></i>检测设置</h3>
                            
                            <div class="mode-selector">
                                <div class="mode-option active" data-mode="species">
                                    <i class="fas fa-seedling"></i>
                                    <span>种类识别</span>
                                </div>
                                <div class="mode-option" data-mode="maturity">
                                    <i class="fas fa-hourglass-half"></i>
                                    <span>成熟度评估</span>
                                </div>
                            </div>
                        </div>

                        <div class="panel-section single-file-section active">
                            <h3><i class="fas fa-file-image"></i>单文件检测</h3>
                            
                            <!-- 文件上传区 -->
                            <div class="upload-zone" id="single-upload-zone">
                                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                                <p class="upload-text">拖拽文件到此处，或点击上传</p>
                                <!-- 隐藏的实际文件输入框 -->
                                <input type="file" id="single-image-upload" accept="image/*" style="display: none;">
                                <!-- 修复的按钮：现在它将拥有自己的事件处理器 -->
                                <button id="upload-file-button" class="action-button primary-button mt-3">
                                    <i class="fas fa-upload"></i> 上传文件
                                </button>
                            </div>

                            <div id="file-preview-container" class="mt-3 hidden">
                                <div class="file-preview card-3d">
                                    <img id="file-preview-img" src="" alt="预览图片">
                                    <div class="file-details">
                                        <p>文件名: <span id="file-name"></span></p>
                                        <p>大小: <span id="file-size"></span></p>
                                    </div>
                                    <button class="remove-file-button" id="remove-file-button"><i class="fas fa-trash"></i> 移除</button>
                                </div>
                            </div>

                            <button id="start-detection-button" class="action-button secondary-button mt-4" disabled>
                                <i class="fas fa-brain"></i> 开始AI分析
                            </button>
                        </div>
                        
                        <div class="panel-section batch-file-section hidden">
                            <h3><i class="fas fa-layer-group"></i>批量检测（功能待实现）</h3>
                            <div class="upload-zone" id="batch-upload-zone">
                                <i class="fas fa-folder-open upload-icon"></i>
                                <p class="upload-text">拖拽文件到此处，或点击添加</p>
                                <input type="file" id="batch-image-upload" accept="image/*" multiple style="display: none;">
                            </div>
                            
                            <div id="batch-queue" class="mt-3 batch-queue-container">
                                <!-- 批量文件列表 -->
                            </div>
                            
                            <div class="action-group mt-3">
                                <button id="process-batch-button" class="action-button secondary-button"><i class="fas fa-cogs"></i> 开始批量处理</button>
                                <button id="clear-batch-button" class="action-button danger-button"><i class="fas fa-eraser"></i> 清空列表</button>
                            </div>
                        </div>
                        
                        <div class="panel-section mt-4">
                             <h3><i class="fas fa-history"></i>历史记录</h3>
                             <div id="detection-history" class="history-list">
                                 <!-- 历史记录项将在这里加载 -->
                             </div>
                             <button id="export-results-button" class="action-button info-button mt-3" disabled>
                                 <i class="fas fa-file-export"></i> 导出全部结果
                             </button>
                         </div>
                        
                    </div>

                    <!-- 右侧结果展示区 -->
                    <div class="result-display card-3d">
                        <h3><i class="fas fa-chart-bar"></i>分析结果</h3>
                        <div id="result-content">
                            <div class="placeholder-message">
                                <i class="fas fa-search"></i>
                                <p>请上传图片并点击 '开始AI分析' 获取结果</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.loadHistory();
    }

    bindEvents() {
        // 模式切换
        document.querySelectorAll('.mode-option').forEach(modeOption => {
            modeOption.addEventListener('click', (e) => this.switchMode(e.currentTarget.dataset.mode));
        });

        // ----------------------------------------------------
        // 文件上传/选择逻辑
        // ----------------------------------------------------

        // 1. 单文件上传区域点击 (整个区域点击)
        const singleUploadZone = document.getElementById('single-upload-zone');
        if (singleUploadZone) {
            singleUploadZone.addEventListener('click', () => {
                document.getElementById('single-image-upload').click();
            });
            // 拖拽事件 (省略实现，但应该在这里绑定)
            singleUploadZone.addEventListener('dragover', (e) => { e.preventDefault(); e.currentTarget.classList.add('dragover'); });
            singleUploadZone.addEventListener('dragleave', (e) => { e.currentTarget.classList.remove('dragover'); });
            singleUploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('dragover');
                this.handleFileSelect(e.dataTransfer.files);
            });
        }
        
        // **修复点**：为“上传文件”按钮添加显式处理器
        const uploadFileButton = document.getElementById('upload-file-button');
        if (uploadFileButton) {
            uploadFileButton.addEventListener('click', (e) => {
                // 停止事件冒泡，防止点击按钮时，父级 singleUploadZone 再次触发点击事件
                e.stopPropagation(); 
                document.getElementById('single-image-upload').click();
            });
        }
        
        // 文件选择变化
        const singleImageUpload = document.getElementById('single-image-upload');
        if (singleImageUpload) {
            singleImageUpload.addEventListener('change', (event) => this.handleFileSelect(event.target.files));
        }
        
        // 移除文件按钮
        document.getElementById('remove-file-button')?.addEventListener('click', () => this.clearFile());
        
        // 开始分析按钮
        document.getElementById('start-detection-button')?.addEventListener('click', () => this.startDetection());

        // 批量处理事件 (功能待实现)
        document.getElementById('process-batch-button')?.addEventListener('click', () => this.processBatch());
        document.getElementById('clear-batch-button')?.addEventListener('click', () => this.clearBatchQueue());

        // 导出结果
        document.getElementById('export-results-button')?.addEventListener('click', () => this.exportResults());
        
        // 批量上传区域
        const batchUploadZone = document.getElementById('batch-upload-zone');
        if (batchUploadZone) {
            batchUploadZone.addEventListener('click', () => {
                document.getElementById('batch-image-upload').click();
            });
            document.getElementById('batch-image-upload')?.addEventListener('change', (event) => this.addBatchFiles(event.target.files));
        }
    }
    
    // 切换检测模式 (种类/成熟度)
    switchMode(mode) {
        document.querySelectorAll('.mode-option').forEach(opt => opt.classList.remove('active'));
        document.querySelector(`.mode-option[data-mode="${mode}"]`).classList.add('active');
        
        // 可以在这里清空结果或者提示用户需要重新分析
        Utils.showMessage(`已切换至 ${mode === 'species' ? '种类识别' : '成熟度评估'} 模式`, 'info');
        // TODO: 实际应用中，这里可能需要更新界面显示或重置分析结果
    }
    
    // 处理文件选择
    handleFileSelect(files) {
        if (files.length === 0) return;

        const file = files[0];
        
        // 检查文件类型
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            Utils.showMessage('不支持的文件类型，请上传PNG或JPG图片', 'error');
            return;
        }

        this.currentFile = file;
        this.renderFilePreview(file);
        
        // 清除 input 框的值，允许选择同一个文件后再次触发 change 事件
        const singleImageUpload = document.getElementById('single-image-upload');
        if (singleImageUpload) {
            singleImageUpload.value = '';
        }
    }
    
    // 渲染文件预览
    renderFilePreview(file) {
        const previewContainer = document.getElementById('file-preview-container');
        const previewImg = document.getElementById('file-preview-img');
        const fileNameSpan = document.getElementById('file-name');
        const fileSizeSpan = document.getElementById('file-size');
        const startButton = document.getElementById('start-detection-button');
        const uploadZone = document.getElementById('single-upload-zone');

        if (!previewContainer || !previewImg || !fileNameSpan || !fileSizeSpan || !startButton || !uploadZone) return;

        // 隐藏上传区域，显示预览区域
        uploadZone.classList.add('hidden');
        previewContainer.classList.remove('hidden');
        startButton.disabled = false;

        fileNameSpan.textContent = file.name;
        fileSizeSpan.textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';

        // 创建本地URL进行预览
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    // 清除已选择的文件
    clearFile() {
        this.currentFile = null;
        const previewContainer = document.getElementById('file-preview-container');
        const startButton = document.getElementById('start-detection-button');
        const uploadZone = document.getElementById('single-upload-zone');
        const resultContent = document.getElementById('result-content');

        if (previewContainer) previewContainer.classList.add('hidden');
        if (uploadZone) uploadZone.classList.remove('hidden');
        if (startButton) startButton.disabled = true;
        
        // 清空结果区域
        if (resultContent) {
            resultContent.innerHTML = `
                <div class="placeholder-message">
                    <i class="fas fa-search"></i>
                    <p>请上传图片并点击 '开始AI分析' 获取结果</p>
                </div>
            `;
        }
        
        Utils.showMessage('已移除图片', 'info');
    }

    // 开始检测
    async startDetection() {
        if (!this.currentFile) {
            Utils.showMessage('请先上传图片', 'error');
            return;
        }
        
        const currentModeElement = document.querySelector('.mode-option.active');
        const mode = currentModeElement ? currentModeElement.dataset.mode : 'species'; // 默认种类识别
        const taskName = mode === 'species' ? '种类识别' : '成熟度评估';
        
        Utils.showLoader(`正在进行 ${taskName}，请稍候...`);
        
        const formData = new FormData();
        formData.append('image', this.currentFile);
        formData.append('task', mode); // 传递当前任务模式
        
        try {
            const response = await fetch('/api/detect', {
                method: 'POST',
                body: formData
            });

            Utils.hideLoader();
            const data = await response.json();
            
            if (response.ok) {
                // 处理成功
                Utils.showMessage(`${taskName} 完成！`, 'success');
                this.renderResults(data, mode);
                this.addToHistory(this.currentFile.name, data.detections, mode);
            } else {
                // 处理失败
                Utils.showMessage(`检测失败: ${data.error || '未知错误'}`, 'error');
                console.error('Detection Error:', data.error);
            }

        } catch (error) {
            Utils.hideLoader();
            Utils.showMessage(`网络请求失败: ${error.message}`, 'error');
            console.error('Fetch Error:', error);
        }
    }
    
    // 渲染检测结果
    renderResults(data, mode) {
        const resultContent = document.getElementById('result-content');
        if (!resultContent) return;
        
        const processedImageUrl = data.processed_image;
        const detections = data.detections;
        const taskName = mode === 'species' ? '种类识别' : '成熟度评估';
        
        // 1. 结果主视图：处理后的图片
        const imageResultHTML = `
            <div class="result-image-container">
                <h4>${taskName}结果图</h4>
                <img src="${processedImageUrl}" alt="AI处理后的图片" class="processed-image card-3d">
            </div>
        `;
        
        // 2. 检测详情列表
        let detailsHTML = `
            <div class="detection-details mt-4">
                <h4>检测详情 (${detections.length} 个目标)</h4>
                <div class="details-list">
        `;

        if (detections.length > 0) {
            detections.forEach((det, index) => {
                const confidence = (det.confidence * 100).toFixed(2);
                detailsHTML += `
                    <div class="detail-item">
                        <span class="detail-badge ${mode}">${det.class}</span>
                        <span class="detail-conf">置信度: ${confidence}%</span>
                        <span class="detail-box">坐标: [${det.box.join(', ')}]</span>
                    </div>
                `;
            });
        } else {
             detailsHTML += `<p class="empty-list-message">未检测到目标，请尝试更换图片。</p>`;
        }

        detailsHTML += `</div></div>`;
        
        // 3. 统计摘要
        const stats = this.generateStats(detections, mode);
        let statsHTML = `
            <div class="stats-summary mt-4">
                <h4>统计摘要</h4>
                <div class="stats-grid">
                    <div class="stat-card">总检测数<span>${detections.length}</span></div>
                    <div class="stat-card">检测模式<span>${taskName}</span></div>
                    ${Object.entries(stats).map(([key, value]) => `
                        <div class="stat-card ${mode}">${key}<span>${value}</span></div>
                    `).join('')}
                </div>
            </div>
        `;

        // 组装最终结果
        resultContent.innerHTML = imageResultHTML + detailsHTML + statsHTML;
    }
    
    // 根据检测结果生成统计数据
    generateStats(detections, mode) {
        const counts = {};
        let totalConf = 0;
        
        detections.forEach(det => {
            counts[det.class] = (counts[det.class] || 0) + 1;
            totalConf += det.confidence;
        });
        
        const stats = {};
        
        // 种类/成熟度计数
        Object.entries(counts).forEach(([className, count]) => {
            stats[`${className} 数量`] = count;
        });
        
        // 平均置信度
        if (detections.length > 0) {
            stats['平均置信度'] = `${(totalConf / detections.length * 100).toFixed(2)}%`;
        }
        
        return stats;
    }
    
    // 添加到历史记录
    addToHistory(filename, detections, mode) {
        const historyItem = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            filename: filename,
            mode: mode,
            count: detections.length
        };
        
        this.detectionHistory.unshift(historyItem);
        // 只保留最近的 10 条记录
        this.detectionHistory = this.detectionHistory.slice(0, 10); 
        Storage.set('detectionHistory', this.detectionHistory);
        this.loadHistory();
        
        // 启用导出按钮
        document.getElementById('export-results-button')?.removeAttribute('disabled');
    }
    
    // 加载历史记录到界面
    loadHistory() {
        const historyList = document.getElementById('detection-history');
        const exportButton = document.getElementById('export-results-button');
        
        if (!historyList) return;

        if (this.detectionHistory.length === 0) {
            historyList.innerHTML = `<p class="empty-list-message">暂无检测历史记录。</p>`;
            if(exportButton) exportButton.disabled = true;
            return;
        }
        
        historyList.innerHTML = this.detectionHistory.map(item => `
            <div class="history-item card-shadow">
                <div class="history-meta">
                    <span class="history-mode">${item.mode === 'species' ? '种类识别' : '成熟度评估'}</span>
                    <span class="history-time">${item.timestamp}</span>
                </div>
                <div class="history-details">
                    <p class="history-filename" title="${item.filename}"><i class="fas fa-image"></i> ${item.filename}</p>
                    <p class="history-count"><i class="fas fa-tag"></i> 检测目标: ${item.count} 个</p>
                </div>
            </div>
        `).join('');
        
        if(exportButton) exportButton.disabled = false;
    }
    
    addBatchFiles(files) {
        const queue = document.getElementById('batch-queue');
        if (!queue) return;

        // 实际应用中，这里需要存储文件对象或相关信息
        // 目前仅做界面展示
        Array.from(files).forEach(file => {
             // 检查文件类型
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                Utils.showMessage(`批量上传: 文件 ${file.name} 类型不支持`, 'warning');
                return;
            }
            
            const queueItem = document.createElement('div');
            queueItem.className = 'batch-queue-item card-shadow';
            queueItem.innerHTML = `
                <div class="queue-file-name">
                    <i class="fas fa-image"></i>
                    <span>${file.name}</span>
                </div>
                <div class="queue-file-size">${(file.size / 1024 / 1024).toFixed(2)} MB</div>
                <button class="queue-remove" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            queue.appendChild(queueItem);
        });
    }

    async processBatch() {
        const queueItems = document.querySelectorAll('.batch-queue-item');
        if (queueItems.length === 0) {
            Utils.showMessage('请先添加文件到处理队列', 'warning');
            return;
        }

        Utils.showMessage(`开始批量处理 ${queueItems.length} 个文件`, 'info');
        
        // 这里实现批量处理逻辑
        for (const item of queueItems) {
            // 模拟处理过程
            await new Promise(resolve => setTimeout(resolve, 1000));
            item.classList.add('processed');
        }

        Utils.showMessage('批量处理完成！', 'success');
    }

    clearBatchQueue() {
        const batchQueue = document.getElementById('batch-queue');
        if (batchQueue) {
            batchQueue.innerHTML = '';
        }
        Utils.showMessage('已清空处理队列', 'info');
    }

    exportResults() {
        Utils.showMessage('导出功能待实现', 'warning');
    }
}

// 确保在页面加载后初始化模块
document.addEventListener('DOMContentLoaded', () => {
    // 检查DOM中是否存在detect-section，如果有，则初始化
    if (document.getElementById('detect-section')) {
        window.detectModule = new DetectModule();
    }
});