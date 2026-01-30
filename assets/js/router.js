/**
 * نظام التنقل بين صفحات نظام أبو جمال
 */

class AbuJamalRouter {
    constructor() {
        this.routes = {
            'index': '../index.html',
            'login': '../login.html',
            'target-analysis': '../pages/target-analysis.html',
            'phone-correlation': '../pages/phone-correlation.html',
            'device-intel': '../pages/device-intel.html',
            'network-map': '../pages/network-map.html',
            'logs': '../pages/logs.html',
            'terminal': '../pages/terminal.html',
            'system-control': '../pages/system-control.html',
            'threat-map': '../pages/threat-map.html',
            'about': '../pages/about.html'
        };
        
        this.init();
    }
    
    init() {
        console.log('🚦 تم تهيئة نظام التنقل');
        
        // إضافة مستمع لأحداث التنقل
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-navigate]');
            if (link) {
                e.preventDefault();
                const page = link.dataset.navigate;
                this.navigateTo(page);
            }
        });
    }
    
    navigateTo(page) {
        if (this.routes[page]) {
            window.location.href = this.routes[page];
        } else {
            console.error(`الصفحة غير موجودة: ${page}`);
            this.navigateTo('index');
        }
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        const page = Object.keys(this.routes).find(key => 
            this.routes[key].includes(path.split('/').pop())
        );
        return page || 'index';
    }
    
    // إضافة تأثير الانتقال
    addTransitionEffect() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 50);
    }
}

// تهيئة الراوتر
let Router;

document.addEventListener('DOMContentLoaded', function() {
    Router = new AbuJamalRouter();
    Router.addTransitionEffect();
});

// دالة مساعدة للتنقل
function navigateTo(page) {
    if (Router) {
        Router.navigateTo(page);
    } else {
        window.location.href = page + '.html';
    }
}