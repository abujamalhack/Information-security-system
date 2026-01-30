/**
 * نواة نظام أبو جمال للذكاء السيبراني
 * الإصدار 2.0 - نظام محاكاة متقدم
 */

class AbuJamalCore {
    constructor() {
        this.systemStatus = {
            initialized: false,
            securityLevel: 'MAXIMUM',
            mode: 'INTELLIGENCE',
            lastUpdate: null,
            alerts: [],
            performance: {
                cpu: 0,
                memory: 0,
                storage: 0
            }
        };
        
        this.modules = {
            analyzer: null,
            terminal: null,
            network: null,
            logs: null
        };
        
        this.user = {
            id: null,
            clearance: null,
            sessionStart: null
        };
        
        this.init();
    }
    
    init() {
        console.log('🚀 تهيئة نواة نظام أبو جمال...');
        
        // تعيين معلومات المستخدم
        this.user.id = localStorage.getItem('operatorId') || 'AJ-GUEST-001';
        this.user.clearance = this.determineClearance(this.user.id);
        this.user.sessionStart = new Date();
        
        // تحديث حالة النظام
        this.systemStatus.lastUpdate = new Date();
        this.systemStatus.initialized = true;
        
        // بدء مراقبة الأداء
        this.startPerformanceMonitor();
        
        // تسجيل بدء الجلسة
        this.logSystemEvent('SYSTEM_INIT', 'System initialized successfully');
        
        console.log('✅ تم تهيئة النظام بنجاح');
        console.log(`👤 المشغل: ${this.user.id} | التخويل: ${this.user.clearance}`);
    }
    
    determineClearance(operatorId) {
        const clearanceMap = {
            'AJ-OPERATOR-001': 'LEVEL_10',
            'AJ-ANALYST-002': 'LEVEL_8',
            'AJ-MONITOR-003': 'LEVEL_5',
            'AJ-EMERGENCY-001': 'LEVEL_3'
        };
        
        return clearanceMap[operatorId] || 'LEVEL_1';
    }
    
    startPerformanceMonitor() {
        // محاكاة مراقبة الأداء
        setInterval(() => {
            this.systemStatus.performance = {
                cpu: Math.floor(Math.random() * 30) + 10,
                memory: Math.floor(Math.random() * 40) + 30,
                storage: Math.floor(Math.random() * 20) + 60
            };
            
            // إضافة تنبيه إذا كان الاستخدام عالي
            if (this.systemStatus.performance.cpu > 80) {
                this.addAlert('HIGH_CPU_USAGE', 'warning');
            }
            
            if (this.systemStatus.performance.memory > 85) {
                this.addAlert('HIGH_MEMORY_USAGE', 'warning');
            }
        }, 5000);
    }
    
    addAlert(type, severity) {
        const alerts = {
            'HIGH_CPU_USAGE': 'استخدام وحدة المعالجة المركزية مرتفع',
            'HIGH_MEMORY_USAGE': 'استخدام الذاكرة مرتفع',
            'SYSTEM_SCAN': 'مسح النظام جارٍ',
            'THREAT_DETECTED': 'تم اكتشاف تهديد'
        };
        
        const alert = {
            id: Date.now(),
            type,
            message: alerts[type] || type,
            severity,
            timestamp: new Date().toISOString(),
            acknowledged: false
        };
        
        this.systemStatus.alerts.unshift(alert);
        
        // الاحتفاظ بآخر 10 تنبيهات فقط
        if (this.systemStatus.alerts.length > 10) {
            this.systemStatus.alerts = this.systemStatus.alerts.slice(0, 10);
        }
        
        // عرض التنبيه
        this.displayAlert(alert);
        
        return alert;
    }
    
    displayAlert(alert) {
        // إنشاء عنصر التنبيه
        const alertEl = document.createElement('div');
        alertEl.className = `alert ${alert.severity}`;
        alertEl.innerHTML = `
            <div class="alert-header">
                <span class="alert-icon">⚠️</span>
                <span class="alert-title">${alert.severity === 'warning' ? 'تحذير' : 'تنبيه'}</span>
                <span class="alert-time">${new Date(alert.timestamp).toLocaleTimeString()}</span>
            </div>
            <div class="alert-content">
                ${alert.message}
            </div>
            <button class="alert-dismiss" onclick="this.parentElement.remove()">✕</button>
        `;
        
        // إضافة إلى حاوية التنبيهات
        const container = document.getElementById('alert-container');
        if (container) {
            container.appendChild(alertEl);
            
            // إزالة تلقائية بعد 10 ثوان
            setTimeout(() => {
                if (alertEl.parentElement) {
                    alertEl.remove();
                }
            }, 10000);
        }
    }
    
