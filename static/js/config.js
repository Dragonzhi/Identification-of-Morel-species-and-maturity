// 系统配置
const CONFIG = {
    // API端点
    ENDPOINTS: {
        SPECIES_DETECT: '/detect',
        MATURITY_DETECT: '/detect_maturity',
        BATCH_PROCESS: '/batch_process',
        SYSTEM_STATUS: '/system_status'
    },
    
    // 动画配置
    ANIMATION: {
        DURATION: {
            SHORT: 300,
            MEDIUM: 600,
            LONG: 1000
        },
        EASING: {
            SMOOTH: 'cubic-bezier(0.4, 0, 0.2, 1)',
            BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        }
    },
    
    // 功能开关
    FEATURES: {
        REAL_TIME_ANALYSIS: true,
        BATCH_PROCESSING: true,
        ADVANCED_ANALYTICS: true,
        MODEL_COMPARISON: true
    },
    
    // 界面配置
    UI: {
        THEME: {
            PRIMARY: '#4ecca3',
            SECONDARY: '#00b4d8',
            ACCENT: '#ff6b6b',
            BACKGROUND: '#1a1a2e'
        },
        BREAKPOINTS: {
            MOBILE: 768,
            TABLET: 1024,
            DESKTOP: 1200
        }
    }
};

// 系统状态
const SYSTEM_STATE = {
    currentSection: 'home',
    isProcessing: false,
    currentModel: 'species',
    userPreferences: {
        theme: 'dark',
        animations: true,
        notifications: true
    }
};