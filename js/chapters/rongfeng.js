// js/chapters/rongfeng.js
const wait = ms => new Promise(r => setTimeout(r, ms));

const nextClick = (element) => new Promise(resolve => {
    element.addEventListener('click', resolve, { once: true });
});

// 🌟 Web Audio API 高精度数字声音合成器（古古乐八音 · 匏笙和弦）
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
    // 🛡️【时序放行守卫】
    if (window.currentActiveChapter === undefined) {
        window.currentActiveChapter = 8;
    }
    while (window.currentActiveChapter < 8) {
        await wait(200);
    }

    container.classList.add('active');

    container.innerHTML = `
        <style>
            .rongfeng-wrapper {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative; 
                background: radial-gradient(circle, rgba(255, 242, 228, 0.4) 0%, rgba(255, 255, 255, 1) 70%);
                user-select: none; overflow: hidden;
            }
            
            /* 🌟【大修正】从头到尾全面贯彻 W3C 标准纯横排流，彻底粉碎折行重叠 */
            #rf-title-screen { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 3.8rem; letter-spacing: 0.6em; text-indent: 0.6em;
                opacity: 0; transition: opacity 2s ease; cursor: pointer; white-space: nowrap; text-align: center;
                color: #1a1a1a; z-index: 10;
                writing-mode: horizontal-tb !important;
            }
            
            /* 🌟【大修正】立春启幕词改为优雅的中央横排对齐，极具现代现代展厅设计感 */
            #rf-intro { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 1.2rem; line-height: 2.3; letter-spacing: 0.18em; 
                opacity: 0; transition: opacity 2s ease; cursor: pointer;
                writing-mode: horizontal-tb !important; white-space: nowrap;
                text-align: center; color: #2b2b2b; z-index: 10;
            }
            
            /* 中央横排主舞台长廊 */
            .rf-master-layout-box {
                display: flex !important; flex-direction: column !important;
                align-items: center !important; justify-content: center !important;
                width: 100%; height: auto; position: relative; z-index: 5;
                opacity: 0; transition: opacity 2.5s cubic-bezier(0.25, 1, 0.5, 1);
                writing-mode: horizontal-tb !important;
            }
            
            /* 🌟【大修正】纯横排法帖视窗：宽度自适应，给句子舒展提供无限空间 */
            .rf-poem-scroll-flow {
                width: auto; height: auto;
                max-width: 80vw;
                display: block !important;
                text-align: center !important;
                margin-bottom: 55px;
                writing-mode: horizontal-tb !important;
            }
            
            /* 正文：从容舒展，如春日枝条般横向蔓延 */
            .rf-text-line {
                display: block !important;
                font-size: 1.6rem; font-weight: bold; color: #111111;
                letter-spacing: 0.18em; line-height: 1.8;
                white-space: nowrap !important;
                font-family: inherit !important;
                filter: drop-shadow(0.5px 0.5px 0px rgba(0,0,0,0.05));
                margin-bottom: 15px;
            }
            
            /* 🌟【大修正】出处落款：在横排流下完美靠右对齐，产生极高雅的文人题款落脚点 */
            .rf-text-author {
                display: block !important;
                font-size: 1rem; color: #555555;
                text-align: right !important; /* 稳健靠右对齐 */
                font-family: inherit !important;
                letter-spacing: 0.12em;
                margin-top: 12px;
                padding-right: 15px;
            }
            
            .rf-final-closure-btn {
                writing-mode: horizontal-tb !important; white-space: nowrap !important;
                font-size: 1.05rem; letter-spacing: 0.25em; color: #962929; 
                font-weight: bold; cursor: pointer;
                transition: opacity 1.2s ease, transform 0.3s ease;
                opacity: 0; display: none;
                font-family: inherit !important;
                margin-top: 10px;
            }
            .rf-final-closure-btn:hover { transform: scale(1.05); text-shadow: 0 0 10px rgba(150,41,41,0.15); }
        </style>

        <div class="rongfeng-wrapper" id="rf-wrapper">
            <!-- 一幕 -->
            <div id="rf-title-screen" class="font-kangxi">融风</div>

            <!-- 二幕 -->
            <div id="rf-intro" class="font-kangxi" style="display: none;">
                融风，东北风也。融，和也。阳气始动，万物始融。<br><br>
                属商，八音为匏。<br><br>
                立春之风。
            </div>

            <!-- 三幕：完美横排终章舞台 -->
            <div class="rf-master-layout-box" id="rf-stage-box">
                <div class="rf-poem-scroll-flow font-kangxi">
                    <div class="rf-text-line font-kangxi">「浴乎沂，風乎舞雩，詠而歸。」</div>
                    <div class="rf-text-author font-kangxi">——《論語》</div>
                </div>
                <div class="rf-final-closure-btn font-kangxi" id="rf-btn-close">【 全冊掩卷 · 終 】</div>
            </div>
        </div>
    `;

    const wrapper = document.getElementById('rf-wrapper');
    const titleScreen = document.getElementById('rf-title-screen');
    const intro = document.getElementById('rf-intro');
    const stageBox = document.getElementById('rf-stage-box');
    const closeBtn = document.getElementById('rf-btn-close');

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

    // 唤醒横排主舞台
    stageBox.style.display = 'flex';
    await wait(100);
    stageBox.style.opacity = 1; 

    // 八音古乐鸣响
    await wait(1500);
    playPaoShengHarmony();

    await wait(5000);

    closeBtn.style.display = 'block';
    setTimeout(() => { closeBtn.style.opacity = 1; }, 50);

    return new Promise((resolveAllChaptersBook) => {
        closeBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            wrapper.style.transition = 'opacity 3s ease-in-out';
            wrapper.style.opacity = 0;
            
            await wait(3200);
            container.innerHTML = '';
            container.classList.remove('active');
            resolveAllChaptersBook();
        });
    });
}
