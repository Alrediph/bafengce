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
                transition: opacity 1.8s ease-in-out; 
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

            /* 🌟【终极祝福第一句：现代优雅横排导引小字】 */
            .rf-blessing-line1-horizontal {
                position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%);
                writing-mode: horizontal-tb !important; white-space: nowrap !important;
                font-size: 1.05rem; color: #7f7f7f; letter-spacing: 0.3em;
                opacity: 0; display: none; z-index: 11;
                font-family: inherit !important;
                transition: opacity 2s ease-in-out;
            }

            /* 🌟【终极祝福第二句：传统巨卷竖排手书大楷】完美参照图三与宣纸笺纸排版，不换行顶天立地 */
            .rf-blessing-line2-vertical {
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                writing-mode: vertical-rl !important; white-space: nowrap !important;
                height: 58vh !important; /* 锁住高度阻断折行 */
                font-size: 2.6rem !important; font-weight: bold;
                color: #962929; opacity: 0; display: none;
                letter-spacing: 0.35em; line-height: 1.5;
                z-index: 12; font-family: inherit !important;
                text-align: start !important; /* 顶格由上至下垂落 */
                filter: drop-shadow(1px 1px 2px rgba(150, 41, 41, 0.12));
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

            <div class="rf-blessing-line1-horizontal font-kangxi" id="rf-blessing-h1">《八風冊》全卷掩卷</div>

            <div class="rf-blessing-line2-vertical font-kangxi" id="rf-blessing-v2">願歲並謝，與長友兮。</div>
        </div>
    `;

    const wrapper = document.getElementById('rf-wrapper');
    const titleScreen = document.getElementById('rf-title-screen');
    const intro = document.getElementById('rf-intro');
    const stageBox = document.getElementById('rf-stage-box');
    const poemFlow = document.getElementById('rf-poem-flow');
    const closeBtn = document.getElementById('rf-btn-close');
    
    const blessingH1 = document.getElementById('rf-blessing-h1');
    const blessingV2 = document.getElementById('rf-blessing-v2');

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

    // ====== 🌟 终章全卷控制链 ======
    return new Promise((resolveAllChaptersBook) => {
        closeBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            // 1. 点击掩卷：曾皙诗行与掩卷键平缓消散
            poemFlow.style.opacity = 0;
            closeBtn.style.opacity = 0;
            await wait(1800);
            stageBox.style.display = 'none';
            
            // 2. 🌟 留白间奏一：第一句优雅横排小字悄然浮现
            blessingH1.style.display = 'block';
            await wait(50);
            blessingH1.style.opacity = 0.55;
            await wait(3000); // 驻留三秒小读
            
            // 横排小字淡出，画面再次回归绝对空灵的纯白
            blessingH1.style.opacity = 0;
            await wait(1500);
            blessingH1.style.display = 'none';
            
            // 3. 🌟 留白间奏二：主祝福语依照图三法度，以磅礴的单列大楷竖排拔地而起！
            blessingV2.style.display = 'block';
            await wait(50);
            blessingV2.style.opacity = 0.85;
            
            // 驻留 5.5 秒，给看画人留下跨越四季与八风的终极寄语时间
            await wait(5500);
            
            // 4. 最终曲终归隐
            blessingV2.style.opacity = 0;
            await wait(2500);

            wrapper.style.transition = 'opacity 3s ease-in-out';
            wrapper.style.opacity = 0;
            
            await wait(3200);
            container.innerHTML = '';
            container.classList.remove('active');
            
            console.log("🌸 《八风册》全卷目次顺利掩卷。愿岁并谢，与长友兮。");
            resolveAllChaptersBook();
        });
    });
}
