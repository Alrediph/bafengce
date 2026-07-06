// js/chapters/rongfeng.js
const wait = ms => new Promise(r => setTimeout(r, ms));

const nextClick = (element) => new Promise(resolve => {
    element.addEventListener('click', resolve, { once: true });
});

// 🌟 Web Audio API 高精度数字声音合成器（古乐八音之 · 匏笙和弦）
function playPaoShengHarmony() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const frequencies = [293.66, 440.00, 587.33]; 
        
        frequencies.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            
            gain.gain.setValueAtTime(0.001, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.06 - (index * 0.015), ctx.currentTime + 1.2);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 5.0);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 5.2);
        });
    } catch (e) {
        console.warn("匏音合成受拦截");
    }
}

export default async function playRongfeng(container) {
    // 🛡️【终极时序放行守卫】
    if (window.currentActiveChapter === undefined) {
        window.currentActiveChapter = 8;
    }
    while (window.currentActiveChapter < 8) {
        await wait(200);
    }

    container.classList.add('active');

    container.innerHTML = `
        <style>
            /* 🌟 完全复刻清明标准：大宣纸底，注入立春微曦的轻柔呼吸感晕染 */
            .rongfeng-wrapper {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative; 
                background: radial-gradient(circle, rgba(255, 242, 228, 0.4) 0%, rgba(255, 255, 255, 1) 70%);
                user-select: none; overflow: hidden;
            }
            
            /* 🌟【大修复：对标清明幕一】纯正金石大竖排，通过外层Flex天然双轴完美居中 */
            #rf-title-screen { 
                font-size: 3.8rem; letter-spacing: 0.6em; opacity: 0; 
                transition: opacity 2s ease; cursor: pointer; 
            }
            
            /* 🌟【大修复：对标清明幕二】传统竖排多列启幕词，行气疏朗空灵，绝对不产生偏台 */
            #rf-intro { 
                font-size: 1.2rem; line-height: 3; opacity: 0; 
                transition: opacity 2s ease; position: absolute; cursor: pointer; 
            }
            
            /* ================================================================= */
            /* 🛡️ 曾皙主舞台及后续区域样式绝对保留，不发生任何改变 */
            /* ================================================================= */
            .rf-stage-layout-v7 {
                position: absolute; 
                top: 50%; left: 50%; 
                transform: translate(-50%, -50%) !important;
                width: auto; height: auto; z-index: 5;
                display: block !important; 
                opacity: 0; transition: opacity 2.5s cubic-bezier(0.25, 1, 0.5, 1);
            }
            
            .rf-scroll-flow-v7 {
                height: 60vh !important; 
                width: auto;
                writing-mode: vertical-rl !important;
                display: block !important;
                margin-bottom: 25px;
                transition: opacity 1.8s ease-in-out; 
            }
            
            .rf-text-line-v7 {
                display: block !important;
                font-size: 2.5rem !important; 
                font-weight: bold; color: #111111;
                letter-spacing: 0.25em; line-height: 1.5;
                white-space: nowrap !important; 
                font-family: inherit !important;
                filter: drop-shadow(0.5px 0.5px 0px rgba(0,0,0,0.04));
                margin-left: 65px !important; 
            }
            
            .rf-text-author-v7 {
                display: block !important;
                font-size: 1.05rem; color: #555555;
                text-align: end !important; 
                font-family: inherit !important;
                white-space: nowrap !important;
                height: calc(100% - 15px); 
                letter-spacing: 0.15em;
            }
            
            .rf-close-btn-v7 {
                position: absolute; bottom: -45px; left: 50%; transform: translateX(-50%);
                writing-mode: horizontal-tb !important; white-space: nowrap !important;
                font-size: 1.05rem; letter-spacing: 0.2em; color: #7f7f7f; 
                font-weight: bold; cursor: pointer;
                transition: opacity 1.2s ease, color 0.3s ease;
                opacity: 0; display: none;
                font-family: inherit !important;
            }
            .rf-close-btn-v7:hover { color: #962929; }

            .rf-blessing-vertical-v7 {
                position: absolute; 
                top: 50%; left: 50%; 
                transform: translate(-50%, -50%) !important; 
                writing-mode: vertical-rl !important; 
                white-space: nowrap !important; 
                height: 58vh !important; 
                font-size: 2.6rem !important; font-weight: bold;
                color: #962929; opacity: 0; display: none;
                letter-spacing: 0.35em; line-height: 1.5;
                z-index: 12; font-family: inherit !important;
                text-align: start !important; 
                filter: drop-shadow(1px 1px 2px rgba(150, 41, 41, 0.12));
                transition: opacity 2.8s cubic-bezier(0.33, 1, 0.68, 1);
            }
        </style>

        <div class="rongfeng-wrapper" id="rf-wrapper">
            <!-- 🌟 幕一：完全对标清明，挂载正统 vertical-text 与类名 -->
            <div id="rf-title-screen" class="vertical-text font-kangxi">融风</div>

            <!-- 🌟 幕二：完全对标清明，挂载正统 vertical-text 启幕解意 -->
            <div id="rf-intro" class="vertical-text font-kangxi" style="display: none;">
                融风，东北风也。融，和也。阳气始动，万物始融。<br>
                属艮，八音为匏。<br>
                立春之风。
            </div>

            <!-- 三幕：曾皙主舞台 -->
            <div class="rf-stage-layout-v7" id="rf-stage-box">
                <div class="rf-scroll-flow-v7 font-kangxi" id="rf-poem-flow">
                    <div class="rf-text-line-v7 font-kangxi">「浴乎沂，風乎舞雩，詠而歸。」</div>
                    <div class="rf-text-author-v7 font-kangxi">——《論語》</div>
                </div>
                <div class="rf-final-closure-btn font-kangxi" id="rf-btn-close">【 全冊掩卷 · 終 】</div>
            </div>

            <!-- 四幕：屈原寄语终极绝对居中祝福 -->
            <div class="rf-blessing-vertical-v7 font-kangxi" id="rf-blessing-toast">願歲並謝，與長友兮。</div>
        </div>
    `;

    const wrapper = document.getElementById('rf-wrapper');
    const titleScreen = document.getElementById('rf-title-screen');
    const intro = document.getElementById('rf-intro');
    const stageBox = document.getElementById('rf-stage-box');
    const poemFlow = document.getElementById('rf-poem-flow');
    const closeBtn = document.getElementById('rf-btn-close');
    const blessingToast = document.getElementById('rf-blessing-toast');

    // ====== 🌟【大修正】第一幕：完全复刻清明大字时序 ======
    titleScreen.style.opacity = 1;
    await nextClick(wrapper);
    titleScreen.style.opacity = 0;
    await wait(2000);
    titleScreen.style.display = 'none';

    // ====== 🌟【大修正】第二幕：完全复刻清明解意词时序 ======
    intro.style.display = 'block';
    await wait(50);
    intro.style.opacity = 1;
    await nextClick(wrapper);
    intro.style.opacity = 0;
    await wait(2000);
    intro.style.display = 'none';

    // ====== 后续满意的舞台区域逻辑保持绝对不变 ======
    stageBox.style.display = 'block'; 
    await wait(100);
    stageBox.style.opacity = 1; 

    await wait(1500);
    playPaoShengHarmony();

    await wait(5000);

    closeBtn.style.display = 'block';
    setTimeout(() => { closeBtn.style.opacity = 1; }, 50);

    return new Promise((resolveAllChaptersBook) => {
        closeBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            poemFlow.style.opacity = 0;
            closeBtn.style.opacity = 0;
            await wait(1800);
            stageBox.style.display = 'none';
            
            await wait(1200);

            blessingToast.style.display = 'block';
            await wait(50);
            blessingToast.style.opacity = 0.85;
            
            await wait(6000);
            
            blessingToast.style.opacity = 0;
            await wait(2500);

            wrapper.style.transition = 'opacity 3s ease-in-out';
            wrapper.style.opacity = 0;
            
            await wait(3200);
            container.innerHTML = '';
            container.classList.remove('active');
            
            resolveAllChaptersBook();
        });
    });
}
