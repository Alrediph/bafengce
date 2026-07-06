// js/chapters/buzhou.js
const wait = ms => new Promise(r => setTimeout(r, ms));

const nextClick = (element) => new Promise(resolve => {
    element.addEventListener('click', resolve, { once: true });
});

// 🌟 Web Audio API 高精度数字声音合成器
// 1. 仿真合成“轻叩石音”：短促、清脆、不尖锐的薄石相叩声
function playStoneClack() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(950, ctx.currentTime);
        // 瞬间向下急坠，仿真石器撞击的坚硬沉闷感
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.03);
        
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
        console.warn("石音合成受浏览器安全策略拦截", e);
    }
}

// 2. 仿真合成“极低极远西北风声”
function playDistantWind() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        // 建立低频环境震荡调制器
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(32, ctx.currentTime); // 极低频环境音
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(220, ctx.currentTime);
        filter.Q.setValueAtTime(2.5, ctx.currentTime);
        
        // 模拟风声的呼啸涌动感
        filter.frequency.linearRampToValueAtTime(380, ctx.currentTime + 2.0);
        filter.frequency.linearRampToValueAtTime(180, ctx.currentTime + 4.5);
        
        // 风声渐起，数秒后归于寂静
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2.0);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 5.0);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 5.2);
    } catch (e) {
        console.warn("风声合成受阻");
    }
}