    logSystemEvent(event, details) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event,
            details,
            operator: this.user.id,
            clearance: this.user.clearance
        };
        
        // إرسال إلى وحدة السجلات إذا كانت متاحة
        if (this.modules.logs) {
            this.modules.logs.addLog(logEntry);
        }
        
        // تسجيل في وحدة التحكم
        console.log(`📝 [${logEntry.timestamp}] ${event}: ${details}`);
        
        return logEntry;
    }
    
    // وظائف الأمان
    securityCheck(action, requiredClearance) {
        const clearanceLevels = {
            'LEVEL_1': 1,
            'LEVEL_3': 3,
            'LEVEL_5': 5,
            'LEVEL_8': 8,
            'LEVEL_10': 10
        };
        
        const userLevel = clearanceLevels[this.user.clearance] || 0;
        const requiredLevel = clearanceLevels[requiredClearance] || 0;
        
        if (userLevel < requiredLevel) {
            this.logSystemEvent('SECURITY_VIOLATION', 
                `محاولة وصول غير مصرح بها: ${action} من قبل ${this.user.id}`);
            return false;
        }
        
        return true;
    }
    
    // إدارة النظام
    getSystemInfo() {
        return {
            ...this.systemStatus,
            user: { ...this.user },
            uptime: this.getUptime(),
            modules: Object.keys(this.modules).filter(k => this.modules[k] !== null)
        };
    }
    
    getUptime() {
        const now = new Date();
        const diff = now - this.user.sessionStart;
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // التحكم بالنظام
    changeSecurityLevel(level) {
        const validLevels = ['MINIMUM', 'LOW', 'MEDIUM', 'HIGH', 'MAXIMUM'];
        
        if (!validLevels.includes(level)) {
            throw new Error(`مستوى أمان غير صالح: ${level}`);
        }
        
        if (!this.securityCheck('CHANGE_SECURITY_LEVEL', 'LEVEL_8')) {
            return false;
        }
        
        this.systemStatus.securityLevel = level;
        this.logSystemEvent('SECURITY_LEVEL_CHANGE', 
            `تم تغيير مستوى الأمان إلى: ${level}`);
        
        return true;
    }
    
    changeMode(mode) {
        const validModes = ['ANALYSIS', 'INTELLIGENCE', 'SURVEILLANCE', 'STEALTH'];
        
        if (!validModes.includes(mode)) {
            throw new Error(`وضع غير صالح: ${mode}`);
        }
        
        this.systemStatus.mode = mode;
        this.logSystemEvent('MODE_CHANGE', `تم تغيير الوضع إلى: ${mode}`);
        
        return true;
    }
    
    // إدارة الجلسة
    logout() {
        const sessionDuration = this.getUptime();
        
        this.logSystemEvent('SESSION_END', 
            `انتهت جلسة ${this.user.id} بعد ${sessionDuration}`);
        
        // مسح بيانات الجلسة
        localStorage.removeItem('operatorId');
        
        return {
            success: true,
            duration: sessionDuration,
            operator: this.user.id
        };
    }
    
    // تسجيل الأخطاء
    logError(error, context) {
        const errorEntry = {
            timestamp: new Date().toISOString(),
            type: error.name,
            message: error.message,
            context,
            stack: error.stack,
            operator: this.user.id
        };
        
        console.error('❌ خطأ في النظام:', errorEntry);
        
        // إضافة تنبيه للخطأ
        this.addAlert(`SYSTEM_ERROR: ${error.name}`, 'critical');
        
        return errorEntry;
    }
    
    // إعادة تعيين النظام
    resetSystem() {
        if (!this.securityCheck('SYSTEM_RESET', 'LEVEL_10')) {
            return false;
        }
        
        this.logSystemEvent('SYSTEM_RESET', 
            `إعادة تعيين النظام بواسطة ${this.user.id}`);
        
        // محاكاة إعادة التعيين
        this.systemStatus = {
            ...this.systemStatus,
            performance: { cpu: 0, memory: 0, storage: 0 },
            alerts: []
        };
        
        return true;
    }
}

// إنشاء نسخة عامة من النواة
let Core;

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    try {
        Core = new AbuJamalCore();
        
        // تعيين النواة في النطاق العام
        window.AbuJamalCore = Core;
        
        // تحديث الساعة
        function updateClock() {
            const clockEl = document.getElementById('terminal-clock');
            if (clockEl) {
                const now = new Date();
                clockEl.textContent = now.toLocaleTimeString('en-GB');
            }
        }
        
        // تحديث الساعة كل ثانية
        setInterval(updateClock, 1000);
        updateClock();
        
        // تحديث معلومات النظام
        function updateSystemInfo() {
            if (Core && Core.getSystemInfo) {
                const info = Core.getSystemInfo();
                
                // تحديث أي عناصر تعرض معلومات النظام
                const elements = {
                    'system-status': info.systemStatus.online ? 'نشط' : 'غير نشط',
                    'security-level': info.securityLevel,
                    'uptime-display': info.uptime
                };
                
                Object.keys(elements).forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.textContent = elements[id];
                });
            }
        }
        
        // تحديث معلومات النظام كل 5 ثوان
        setInterval(updateSystemInfo, 5000);
        updateSystemInfo();
        
    } catch (error) {
        console.error('فشل في تهيئة نواة النظام:', error);
        
        // نسخة بديلة في حالة الفشل
        Core = {
            logSystemEvent: (event, details) => 
                console.log(`[بديل] ${event}: ${details}`),
            securityCheck: () => true,
            getSystemInfo: () => ({ initialized: false })
        };
    }
});

// وظائف مساعدة عامة
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function formatDate(date) {
    return new Date(date).toLocaleString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function generateId(prefix = 'ID') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// تصدير الوظائف
window.showNotification = showNotification;
window.formatDate = formatDate;
window.generateId = generateId;