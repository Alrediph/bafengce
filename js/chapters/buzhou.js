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

// 2. 仿真合成“极低极远西北风声”
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
            .buzhou-wrapper {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative; 
                /* 🌟【大修正】全线采用一贯到底的干净、素雅传统宣纸白底 */
                background-color: #ffffff;
                user-select: none; overflow: hidden;
            }
            
            /* 🌟 大字和启幕词全部修正为优雅的深色墨迹，与白底完美咬合 */
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
            
            #bz-content-stage {
                width: 100%; height: 100%; display: none; opacity: 0;
                transition: opacity 2s ease; position: relative;
                display: flex; flex-direction: column; justify-content: center; align-items: center;
            }
            
            #buzhou-wind-canvas {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                z-index: 3; cursor: move;
            }
            
            .bz-cards-row {
                display: flex !important; flex-direction: row !important;
                justify-content: center; align-items: center;
                gap: 55px; width: fit-content; height: 50vh;
                position: relative; top: -2vh; z-index: 5;
                opacity: 0; transition: opacity 1.5s ease;
                pointer-events: none;
            }
            
            /* 🌟【大修正】适度拓宽卡牌宽度至 135px，给竖排多列留下充裕空间 */
            .bz-flip-card { 
                width: 135px; height: 100%; perspective: 1000px; cursor: pointer; 
            }
            .card-inner { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1); }
            .bz-flip-card.is-flipped .card-inner { transform: rotateY(180deg); }
            .card-face { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 2px; box-sizing: border-box; display: flex; justify-content: center; align-items: center; }
            
            /* 牌背面：极简干净 */
            .card-face-back { 
                background-color: #f2efe9; border: 1px solid #dcd6cd; 
                box-shadow: inset 0 0 15px rgba(215,200,180,0.2), 0 4px 15px rgba(0,0,0,0.03); 
            }
            
            /* 牌正面：大写意金石摩崖法帖风格 */
            .card-face-front { 
                background-color: #faf9f5; border: 1px solid #d5cbd0; 
                box-shadow: 0 8px 24px rgba(0,0,0,0.04); padding: 40px 18px; 
                box-sizing: border-box; 
            }
            
            /* 🌟【大修正】碑刻行气控制核心骨架：利用竖排块级纵向流，从右至左规整排列 */
            .dao-stone-content-box {
                writing-mode: vertical-rl !important;
                height: 100%;
                white-space: nowrap;
                text-align: start;
                display: block;
            }
            
            .dao-stone-text { 
                font-size: 1.28rem; font-weight: bold; color: #1c1c1c; 
                letter-spacing: 0.22em; line-height: 1.5; 
                display: inline-block; vertical-align: top;
                font-family: inherit !important; 
                filter: drop-shadow(0.5px 0.5px 0px rgba(0,0,0,0.1));
            }
            
            /* 🌟【大修正】让落款独立成列，并添加右侧间距与顶部衬距，使其稳稳沉淀在卡牌左下方 */
            .dao-stone-author { 
                font-size: 0.85rem; color: #6d6262; 
                display: inline-block; vertical-align: top;
                margin-right: 16px; /* 产生优美的两列横向间距 */
                padding-top: 85px; /* 🌟 核心：通过顶衬高度，把落款向下完美推送，绝不产生挤压 */
                letter-spacing: 0.12em;
                font-family: inherit !important; 
            }
            
            .dao-stone-text.weathered, .dao-stone-author.weathered { opacity: 0.05 !important; filter: blur(2px) contrast(80%) !important; }
            
            #bz-prompt-tip { position: absolute; bottom: 8%; left: 50%; transform: translateX(-50%); font-size: 1.05rem; letter-spacing: 0.25em; color: #8a999a; opacity: 0; transition: opacity 1.5s ease; pointer-events: none; z-index: 8; }
            
            /* 下方掩卷按钮排版稳定器 */
            .bz-exit-farlbar { 
                position: absolute; bottom: 6%; left: 50%; transform: translateX(-50%);
                writing-mode: horizontal-tb !important; white-space: nowrap !important; 
                font-size: 1.05rem; color: #7f7f7f; cursor: pointer; 
                transition: opacity 1s ease, color 0.3s ease; z-index: 9; 
                opacity: 0; display: none; font-family: inherit !important; 
            }
            .bz-exit-farlbar:hover { color: #962929; font-weight: bold; }
            .bz-exit-farlbar span { display: inline-block !important; writing-mode: horizontal-tb !important; white-space: nowrap !important; }
        </style>

        <div class="buzhou-wrapper" id="bz-wrapper">
            <div id="bz-title-screen" class="vertical-text font-kangxi">不周风</div>
            <div id="bz-intro" class="vertical-text font-kangxi" style="display: none;">
                不周风，西北风也。不周者，不交也。阴阳未合，万物未生。<br>
                属乾，八音为石。<br>
                立冬之风。
            </div>
            
            <div id="bz-content-stage">
                <canvas id="buzhou-wind-canvas"></canvas>
                <div class="bz-cards-row" id="bz-cards-container">
                    
                    <div class="bz-flip-card font-kangxi" data-idx="0">
                        <div class="card-inner">
                            <div class="card-face card-face-back"></div>
                            <div class="card-face card-face-front">
                                <div class="dao-stone-content-box">
                                    <div class="dao-stone-text font-kangxi">大音希聲，大象無形。</div>
                                    <div class="dao-stone-author font-kangxi">——老子</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bz-flip-card font-kangxi" data-idx="1">
                        <div class="card-inner">
                            <div class="card-face card-face-back"></div>
                            <div class="card-face card-face-front">
                                <div class="dao-stone-content-box">
                                    <div class="dao-stone-text font-kangxi">大塊噫氣，其名為風。</div>
                                    <div class="dao-stone-author font-kangxi">——《莊子·齊物論》</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bz-flip-card font-kangxi" data-idx="2">
                        <div class="card-inner">
                            <div class="card-face card-face-back"></div>
                            <div class="card-face card-face-front">
                                <div class="dao-stone-content-box">
                                    <div class="dao-stone-text font-kangxi">至人無己，神人無功，聖人無名。</div>
                                    <div class="dao-stone-author font-kangxi">——《莊子·逍遥遊》</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div id="bz-prompt-tip" class="font-kangxi">【 陰氣主至，順風斂字 】</div>
                <div class="bz-exit-farlbar font-kangxi" id="bz-exit-btn"><span>【</span><span>冬</span><span>蟄</span><span>掩</span><span>卷</span><span>】</span></div>
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

    // 进入交互舞台，全面拥抱高洁纯白大底
    contentStage.style.display = 'flex';
    await wait(50);
    contentStage.style.opacity = 1;
    await wait(300);
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
            // 墨迹灰屑
            ctx.fillStyle = `rgba(40, 40, 40, ${0.6 - (gatherProgress/140)})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        });

        if (isDrawingWind && gatherProgress < 100) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)'; // 浅淡墨风痕
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
        exitBtn.style.display = 'flex';
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
