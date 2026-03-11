// AI API配置
const APIConfig = {
    // 本地AI生成配置（默认使用）
    localAI: {
        enabled: true,
        templates: {
            // 锅底模板
            potTemplates: {
                '麻辣牛油锅': '经典的川味麻辣牛油锅，汤底浓郁醇厚，辣椒和花椒的香气完美融合，牛油的醇香让整个锅底更加顺滑，辣而不燥，麻而不苦。',
                '番茄牛腩锅': '酸甜可口的番茄牛腩锅，番茄汤汁浓郁开胃，牛腩炖得软烂入味，番茄的天然酸味完美中和了牛肉的油腻感。',
                '菌菇养生锅': '鲜美的菌菇养生锅，多种野生菌菇熬制的汤底，味道鲜美醇厚，营养价值高，适合注重健康的食客。',
                '鸳鸯锅': '经典的鸳鸯锅设计，一边麻辣一边清汤，满足不同口味需求，非常贴心，适合朋友聚餐。'
            },
            
            // 特色菜品模板
            specialTemplates: {
                '极品肥牛': '极品肥牛肉质鲜嫩，大理石花纹分布均匀，涮煮后入口即化，肉香四溢。',
                '手打虾滑': '手工现打的虾滑，Q弹爽口，虾肉含量极高，鲜美无比，每一口都能吃到虾肉的颗粒感。',
                '毛肚': '新鲜的毛肚处理得非常干净，七上八下涮煮后脆嫩爽口，吸收了汤汁后更加美味。',
                '鸭血': '鲜鸭血嫩滑如豆腐，入口即化，吸收了汤汁后更加美味，没有任何腥味。',
                '黄喉': '脆黄喉处理得恰到好处，涮煮后爽脆弹牙，口感极佳，是火锅的绝配。',
                '脑花': '麻辣脑花处理得很干净，没有腥味，麻辣入味，口感绵密，像豆腐脑一样嫩滑。'
            },
            
            // 评分描述模板
            ratingTemplates: {
                taste: {
                    1: '口味比较普通，没有特别惊艳的感觉。',
                    2: '口味还不错，达到了火锅店的基本水准。',
                    3: '口味很好，汤底味道正宗，值得一试。',
                    4: '口味非常棒，麻辣鲜香恰到好处。',
                    5: '口味完美无缺，是我吃过的最好吃的火锅之一。'
                },
                service: {
                    1: '服务有待改进，响应速度较慢。',
                    2: '服务还算可以，基本需求能够得到满足。',
                    3: '服务热情周到，服务员态度很好。',
                    4: '服务非常满意，服务员主动帮忙加汤调火。',
                    5: '服务无微不至，从进门到离开全程都很贴心。'
                },
                environment: {
                    1: '环境比较普通，装修简单。',
                    2: '环境整洁干净，用餐氛围不错。',
                    3: '环境舒适温馨，装修有特色。',
                    4: '环境优雅大气，适合朋友聚会。',
                    5: '环境顶级享受，装修精致有格调。'
                }
            },
            
            // 结尾模板
            endingTemplates: [
                '非常满意的一次用餐体验！锅底正宗，食材新鲜，服务贴心，强烈推荐给喜欢吃火锅的朋友！',
                '整体体验很棒！从锅底到食材都能感受到店家的用心，下次还会再来！',
                '性价比超高的一家火锅店！味道好，服务佳，环境也不错，值得打卡！',
                '没想到这家火锅店这么惊艳！无论是口味还是服务都超出预期，已经成为我的火锅首选！'
            ]
        }
    },
    
    // 云端AI API配置（可选）
    cloudAI: {
        enabled: false,
        providers: {
            openai: {
                apiKey: '',
                endpoint: 'https://api.openai.com/v1/chat/completions',
                model: 'gpt-3.5-turbo',
                maxTokens: 300
            },
            baidu: {
                apiKey: '',
                endpoint: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
                model: 'ERNIE-Bot-4',
                maxTokens: 300
            },
            tencent: {
                apiKey: '',
                endpoint: 'https://api.tencentcloudapi.com',
                model: 'hunyuan-v1',
                maxTokens: 300
            }
        }
    },
    
    // 生成配置
    generation: {
        maxLength: 200, // 最大字数
        minLength: 100, // 最小字数
        hashtags: ['火锅探店', '美食打卡', '成都美食', '麻辣火锅', '吃货日常', '美食推荐', '周末去哪儿']
    }
};

// AI生成函数
class AIGenerator {
    constructor(config = APIConfig) {
        this.config = config;
    }
    
