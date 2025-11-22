// 工具函数库
class Utils {
    // DOM操作
    static $(selector) {
        return document.querySelector(selector);
    }
    
    static $$(selector) {
        return document.querySelectorAll(selector);
    }
    
    // 创建元素
    static createElement(tag, classes = '', content = '') {
        const element = document.createElement(tag);
        if (classes) element.className = classes;
        if (content) element.innerHTML = content;
        return element;
    }
    
    // 显示消息
    static showMessage(message, type = 'info', duration = 4000) {
        const messageEl = this.createElement('div', `message ${type}-message`);
        messageEl.textContent = message;
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.classList.add('fade-out');
            setTimeout(() => messageEl.remove(), 300);
        }, duration);
    }
    
    // 格式化数字
    static formatNumber(num, decimals = 0) {
        return new Intl.NumberFormat('zh-CN').format(num.toFixed(decimals));
    }
    
    // 随机延迟
    static randomDelay(min = 100, max = 1000) {
        return Math.random() * (max - min) + min;
    }
    
    // 防抖函数
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // 节流函数
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // 检测设备类型
    static getDeviceType() {
        const width = window.innerWidth;
        if (width < CONFIG.UI.BREAKPOINTS.MOBILE) return 'mobile';
        if (width < CONFIG.UI.BREAKPOINTS.TABLET) return 'tablet';
        return 'desktop';
    }
    
    // 复制到剪贴板
    static copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showMessage('已复制到剪贴板', 'success');
        }).catch(() => {
            this.showMessage('复制失败', 'error');
        });
    }
    
    // 下载文件
    static downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// 数据存储
class Storage {
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    }
    
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    }
    
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage remove error:', e);
            return false;
        }
    }
}