export default async function playBuzhou(container) {
    // 🛡️ 全局生命周期守卫阻断锁
    if (window.currentActiveChapter === undefined) {
        window.currentActiveChapter = 6;
    }
    while (window.currentActiveChapter < 6) {
        await wait(200);
    }

    container.innerHTML = `
        <style>
            .buzhou-wrapper {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative; 
                /* 初始启幕词过渡色，后接纯白大底 */
                background-color: #121720;
                transition: background-color 2.5s ease;
                user-select: none; overflow: hidden;
            }
            
            #bz-title-screen { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 3.8rem; letter-spacing: 0.6em; text-indent: 0.6em;
                opacity: 0; transition: opacity 2s ease; cursor: pointer; white-space: nowrap; text-align: center;
                color: #ffffff; z-index: 10;
            }
            
            #bz-intro { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 1.2rem; line-height: 2.8; letter-spacing: 0.15em; 
                opacity: 0; transition: opacity 2s ease; cursor: pointer;
                writing-mode: vertical-rl; white-space: nowrap;
                color: #e2e8f0; z-index: 10;
            }
            
            #bz-content-stage {
                width: 100%; height: 100%; display: none; opacity: 0;
                transition: opacity 2s ease; position: relative;
                display: flex; flex-direction: column; justify-content: center; align-items: center;
            }

            /* 🌟【大画幅西北敛字画布】 */
            #buzhou-wind-canvas {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                z-index: 3; cursor: move;
            }

            /* 🌟【三块修长翻牌容器】并置于中央偏上方 */
            .bz-cards-row {
                display: flex !important; flex-direction: row !important;
                justify-content: center; align-items: center;
                gap: 55px; width: fit-content; height: 50vh;
                position: relative; top: -4vh; z-index: 5;
                opacity: 0; transition: opacity 1.5s ease;
                pointer-events: none; /* 敛字完成前不可触碰 */
            }
            
            /* 3D 翻转卡片骨架 */
            .bz-flip-card {
                width: 110px; height: 100%; perspective: 1000px; cursor: pointer;
            }
            .card-inner {
                width: 100%; height: 100%; position: relative;
                transform-style: preserve-3d;
                transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .bz-flip-card.is-flipped .card-inner {
                transform: rotateY(180deg);
            }
            
            /* 卡片正反面共享基类 */
            .card-face {
                position: absolute; width: 100%; height: 100%;
                backface-visibility: hidden; border-radius: 2px;
                box-sizing: border-box; display: flex; justify-content: center; align-items: center;
            }
            
            /* 牌背面（初始朝外）：修长、素面、极简干净克制 */
            .card-face-back {
                background-color: #ededed;
                border: 1px solid #d4d4d4;
                box-shadow: inset 0 0 15px rgba(0,0,0,0.02), 0 4px 15px rgba(0,0,0,0.03);
            }
            
            /* 牌正面（翻转后可见）：展现粗粝道家碑刻 */
            .card-face-front {
                background-color: #fafafa;
                border: 1px solid #ccbcbc;
                transform: rotateY(180deg);
                box-shadow: 0 6px 20px rgba(0,0,0,0.04);
                padding: 30px 10px;
            }
            
            /* 🌟【碑石连线：枯笔散淡、金石粗粝风骨】 */
            .dao-stone-text {
                writing-mode: vertical-rl; height: 100%;
                font-size: 1.2rem; font-weight: bold; color: #202020;
                letter-spacing: 0.22em; line-height: 1.5;
                text-align: start; display: block; word-break: break-all;
                font-family: inherit !important;
                /* 通过微弱的位移滤镜，模拟魏碑石刻的边缘剥蚀感 */
                filter: contrast(120%) blur(0.2px);
                transition: opacity 3s cubic-bezier(0.25, 1, 0.5, 1), filter 3s ease;
            }
            .dao-stone-author {
                font-size: 0.85rem; color: #887070; margin-left: 12px;
                font-family: inherit !important;
                transition: opacity 3s ease;
            }
            
            /* 🌟 风化剥蚀消散态 */
            .dao-stone-text.weathered, .dao-stone-author.weathered {
                opacity: 0.06 !important; /* 归于空白，仅留极淡余痕 */
                filter: blur(2px) contrast(80%) !important;
            }

            /* 动态提示小浮标 */
            #bz-prompt-tip {
                position: absolute; bottom: 8%; left: 50%; transform: translateX(-50%);
                font-size: 1.05rem; letter-spacing: 0.25em; color: #7f8c8d;
                opacity: 0; transition: opacity 1.5s ease; pointer-events: none; z-index: 8;
            }

            /* 左下角线装掩卷按钮（允许随时抽身离开） */
            .bz-exit-farlbar {
                position: absolute; bottom: -50px; left: 0;
                writing-mode: horizontal-tb !important; white-space: nowrap !important;
                font-size: 1.05rem; color: #888888; cursor: pointer;
                transition: opacity 1s ease, color 0.3s ease; z-index: 9;
                opacity: 0; display: none; font-family: inherit !important;
            }
            .bz-exit-farlbar:hover { color: #962929; font-weight: bold; }
            .bz-exit-farlbar span { display: inline-block !important; writing-mode: horizontal-tb !important; white-space: nowrap !important; }
        </style>

        <div class="buzhou-wrapper" id="bz-wrapper">
            <!-- 一幕 -->
            <div id="bz-title-screen" class="vertical-text font-kangxi">不周风</div>

            <!-- 二幕：新定稿不周启幕词 -->
            <div id="bz-intro" class="vertical-text font-kangxi" style="display: none;">
                不周风，西北风也。不周者，不交也。阴阳未合，万物未生。<br>
                属乾，八音为石。<br>
                立冬之风。
            </div>

            <!-- 三幕：白底主交互舞台 -->
            <div id="ch-content-stage" id="bz-content-stage">
                <!-- 交互画布 -->
                <canvas id="buzhou-wind-canvas"></canvas>

                <!-- 三块并置修长牌 -->
                <div class="bz-cards-row" id="bz-cards-container">
                    
                    <!-- 牌一 -->
                    <div class="bz-flip-card font-kangxi" data-idx="0">
                        <div class="card-inner">
                            <div class="card-face card-face-back"></div>
                            <div class="card-face card-face-front">
                                <div class="dao-stone-text font-kangxi">大音希聲，大象無形。</div>
                                <div class="dao-stone-author font-kangxi">——老子</div>
                            </div>
                        </div>
                    </div>

                    <!-- 牌二 -->
                    <div class="bz-flip-card font-kangxi" data-idx="1">
                        <div class="card-inner">
                            <div class="card-face card-face-back"></div>
                            <div class="card-face card-face-front">
                                <div class="dao-stone-text font-kangxi">大塊噫氣，其名為風。</div>
                                <div class="dao-stone-author font-kangxi">——《莊子·齊物論》</div>
                            </div>
                        </div>
                    </div>

                    <!-- 牌三 -->
                    <div class="bz-flip-card font-kangxi" data-idx="2">
                        <div class="card-inner">
                            <div class="card-face card-face-back"></div>
                            <div class="card-face card-face-front">
                                <div class="dao-stone-text font-kangxi">至人無己，神人無功，聖人無名。</div>
                                <div class="dao-stone-author font-kangxi">——《莊子·逍遥遊》</div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- 提示词 -->
                <div id="bz-prompt-tip" class="font-kangxi">【 陰氣主至，順風斂字 】</div>
            </div>
        </div>
    `;

    const wrapper = document.getElementById('bz-wrapper');
    const titleScreen = document.getElementById('bz-title-screen');
    const intro = document.getElementById('bz-intro');
    const contentStage = document.getElementById('ch-content-stage');
    
    const canvas = document.getElementById('buzhou-wind-canvas');
    const cardsContainer = document.getElementById('bz-cards-container');
    const promptTip = document.getElementById('bz-prompt-tip');

    // ====== 第一幕：居中大字 ======
    titleScreen.style.opacity = 1;
    await nextClick(wrapper);
    titleScreen.style.opacity = 0;
    await wait(2000);
    titleScreen.style.display = 'none';

    // ====== 第二幕 ======
    intro.style.display = 'block';
    await wait(50);
    intro.style.opacity = 1;
    await nextClick(wrapper);
    intro.style.opacity = 0;
    await wait(2000);
    intro.style.display = 'none';

    // ====== 第三幕：切入纯白极简底色大舞台 ======
    wrapper.style.backgroundColor = '#ffffff'; // 隐去后，白底，极简
    contentStage.style.display = 'flex';
    await wait(50);
    contentStage.style.opacity = 1;
    await wait(300);
    promptTip.style.opacity = 0.85;

    // --- 粒子汇聚物理引擎：实现“顺风敛字、碎墨成行” ---
    const ctx = canvas.getContext('2d');
    let particles = [];
    let isDrawingWind = false;
    let gatherProgress = 0;

    function initPhysics() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        particles = [];
        // 生成 65 颗杂乱飘零的“碎墨屑”
        for (let i = 0; i < 65; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 1.5 + Math.random() * 2.5,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5
            });
        }
    }
    initPhysics();
    window.addEventListener('resize', initPhysics);

    let frameId;
    function renderLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 抓取三块卡牌在屏幕中央的真实物理对准区
        const rowRect = cardsContainer.getBoundingClientRect();
        const targetX = rowRect.left + rowRect.width / 2;
        const targetY = rowRect.top + rowRect.height / 2;

        particles.forEach(p => {
            if (gatherProgress > 1) {
                // 按住划动风迹时，碎墨强制顺风卷向中央形成翻牌
                const dx = targetX - p.x;
                const dy = targetY - p.y;
                const force = gatherProgress / 100;
                p.x += dx * 0.04 * force + (Math.random() - 0.5) * 2;
                p.y += dy * 0.04 * force + (Math.random() - 0.5) * 2;
            } else {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            }

            ctx.fillStyle = `rgba(30, 30, 30, ${0.7 - (gatherProgress/140)})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        });

        // 绘制看画人划擦时的浅白色风流痕迹（从右上角划向左下角）
        if (isDrawingWind && gatherProgress < 100) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            for(let i=0; i<3; i++) {
                ctx.moveTo(Math.random()*canvas.width + 200, Math.random()*canvas.height*0.3);
                ctx.lineTo(Math.random()*canvas.width*0.3, Math.random()*canvas.height + 200);
            }
            ctx.stroke();
        }

        frameId = requestAnimationFrame(renderLoop);
    }
    renderLoop();

    // 顺西北风方向判定器
    function startWind() { isDrawingWind = true; }
    function sweepWind() {
        if (!isDrawingWind || gatherProgress >= 100) return;
        gatherProgress += 1.8; // 推进成型
        if (gatherProgress >= 100) {
            gatherProgress = 100;
            triggerCardsSolidifiedFlow();
        }
    }
    function endWind() { isDrawingWind = false; }

    canvas.addEventListener('mousedown', startWind);
    canvas.addEventListener('mousemove', sweepWind);
    window.addEventListener('mouseup', endWind);
    canvas.addEventListener('touchstart', startWind);
    canvas.addEventListener('touchmove', sweepWind);
    window.addEventListener('touchend', endWind);

    // 🌟 碎墨凝聚完成，长方形牌组固体破茧现形
    async function triggerCardsSolidifiedFlow() {
        // 注销点击风流画布，让事件渗透给下层的卡牌
        canvas.style.display = 'none';
        cancelAnimationFrame(frameId);

        // 牌组解冻，素面显现
        cardsContainer.style.opacity = 1;
        cardsContainer.style.pointerEvents = 'auto';

        // 并在牌组左下角悄悄撑起精美的线装退场键，允许只看一个便离开
        injectExitButton();

        promptTip.style.opacity = 0;
        await wait(500);
        promptTip.innerText = '【 點擊牌面，輕叩解意 】';
        promptTip.style.opacity = 0.7;
    }

    // ====== 第四幕：翻牌及离场总控 ======
    let flippedMask = new Set();
    let isWeatheringTriggered = false;

    function injectExitButton() {
        // 在牌组盒子内部动态挂载左下角独立横排按钮，杜绝流失错乱
        const exitBtn = document.createElement('div');
        exitBtn.className = 'bz-exit-farlbar font-kangxi';
        exitBtn.id = 'bz-exit-btn';
        exitBtn.innerHTML = '<span>【</span><span>冬</span><span>蟄</span><span>掩</span><span>卷</span><span>】</span>';
        
        // 塞入卡牌容器中，锁定其绝对左下角物理流
        const innerBox = container.querySelector('.woodblock-catalog-container');
        if (innerBox) {
            innerBox.appendChild(exitBtn);
            exitBtn.style.display = 'flex';
            setTimeout(() => { exitBtn.style.opacity = 1; }, 50);
        }
    }

    return new Promise((resolveNextChapter) => {
        const cards = container.querySelectorAll('.bz-flip-card');
        
        cards.forEach(card => {
            card.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (card.classList.contains('is-flipped') || isWeatheringTriggered) return;
                
                card.classList.add('is-flipped');
                flippedMask.add(card.getAttribute('data-idx'));
                
                // 1. 声音设计：一声极轻的石音，短促清脆不尖锐
                playStoneClack();

                // 2. 如果三块牌全部翻完，静置数秒，执行终极风化消散
                if (flippedMask.size === 3 && !isWeatheringTriggered) {
                    isWeatheringTriggered = true;
                    promptTip.style.opacity = 0; // 抹除中央提示
                    
                    await wait(4500); // 全部翻完后，画面静置数秒
                    
                    // 3. 声音设计：西北低风呼啸渐起，数秒后归于寂静
                    playDistantWind();
                    
                    // 4. 形式交互：文字缓缓消散，归于极淡余痕的风化石刻
                    const texts = container.querySelectorAll('.dao-stone-text, .dao-stone-author');
                    texts.forEach(t => t.classList.add('weathered'));
                    
                    // 驻留 5 秒回味风化空寂，随后自动解缆放行
                    await wait(5000);
                    exitChapterFlow();
                }
            });
        });

        // 接管随时可点击的冬蛰掩卷控制键
        container.addEventListener('click', (e) => {
            const clickedBtn = e.target.closest('#bz-exit-btn');
            if (clickedBtn) {
                e.stopPropagation();
                exitChapterFlow();
            }
        });

        async function exitChapterFlow() {
            contentStage.style.opacity = 0;
            await wait(2000);
            contentStage.innerHTML = '';
            
            container.innerHTML = '';
            container.classList.remove('active');
            
            // 递交路由放行钥匙，正式移交第七开
            window.currentActiveChapter = 7;
            resolveNextChapter();
        }
    });
}