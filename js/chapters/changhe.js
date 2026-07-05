// js/chapters/changhe.js
const wait = ms => new Promise(r => setTimeout(r, ms));

const nextClick = (element) => new Promise(resolve => {
    element.addEventListener('click', resolve, { once: true });
});

// 纯代码高级数字音频合成器：无资产依赖，完美还原传统“磬音”的空灵空旷
function playChimeGong() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        // 基音 Oscillator：仿真磬的青铜敲击震颤
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(293.66, ctx.currentTime); // D4 调，深沉安宁
        
        // 泛音 Oscillator：营造“极远、极轻”的空间飘渺感
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(587.33, ctx.currentTime); // 高八度泛音对冲
        
        // 悠长的时间衰减曲线（持续 4.5 秒的漫长尾憩）
        gain1.gain.setValueAtTime(0.3, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.5);
        
        gain2.gain.setValueAtTime(0.08, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);
        
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 4.6);
        osc2.stop(ctx.currentTime + 4.6);
    } catch (e) {
        console.warn("磬音合成受浏览器安全策略暂拦截", e);
    }
}

export default async function playChanghe(container) {
    container.innerHTML = `
        <style>
            .changhe-wrapper {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative; 
                background: linear-gradient(to bottom, #11161e 0%, #1d2530 100%);
                user-select: none; overflow: hidden;
            }
            
            #ch-title-screen { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 3.8rem; letter-spacing: 0.6em; text-indent: 0.6em;
                opacity: 0; transition: opacity 2s ease; cursor: pointer; white-space: nowrap; text-align: center;
                color: #ffffff; z-index: 10;
            }
            
            #ch-intro { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 1.2rem; line-height: 2.8; letter-spacing: 0.15em; 
                opacity: 0; transition: opacity 2s ease; cursor: pointer;
                writing-mode: vertical-rl; white-space: nowrap;
                color: #e2e8f0; z-index: 10;
            }
            
            #ch-content-stage {
                width: 100%; height: 100%; display: none; opacity: 0;
                transition: opacity 2s ease; position: relative;
            }

            /* 🌟【大魄力重构：2006年1月真实冬季全景星空图层】 */
            .global-starry-background {
                position: absolute; width: 100vw; height: 100vh;
                top: 0; left: 0; z-index: 1; pointer-events: none;
                /* 初始处于极其克制、微弱、含蓄的隐约状态 */
                opacity: 0.16; 
                transition: opacity 3s cubic-bezier(0.25, 1, 0.5, 1);
            }
            .global-starry-background.awaken {
                opacity: 0.75; /* 天门大开时，星河轰然觉醒耀眼 */
            }

            /* 天文学写意经纬细格网 */
            .astro-grid { stroke: rgba(225,210,180,0.15); stroke-width: 0.5; fill: none; stroke-dasharray: 1 5; }
            /* 星座连线：极细白描骨骼 */
            .constellation-line { stroke: rgba(255,255,255,0.22); stroke-width: 0.6; fill: none; }
            /* 冬季大三角：神圣连线 */
            .winter-triangle-line { stroke: rgba(205,168,105,0.3); stroke-width: 0.8; stroke-dasharray: 3 3; fill: none; }
            
            /* 恒星核心：带呼吸感的微光 */
            .star-node { fill: #ffffff; filter: drop-shadow(0 0 3px rgba(255,255,255,0.8)); }
            .star-node.alpha { fill: #ffdbb0; filter: drop-shadow(0 0 5px rgba(255,220,180,0.9)); } /* 参宿四等一等星 */
            .star-node.sirius { fill: #bde0ff; filter: drop-shadow(0 0 7px rgba(189,224,255,1)); } /* 耀眼天狼星 */
            .star-node.vermilion { fill: #962929; opacity: 0.8; } /* 朱砂红星群 */

            /* 🌟【写意重门深锁双扉】只包裹中央的核心交互区，不再污染全屏边界 */
            .gate-universe-box {
                position: absolute; top: 50%; left: 50%;
                transform: translate(-50%, -50%);
                width: 420px; height: 60vh;
                overflow: hidden;
                display: flex; justify-content: center; align-items: center;
                z-index: 2;
            }
            .gate-leaf {
                position: absolute; top: 0; width: 50%; height: 100%;
                background-color: rgba(17, 22, 30, 0.95); /* 融入暮色的重门 */
                box-sizing: border-box; z-index: 5;
                transition: transform 2.5s cubic-bezier(0.66, 0, 0.2, 1);
            }
            .gate-leaf-left { left: 0; border-right: 1px solid rgba(255,255,255,0.03); }
            .gate-leaf-right { right: 0; border-left: 1px solid rgba(255,255,255,0.03); }
            
            /* 当愿望升空时，中央重门朝两侧退场 */
            .gate-universe-box.open .gate-leaf-left { transform: translateX(-100%); }
            .gate-universe-box.open .gate-leaf-right { transform: translateX(100%); }

            /* 阊阖门中透下的一缕淡光 */
            .heaven-ray {
                position: absolute; top: 0; left: 50%; transform: translateX(-50%);
                width: 180px; height: 100%;
                background: linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0) 100%);
                pointer-events: none; z-index: 3;
            }

            /* 极简祈福牌 */
            .prayer-plaque-container {
                position: absolute; top: 46%; left: 50%;
                transform: translate(-50%, -40%);
                width: 110px; height: 260px;
                background: linear-gradient(135deg, #dfcfa5 0%, #ccba8f 100%); 
                border-radius: 2px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.35), inset 0 0 15px rgba(0,0,0,0.05);
                z-index: 4; cursor: pointer;
                transition: transform 3.8s cubic-bezier(0.55, 0, 0.1, 1), opacity 3s ease, box-shadow 1.5s ease;
                display: flex; justify-content: center; align-items: center;
                box-sizing: border-box; padding: 25px 12px;
            }
            .prayer-plaque-container::before {
                content: ''; position: absolute; top: -35px; left: 50%; transform: translateX(-50%);
                width: 1px; height: 35px; background-color: rgba(150,41,41,0.4);
            }
            
            /* 愿望文字：纯正竖排手书行气 */
            .plaque-wish-text {
                writing-mode: vertical-rl; height: 100%; width: 100%;
                font-family: 'Kaiti', 'STKaiti', serif;
                font-size: 1.2rem; font-weight: bold; color: #232323;
                letter-spacing: 0.18em; line-height: 1.6;
                text-align: start; display: block; word-break: break-all;
            }

            /* 斜依的毛笔 */
            .calligraphy-brush {
                position: absolute; top: 52%; left: 56%;
                width: 8px; height: 180px;
                background: linear-gradient(to bottom, #2b2b2b 0%, #151515 85%, #e2dac9 100%);
                border-radius: 1px; z-index: 4; cursor: pointer;
                transition: opacity 1s ease, transform 1s ease;
                transform-origin: top center;
            }
            .calligraphy-brush::after {
                content: ''; position: absolute; bottom: -20px; left: -2px;
                width: 12px; height: 20px; background-color: #ffffff;
                clip-path: polygon(50% 100%, 0 0, 100% 0);
            }

            /* 祈福牌载愿升空 */
            .prayer-plaque-container.ascend {
                box-shadow: 0 0 50px rgba(255,254,220,0.85);
                transform: translate(-50%, -190vh) scale(0.12); 
                opacity: 0.05;
            }

            /* 落墨案台 */
            .ink-writing-overlay {
                position: absolute; bottom: 8%; left: 50%; transform: translateX(-50%);
                z-index: 8; width: 320px; display: none; opacity: 0;
                transition: opacity 0.5s ease;
                background: rgba(20, 26, 35, 0.9);
                padding: 15px; border-radius: 4px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                border: 1px solid rgba(255,255,255,0.06);
                text-align: center; writing-mode: horizontal-tb !important;
            }
            .ink-input-field {
                width: 100%; background: rgba(0,0,0,0.3); border: 1px solid #4a5568;
                color: #ffffff; padding: 8px 10px; font-size: 0.95rem; border-radius: 2px;
                box-sizing: border-box; text-align: center; letter-spacing: 0.1em;
                margin-bottom: 12px; font-family: 'Kaiti', serif;
            }
            .ink-submit-btn {
                background-color: #962929; color: #ffffff; padding: 6px 20px;
                font-size: 0.85rem; letter-spacing: 0.2em; border-radius: 2px;
                cursor: pointer; border: none; font-family: 'KangXi', serif;
            }

            #gate-push-tip {
                position: absolute; bottom: 6%; left: 50%; transform: translateX(-50%);
                font-size: 1.05rem; letter-spacing: 0.25em; color: #7f8c8d;
                opacity: 0; transition: opacity 1.5s ease; pointer-events: none; z-index: 6;
            }

            @keyframes leaf-drift {
                0% { transform: translateY(-5vh) translateX(0) rotate(0deg); opacity: 0; }
                10% { opacity: 0.3; }
                90% { opacity: 0.15; }
                100% { transform: translateY(105vh) translateX(-80px) rotate(120deg); opacity: 0; }
            }
            .drifting-leaf {
                position: absolute; top: -5vh; width: 14px; height: 8px;
                background-color: rgba(200,180,150,0.12); border-radius: 0 8px 4px 8px;
                pointer-events: none; z-index: 6;
            }
        </style>

        <div class="changhe-wrapper" id="ch-wrapper">
            
            <svg class="global-starry-background" id="ch-starry-bg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
                <circle cx="960" cy="540" r="300" class="astro-grid" />
                <circle cx="960" cy="540" r="500" class="astro-grid" />
                <line x1="0" y1="540" x2="1920" y2="540" class="astro-grid" />
                <line x1="960" y1="0" x2="960" y2="1080" class="astro-grid" />

                <polyline points="910,360 1010,380 1030,520 930,500 910,360" class="constellation-line" /> <line x1="910" y1="360" x2="955,440" class="constellation-line" />
                <line x1="1010" y1="380" x2="975,442" class="constellation-line" />
                <polyline points="910,360 870,330 840,340" class="constellation-line" /> <circle cx="910" cy="360" r="5.5" class="star-node alpha" /> <circle cx="1010" cy="380" r="4.5" class="star-node" />       <circle cx="1030" cy="520" r="6.0" class="star-node alpha" /> <circle cx="930" cy="500" r="4.0" class="star-node" />       <circle cx="955" cy="440" r="3.5" class="star-node" />       <circle cx="965" cy="441" r="3.5" class="star-node" />       <circle cx="975" cy="442" r="3.5" class="star-node" />       <polyline points="1120,680 1180,740 1240,710 1180,630 1120,680" class="constellation-line" />
                <circle cx="1120" cy="680" r="8.5" class="star-node sirius" /> 

                <line x1="1160" y1="320" x2="1240" y2="340" class="constellation-line" />
                <circle cx="1160" cy="320" r="5.0" class="star-node alpha" /> <polygon points="910,360 1120,680 1160,320" class="winter-triangle-line" />

                <polyline points="810,260 740,210 680,230" class="constellation-line" />
                <circle cx="810" cy="260" r="5.0" class="star-node alpha" /> <g transform="translate(660, 200)">
                    <circle cx="0" cy="0" r="1.5" class="star-node vermilion" />
                    <circle cx="5" cy="-4" r="1.2" class="star-node vermilion" />
                    <circle cx="-4" cy="6" r="1.5" class="star-node vermilion" />
                    <circle cx="8" cy="4" r="1.0" class="star-node vermilion" />
                    <circle cx="-2" cy="-6" r="1.2" class="star-node vermilion" />
                    <circle cx="12" cy="-2" r="1.3" class="star-node vermilion" />
                </g>
            </svg>

            <div id="ch-title-screen" class="vertical-text font-kangxi">阊阖风</div>

            <div id="ch-intro" class="vertical-text font-kangxi" style="display: none;">
                阊阖风，西方风也。阊阖者，天门也。咸收藏也。<br>
                属兑，八音为金。<br>
                秋分之风。
            </div>

            <div id="ch-content-stage">
                
                <div class="woodblock-catalog-container gate-universe-box">
                    <div class="ch-gate-overlay" id="ch-gate-box">
                        <div class="gate-leaf gate-leaf-left"></div>
                        <div class="gate-leaf gate-leaf-right"></div>
                    </div>

                    <div class="heaven-ray"></div>

                    <div class="prayer-plaque-container" id="ch-plaque">
                        <div class="plaque-wish-text" id="wish-text-slot"></div>
                    </div>

                    <div class="calligraphy-brush" id="ch-brush"></div>
                </div>
                
                <div id="gate-push-tip" class="font-kangxi">【 抚扉启关，天门大开 】</div>

                <div class="ink-writing-overlay" id="ch-writing-panel">
                    <input type="text" class="ink-input-field" id="wish-input" placeholder="秉笔落墨，写下祈愿" maxlength="24" autocomplete="off" />
                    <button class="ink-submit-btn" id="btn-submit-wish">送入門</button>
                </div>
            </div>
        </div>
    `;

    const wrapper = document.getElementById('ch-wrapper');
    const titleScreen = document.getElementById('ch-title-screen');
    const intro = document.getElementById('ch-intro');
    const contentStage = document.getElementById('ch-content-stage');
    
    const starryBg = document.getElementById('ch-starry-bg');
    const plaque = document.getElementById('ch-plaque');
    const brush = document.getElementById('ch-brush');
    const textSlot = document.getElementById('wish-text-slot');
    const writingPanel = document.getElementById('ch-writing-panel');
    const wishInput = document.getElementById('wish-input');
    const btnSubmit = document.getElementById('btn-submit-wish');
    
    const gateBox = document.getElementById('ch-gate-box');
    const pushTip = document.getElementById('gate-push-tip');

    container.classList.add('active');
    await wait(400);

    // ====== 第一幕：“阊阖风”居中 ======
    titleScreen.style.opacity = 1;
    await nextClick(wrapper);
    titleScreen.style.opacity = 0;
    await wait(2000);
    titleScreen.style.display = 'none';

    // ====== 第二幕：定稿启幕词 ======
    intro.style.display = 'block';
    await wait(50);
    intro.style.opacity = 1;
    await nextClick(wrapper);
    intro.style.opacity = 0;
    await wait(2000);
    intro.style.display = 'none';

    // ====== 第三幕：清冽暮色大舞台亮起 ======
    contentStage.style.display = 'block';
    await wait(50);
    contentStage.style.opacity = 1;
    await wait(400);
    pushTip.style.opacity = 0.85;

    const triggerWritingState = (e) => {
        e.stopPropagation();
        if (writingPanel.style.display === 'block') return;
        
        writingPanel.style.display = 'block';
        setTimeout(() => { writingPanel.style.opacity = 1; }, 50);
        wishInput.focus();
        
        brush.style.transform = 'rotate(-15deg) translateY(-10px)';
    };

    plaque.addEventListener('click', triggerWritingState);
    brush.addEventListener('click', triggerWritingState);

    wishInput.addEventListener('input', () => {
        textSlot.innerText = wishInput.value;
    });

    // ====== 第四幕：高潮送愿 ======
    btnSubmit.addEventListener('click', async (e) => {
        e.stopPropagation();
        const wishContent = wishInput.value.trim();
        if (!wishContent) return; 

        writingPanel.style.opacity = 0;
        brush.style.opacity = 0;
        await wait(500);
        writingPanel.style.display = 'none';
        brush.style.display = 'none';
        pushTip.style.opacity = 0;

        // 1. 全局 2006 年 1 月星空夜幕瞬间被唤醒，流溢璀璨高亮！
        starryBg.classList.add('awaken');

        // 2. 重门大启向两侧大幅拉开！
        gateBox.classList.add('open');
        await wait(1000);

        // 3. 祈福牌发光并冉冉上升，跨越时间尺度隐入 2006 年的夜穹极深处
        plaque.classList.add('ascend');
        
        // 4. 磬音回荡长鸣
        playChimeGong();

        // 驻留 5.5 秒供人把玩欣赏
        await wait(5500);

        // 舞台清场，画面重归绝对的空寂留白
        contentStage.style.opacity = 0;
        await wait(2500);
        contentStage.innerHTML = ''; 

        // 5. 唯余两片微弱的枯叶在空旷的 2006 隐约星轨下悠然飘落
        spawnDriftingLeaves();
        await wait(5000);

        container.classList.remove('active');
    });

    function spawnDriftingLeaves() {
        for (let i = 0; i < 2; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'drifting-leaf';
            leaf.style.left = `${40 + Math.random() * 30}%`;
            leaf.style.animation = `leaf-drift ${5 + Math.random() * 3}s linear forwards`;
            leaf.style.animationDelay = `${i * 1.5}s`;
            wrapper.appendChild(leaf);
        }
    }
}