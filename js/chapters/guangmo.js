// js/chapters/guangmo.js
const wait = ms => new Promise(r => setTimeout(r, ms));

const nextClick = (element) => new Promise(resolve => {
    element.addEventListener('click', resolve, { once: true });
});

// 🌟 Web Audio API 高精度金石声学仿真引擎
// 1. 仿真合成“极轻、极沉、极远”的古代皮鼓革音
function playDistant革音() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        // 55Hz 低频，模拟巨大的皮革鼓面在远山引发的低频共振
        osc.frequency.setValueAtTime(55, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 1.5);
        
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        // 极其漫长、轻缓的指数级衰减，形成余响袅袅的深远感
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.8);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 3.9);
    } catch (e) {
        console.warn("革音受拦截");
    }
}

// 2. 仿真合成“冰消融雪”之音：极其清脆、剔透、带有水晶质感的破冰声
function playCrystal破冰() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        // 双高频谐振器交织
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(2400, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.12);
        
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(4600, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.06);
        
        gain1.gain.setValueAtTime(0.06, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        
        gain2.gain.setValueAtTime(0.015, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.55);
        osc2.stop(ctx.currentTime + 0.55);
    } catch (e) {
        console.warn("破冰音受拦截");
    }
}

export default async function playGuangmo(container) {
    // 强制刷新当前生命周期
    window.currentActiveChapter = 7;
    container.classList.add('active'); 

    container.innerHTML = `
        <style>
            /* 🌟 全线贯彻极致克制、纯白未落一字的宣纸/雪原底色 */
            .guangmo-wrapper {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative; 
                background-color: #ffffff;
                user-select: none; overflow: hidden;
            }
            
            /* 启幕词字迹：淡墨色 */
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
            
            /* 🌟【余秋雨散文金石连线舞台】纯正 Block 列排版，空灵舒展 */
            .gm-poem-stage {
                position: relative;
                width: fit-content; height: fit-content;
                writing-mode: vertical-rl !important;
                display: block !important;
                opacity: 0;
                transition: opacity 3.5s cubic-bezier(0.33, 1, 0.68, 1);
                z-index: 5;
            }
            
            /* 手书小楷：字迹偏瘦、偏淡，笔触微带枯笔，如呵在冷空气中的一口气 */
            .gm-text-line {
                display: block !important;
                font-size: 1.25rem; font-weight: bold;
                color: #1a1a1a; opacity: 0.65; /* 偏淡瘦骨 */
                line-height: 2.3; letter-spacing: 0.22em;
                text-align: start !important;
                margin-left: 20px;
                font-family: inherit !important;
                filter: blur(0.2px) contrast(110%);
            }
            
            /* 落款：极高稳定性，优雅下沉于左下方 */
            .gm-text-author {
                display: block !important;
                font-size: 0.88rem; color: #666666; opacity: 0.55;
                margin-left: 24px; letter-spacing: 0.15em;
                text-align: end !important; /* 完美下沉 */
                height: 380px; /* 锁定物理行高度确保行气 */
                font-family: inherit !important;
            }
            
            /* 🌟【第八开引线：极淡的中央煦暖日光晕】 */
            .gm-warmth-glow {
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 70vw; height: 70vw; border-radius: 50%;
                background: radial-gradient(circle, rgba(255, 238, 200, 0.28) 0%, rgba(255, 246, 225, 0.08) 50%, rgba(255,255,255,0) 70%);
                pointer-events: none; z-index: 2;
                opacity: 0;
                transition: opacity 4s cubic-bezier(0.25, 1, 0.5, 1);
            }
        </style>

        <div class="guangmo-wrapper" id="gm-wrapper">
            <!-- 暖意地维层 -->
            <div class="gm-warmth-glow" id="gm-glow-layer"></div>

            <!-- 一幕大字 -->
            <div id="gm-title-screen" class="vertical-text font-kangxi">广莫风</div>

            <!-- 二幕启幕词 -->
            <div id="gm-intro" class="vertical-text font-kangxi" style="display: none;">
                广莫风，北方风也。广，大也。莫，虚也。风至则万物藏，物成而虚也。<br>
                属坎，八音为革。<br>
                冬至之风。
            </div>

            <!-- 三幕：余秋雨手书小帖浮现舞台 -->
            <div class="gm-poem-stage font-kangxi" id="gm-poem-box">
                <div class="gm-text-line font-kangxi">「在这种天地中獨個兒行走，侏儒也變成了巨人。</div>
                <div class="gm-text-line font-kangxi">在这种天地中獨個兒行走，巨人也變成了侏儒。」</div>
                <div class="gm-text-author font-kangxi">——余秋雨《陽關雪》</div>
            </div>
        </div>
    `;

    const wrapper = document.getElementById('gm-wrapper');
    const titleScreen = document.getElementById('gm-title-screen');
    const intro = document.getElementById('gm-intro');
    const poemBox = document.getElementById('gm-poem-box');
    const glowLayer = document.getElementById('gm-glow-layer');

    // ====== 第一幕：大字浮现 ======
    await wait(200);
    titleScreen.style.opacity = 1;
    await nextClick(wrapper);
    titleScreen.style.opacity = 0;
    await wait(2000);
    titleScreen.style.display = 'none';

    // ====== 第二幕：广莫解意 ======
    intro.style.display = 'block';
    await wait(50);
    intro.style.opacity = 1;
    await nextClick(wrapper);
    intro.style.opacity = 0;
    await wait(2000);
    intro.style.display = 'none';

    // ====== 第三幕：余秋雨原句如呼吸般浮现与消散 ======
    poemBox.style.display = 'block';
    await wait(100);
    // 缓缓浮现，宛若冰天雪地里的一行孤寂足印
    poemBox.style.opacity = 1;
    
    // 停留数秒（4.5秒：足够看画人平静地默读完两遍）
    await wait(4500);
    
    // 缓缓消散，字迹淡去，如足迹被漫天飞雪温柔覆盖
    poemBox.style.opacity = 0;
    await wait(3500);
    poemBox.style.display = 'none';

    // ====== 第四幕：纯白静置，革音破冰 ======
    await wait(1200); // 纯白静置片刻
    
    // 1. 极轻、极沉、极远的革音一声——咚。
    playDistant革音();
    
    // 2. 紧接着：水晶般清脆、剔透的冬夜破冰消融声破空而出
    await wait(250);
    playCrystal破冰();
    
    // 3. 远古余响袅袅，渐弱至无，空灵深远
    await wait(2500);

    // ====== 第五幕：微渗暖意，无缝引向第八开终章 ======
    glowLayer.style.opacity = 1; // 纯白中央柔和渗出极淡的暖黄色日照光晕
    await wait(3800);

    // 卸载本章，完美将控制权移交至最后一开
    container.innerHTML = '';
    container.classList.remove('active');
    
    window.currentActiveChapter = 8;
}