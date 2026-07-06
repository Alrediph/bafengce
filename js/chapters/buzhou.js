// js/chapters/buzhou.js
const wait = ms => new Promise(r => setTimeout(r, ms));

const nextClick = (element) => new Promise(resolve => {
    element.addEventListener('click', resolve, { once: true });
});

// 🌟 Web Audio API 高精度数字声音合成器
function playStoneClack() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(950, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.03);
        
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
        console.warn("石音合成受阻", e);
    }
}

function playDistantWind() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(32, ctx.currentTime); 
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(220, ctx.currentTime);
        filter.Q.setValueAtTime(2.5, ctx.currentTime);
        
        filter.frequency.linearRampToValueAtTime(380, ctx.currentTime + 2.0);
        filter.frequency.linearRampToValueAtTime(180, ctx.currentTime + 4.5);
        
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
    container.classList.add('active'); 

    container.innerHTML = `
        <style>
            /* 🌟【大修正】从头到尾始终保持高洁素雅的纯白宣纸大底 */
            .buzhou-wrapper {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative; 
                background-color: #ffffff;
                user-select: none; overflow: hidden;
            }
            
            #bz-title-screen { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 3.8rem; letter-spacing: 0.6em; text-indent: 0.6em;
                opacity: 0; transition: opacity 2s ease; cursor: pointer; white-space: nowrap; text-align: center;
                color: #1a1a1a; z-index: 10;
            }
            
            #bz-intro { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 1.2rem; line-height: 2.8; letter-spacing: 0.15em; 
                opacity: 0; transition: opacity 2s ease; cursor: pointer;
                writing-mode: vertical-rl; white-space: nowrap;
                color: #2b2b2b; z-index: 10;
            }
            
            /* 🌟【外围控制链布局】采用纯净的垂直流，杜绝内部文字碰撞叠罗汉 */
            .bz-master-layout-container {
                display: flex !important; flex-direction: column !important;
                align-items: center !important; justify-content: center !important;
                width: 100%; height: 100%; position: relative; z-index: 5;
            }
            
            #buzhou-wind-canvas {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                z-index: 3; cursor: move;
            }
            
            .bz-cards-row {
                display: flex !important; flex-direction: row !important;
                justify-content: center; align-items: center;
                gap: 50px; width: fit-content; height: 380px;
                margin-bottom: 35px; opacity: 0;
                transition: opacity 1.5s ease; pointer-events: none;
            }
            
            /* 🌟【3D 工业翻转核心骨架】剥离所有冲突的 Flex，采用绝对纯净的 3D 轴心 */
            .bz-flip-card { 
                width: 135px; height: 100%; perspective: 1000px; cursor: pointer; 
            }
            
            .card-inner { 
                width: 100%; height: 100%; position: relative; 
                transform-style: preserve-3d !important; 
                transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1); 
            }
            
            .bz-flip-card.is-flipped .card-inner { 
                transform: rotateY(180deg); 
            }
            
            .card-face { 
                position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                backface-visibility: hidden !important; 
                -webkit-backface-visibility: hidden !important;
                border-radius: 4px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            }
            
            /* 卡牌背面：内敛克制 */
            .card-face-back { 
                background-color: #f2efe9; border: 1px solid #dcd6cd; 
                transform: rotateY(0deg);
            }
            
            /* 🌟【核心重构：碑刻正面】彻底采用原生 Block 多列流，无缝支持两列排布 */
            .card-face-front { 
                background-color: #faf9f5; border: 1px solid #ccbfa9; 
                transform: rotateY(180deg); padding: 35px 20px; box-sizing: border-box; 
                writing-mode: vertical-rl !important; /* 开启纵向传统排版 */
                display: block !important; /* 强制回归块级流，彻底复活 3D 翻转 */
            }
            
            /* 🌟 右侧纵列：正文句法，自动靠右顶格书写 */
            .dao-stone-text { 
                display: block !important;
                font-size: 1.25rem; font-weight: bold; color: #1a1a1a; 
                letter-spacing: 0.22em; line-height: 1.6; 
                text-align: start !important; /* 顶部对齐 */
                font-family: inherit !important; 
            }
            
            /* 🌟 左侧纵列：出处落款，自动在左侧生成一列，并天生极其稳定地自然沉淀在最底端 */
            .dao-stone-author { 
                display: block !important;
                font-size: 0.85rem; color: #666666; 
                margin-right: 18px; /* 产生两列之间完美的古籍横向间距 */
                text-align: end !important; /* 🌟 核心：在 vertical-rl 下代表完美沉底，绝不出界溢出 */
                font-family: inherit !important; 
                height: calc(100% - 20px); /* 预留底部缓冲安全岛 */
            }
            
            .dao-stone-text.weathered, .dao-stone-author.weathered { opacity: 0.05 !important; filter: blur(2px) contrast(80%) !important; }
            
            /* 外部控制组件 */
            #bz-prompt-tip { font-size: 1.05rem; letter-spacing: 0.25em; color: #8a999a; opacity: 0; transition: opacity 1.5s ease; pointer-events: none; margin-bottom: 12px; }
            
            .bz-exit-farlbar { 
                writing-mode: horizontal-tb !important; white-space: nowrap !important; 
                font-size: 1.05rem; color: #7f7f7f; cursor: pointer; 
                transition: opacity 1s ease, color 0.3s ease; opacity: 0; display: none; 
                font-family: inherit !important; 
            }
            .bz-exit-farlbar:hover { color: #962929; font-weight: bold; }
        </style>

        <div class="buzhou-wrapper" id="bz-wrapper">
            <div id="bz-title-screen" class="vertical-text font-kangxi">不周</div>
            <div id="bz-intro" class="vertical-text font-kangxi" style="display: none;">
                不周风，西北风也。不周者，不交也。阴阳未合，万物未生。<br>
                属乾，八音为石。<br>
                立冬之风。
            </div>
            
            <div id="bz-content-stage">
                <canvas id="buzhou-wind-canvas"></canvas>
                
                <div class="bz-master-layout-container">
                    <div class="bz-cards-row" id="bz-cards-container">
                        
                        <div class="bz-flip-card font-kangxi" data-idx="0">
                            <div class="card-inner">
                                <div class="card-face card-face-back"></div>
                                <div class="card-face card-face-front">
                                    <div class="dao-stone-text font-kangxi">大音希聲，大象無形。</div>
                                    <div class="dao-stone-author font-kangxi">——老子</div>
                                </div>
                            </div>
                        </div>

                        <div class="bz-flip-card font-kangxi" data-idx="1">
                            <div class="card-inner">
                                <div class="card-face card-face-back"></div>
                                <div class="card-face card-face-front">
                                    <div class="dao-stone-text font-kangxi">大塊噫氣，其名為風。</div>
                                    <div class="dao-stone-author font-kangxi">——《莊子·齊物論》</div>
                                </div>
                            </div>
                        </div>

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
                    
                    <div id="bz-prompt-tip" class="font-kangxi">【 點擊牌面，輕叩解意 】</div>
                    <div class="bz-exit-farlbar font-kangxi" id="bz-exit-btn">【 冬蟄掩卷 】</div>
                </div>
            </div>
        </div>
    `;

    const wrapper = document.getElementById('bz-wrapper');
    const titleScreen = document.getElementById('bz-title-screen');
    const intro = document.getElementById('bz-intro');
    const contentStage = document.getElementById('bz-content-stage');
    const canvas = document.getElementById('buzhou-wind-canvas');
    const cardsContainer = document.getElementById('bz-cards-container');
    const promptTip = document.getElementById('bz-prompt-tip');
    const exitBtn = document.getElementById('bz-exit-btn');

    await wait(200);
    titleScreen.style.opacity = 1;
    await nextClick(wrapper);
    titleScreen.style.opacity = 0;
    await wait(2000);
    titleScreen.style.display = 'none';

    intro.style.display = 'block';
    await wait(50);
    intro.style.opacity = 1;
    await nextClick(wrapper);
    intro.style.opacity = 0;
    await wait(2000);
    intro.style.display = 'none';

    // 展现舞台
    contentStage.style.display = 'flex';
    await wait(50);
    contentStage.style.opacity = 1;
    await wait(300);
    promptTip.innerText = '【 陰氣主至，順風斂字 】';
    promptTip.style.opacity = 0.85;

    // --- 粒子系统物理引擎：写意水墨屑散落 ---
    const ctx = canvas.getContext('2d');
    let particles = [];
    let isDrawingWind = false;
    let gatherProgress = 0;

    function initPhysics() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        particles = [];
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
        const rowRect = cardsContainer.getBoundingClientRect();
        const targetX = rowRect.left + rowRect.width / 2;
        const targetY = rowRect.top + rowRect.height / 2;

        particles.forEach(p => {
            if (gatherProgress > 1) {
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
            ctx.fillStyle = `rgba(40, 40, 40, ${0.6 - (gatherProgress/140)})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        });

        if (isDrawingWind && gatherProgress < 100) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)'; 
            ctx.lineWidth = 2;
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

    function startWind() { isDrawingWind = true; }
    function sweepWind() {
        if (!isDrawingWind || gatherProgress >= 100) return;
        gatherProgress += 1.8; 
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

    async function triggerCardsSolidifiedFlow() {
        canvas.style.display = 'none';
        cancelAnimationFrame(frameId);
        
        cardsContainer.style.opacity = 1;
        cardsContainer.style.pointerEvents = 'auto';
        exitBtn.style.display = 'block';
        setTimeout(() => { exitBtn.style.opacity = 1; }, 50);

        promptTip.style.opacity = 0;
        await wait(500);
        promptTip.innerText = '【 點擊牌面，輕叩解意 】';
        promptTip.style.opacity = 0.7;
    }

    let flippedMask = new Set();
    let isWeatheringTriggered = false;

    return new Promise((resolveNextChapter) => {
        const cards = container.querySelectorAll('.bz-flip-card');
        cards.forEach(card => {
            card.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (card.classList.contains('is-flipped') || isWeatheringTriggered) return;
                
                card.classList.add('is-flipped');
                flippedMask.add(card.getAttribute('data-idx'));
                playStoneClack();

                if (flippedMask.size === 3 && !isWeatheringTriggered) {
                    isWeatheringTriggered = true;
                    promptTip.style.opacity = 0; 
                    await wait(4500); 
                    playDistantWind();
                    
                    const texts = container.querySelectorAll('.dao-stone-text, .dao-stone-author');
                    texts.forEach(t => t.classList.add('weathered'));
                    await wait(5000);
                    exitChapterFlow();
                }
            });
        });

        exitBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            exitChapterFlow();
        });

        async function exitChapterFlow() {
            contentStage.style.opacity = 0;
            await wait(2000);
            contentStage.innerHTML = '';
            container.innerHTML = '';
            container.classList.remove('active');
            resolveNextChapter();
        }
    });
}
