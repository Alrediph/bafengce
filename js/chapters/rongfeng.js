// js/chapters/rongfeng.js
const wait = ms => new Promise(r => setTimeout(r, ms));

const nextClick = (element) => new Promise(resolve => {
    element.addEventListener('click', resolve, { once: true });
});

// 🌟 Web Audio API 高精度数字声音合成器（古乐八音之 · 匏笙和弦）[cite: 2]
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
    // 🛡️【时序放行守卫】[cite: 2]
    if (window.currentActiveChapter === undefined) {
        window.currentActiveChapter = 8;
    }
    while (window.currentActiveChapter < 8) {
        await wait(200);
    }

    container.classList.add('active');

    // 🌟 全新 v10 样式命名空间，彻底清扫缓存！
    container.innerHTML = `
        <style>
            .rf-wrapper-v10-final {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative; 
                background: radial-gradient(circle, rgba(255, 242, 228, 0.4) 0%, rgba(255, 255, 255, 1) 70%);
                user-select: none; overflow: hidden;
            }
            
            /* ========================================================= */
            /* 🌟 1. 启幕：完全对标 qingming.js，依赖全局 vertical-text 竖排 */
            /* ========================================================= */
            #rf-title-screen { 
                font-size: 3.8rem; letter-spacing: 0.6em; opacity: 0; 
                transition: opacity 2s ease; cursor: pointer; 
                /* 与清明完全一致的简约属性，不加多余的定位与换行污染 */
            }
            
            #rf-intro { 
                font-size: 1.2rem; line-height: 3; opacity: 0; 
                transition: opacity 2s ease; position: absolute; cursor: pointer; 
                /* 与清明完全一致的行高与定位控制，配合 vertical-text 实现原生竖排 */
            }
            
            /* ========================================================= */
            /* 🌟 2. 正文与谢幕：完全死锁纯正横排（Horizontal-tb）绝对居中 */
            /* ========================================================= */
            .rf-stage-horizontal-v10 {
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                display: flex !important; flex-direction: column !important;
                align-items: center !important; justify-content: center !important;
                width: auto; height: auto; z-index: 5;
                opacity: 0; transition: opacity 2.5s cubic-bezier(0.25, 1, 0.5, 1);
                writing-mode: horizontal-tb !important; /* 死锁横排 */
                text-align: center !important;
            }
            
            .rf-scroll-flow-horizontal {
                display: block !important;
                writing-mode: horizontal-tb !important; /* 死锁横排 */
                text-align: center !important;
                margin-bottom: 25px;
                transition: opacity 1.8s ease-in-out;
            }
            
            .rf-text-line-horizontal {
                display: block !important;
                font-size: 1.6rem !important; /* 横排优雅字号 */
                font-weight: normal; color: #111111;
                letter-spacing: 0.18em; line-height: 1.8;
                white-space: nowrap !important; 
                font-family: inherit !important;
            }
            
            .rf-text-author-horizontal {
                display: block !important;
                font-size: 0.95rem; color: #555555;
                text-align: right !important; /* 靠右对齐 */
                margin-top: 12px;
                padding-right: 15px;
                letter-spacing: 0.12em;
                font-family: inherit !important;
            }
            
            .rf-close-btn-horizontal {
                writing-mode: horizontal-tb !important; /* 死锁横排 */
                white-space: nowrap !important;
                font-size: 1.05rem; letter-spacing: 0.2em; color: #7f7f7f; 
                font-weight: bold; cursor: pointer;
                transition: opacity 1.2s ease, color 0.3s ease;
                opacity: 0; display: none;
                font-family: inherit !important;
            }
            .rf-close-btn-horizontal:hover { color: #962929; }

            /* ========================================================= */
            /* 🌟 3. 终极祝福：完美对标清明雨歇图，横排单列绝对双轴居中 */
            /* ========================================================= */
            .rf-blessing-horizontal-v10 {
                position: absolute; 
                top: 50%; left: 50%; 
                transform: translate(-50%, -50%) !important; 
                writing-mode: horizontal-tb !important; /* 核心：死锁横排 */
                white-space: nowrap !important; 
                font-size: 1.45rem !important; /* 核心：清秀留白字号 */
                font-weight: normal;
                color: #962929; 
                opacity: 0; display: none;
                letter-spacing: 0.25em; line-height: 1.8;
                z-index: 12; 
                font-family: inherit !important;
                text-align: center !important;
                transition: opacity 2.8s cubic-bezier(0.33, 1, 0.68, 1);
            }
        </style>

        <div class="rf-wrapper-v10-final" id="rf-wrapper">
            <!-- 🌟 第一幕：完全挂载清明 .vertical-text 原生古典竖排大字 -->
            <div id="rf-title-screen" class="vertical-text font-kangxi">融风</div>

            <!-- 🌟 第二幕：完全挂载清明 .vertical-text 原生古籍解意竖排 -->
            <div id="rf-intro" class="vertical-text font-kangxi" style="display: none;">
                融风，东北风也。融，和也。阳气始动，万物始融。<br>
                属艮，八音为匏。<br>
                立春之风。
            </div>

            <!-- 🌟 第三幕：曾皙主舞台，全盘退回横排居中模式 -->
            <div class="rf-stage-horizontal-v10" id="rf-stage-box">
                <div class="rf-scroll-flow-horizontal font-kangxi" id="rf-poem-flow">
                    <div class="rf-text-line-horizontal font-kangxi">「浴乎沂，風乎舞雩，詠而歸。」</div>
                    <div class="rf-text-author-horizontal font-kangxi">——《論語》</div>
                </div>
                <div class="rf-close-btn-horizontal font-kangxi" id="rf-btn-close">【 全冊掩卷 · 終 】</div>
            </div>

            <!-- 🌟 四幕：清明雨歇式的清秀横排居中终极祝福 -->
            <div class="rf-blessing-horizontal-v10 font-kangxi" id="rf-blessing-toast">願歲並謝，與長友兮。</div>
        </div>
    `;

    const wrapper = document.getElementById('rf-wrapper');
    const titleScreen = document.getElementById('rf-title-screen');
    const intro = document.getElementById('rf-intro');
    const stageBox = document.getElementById('rf-stage-box');
    const poemFlow = document.getElementById('rf-poem-flow');
    const closeBtn = document.getElementById('rf-btn-close');
    const blessingToast = document.getElementById('rf-blessing-toast');

    // ====== 第一幕：立春大字（原生竖排） ======
    await wait(200);
    titleScreen.style.opacity = 1;
    await nextClick(wrapper);
    titleScreen.style.opacity = 0;
    await wait(2000);
    titleScreen.style.display = 'none';

    // ====== 第二幕：立春解意（原生竖排） ======
    intro.style.display = 'block';
    await wait(50);
    intro.style.opacity = 1;
    await nextClick(wrapper);
    intro.style.opacity = 0;
    await wait(2000);
    intro.style.display = 'none';

    // ====== 第三幕：曾皙言志大轴（横排绝对居中） ======
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
            
            // 舞台散去
            poemFlow.style.opacity = 0;
            closeBtn.style.opacity = 0;
            await wait(1800);
            stageBox.style.display = 'none';
            
            // 纯白雪原极简留白静置
            await wait(1200);

            // ====== 🌟 第四幕：屈原寄语终极横排浮现 ======
            blessingToast.style.display = 'block';
            await wait(50);
            blessingToast.style.opacity = 0.85;
            
            // 驻留 6 秒
            await wait(6000);
            
            // 彻底落幕归隐
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
