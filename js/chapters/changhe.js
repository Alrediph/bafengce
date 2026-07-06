// js/chapters/changhe.js
const wait = ms => new Promise(r => setTimeout(r, ms));

const nextClick = (element) => new Promise(resolve => {
    element.addEventListener('click', resolve, { once: true });
});

// 纯代码高级数字音频合成器：无资产依赖，仿真还原传统“磬音”的空灵深远
function playChimeGong() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(293.66, ctx.currentTime); 
        
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(587.33, ctx.currentTime); 
        
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
        console.warn("磬音合成受拦截：", e);
    }
}

export default async function playChanghe(container) {
    // 路由守卫锁死，绝不准第四开残影抢跑
    if (window.currentActiveChapter === undefined) {
        window.currentActiveChapter = 5; 
    }
    while (window.currentActiveChapter < 5) {
        await wait(200); 
    }

    container.innerHTML = `
        <style>
            .changhe-wrapper {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative; 
                background: linear-gradient(to bottom, #0d121a 0%, #18202b 100%);
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
                display: flex; justify-content: center; align-items: center;
            }
            
            /* 🌟【大改写】全局星空背景：恢复恢弘舒展、丝滑柔和的深邃大画幅 */
            .global-starry-background {
                position: absolute; width: 100vw; height: 100vh;
                top: 0; left: 0; z-index: 1; pointer-events: none;
                opacity: 0.18; 
                transition: opacity 3s cubic-bezier(0.25, 1, 0.5, 1);
            }
            .global-starry-background.awaken { opacity: 0.85; }
            
            /* 丝质典雅经纬网 */
            .astro-grid { stroke: rgba(215,195,160,0.07); stroke-width: 0.6; fill: none; }
            .astro-dashed { stroke: rgba(215,195,160,0.05); stroke-width: 0.5; stroke-dasharray: 2 6; fill: none; }
            
            /* 星座骨骼连线：极其纤细，若隐若现 */
            .constellation-line { stroke: rgba(255,255,255,0.15); stroke-width: 0.5; fill: none; transition: stroke 2s ease; }
            .winter-triangle-line { stroke: rgba(218,175,115,0.18); stroke-width: 0.7; stroke-dasharray: 4 4; fill: none; }
            
            /* 🌟 星子图层核心样式优化：加入朦胧夜空光晕 */
            .star-node { fill: #ffffff; filter: drop-shadow(0 0 2px rgba(255,255,255,0.6)); }
            .star-node.alpha { fill: #ffe3ca; filter: drop-shadow(0 0 5px rgba(255,210,160,0.85)); } 
            .star-node.sirius { fill: #cce3ff; filter: drop-shadow(0 0 8px rgba(150,200,255,0.95)); } 
            .star-node.ambient { fill: #ffffff; opacity: 0.4; }
            .star-node.vermilion { fill: #b84a4a; opacity: 0.7; }

            .gate-universe-box {
                position: absolute; top: 50%; left: 50%;
                transform: translate(-50%, -50%);
                width: 420px; height: 60vh;
                overflow: hidden; display: flex; justify-content: center; align-items: center;
                z-index: 2;
            }
            .gate-leaf {
                position: absolute; top: 0; width: 50%; height: 100%;
                background-color: rgba(13, 17, 24, 0.97); box-sizing: border-box; 
                z-index: 2; 
                transition: transform 2.5s cubic-bezier(0.66, 0, 0.2, 1);
            }
            .gate-leaf-left { left: 0; border-right: 1px solid rgba(255,255,255,0.02); }
            .gate-leaf-right { right: 0; border-left: 1px solid rgba(255,255,255,0.02); }
            .gate-universe-box.open .gate-leaf-left { transform: translateX(-100%); }
            .gate-universe-box.open .gate-leaf-right { transform: translateX(100%); }

            .heaven-ray {
                position: absolute; top: 0; left: 50%; transform: translateX(-50%);
                width: 180px; height: 100%;
                background: linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 60%, rgba(255,255,255,0) 100%);
                pointer-events: none; z-index: 3;
            }
            
            .prayer-plaque-container {
                position: absolute; top: 46%; left: 50%; transform: translate(-50%, -40%);
                width: 110px; height: 260px;
                background: linear-gradient(135deg, #dfcfa5 0%, #ccba8f 100%); 
                border-radius: 2px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.35), inset 0 0 15px rgba(0,0,0,0.05);
                z-index: 6; cursor: pointer; 
                pointer-events: auto !important;
                transition: transform 3.8s cubic-bezier(0.55, 0, 0.1, 1), opacity 3s ease, box-shadow 1.5s ease;
                display: flex; justify-content: center; align-items: center;
                box-sizing: border-box; padding: 25px 12px;
            }
            .prayer-plaque-container::before {
                content: ''; position: absolute; top: -35px; left: 50%; transform: translateX(-50%);
                width: 1px; height: 35px; background-color: rgba(150,41,41,0.4);
            }
            .plaque-wish-text {
                writing-mode: vertical-rl; height: 100%; width: 100%;
                font-size: 1.2rem; font-weight: bold; color: #232323;
                letter-spacing: 0.18em; line-height: 1.6;
                text-align: start; display: block; word-break: break-all;
                font-family: inherit !important; 
            }
            
            .calligraphy-brush {
                position: absolute; top: 52%; left: 56%;
                width: 8px; height: 180px;
                background: linear-gradient(to bottom, #2b2b2b 0%, #151515 85%, #e2dac9 100%);
                border-radius: 1px; z-index: 6; cursor: pointer;
                pointer-events: auto !important;
                transition: opacity 1s ease, transform 1s ease; transform-origin: top center;
            }
            .calligraphy-brush::after {
                content: ''; position: absolute; bottom: -20px; left: -2px;
                width: 12px; height: 20px; background-color: #ffffff;
                clip-path: polygon(50% 100%, 0 0, 100% 0);
            }
            
            .prayer-plaque-container.ascend {
                box-shadow: 0 0 50px rgba(255,254,220,0.85);
                transform: translate(-50%, -190vh) scale(0.12); opacity: 0.05;
            }
            
            .ink-writing-overlay {
                position: absolute; bottom: 8%; left: 50%; transform: translateX(-50%);
                z-index: 12; width: 320px; display: none; opacity: 0;
                transition: opacity 0.5s ease; background: rgba(20, 26, 35, 0.9);
                padding: 15px; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                border: 1px solid rgba(255,255,255,0.06); text-align: center; writing-mode: horizontal-tb !important;
            }
            .ink-input-field {
                width: 100%; background: rgba(0,0,0,0.3); border: 1px solid #4a5568;
                color: #ffffff; padding: 8px 10px; font-size: 0.95rem; border-radius: 2px;
                box-sizing: border-box; text-align: center; letter-spacing: 0.1em;
                margin-bottom: 12px; font-family: inherit !important;
            }
            .ink-submit-btn {
                background-color: #962929; color: #ffffff; padding: 6px 20px;
                font-size: 0.85rem; letter-spacing: 0.2em; border-radius: 2px;
                cursor: pointer; border: none; font-family: inherit !important;
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
            <!-- 🌟 全屏覆盖：全新重构、宏大阔朗的 2006 年 1 月冬季星空画布 -->
            <svg class="global-starry-background" id="ch-starry-bg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
                <!-- 朦胧古典浑天仪圆轨格线 -->
                <circle cx="960" cy="540" r="420" class="astro-grid" />
                <circle cx="960" cy="540" r="700" class="astro-dashed" />
                <line x1="100" y1="540" x2="1820" y2="540" class="astro-dashed" />
                <line x1="960" y1="50" x2="960" y2="1030" class="astro-dashed" />

                <!-- 🌟【大写意：全屏自然散落的背景淡星，剔除孤岛感】 -->
                <circle cx="250" cy="180" r="1.2" class="star-node ambient" />
                <circle cx="450" cy="850" r="1.5" class="star-node ambient" />
                <circle cx="150" cy="620" r="1.0" class="star-node ambient" />
                <circle cx="850" cy="120" r="1.8" class="star-node ambient" />
                <circle cx="1300" cy="150" r="1.3" class="star-node ambient" />
                <circle cx="1750" cy="280" r="1.6" class="star-node ambient" />
                <circle cx="1620" cy="780" r="1.2" class="star-node ambient" />
                <circle cx="1450" cy="920" r="1.5" class="star-node ambient" />
                <circle cx="780" cy="960" r="1.0" class="star-node ambient" />
                <circle cx="1050" cy="980" r="1.4" class="star-node ambient" />

                <!-- 🌟【迈向大画幅：猎户座 Orion 真正威严展布】 -->
                <!-- 骨骼框架连线 -->
                <polyline points="720,260 920,290 980,620 760,580 720,260" class="constellation-line" /> 
                <line x1="720" y1="260" x2="820,440" class="constellation-line" />
                <line x1="920" y1="290" x2="870,445" class="constellation-line" />
                <polyline points="720,260 620,210 560,230" class="constellation-line" /> 
                <!-- 核心亮星锚定 -->
                <circle cx="720" cy="260" r="7.0" class="star-node alpha" /> <!-- 参宿四 ( Betelgeuse ) -->
                <circle cx="920" cy="290" r="5.0" class="star-node" />       <!-- 参宿五 -->
                <circle cx="980" cy="620" r="7.5" class="star-node alpha" /> <!-- 参宿七 ( Rigel ) -->
                <circle cx="760" cy="580" r="4.5" class="star-node" />       <!-- 参宿六 -->
                <!-- 昂然横陈的“腰带三星” -->
                <circle cx="820" cy="440" r="4.0" class="star-node" />       
                <circle cx="845" cy="442" r="4.0" class="star-node" />       
                <circle cx="870" cy="445" r="4.0" class="star-node" />       

                <!-- 🌟【大犬座与天狼星 Canis Major - 移至右侧下开阔区】 -->
                <polyline points="1200,820 1320,930 1420,880 1320,740 1200,820" class="constellation-line" />
                <circle cx="1200" cy="820" r="10.0" class="star-node sirius" /> <!-- 极高亮耀眼天狼星 -->

                <!-- 🌟【小犬座南河三 Canis Minor - 居右上高空】 -->
                <line x1="1280" y1="220" x2="1400" y2="250" class="constellation-line" />
                <circle cx="1280" cy="220" r="6.0" class="star-node alpha" /> <!-- 南河三 -->

                <!-- 🌟【冬季大三角神圣巨拱连线 - 纵贯整座幕布】 -->
                <polygon points="720,260 1200,820 1280,220" class="winter-triangle-line" />

                <!-- 🌟【金牛座与朱砂红昴宿星团 - 铺展至左侧开阔野】 -->
                <polyline points="520,160 420,90 320,120" class="constellation-line" />
                <circle cx="520" cy="160" r="6.5" class="star-node alpha" /> <!-- 毕宿五 -->
                <!-- 烟散状浪漫昂宿星群 -->
                <g transform="translate(300, 80)">
                    <circle cx="0" cy="0" r="2.0" class="star-node vermilion" />
                    <circle cx="8" cy="-6" r="1.5" class="star-node vermilion" />
                    <circle cx="-6" cy="10" r="2.0" class="star-node vermilion" />
                    <circle cx="14" cy="6" r="1.2" class="star-node vermilion" />
                    <circle cx="-3" cy="-10" r="1.6" class="star-node vermilion" />
                    <circle cx="22" cy="-2" r="1.8" class="star-node vermilion" />
                </g>
            </svg>

            <div id="ch-title-screen" class="vertical-text font-kangxi">阊阖风</div>
            <div id="ch-intro" class="vertical-text font-kangxi" style="display: none;">
                阊阖风，西方风也。阊阖者，天门也。咸收藏也。<br>
                属兑，八音为金。<br>
                秋分之风。
            </div>

            <div id="ch-content-stage">
                <div class="woodblock-catalog-container gate-universe-box font-kangxi">
                    <!-- 门扉图层（安全居于底层） -->
                    <div class="ch-gate-overlay" id="ch-gate-box">
                        <div class="gate-leaf gate-leaf-left"></div>
                        <div class="gate-leaf gate-leaf-right"></div>
                    </div>
                    <div class="heaven-ray"></div>
                    <!-- 祈福牌（高调托举至最上层） -->
                    <div class="prayer-plaque-container font-kangxi" id="ch-plaque">
                        <div class="plaque-wish-text font-kangxi" id="wish-text-slot"></div>
                    </div>
                    <div class="calligraphy-brush" id="ch-brush"></div>
                </div>
                <div id="gate-push-tip" class="font-kangxi">【 點擊祈福牌或毛筆，落墨祈願 】</div>
                <div class="ink-writing-overlay font-kangxi" id="ch-writing-panel">
                    <input type="text" class="ink-input-field font-kangxi" id="wish-input" placeholder="秉笔落墨，写下祈愿" maxlength="24" autocomplete="off" />
                    <button class="ink-submit-btn font-kangxi" id="btn-submit-wish">送入門</button>
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

        starryBg.classList.add('awaken');
        gateBox.classList.add('open');
        await wait(1000);

        plaque.classList.add('ascend');
        playChimeGong();
        await wait(5500);

        contentStage.style.opacity = 0;
        await wait(2500);
        contentStage.innerHTML = ''; 

        spawnDriftingLeaves();
        await wait(5000);
        container.innerHTML = '';
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
