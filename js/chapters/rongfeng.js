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
    // 🛡️【时序放行守卫】
    if (window.currentActiveChapter === undefined) {
        window.currentActiveChapter = 8;
    }
    while (window.currentActiveChapter < 8) {
        await wait(200);
    }

    container.classList.add('active');

    // 🌟 全量引入全新的 v6-absolute 独立样式，彻底将偏台、竖排、旧缓存碎骨扬灰！
    container.innerHTML = `
        <style>
            .rf-wrapper-v6-absolute {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative; 
                background: radial-gradient(circle, rgba(255, 242, 228, 0.4) 0%, rgba(255, 255, 255, 1) 70%);
                user-select: none; overflow: hidden;
            }
            
            #rf-title-v6 { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 3.8rem; letter-spacing: 0.6em; text-indent: 0.6em;
                opacity: 0; transition: opacity 2s ease; cursor: pointer; white-space: nowrap; text-align: center;
                color: #1a1a1a; z-index: 10;
                writing-mode: horizontal-tb !important;
            }
            
            #rf-intro-v6 { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 1.2rem; line-height: 2.8; letter-spacing: 0.15em; 
                opacity: 0; transition: opacity 2s ease; cursor: pointer;
                writing-mode: horizontal-tb !important; white-space: nowrap;
                text-align: center; color: #2b2b2b; z-index: 10;
            }
            
            /* 🌟【大修正：曾皙主舞台布局】全面对标清明雨歇图，横向绝对双轴居中 */
            .rf-stage-layout-v6 {
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                display: flex !important; flex-direction: column !important;
                align-items: center !important; justify-content: center !important;
                width: auto; height: auto; z-index: 5;
                opacity: 0; transition: opacity 2.5s cubic-bezier(0.25, 1, 0.5, 1);
                writing-mode: horizontal-tb !important;
                text-align: center !important;
            }
            
            .rf-scroll-flow-v6 {
                display: block !important;
                writing-mode: horizontal-tb !important;
                text-align: center !important;
                margin-bottom: 25px;
                transition: opacity 1.8s ease-in-out;
            }
            
            /* 🌟 正文：清秀、从容舒展的横排手书 */
            .rf-text-line-v6 {
                display: block !important;
                font-size: 1.45rem !important; /* 校准为清明秀丽的典雅尺寸 */
                font-weight: normal; color: #111111;
                letter-spacing: 0.18em; line-height: 1.8;
                white-space: nowrap !important; 
                font-family: inherit !important;
            }
            
            /* 落款：靠右舒展 */
            .rf-text-author-v6 {
                display: block !important;
                font-size: 0.92rem; color: #555555;
                text-align: right !important;
                margin-top: 12px;
                padding-right: 8px;
                letter-spacing: 0.12em;
                font-family: inherit !important;
            }
            
            .rf-close-btn-v6 {
                writing-mode: horizontal-tb !important; white-space: nowrap !important;
                font-size: 1.05rem; letter-spacing: 0.2em; color: #7f7f7f; 
                font-weight: bold; cursor: pointer;
                transition: opacity 1.2s ease, color 0.3s ease;
                opacity: 0; display: none;
                font-family: inherit !important;
            }
            .rf-close-btn-v6:hover { color: #962929; }

            /* 🌟【终极完美修正：屈原寄语大写意】 */
            /* 🌟 严格尊照清明雨歇图的黄金排版：横排、无序言打扰、绝对死锁屏幕中心 */
            .rf-blessing-absolute-v6 {
                position: absolute; 
                top: 50%; left: 50%; 
                transform: translate(-50%, -50%); /* 🌟 核心：双轴交叉绝对居中线 */
                writing-mode: horizontal-tb !important; 
                white-space: nowrap !important; /* 🌟 核心：锁死不准换行折列 */
                font-size: 1.45rem !important; /* 🌟 核心：对标清明雨歇图的优雅字号，空灵素雅 */
                font-weight: normal;
                color: #962929; /* 传统朱砂红祝福 */
                opacity: 0; display: none;
                letter-spacing: 0.18em; line-height: 1.8;
                z-index: 12; 
                font-family: inherit !important;
                text-align: center !important;
                transition: opacity 2.8s cubic-bezier(0.33, 1, 0.68, 1);
            }
        </style>

        <div class="rf-wrapper-v6-absolute" id="rf-wrapper">
            <div id="rf-title-v6" class="font-kangxi">融风</div>

            <div id="rf-intro-v6" class="font-kangxi" style="display: none;">
                融风，东北风也。融，和也。阳气始动，万物始融。<br><br>
                属艮，八音为匏。<br><br>
                立春之风。
            </div>

            <div class="rf-stage-layout-v6" id="rf-stage-box">
                <div class="rf-scroll-flow-v6 font-kangxi" id="rf-poem-flow">
                    <div class="rf-text-line-v6 font-kangxi">「浴乎沂，風乎舞雩，詠而歸。」</div>
                    <div class="rf-text-author-v6 font-kangxi">——《論語》</div>
                </div>
                <div class="rf-close-btn-v6 font-kangxi" id="rf-btn-close">【 全冊掩卷 · 終 】</div>
            </div>

            <div class="rf-blessing-absolute-v6 font-kangxi" id="rf-blessing-toast">願歲並謝，與長友兮。</div>
        </div>
    `;

    const wrapper = document.getElementById('rf-wrapper');
    const titleScreen = document.getElementById('rf-title-v6');
    const intro = document.getElementById('rf-intro-v6');
    const stageBox = document.getElementById('rf-stage-box');
    const poemFlow = document.getElementById('rf-poem-flow');
    const closeBtn = document.getElementById('rf-btn-close');
    const blessingToast = document.getElementById('rf-blessing-toast');

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

    stageBox.style.display = 'flex';
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
            
            // 1. 点击按钮：前半部分舞台徐徐消散
            poemFlow.style.opacity = 0;
            closeBtn.style.opacity = 0;
            await wait(1800);
            stageBox.style.display = 'none';
            
            // 2. 纯白雪原绝美留白静置，屏息酝酿
            await wait(1500);

            // 3. 🌟【最完美的绝唱】朱砂红的温暖祝福，像清明雨歇图一样，在最中央极其清秀地款款洇显！
            blessingToast.style.display = 'block';
            await wait(50);
            blessingToast.style.opacity = 0.85;
            
            // 驻留 6 秒，供用户静心回味
            await wait(6000);
            
            // 4. 彻底归隐落幕
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
