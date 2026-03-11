// 火锅店AI好评生成系统 - JavaScript主文件

document.addEventListener('DOMContentLoaded', function() {
    // 状态变量
    let state = {
        selectedDish: null,
        specialDishes: [],
        ratings: {
            taste: 0,
            service: 0,
            environment: 0
        },
        generatedReview: '',
        isEditing: false
    };

    // DOM元素
    const dishCards = document.querySelectorAll('.dish-card');
    const specialCheckboxes = document.querySelectorAll('input[name="special"]');
    const stars = document.querySelectorAll('.stars i');
    const generateBtn = document.getElementById('generateBtn');
    const reviewSection = document.querySelector('.review-section');
    const reviewTextarea = document.getElementById('reviewText');
    const wordCountEl = document.getElementById('wordCount');
    const copyBtn = document.getElementById('copyBtn');
    const regenerateBtn = document.getElementById('regenerateBtn');
    const editBtn = document.getElementById('editBtn');
    const publishSection = document.querySelector('.publish-section');
    const publishBtn = document.getElementById('publishBtn');
    const loadingOverlay = document.getElementById('loading');
    const progressSteps = document.querySelectorAll('.step');

    // 初始化事件监听
    initEventListeners();

    // 菜品选择
    function initEventListeners() {
        // 菜品卡片点击
        dishCards.forEach(card => {
            card.addEventListener('click', function() {
                dishCards.forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
                state.selectedDish = this.dataset.dish;
                updateProgress();
            });
        });

        // 特色菜品选择
        specialCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const value = this.value;
                if (this.checked) {
                    state.specialDishes.push(value);
                } else {
                    state.specialDishes = state.specialDishes.filter(dish => dish !== value);
                }
            });
        });

        // 星级评分
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const category = this.parentElement.dataset.category;
                const value = parseInt(this.dataset.value);
                
                // 更新评分
                state.ratings[category] = value;
                
                // 更新星星显示
                const categoryStars = this.parentElement.querySelectorAll('i');
                categoryStars.forEach((s, index) => {
                    if (index < value) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
                
                updateProgress();
            });
        });

        // AI生成按钮
        generateBtn.addEventListener('click', generateReview);

        // 复制按钮
        copyBtn.addEventListener('click', copyReview);

        // 重新生成按钮
        regenerateBtn.addEventListener('click', generateReview);

        // 编辑按钮
        editBtn.addEventListener('click', toggleEditMode);

        // 发布按钮
        publishBtn.addEventListener('click', publishToXiaohongshu);

        // 字数统计
        reviewTextarea.addEventListener('input', updateWordCount);
    }

    // 更新进度步骤
    function updateProgress() {
        let completedSteps = 0;
        
        if (state.selectedDish) completedSteps++;
        if (state.ratings.taste > 0) completedSteps++;
        
        // 更新步骤激活状态
        progressSteps.forEach((step, index) => {
            if (index < completedSteps) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    // 生成好评文案
    async function generateReview() {
        // 验证必填项
        if (!state.selectedDish) {
            showMessage('请先选择您品尝的锅底', 'error');
            return;
        }

        if (state.ratings.taste === 0) {
            showMessage('请为口味评分', 'error');
            return;
        }

        // 显示加载动画
        showLoading(true);

        try {
            // 模拟AI生成延迟
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // 生成好评文案
            const review = generateAIContent();
            state.generatedReview = review;
            
            // 更新UI
            reviewTextarea.value = review;
            reviewTextarea.readOnly = true;
            state.isEditing = false;
            editBtn.innerHTML = '<i class="fas fa-edit"></i> 编辑文案';
            
            // 显示好评区域
            reviewSection.style.display = 'block';
            
            // 更新进度
            progressSteps[1].classList.add('active');
            
            // 隐藏生成按钮区域
            generateBtn.parentElement.style.display = 'none';
            
            // 显示发布区域
            publishSection.style.display = 'block';
            progressSteps[2].classList.add('active');
            
            // 更新字数
            updateWordCount();
            
            showMessage('AI好评生成成功！', 'success');
            
        } catch (error) {
            console.error('生成失败:', error);
            showMessage('生成失败，请重试', 'error');
        } finally {
            showLoading(false);
        }
    }

    // AI内容生成逻辑
    function generateAIContent() {
        const dish = state.selectedDish;
        const specials = state.specialDishes;
        const { taste, service, environment } = state.ratings;
        
        // 评分形容词
        const tasteAdjectives = {
            1: '一般',
            2: '不错',
            3: '很好',
            4: '非常棒',
            5: '完美无缺'
        };
        
        const serviceAdjectives = {
            1: '有待改进',
            2: '还算可以',
            3: '热情周到',
            4: '非常满意',
            5: '无微不至'
        };
        
        const environmentAdjectives = {
            1: '普通',
            2: '整洁',
            3: '舒适',
            4: '优雅',
            5: '顶级享受'
        };
        
        // 菜品描述
        const dishDescriptions = {
            '麻辣牛油锅': '经典的川味麻辣牛油锅，汤底浓郁醇厚，辣椒和花椒的香气完美融合，牛油的醇香让整个锅底更加顺滑。',
            '番茄牛腩锅': '酸甜可口的番茄牛腩锅，番茄汤汁浓郁开胃，牛腩炖得软烂入味，营养又美味。',
            '菌菇养生锅': '鲜美的菌菇养生锅，多种野生菌菇熬制的汤底，味道鲜美醇厚，滋补养生首选。',
            '鸳鸯锅': '经典的鸳鸯锅设计，一边麻辣一边清汤，满足不同口味需求，非常贴心。'
        };
        
        // 特色菜品描述
        const specialDescriptions = {
            '极品肥牛': '极品肥牛肉质鲜嫩，大理石花纹分布均匀，涮煮后入口即化。',
            '手打虾滑': '手工现打的虾滑，Q弹爽口，虾肉含量极高，鲜美无比。',
            '毛肚': '新鲜的毛肚处理得非常干净，七上八下涮煮后脆嫩爽口。',
            '鸭血': '鲜鸭血嫩滑如豆腐，入口即化，吸收了汤汁后更加美味。',
            '黄喉': '脆黄喉处理得恰到好处，涮煮后爽脆弹牙，口感极佳。',
            '脑花': '麻辣脑花处理得很干净，没有腥味，麻辣入味，口感绵密。'
        };
        
        // 生成好评文案
        let review = `🔥 打卡麻辣火锅坊！\n\n`;
        
        // 锅底描述
        review += `今天尝试了${dish}，${dishDescriptions[dish] || '味道非常不错'}。\n\n`;
        
        // 特色菜品描述
        if (specials.length > 0) {
            review += `特别推荐：${specials.map(dish => specialDescriptions[dish] ? dish : '').filter(Boolean).join('、')}。`;
            specials.forEach(dish => {
                if (specialDescriptions[dish]) {
                    review += ` ${specialDescriptions[dish]}`;
                }
            });
            review += '\n\n';
        }
        
        // 评分描述
        review += `💫 用餐体验：\n`;
        review += `• 口味：${tasteAdjectives[taste]}（${taste}星）\n`;
        review += `• 服务：${serviceAdjectives[service]}（${service}星）\n`;
        review += `• 环境：${environmentAdjectives[environment]}（${environment}星）\n\n`;
        
        // 总结
        review += `🌟 总结：非常满意的一次用餐体验！锅底正宗，食材新鲜，服务贴心。\n`;
        review += `人均消费约120元，性价比超高！\n\n`;
        
        // 标签
        review += `#火锅探店 #美食打卡 #成都美食 #麻辣火锅 #吃货日常`;
        
        return review;
    }

    // 复制文案到剪贴板
    function copyReview() {
        if (!state.generatedReview) {
            showMessage('请先生成文案', 'error');
            return;
        }
        
        navigator.clipboard.writeText(state.generatedReview)
            .then(() => {
                showMessage('文案已复制到剪贴板！', 'success');
            })
            .catch(err => {
                console.error('复制失败:', err);
                showMessage('复制失败，请手动选择复制', 'error');
            });
    }

    // 切换编辑模式
    function toggleEditMode() {
        state.isEditing = !state.isEditing;
        
        if (state.isEditing) {
            reviewTextarea.readOnly = false;
            reviewTextarea.focus();
            editBtn.innerHTML = '<i class="fas fa-check"></i> 完成编辑';
            showMessage('现在可以自由编辑文案了', 'info');
        } else {
            reviewTextarea.readOnly = true;
            state.generatedReview = reviewTextarea.value;
            editBtn.innerHTML = '<i class="fas fa-edit"></i> 编辑文案';
            updateWordCount();
            showMessage('编辑已保存', 'success');
        }
    }

    // 发布到小红书
    function publishToXiaohongshu() {
        if (!state.generatedReview) {
            showMessage('请先生成文案', 'error');
            return;
        }
        
        // 先复制到剪贴板
        copyReview();
        
        // 小红书发布链接
        const xiaohongshuUrl = 'https://www.xiaohongshu.com/discovery/item/create';
        
        // 尝试使用深度链接
        const deepLink = `xiaohongshu://discovery/item/create`;
        
        // 显示提示
        showMessage('正在跳转到小红书...', 'info');
        
        // 延迟跳转，让用户看到提示
        setTimeout(() => {
            // 尝试打开小红书APP
            window.location.href = deepLink;
            
            // 如果小红书APP未安装，3秒后跳转到网页版
            setTimeout(() => {
                window.location.href = xiaohongshuUrl;
            }, 3000);
        }, 1500);
    }

    // 更新字数统计
    function updateWordCount() {
        const text = reviewTextarea.value;
        const wordCount = text.replace(/\s/g, '').length; // 中文字数统计
        wordCountEl.textContent = wordCount;
        
        // 检查是否超过200字
        if (wordCount > 200) {
            wordCountEl.style.color = '#ff4757';
            wordCountEl.innerHTML = `${wordCount} <small>(超过200字)</small>`;
        } else {
            wordCountEl.style.color = '';
            wordCountEl.textContent = wordCount;
        }
    }

    // 显示加载动画
    function showLoading(show) {
        if (show) {
            loadingOverlay.style.display = 'flex';
        } else {
            loadingOverlay.style.display = 'none';
        }
    }

    // 显示消息提示
    function showMessage(message, type = 'info') {
        // 移除现有的消息
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // 创建新消息
        const messageEl = document.createElement('div');
        messageEl.className = 'success-message';
        
        // 设置图标和颜色
        let icon = 'info-circle';
        let bgColor = '#4ecdc4';
        
        switch (type) {
            case 'success':
                icon = 'check-circle';
                bgColor = '#4ecdc4';
                break;
            case 'error':
                icon = 'exclamation-circle';
                bgColor = '#ff4757';
                break;
            case 'warning':
                icon = 'exclamation-triangle';
                bgColor = '#ffd166';
                break;
            case 'info':
            default:
                icon = 'info-circle';
                bgColor = '#3498db';
                break;
        }
        
        messageEl.style.background = `linear-gradient(135deg, ${bgColor} 0%, ${adjustColor(bgColor, -20)} 100%)`;
        messageEl.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
        
        document.body.appendChild(messageEl);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.style.animation = 'slideInRight 0.3s ease-out reverse';
                setTimeout(() => messageEl.remove(), 300);
            }
        }, 3000);
    }

    // 调整颜色亮度
    function adjustColor(color, amount) {
        // 简化版颜色调整
        return color;
    }

    // 初始化
    updateProgress();
    
    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        // Ctrl+Enter 生成好评
        if (e.ctrlKey && e.key === 'Enter') {
            generateReview();
        }
        
        // Esc 取消编辑
        if (e.key === 'Escape' && state.isEditing) {
            toggleEditMode();
        }
    });

    // 添加页面可见性变化监听
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            // 页面重新可见时，检查是否需要重新生成
            console.log('页面重新激活');
        }
    });

    // 添加服务工作者支持（如果将来需要PWA）
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // 注册服务工作者
            // navigator.serviceWorker.register('/sw.js');
        });
    }
});