// تأثير المصفوفة المتقدم
class MatrixEffect {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.drops = [];
        this.symbols = "01اأإآبةتثجحخدذرزسشصضطظعغفقكلمنهوي٠١٢٣٤٥٦٧٨٩";
        this.fontSize = 14;
        this.columns = 0;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        // تعيين حجم الكانفاس
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // تهيئة الأعمدة
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
        
        // بدء التأثير
        this.start();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }
    
    start() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.draw();
    }
    
    draw() {
        // خلفية شفافة
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.04)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // لون النص
        this.ctx.fillStyle = '#0f0';
        this.ctx.font = `${this.fontSize}px 'JetBrains Mono', monospace`;
        
        // رسم الرموز
        for (let i = 0; i < this.drops.length; i++) {
            // نص عشوائي
            const text = this.symbols.charAt(Math.floor(Math.random() * this.symbols.length));
            
            // إحداثيات العمود
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            // رسم الرمز
            this.ctx.fillStyle = '#0f0';
            this.ctx.fillText(text, x, y);
            
            // تدرج الألوان للرموز الأولى
            if (this.drops[i] * this.fontSize > this.canvas.height * 0.9 && Math.random() > 0.975) {
                this.ctx.fillStyle = 'rgba(0, 255, 157, 0.7)';
                this.ctx.fillText(text, x, y);
            } else if (this.drops[i] * this.fontSize > this.canvas.height * 0.7 && Math.random() > 0.95) {
                this.ctx.fillStyle = 'rgba(0, 204, 255, 0.6)';
                this.ctx.fillText(text, x, y);
            }
            
            // إعادة تعيين القطرة عند الوصول للأسفل
            if (y > this.canvas.height && Math.random() > 0.98) {
                this.drops[i] = 0;
            }
            
            // زيادة موضع القطرة
            this.drops[i]++;
        }
        
        // تأثير خط المسح
        this.drawScanLine();
        
        // استمرار الرسم
        this.animationId = requestAnimationFrame(() => this.draw());
    }
    
    drawScanLine() {
        // خط المسح المتحرك
        const scanY = (Date.now() / 20) % this.canvas.height;
        
        // تدرج الخط
        const gradient = this.ctx.createLinearGradient(0, scanY, 0, scanY + 100);
        gradient.addColorStop(0, 'rgba(0, 255, 157, 0)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 157, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 255, 157, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, scanY, this.canvas.width, 100);
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    setSpeed(speed) {
        // التحكم بسرعة التأثير
        this.speed = speed;
    }
}

// تهيئة تأثير المصفوفة
function startMatrixEffect() {
    if (!document.getElementById('matrix-canvas')) {
        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-canvas';
        document.body.appendChild(canvas);
    }
    
    window.matrixEffect = new MatrixEffect('matrix-canvas');
}