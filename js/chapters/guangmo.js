// js/chapters/guangmo.js
const wait = ms => new Promise(r => setTimeout(r, ms));

const nextClick = (element) => new Promise(resolve => {
    element.addEventListener('click', resolve, { once: true });
});

// 🌟 Web Audio API 高精度金石声学仿真引擎
function playDistant革音() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(55, ctx.currentTime); // 55Hz 深层大鼓共振
        osc.frequency.linearRampToValueAtTime(38, ctx.currentTime + 1.8);
        
        gain.gain.setValueAtTime(0.28, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.0);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 4.1);
    } catch (e) {
        console.warn("革音受拦截");
    }
}

function playCrystal破冰() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(2350, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(1350, ctx.currentTime + 0.15);
        
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(4700, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(2100, ctx.currentTime + 0.08);
        
        gain1.gain.setValueAtTime(0.07, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
        gain2.gain.setValueAtTime(0.015, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.6);
        osc2.stop(ctx.currentTime + 0.6);
    } catch (e) {
        console.warn("破冰音受拦截");
    }
}

export default async function playGuangmo(container) {
    window.currentActiveChapter = 7;
    container.classList.add('active'); 

    container.innerHTML = `
        <style>
            /* 全线贯穿极致克制的雪原纯白大底 */
            .guangmo-wrapper {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative; background-color: #ffffff;
                user-select: none; overflow: hidden;
            }
            
            #gm-title-screen { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 3.8rem; letter-spacing: 0.6em; text-indent: 0.6em;
                opacity: 0; transition: opacity 2s ease; cursor: pointer; white-space: nowrap; text-align: center;
                color: #222222; z-index: 10;
            }
            #gm-intro { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 1.2rem; line-height: 2.8; letter-spacing: 0.15em; 
                opacity: 0; transition: opacity 2s ease; cursor: pointer;
                writing-mode: vertical-rl; white-space: nowrap;
                color: #333333; z-index: 10;
            }
            
            /* 🌟【大组对齐外框】剥离所有弹性冲突，确保 3D 与块流共存 */
            .gm-scroll-center-stage {
                position: relative;
                width: 480px; height: 420px;
                display: flex !important; flex-direction: column !important;
                align-items: center !important; justify-content: center !important;
            }

            /* 🌟【古典双列块级流画布】隐藏在雪原正下方 */
            .gm-poem-layout-box {
                width: 100%; height: 100%;
                writing-mode: vertical-rl !important;
                display: block !important;
                padding: 40px 30px; box-sizing: border-box;
            }
            
            /* 右列：正文瘦骨小楷 */
            .gm-text-line {
                display: block !important;
                font-size: 1.28rem; font-weight: bold;
                color: #1a1a1a; opacity: 0.75;
                line-height: 2.3; letter-spacing: 0.22em;
                text-align: start !important;
                margin-left: 22px;
                font-family: inherit !important;
            }
            
            /* 左列：出处落款，自然下沉 */
            .gm-text-author {
                display: block !important;
                font-size: 0.88rem; color: #666666; opacity: 0.55;
                margin-left: 26px; letter-spacing: 0.15em;
                text-align: end !important;
                height: calc(100% - 20px);
                font-family: inherit !important;
            }

            /* 🌟【覆雪交互 Canvas 图层】绝对覆盖在文字上方 */
            #gm-snow-canvas {
                position: absolute; top: 0; left: 0;
                width: 100%; height: 100%;
                z-index: 6; cursor: pointer;
                transition: opacity 2.5s ease-in-out; /* 用于最后阶段的新雪覆盖动画 */
            }

            #gm-prompt-tip {
                position: absolute; bottom: 8%; left: 50%; transform: translateX(-50%);
                font-size: 1.05rem; letter-spacing: 0.25em; color: #9aa5a6;
                opacity: 0; transition: opacity 1.5s ease; pointer-events: none; z-index: 8;
            }
            
            /* 极淡的中央冬至煦暖日照 */
            .gm-warmth-glow {
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 75vw; height: 70vw; border-radius: 50%;
                background: radial-gradient(circle, rgba(255, 235, 190, 0.3) 0%, rgba(255, 245, 220, 0.06) 55%, rgba(255,255,255,0) 75%);
                pointer-events: none; z-index: 2; opacity: 0;
                transition: opacity 4.5s cubic-bezier(0.25, 1, 0.5, 1);
            }
        </style>

        <div class="guangmo-wrapper" id="gm-wrapper">
            <!-- 地维煦暖光晕 -->
            <div class="gm-warmth-glow" id="gm-glow-layer"></div>

            <div id="gm-title-screen" class="vertical-text font-kangxi">广莫风</div>
            <div id="gm-intro" class="vertical-text font-kangxi" style="display: none;">
                广莫风，北方风也。广，大也。慢，虚也。风至则万物藏，物成而虚也。<br>
                属坎，八音为革。<br>
                冬至之风。
            </div>

            <!-- 主舞台外框 -->
            <div id="gm-content-stage" style="display: none; opacity: 0;">
                <div class="gm-scroll-center-stage">
                    <!-- 顶层雪盖 -->
                    <canvas id="gm-snow-canvas"></canvas>

                    <!-- 底层余秋雨法帖（经典原生双列块流） -->
                    <div class="gm-poem-layout-box font-kangxi">
                        <div class="gm-text-line font-kangxi">「在这种天地中獨個兒行走，侏儒也變成了巨人。</div>
                        <div class="gm-text-line font-kangxi">在这种天地中獨個兒行走，巨人也變成了侏儒。」</div>
                        <div class="gm-text-author font-kangxi">——余秋雨《陽關雪》</div>
                    </div>
                </div>
                <div id="gm-prompt-tip" class="font-kangxi">【 萬物伏藏，抚雪見詩 】</div>
            </div>
        </div>
    `;

    const wrapper = document.getElementById('gm-wrapper');
    const titleScreen = document.getElementById('gm-title-screen');
    const intro = document.getElementById('gm-intro');
    const contentStage = document.getElementById('gm-content-stage');
    const snowCanvas = document.getElementById('gm-snow-canvas');
    const promptTip = document.getElementById('gm-prompt-tip');
    const glowLayer = document.getElementById('gm-glow-layer');

    // ====== 第一幕 ======
    await wait(200);
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

    // ====== 第三幕：切入纯白舞台，覆雪层初始化 ======
    contentStage.style.display = 'flex';
    await wait(50);
    contentStage.style.opacity = 1;
    await wait(300);
    promptTip.style.opacity = 0.85;

    const sCtx = snowCanvas.getContext('2d');
    let isWiping = false;
    let wipePointsCount = 0;
    let isThawTriggered = false;

    function initSnowField() {
        const box = container.querySelector('.gm-scroll-center-stage');
        snowCanvas.width = box.clientWidth;
        snowCanvas.height = box.clientHeight;
        
        // 铺满一层温暖宣纸白/积雪白
        sCtx.fillStyle = '#ffffff';
        sCtx.fillRect(0, 0, snowCanvas.width, snowCanvas.height);
        
        // 极淡的水墨霜雪纹理屑
        sCtx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        for (let i = 0; i < 150; i++) {
            sCtx.fillRect(Math.random() * snowCanvas.width, Math.random() * snowCanvas.height, 2, 2);
        }
    }
    initSnowField();

    // 绑定刮雪交互机制
    function startWipe() { if(!isThawTriggered) isWiping = true; }
    function processWipe(e) {
        if (!isWiping || isThawTriggered) return;
        const rect = snowCanvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        sCtx.globalCompositeOperation = 'destination-out';
        sCtx.beginPath();
        // 羽化笔刷，刮雪留踪
        const grad = sCtx.createRadialGradient(x, y, 4, x, y, 32);
        grad.addColorStop(0, 'rgba(0,0,0,1)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        sCtx.fillStyle = grad;
        sCtx.arc(x, y, 32, 0, Math.PI * 2);
        sCtx.fill();

        wipePointsCount++;
        // 达到拂雪阈值，解密成功
        if (wipePointsCount > 120) {
            isThawTriggered = true;
            isWiping = false;
            triggerNewSnowBurialFlow();
        }
    }
    function endWipe() { isWiping = false; }

    snowCanvas.addEventListener('mousedown', startWipe);
    snowCanvas.addEventListener('mousemove', processWipe);
    window.addEventListener('mouseup', endWipe);
    snowCanvas.addEventListener('touchstart', startWipe);
    snowCanvas.addEventListener('touchmove', processWipe);
    window.addEventListener('touchend', endWipe);

    // 🌟【大高潮：诵读停留 -> 新雪自合覆灭 -> 破冰革音响彻】
    async function triggerNewSnowBurialFlow() {
        promptTip.style.opacity = 0; // 撤走提示
        await wait(5000); // 🔒 驻留 5 秒：足够看画人情绪饱满地将名句默读两遍！

        // 🌟 核心视觉丰富：利用 Canvas 图层混合模式变回正常，并用 2.5 秒平滑淡入纯白，实现“足迹被新雪覆盖”！
        sCtx.globalCompositeOperation = 'source-over';
        snowCanvas.style.opacity = '1';
        
        // 用渐变动画重绘新雪
        let opacityTracker = 0;
        const snowCoverInterval = setInterval(() => {
            opacityTracker += 0.04;
            sCtx.fillStyle = `rgba(255, 255, 255, ${opacityTracker})`;
            sCtx.fillRect(0, 0, snowCanvas.width, snowCanvas.height);
            if (opacityTracker >= 1) clearInterval(snowCoverInterval);
        }, 30);

        await wait(2800); // 等待新雪完全覆盖，重归纯白

        // ====== 第四幕：极静之中的声学爆发 ======
        playDistant革音(); // 1. 咚——极轻极沉极远的远古革鸣
        await wait(250);
        playCrystal破冰(); // 2. 啪啦——极其清脆剔透的冬夜水晶破冰声
        
        await wait(3000); // 享受三秒袅袅余音

        // ====== 第五幕：煦暖冬蛰，无缝渡让终章 ======
        glowLayer.style.opacity = 1; // 纯白中央，极其温柔地渗出一抹极淡的太阳金辉
        await wait(4200);

        // 彻底清空，平滑卸载控制权
        contentStage.style.opacity = 0;
        await wait(1500);
        contentStage.innerHTML = '';
        container.innerHTML = '';
        container.classList.remove('active');

        // 步入最终回
        window.currentActiveChapter = 8;
    }
}
