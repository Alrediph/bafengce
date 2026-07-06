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

    // 🌟 全面采用全新的 -v9-true-vertical 类名，彻底掐死任何假竖排的玄学错误！
    container.innerHTML = `
        <style>
            .rf-wrapper-v9-true-vertical {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative; 
                background: radial-gradient(circle, rgba(255, 242, 228, 0.4) 0%, rgba(255, 255, 255, 1) 70%);
                user-select: none; overflow: hidden;
            }
            
            /* 🌟【第一幕大字物理锁死】限制宽度，利用换行机制让“融”在顶、“风”在底，形成绝对地道的单列竖排！ */
            #rf-title-v9-true { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 3.8rem; 
                line-height: 1.6; /* 纵向字距 */
                letter-spacing: 0px; /* 抹除可能引发横向平移的参数 */
                width: 4.5rem !important; /* 🌟 核心死锁：强行缩窄宽度，逼迫两个字只能纵向往下叠！ */
                opacity: 0; transition: opacity 2s ease; cursor: pointer; 
                text-align: center !important;
                color: #1a1a1a; z-index: 10;
                writing-mode: vertical-rl !important;
                display: block !important;
            }
            
            /* 🌟【第二幕启幕词物理锁死】同样限制高度与行气，确保多列从右向左垂落展布 */
            #rf-intro-v9-true { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 1.2rem; line-height: 2.8; letter-spacing: 0.15em; 
                height: 48vh !important; /* 限制高度形成完美的古籍行气长度 */
                opacity: 0; transition: opacity 2s ease; cursor: pointer;
                writing-mode: vertical-rl !important; 
                white-space: nowrap !important;
                color: #2b2b2b; z-index: 10;
                display: block !important;
            }
            
            /* 三幕：曾皙主舞台布局（对标清明雨歇图，完美状态） */
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

            /* 四幕：最终祝福（绝对对标清明雨歇图，完美横排单行绝对居中） */
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

        <div class="rf-wrapper-v9-true-vertical" id="rf-wrapper">
            <!-- 🌟 一幕大字：强行物理阻断，锁死为真正的单列直落竖排 -->
            <div id="rf-title-v9-true" class="font-kangxi">融<br>風</div>

            <!-- 🌟 二幕启幕词：正统古籍多列竖排 -->
            <div id="rf-intro-v9-true" class="font-kangxi" style="display: none;">
                融风，东北风也。融，和也。阳气始动，万物始融。<br><br>
                属艮，八音为泡。<br><br>
                立春之风。
            </div>

            <!-- 三幕：曾皙主舞台 -->
            <div class="rf-stage-layout-v7" id="rf-stage-box">
                <div class="rf-scroll-flow-v7 font-kangxi" id="rf-poem-flow">
                    <div class="rf-text-line-v7 font-kangxi">「浴乎沂，風乎舞雩，詠而歸。」</div>
                    <div class="rf-text-author-v7 font-kangxi">——《論語》</div>
                </div>
                <div class="rf-close-btn-v7 font-kangxi" id="rf-btn-close">【 全冊掩卷 · 終 】</div>
            </div>

            <!-- 四幕：屈原寄语终极绝对居中祝福 -->
            <div class="rf-blessing-vertical-v7 font-kangxi" id="rf-blessing-toast">願歲並謝，與長友兮。</div>
        </div>
    `;

    const wrapper = document.getElementById('rf-wrapper');
    const titleScreen = document.getElementById('rf-title-v9-true');
    const intro = document.getElementById('rf-intro-v9-true');
    const stageBox = document.getElementById('rf-stage-box');
    const poemFlow = document.getElementById('rf-poem-flow');
    const closeBtn = document.getElementById('rf-btn-close');
    const blessingToast = document.getElementById('rf-blessing-toast');

    // ====== 第一幕：真正的直落大竖排 ======
    await wait(200);
    titleScreen.style.opacity = 1;
    await nextClick(wrapper);
    titleScreen.style.opacity = 0;
    await wait(2000);
    titleScreen.style.display = 'none';
    titleScreen.remove(); 

    // ====== 第二幕：立春解意（标准古籍竖排） ======
    intro.style.display = 'block';
    await wait(50);
    intro.style.opacity = 1;
    await nextClick(wrapper);
    intro.style.opacity = 0;
    await wait(2000);
    intro.style.display = 'none';
    intro.remove(); 

    // ====== 第三幕：曾皙言志大轴舞台 ======
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

            // 屈原寄语
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
