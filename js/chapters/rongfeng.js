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

    container.innerHTML = `
        <style>
            .rongfeng-wrapper {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative; 
                background: radial-gradient(circle, rgba(255, 242, 228, 0.4) 0%, rgba(255, 255, 255, 1) 70%);
                user-select: none; overflow: hidden;
            }
            
            #rf-title-screen { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 3.8rem; letter-spacing: 0.6em; text-indent: 0.6em;
                opacity: 0; transition: opacity 2s ease; cursor: pointer; white-space: nowrap; text-align: center;
                color: #1a1a1a; z-index: 10;
                writing-mode: vertical-rl !important;
            }
            
            #rf-intro { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 1.2rem; line-height: 2.8; letter-spacing: 0.15em; 
                opacity: 0; transition: opacity 2s ease; cursor: pointer;
                writing-mode: vertical-rl !important; white-space: nowrap;
                color: #2b2b2b; z-index: 10;
            }
            
            /* 中央垂直布局总链 */
            .rf-master-layout-box {
                display: flex !important; flex-direction: column !important;
                align-items: center !important; justify-content: center !important;
                width: 100%; height: 100%; position: relative; z-index: 5;
                opacity: 0; transition: opacity 2.5s cubic-bezier(0.25, 1, 0.5, 1);
            }
            
            /* 正统竖排流排版 */
            .rf-poem-scroll-flow {
                height: 62vh !important; 
                width: auto;
                writing-mode: vertical-rl !important;
                display: block !important;
                margin-bottom: 20px;
                transition: opacity 1.8s ease-in-out; /* 为掩卷淡出预留流畅过渡 */
            }
            
            /* 曾皙言志正文：巨幕字体 */
            .rf-text-line {
                display: block !important;
                font-size: 2.5rem !important; 
                font-weight: bold; color: #111111;
                letter-spacing: 0.25em; line-height: 1.5;
                white-space: nowrap !important; 
                font-family: inherit !important;
                filter: drop-shadow(0.5px 0.5px 0px rgba(0,0,0,0.04));
            }
            
            /* 落款出处 */
            .rf-text-author {
                display: block !important;
                font-size: 1.05rem; color: #555555;
                margin-left: 28px; 
                text-align: end !important; 
                font-family: inherit !important;
                white-space: nowrap !important;
                height: calc(100% - 10px); 
                letter-spacing: 0.15em;
            }
            
            .rf-final-closure-btn {
                writing-mode: horizontal-tb !important; white-space: nowrap !important;
                font-size: 1.05rem; letter-spacing: 0.2em; color: #7f7f7f; 
                font-weight: bold; cursor: pointer;
                transition: opacity 1.2s ease, color 0.3s ease;
                opacity: 0; display: none;
                font-family: inherit !important;
                margin-top: 15px;
            }
            .rf-final-closure-btn:hover { color: #962929; }

            /* 🌟【终极祝福：愿岁并谢，与长友兮】大写意朱砂红竖排大楷 */
            .rf-final-blessing-toast {
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                writing-mode: vertical-rl !important; white-space: nowrap !important;
                font-size: 2.3rem !important; font-weight: bold;
                color: #962929; opacity: 0; display: none;
                letter-spacing: 0.35em; line-height: 1.5;
                z-index: 12; font-family: inherit !important;
                /* 微弱的晕染背光，模拟墨迹在宣纸上的古朴厚重感 */
                filter: drop-shadow(1px 1px 2px rgba(150, 41, 41, 0.15));
                transition: opacity 2.8s cubic-bezier(0.33, 1, 0.68, 1);
            }
        </style>

        <div class="rongfeng-wrapper" id="rf-wrapper">
            <div id="rf-title-screen" class="vertical-text font-kangxi">融风</div>

            <div id="rf-intro" class="vertical-text font-kangxi" style="display: none;">
                融风，东北风也。融，和也。阳气始动，万物始融。<br>
                属艮，八音为泡。<br>
                立春之风。
            </div>

            <div class="rf-master-layout-box" id="rf-stage-box">
                <div class="rf-poem-scroll-flow font-kangxi" id="rf-poem-flow">
                    <div class="rf-text-line font-kangxi">「浴乎沂，風乎舞雩，詠而歸。」</div>
                    <div class="rf-text-author font-kangxi">——《論語》</div>
                </div>
                <div class="rf-final-closure-btn font-kangxi" id="rf-btn-close">【 全冊掩卷 · 終 】</div>
            </div>

            <div class="rf-final-blessing-toast font-kangxi" id="rf-blessing-toast">願歲並謝，與長友兮。</div>
        </div>
    `;

    const wrapper = document.getElementById('rf-wrapper');
    const titleScreen = document.getElementById('rf-title-screen');
    const intro = document.getElementById('rf-intro');
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

    // ====== 🌟 终章全卷合流控制链 ======
    return new Promise((resolveAllChaptersBook) => {
        closeBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            // 1. 点击掩卷：曾皙诗行与掩卷键平缓淡出消散
            poemFlow.style.opacity = 0;
            closeBtn.style.opacity = 0;
            await wait(1800);
            
            // 清空主舞台，画面进入完全干净的纯白留白静置状态
            stageBox.style.display = 'none';
            await wait(1200);

            // 2. 🌟 破白而生：终极祝福语缓缓在宣纸中央洇显
            blessingToast.style.display = 'block';
            await wait(50);
            blessingToast.style.opacity = 0.85;
            
            // 3. 驻留 5 秒：给看画人留出极其震撼、饱满的时间去品味这段临别寄语
            await wait(5000);
            
            // 4. 祝福语悄然消散，整卷大作融于初春微曦的阳光中
            blessingToast.style.opacity = 0;
            await wait(2500);

            wrapper.style.transition = 'opacity 3s ease-in-out';
            wrapper.style.opacity = 0;
            
            await wait(3200);
            container.innerHTML = '';
            container.classList.remove('active');
            
            console.log("🌸 《八风册》全卷目次顺利掩卷。愿岁并谢，与长友兮。");
            resolveAllChaptersBook(); // 释放全部流程
        });
    });
}
