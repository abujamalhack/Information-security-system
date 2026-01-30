// محرك التحليل المتقدم لنظام أبو جمال
class AdvancedAnalyzer {
    constructor() {
        this.scanHistory = [];
        this.threatPatterns = this.initializeThreatPatterns();
        this.behaviorModels = this.initializeBehaviorModels();
    }
    
    initializeThreatPatterns() {
        return {
            burners: {
                pattern: /\+96777[0-9]{7}/,
                risk: 30,
                description: "رقم هاتف محروق (مؤقت)"
            },
            lateNight: {
                pattern: /([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]/,
                condition: (time) => {
                    const hour = parseInt(time.split(':')[0]);
                    return hour >= 22 || hour <= 5;
                },
                risk: 20,
                description: "نشاط في ساعات متأخرة"
            },
            encryptedComms: {
                keywords: ['Signal', 'Telegram Secret', 'Encrypted', 'PGP'],
                risk: 40,
                description: "استخدام اتصالات مشفرة"
            }
        };
    }
    
    initializeBehaviorModels() {
        return {
            normal: {
                activityHours: [8, 22],
                locationChanges: 2,
                contactFrequency: 5
            },
            suspicious: {
                activityHours: [22, 8],
                locationChanges: 5,
                contactFrequency: 20
            },
            threat: {
                activityHours: [0, 6],
                locationChanges: 10,
                contactFrequency: 50
            }
        };
    }
    
    // تحليل متقدم للرقم
    advancedPhoneAnalysis(phoneNumber) {
        const basicAnalysis = DB.analyzePhoneNumber(phoneNumber);
        
        if (!basicAnalysis.found) {
            return {
                ...basicAnalysis,
                advanced: {
                    behavioralScore: 0,
                    patternMatches: [],
                    anomalyCount: 0,
                    confidence: "LOW"
                }
            };
        }
        
        // تحليل أنماط التهديد
        const patternMatches = this.detectThreatPatterns(basicAnalysis);
        
        // تحليل السلوك
        const behavioralScore = this.analyzeBehavior(basicAnalysis);
        
        // اكتشاف الشذوذ
        const anomalies = this.detectAnomalies(basicAnalysis);
        
        // حساب درجة الثقة
        const confidence = this.calculateConfidence(basicAnalysis, patternMatches, behavioralScore);
        
        return {
            ...basicAnalysis,
            advanced: {
                behavioralScore,
                patternMatches,
                anomalies,
                confidence,
                recommendations: this.generateAdvancedRecommendations(basicAnalysis, patternMatches, behavioralScore)
            }
        };
    }
    
    detectThreatPatterns(analysis) {
        const matches = [];
        const target = analysis.target;
        const phone = analysis.phone;
        
        // تحقق من أرقام الهواتف المحروقة
        if (phone.type === 'BURNER') {
            matches.push({
                pattern: 'burners',
                description: 'رقم هاتف محروق (استخدام مؤقت)',
                risk: 30
            });
        }
        
        // تحقق من النشاط الليلي
        const lastActive = new Date(phone.lastUsed);
        const hour = lastActive.getHours();
        if (hour >= 22 || hour <= 5) {
            matches.push({
                pattern: 'lateNight',
                description: 'نشاط في ساعات متأخرة (مشبوه)',
                risk: 20
            });
        }
        
        // تحقق من استخدام الاتصالات المشفرة
        if (analysis.target.platform && 
            analysis.target.platform.toLowerCase().includes('telegram') ||
            analysis.target.secondaryPlatforms?.some(p => 
                p.toLowerCase().includes('signal') || 
                p.toLowerCase().includes('encrypted')
            )) {
            matches.push({
                pattern: 'encryptedComms',
                description: 'استخدام منصات اتصال مشفرة',
                risk: 40
            });
        }
        
        return matches;
    }
    
    analyzeBehavior(analysis) {
        let score = 50; // درجة أساسية
        
        const target = analysis.target;
        const phone = analysis.phone;
        
        // تحليل التردد
        if (target.activityPattern === 'NIGHT_ACTIVE') {
            score += 25;
        }
        
        // تحليل التنوع الجغرافي
        if (phone.location && phone.location.includes(',')) {
            score += 15;
        }
        
        // تحليل الاتصالات المتعددة
        if (analysis.network?.connections?.length > 3) {
            score += (analysis.network.connections.length - 3) * 5;
        }
        
        return Math.min(score, 100);
    }
    
    detectAnomalies(analysis) {
        const anomalies = [];
        
        // تباين في معلومات الجهاز
        const device = analysis.device;
        if (device) {
            if (device.os && device.os.includes('Android') && 
                device.securityPatch && 
                this.isPatchOutdated(device.securityPatch)) {
                anomalies.push({
                    type: 'SECURITY_PATCH',
                    description: 'تصحيح أمني قديم جداً',
                    severity: 'MEDIUM'
                });
            }
            
            if (device.vulnerabilities && device.vulnerabilities.length > 2) {
                anomalies.push({
                    type: 'MULTIPLE_VULNERABILITIES',
                    description: `${device.vulnerabilities.length} ثغرات أمنية`,
                    severity: 'HIGH'
                });
            }
        }
        
        // تناقض في المعلومات
        if (analysis.phone.carrier === 'MTN Yemen' && 
            analysis.phone.location && 
            analysis.phone.location.includes('Aden')) {
            // MTN ليس المشغل الأساسي في عدن
            anomalies.push({
                type: 'LOCATION_CARRIER_MISMATCH',
                description: 'عدم تطابق بين الموقع والمشغل',
                severity: 'LOW'
            });
        }
        
        return anomalies;
    }
    
    isPatchOutdated(patchDate) {
        const patch = new Date(patchDate);
        const now = new Date();
        const diffMonths = (now.getFullYear() - patch.getFullYear()) * 12 + 
                         (now.getMonth() - patch.getMonth());
        return diffMonths > 6;
    }
    
    calculateConfidence(analysis, patterns, behavioralScore) {
        let confidenceScore = 70; // درجة أساسية
        
        // زيادة الثقة بناءً على كمية البيانات
        if (analysis.device) confidenceScore += 10;
        if (analysis.network) confidenceScore += 10;
        if (patterns.length > 0) confidenceScore += 5;
        
        // تقليل الثقة بناءً على الشذوذ
        const anomalies = this.detectAnomalies(analysis);
        confidenceScore -= anomalies.length * 5;
        
        // تصنيف الثقة
        if (confidenceScore >= 90) return "VERY_HIGH";
        if (confidenceScore >= 80) return "HIGH";
        if (confidenceScore >= 70) return "MEDIUM_HIGH";
        if (confidenceScore >= 60) return "MEDIUM";
        return "LOW";
    }
    
    generateAdvancedRecommendations(analysis, patterns, behavioralScore) {
        const recommendations = [];
        
        // توصيات بناءً على أنماط التهديد
        patterns.forEach(pattern => {
            if (pattern.risk >= 30) {
                recommendations.push(`مراقبة نمط ${pattern.description}`);
            }
        });
        
        // توصيات بناءً على درجة السلوك
        if (behavioralScore >= 70) {
            recommendations.push('مراقبة مكثفة للسلوك');
        }
        
        // توصيات بناءً على الثغرات
        if (analysis.device?.vulnerabilities?.length > 0) {
            recommendations.push('استغلال الثغرات الأمنية المتاحة');
        }
        
        // توصيات بناءً على الشبكة
        if (analysis.network?.connections?.length > 2) {
            recommendations.push('توسيع نطاق تحليل الشبكة');
        }
        
        return recommendations.length > 0 ? recommendations : ['المراقبة الدورية'];
    }
    
    // تحليل الشبكة الاجتماعية
    analyzeSocialNetwork(targetId) {
        const target = DB.getTarget(targetId);
        if (!target) return null;
        
        const network = target.network || { connections: [] };
        const centrality = this.calculateCentrality(network.connections);
        
        return {
            nodes: network.connections.length,
            centrality,
            keyNodes: this.identifyKeyNodes(network.connections),
            recommendations: this.generateNetworkRecommendations(network.connections)
        };
    }
    
    calculateCentrality(connections) {
        if (connections.length === 0) return 0;
        
        // حساب درجة المركزية البسيطة
        let totalStrength = 0;
        connections.forEach(conn => {
            if (conn.strength === 'STRONG') totalStrength += 3;
            else if (conn.strength === 'MEDIUM') totalStrength += 2;
            else totalStrength += 1;
        });
        
        return Math.min(totalStrength / (connections.length * 3), 1);
    }
    
    identifyKeyNodes(connections) {
        return connections
            .filter(conn => conn.strength === 'STRONG')
            .map(conn => ({
                target: conn.target,
                relationship: conn.relationship,
                priority: 'HIGH'
            }));
    }
    
    generateNetworkRecommendations(connections) {
        const recommendations = [];
        
        if (connections.length >= 3) {
            recommendations.push('تحليل التفاعلات بين العقد');
        }
        
        const strongConnections = connections.filter(c => c.strength === 'STRONG');
        if (strongConnections.length >= 2) {
            recommendations.push('مراقبة العلاقات القوية');
        }
        
        return recommendations.length > 0 ? recommendations : ['توسيع جمع البيانات الشبكية'];
    }
    
    // مسح عميق
    deepScan(targetId) {
        const analysis = this.advancedPhoneAnalysis(targetId);
        
        // محاكاة المسح العميق
        const deepResults = {
            ...analysis,
            timeline: this.generateTimelineAnalysis(),
            predictive: this.generatePredictiveAnalysis(analysis),
            countermeasures: this.generateCountermeasures(analysis)
        };
        
        // حفظ في السجل
        this.scanHistory.push({
            timestamp: new Date().toISOString(),
            targetId,
            results: deepResults
        });
        
        return deepResults;
    }
    
    generateTimelineAnalysis() {
        const now = new Date();
        const timeline = [];
        
        // إنشاء جدول زمني عشوائي
        for (let i = 7; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            timeline.push({
                date: date.toLocaleDateString(),
                activity: Math.floor(Math.random() * 10),
                risk: Math.floor(Math.random() * 100)
            });
        }
        
        return timeline;
    }
    
    generatePredictiveAnalysis(analysis) {
        const risk = analysis.analysis?.riskScore || 50;
        
        return {
            nextActivity: this.predictNextActivity(risk),
            riskTrend: risk > 70 ? 'INCREASING' : risk > 30 ? 'STABLE' : 'DECREASING',
            probability: Math.min(risk + 20, 95)
        };
    }
    
    predictNextActivity(risk) {
        const activities = [
            'زيادة النشاط على وسائل التواصل',
            'تغيير رقم الهاتف',
            'توسيع الشبكة',
            'النشاط خلال ساعات الذروة',
            'تقليل النشاط (اختفاء مؤقت)'
        ];
        
        return activities[Math.floor(Math.random() * activities.length)];
    }
    
    generateCountermeasures(analysis) {
        const countermeasures = [];
        const risk = analysis.analysis?.riskScore || 50;
        
        if (risk >= 70) {
            countermeasures.push('مراقبة 24/7');
            countermeasures.push('التدخل الإلكتروني');
            countermeasures.push('عزل الشبكة');
        } else if (risk >= 40) {
            countermeasures.push('مراقبة منتظمة');
            countermeasures.push('جمع معلومات إضافية');
        } else {
            countermeasures.push('مراقبة عابرة');
        }
        
        return countermeasures;
    }
}

// إنشاء نسخة عامة من المحلل
const AdvancedAnalyzerInstance = new AdvancedAnalyzer();