    // 生成好评文案
    async generateReview(data) {
        const { selectedDish, specialDishes, ratings } = data;
        
        try {
            if (this.config.localAI.enabled) {
                return this.generateLocalReview(data);
            } else if (this.config.cloudAI.enabled) {
                return await this.generateCloudReview(data);
            } else {
                throw new Error('没有可用的AI生成器');
            }
        } catch (error) {
            console.error('AI生成失败:', error);
            return this.generateFallbackReview(data);
        }
    }
    
    // 本地生成
    generateLocalReview(data) {
        const { selectedDish, specialDishes, ratings } = data;
        const templates = this.config.localAI.templates;
        
        let review = `🔥 打卡麻辣火锅坊！\n\n`;
        
        // 锅底描述
        if (selectedDish && templates.potTemplates[selectedDish]) {
            review += `今天尝试了${selectedDish}，${templates.potTemplates[selectedDish]}\n\n`;
        }
        
        // 特色菜品
        if (specialDishes && specialDishes.length > 0) {
            review += `特别推荐：${specialDishes.join('、')}。`;
            specialDishes.forEach(dish => {
                if (templates.specialTemplates[dish]) {
                    review += ` ${templates.specialTemplates[dish]}`;
                }
            });
            review += '\n\n';
        }
        
        // 评分描述
        review += `💫 用餐体验：\n`;
        if (ratings.taste && templates.ratingTemplates.taste[ratings.taste]) {
            review += `• 口味：${templates.ratingTemplates.taste[ratings.taste]}\n`;
        }
        if (ratings.service && templates.ratingTemplates.service[ratings.service]) {
            review += `• 服务：${templates.ratingTemplates.service[ratings.service]}\n`;
        }
        if (ratings.environment && templates.ratingTemplates.environment[ratings.environment]) {
            review += `• 环境：${templates.ratingTemplates.environment[ratings.environment]}\n`;
        }
        review += '\n';
        
        // 随机结尾
        const randomEnding = templates.endingTemplates[Math.floor(Math.random() * templates.endingTemplates.length)];
        review += `🌟 总结：${randomEnding}\n`;
        review += `人均消费约120元，性价比超高！\n\n`;
        
        // 标签
        const hashtags = this.config.generation.hashtags;
        const selectedHashtags = [];
        for (let i = 0; i < Math.min(5, hashtags.length); i++) {
            selectedHashtags.push(hashtags[Math.floor(Math.random() * hashtags.length)]);
        }
        review += `#${selectedHashtags.join(' #')}`;
        
        return this.truncateReview(review);
    }
    
    // 云端生成
    async generateCloudReview(data) {
        // 这里可以集成真实的AI API
        // 由于需要API密钥，这里仅提供框架
        throw new Error('云端AI需要配置API密钥');
    }
    
    // 备用生成（当AI失败时）
    generateFallbackReview(data) {
        const { selectedDish, specialDishes, ratings } = data;
        
        let review = `🔥 打卡麻辣火锅坊！\n\n`;
        review += `今天品尝了${selectedDish || '火锅'}，味道非常不错！\n\n`;
        
        if (specialDishes && specialDishes.length > 0) {
            review += `特别推荐${specialDishes.join('、')}，都很新鲜好吃。\n\n`;
        }
        
        review += `用餐体验：\n`;
        if (ratings.taste) review += `• 口味：${ratings.taste}星\n`;
        if (ratings.service) review += `• 服务：${ratings.service}星\n`;
        if (ratings.environment) review += `• 环境：${ratings.environment}星\n\n`;
        
        review += `整体体验很棒，值得推荐！\n`;
        review += `#火锅探店 #美食打卡`;
        
        return review;
    }
    
    // 截断文案到指定长度
    truncateReview(review) {
        const maxLength = this.config.generation.maxLength;
        if (review.length <= maxLength) return review;
        
        // 尝试在句号处截断
        const sentences = review.split('。');
        let truncated = '';
        
        for (const sentence of sentences) {
            if ((truncated + sentence + '。').length <= maxLength) {
                truncated += sentence + '。';
            } else {
                break;
            }
        }
        
        // 如果截断后太短，直接截取
        if (truncated.length < this.config.generation.minLength) {
            truncated = review.substring(0, maxLength - 3) + '...';
        }
        
        return truncated;
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APIConfig, AIGenerator };
}

// 浏览器全局变量
if (typeof window !== 'undefined') {
    window.APIConfig = APIConfig;
    window.AIGenerator = AIGenerator;
}