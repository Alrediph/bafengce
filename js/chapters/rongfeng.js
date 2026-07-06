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
    // 🛡️【终极时序守卫】
    if (window.currentActiveChapter === undefined) {
        window.currentActiveChapter = 8;
    }
    while (window.currentActiveChapter < 8) {
        await wait(200);
    }

    container.classList.add('active');

    // 🌟 通过全局唯一专属的 v5 新类名，彻底粉碎任何浏览器顽固缓存！
    container.innerHTML = `
        <style>
            .rf-wrapper-v5-final {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative; 
                background: radial-gradient(circle, rgba(255, 242, 228, 0.4) 0%, rgba(255, 255, 255, 1) 70%);
                user-select: none; overflow: hidden;
            }
            
            #rf-title-v5 { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 3.8rem; letter-spacing: 0.6em; text-indent: 0.6em;
                opacity: 0; transition: opacity 2s ease; cursor: pointer; white-space: nowrap; text-align: center;
                color: #1a1a1a; z-index: 10;
                writing-mode: vertical-rl !important;
            }
            
            #rf-intro-v5 { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 1.2rem; line-height: 2.8; letter-spacing: 0.15em; 
                opacity: 0; transition: opacity 2s ease; cursor: pointer;
                writing-mode: vertical-rl !important; white-space: nowrap;
                color: #2b2b2b; z-index: 10;
            }
            
            .rf-stage-layout-v5 {
                display: flex !important; flex-direction: column !important;
                align-items: center !important; justify-content: center !important;
                width: 100%; height: 100%; position: relative; z-index: 5;
                opacity: 0; transition: opacity 2.5s cubic-bezier(0.25, 1, 0.5, 1);
            }
            
            /* 正统古籍竖排长廊容器 */
            .rf-scroll-flow-v5 {
                height: 62vh !important; 
                width: auto;
                writing-mode: vertical-rl !important;
                display: block !important;
                margin-bottom: 20px;
                transition: opacity 1.8s ease-in-out; 
            }
            
            /* 曾皙正文：巨幕级挺拔中流砥柱 */
            .rf-text-line-v5 {
                display: block !important;
                font-size: 2.5rem !important; 
                font-weight: bold; color: #111111;
                letter-spacing: 0.25em; line-height: 1.5;
                white-space: nowrap !important; 
                font-family: inherit !important;
                filter: drop-shadow(0.5px 0.5px 0px rgba(0,0,0,0.04));
                /* 🌟【大修正】注入强力的左侧外衬，强行与左列落款扯开宽广的呼吸行气间距，绝不挤压！ */
                margin-left: 55px !important; 
            }
            
            /* 落款出处：在左列自成一线，优雅沉底 */
            .rf-text-author-v5 {
                display: block !important;
                font-size: 1.05rem; color: #555555;
                text-align: end !important; 
                font-family: inherit !important;
                white-space: nowrap !important;
                height: calc(100% - 10px); 
                letter-spacing: 0.15em;
            }
            
            .rf-close-btn-v5 {
                writing-mode: horizontal-tb !important; white-space: nowrap !important;
                font-size: 1.05rem; letter-spacing: 0.2em; color: #7f7f7f; 
                font-weight: bold; cursor: pointer;
                transition: opacity 1.2s ease, color 0.3s ease;
                opacity: 0; display: none;
                font-family: inherit !important;
                margin-top: 15px;
            }
            .rf-close-btn-v5:hover { color: #962929; }

            /* 🌟【终极祝福：完美参照单叶笺纸法度】纯正独立单列竖排大楷，顶天立地绝不折行 */
            .rf-blessing-vertical-v5 {
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                writing-mode: vertical-rl !important; white-space: nowrap !important;
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

        <div class="rf-wrapper-v5-final" id="rf-wrapper">
            <!-- 一幕大字 -->
            <div id="rf-title-v5" class="vertical-text font-kangxi">融风</div>

            <!-- 二幕启幕词 -->
            <div id="rf-intro-v5" class="vertical-text font-kangxi" style="display: none;">
                融风，东北风也。融，和也。阳气始动，万物始融。<br>
                属艮，八音为泡。<br>
                立春之风。
            </div>

            <!-- 三幕：主舞台 -->
            <div class="rf-stage-layout-v5" id="rf-stage-box">
                <div class="rf-scroll-flow-v5 font-kangxi" id="rf-poem-flow">
                    <div class="rf-text-line-v5 font-kangxi">「浴乎沂，風乎舞雩，詠而歸。」</div>
                    <div class="rf-text-author-v5 font-kangxi">——《論語》</div>
                </div>
                <div class="rf-close-btn-v5 font-kangxi" id="rf-btn-close">【 全冊掩卷 · 終 】</div>
            </div>

            <!-- 🌟 四幕：直接呈现终极单列手书祝福（删除了所有中间过渡句） -->
            <div class="rf-blessing-vertical-v5 font-kangxi" id="rf-blessing-toast">願歲並謝，與長友兮。</div>
        </div>
    `;

    const wrapper = document.getElementById('rf-wrapper');
    const titleScreen = document.getElementById('rf-title-v5');
    const intro = document.getElementById('rf-intro-v5');
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
            
            // 1. 点击按钮后，前半部分舞台如细雨般轻缓淡出
            poemFlow.style.opacity = 0;
            closeBtn.style.opacity = 0;
            await wait(1800);
            stageBox.style.display = 'none';
            
            // 2. 纯白画布静置留白，酝酿情绪
            await wait(1200);

            // 3. 🌟【大高潮】没有任何多余的打扰，朱砂红的文人祝福语直接挺拔洇显！
            blessingToast.style.display = 'block';
            await wait(50);
            blessingToast.style.opacity = 0.85;
            
            // 驻留 6 秒，供看画人静静凝视回味
            await wait(6000);
            
            // 4. 祝福语悄然消散，融于立春暖阳
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
