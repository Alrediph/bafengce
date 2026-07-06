// js/chapters/rongfeng.js
const wait = ms => new Promise(r => setTimeout(r, ms));

const nextClick = (element) => new Promise(resolve => {
    element.addEventListener('click', resolve, { once: true });
});

// 🌟 Web Audio API 高精度数字声音合成器
// 仿真合成古老八音之“匏”音：模拟笙/簧管乐器温暖、和穆、多声部共鸣的立春和弦
function playPaoShengHarmony() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        // 合成三声部纯净和弦（根音 + 纯五度 + 叠音），模拟笙的丰满簧片感
        const frequencies = [293.66, 440.00, 587.33]; // D4, A4, D5 构成大和
        
        frequencies.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            // 采用 triangle 三角波，天生具备传统木质簧管乐器的温润、不尖锐特质
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            
            // 极其轻缓、从容的渐入（Attack），如同春风拂面
            gain.gain.setValueAtTime(0.001, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.06 - (index * 0.015), ctx.currentTime + 1.2);
            
            // 漫长、深远的余响衰减（Decay）
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 5.0);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 5.2);
        });
    } catch (e) {
        console.warn("匏音合成受暂拦截");
    }
}

export default async function playRongfeng(container) {
    // 锁定最后一开生命周期
    window.currentActiveChapter = 8;
    container.classList.add('active');

    container.innerHTML = `
        <style>
            .rongfeng-wrapper {
                width: 100%; height: 100%;
                display: center; justify-content: center; align-items: center;
                position: relative; 
                /* 🌟 纯白宣纸大底，注入立春清晨第一缕微曦的呼吸感渐变 */
                background: radial-gradient(circle, rgba(255, 242, 228, 0.4) 0%, rgba(255, 255, 255, 1) 70%);
                animation: rf-aurora-glow 8s ease-in-out infinite alternate;
                user-select: none; overflow: hidden;
                display: flex; justify-content: center; align-items: center;
            }
            
            @keyframes rf-aurora-glow {
                0% { background-size: 100% 100%; }
                100% { background-size: 130% 130%; }
            }
            
            #rf-title-screen { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 3.8rem; letter-spacing: 0.6em; text-indent: 0.6em;
                opacity: 0; transition: opacity 2s ease; cursor: pointer; white-space: nowrap; text-align: center;
                color: #1a1a1a; z-index: 10;
            }
            
            #rf-intro { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 1.2rem; line-height: 2.8; letter-spacing: 0.15em; 
                opacity: 0; transition: opacity 2s ease; cursor: pointer;
                writing-mode: vertical-rl; white-space: nowrap;
                color: #2b2b2b; z-index: 10;
            }
            
            /* 主垂直布局中心链 */
            .rf-master-layout-box {
                display: flex !important; flex-direction: column !important;
                align-items: center !important; justify-content: center !important;
                width: 100%; height: 100%; position: relative; z-index: 5;
                opacity: 0; transition: opacity 2.5s cubic-bezier(0.25, 1, 0.5, 1);
            }
            
            /* 🌟【原生双列块流排版】字迹清明，不枯不瘦，从容舒展 */
            .rf-poem-scroll-flow {
                width: fit-content; height: 360px;
                writing-mode: vertical-rl !important;
                display: block !important;
                margin-bottom: 45px;
            }
            
            /* 曾皙言志正文：春日枝条般展开 */
            .rf-text-line {
                display: block !important;
                font-size: 1.35rem; font-weight: bold; color: #111111;
                letter-spacing: 0.25em; line-height: 1.6;
                text-align: start !important;
                font-family: inherit !important;
                filter: drop-shadow(0.5px 0.5px 0px rgba(0,0,0,0.05));
            }
            
            /* 出处落款：平滑下沉于左下方 */
            .rf-text-author {
                display: block !important;
                font-size: 0.88rem; color: #555555;
                margin-right: 22px; /* 产生舒展的多列横向间距 */
                text-align: end !important; /* 核心沉底机制 */
                font-family: inherit !important;
                height: calc(100% - 15px);
                letter-spacing: 0.15em;
            }
            
            /* 终篇全册大掩卷离场键 */
            .rf-final-closure-btn {
                writing-mode: horizontal-tb !important; white-space: nowrap !important;
                font-size: 1.05rem; letter-spacing: 0.2em; color: #962929; /* 朱砂红暗示春暖 */
                font-weight: bold; cursor: pointer;
                transition: opacity 1.2s ease, transform 0.3s ease;
                opacity: 0; display: none;
                font-family: inherit !important;
            }
            .rf-final-closure-btn:hover { transform: scale(1.05); text-shadow: 0 0 10px rgba(150,41,41,0.15); }
        </style>

        <div class="rongfeng-wrapper" id="rf-wrapper">
            <div id="rf-title-screen" class="vertical-text font-kangxi">融风</div>

            <div id="rf-intro" class="vertical-text font-kangxi" style="display: none;">
                融风，东北风也。融，和也。阳气始动，万物始融。<br>
                属艮，八音为匏。<br>
                立春之风。
            </div>

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

    // ====== 第一幕：居中融风大字 ======
    await wait(200);
    titleScreen.style.opacity = 1;
    await nextClick(wrapper);
    titleScreen.style.opacity = 0;
    await wait(2000);
    titleScreen.style.display = 'none';

    // ====== 第二幕：立春启幕解意 ======
    intro.style.display = 'block';
    await wait(50);
    intro.style.opacity = 1;
    await nextClick(wrapper);
    intro.style.opacity = 0;
    await wait(2000);
    intro.style.display = 'none';

    // ====== 第三幕：曾皙言志，从容舒展 ======
    stageBox.style.display = 'flex';
    await wait(100);
    stageBox.style.opacity = 1; // 缓缓浮现，如春日枝条般展开

    // 🌟 在文字全然舒展稳定的刹那，悠扬鸣响古代八音之“匏”音（古笙和弦）
    await wait(1500);
    playPaoShengHarmony();

    // 停留数秒供看画人静心品读和感受微曦
    await wait(5000);

    // ====== 第四幕：托举出全书完结离场键 ======
    closeBtn.style.display = 'block';
    setTimeout(() => { closeBtn.style.opacity = 1; }, 50);

    // ====== 第五幕：全书终章合流离场 ======
    return new Promise((resolveAllChaptersBook) => {
        closeBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            // 整个大屏幕带着最后的春意暖阳，平缓、舒适地淡出，归于虚无
            wrapper.style.transition = 'opacity 3s ease-in-out';
            wrapper.style.opacity = 0;
            
            await wait(3200);
            container.innerHTML = '';
            container.classList.remove('active');
            
            console.log("🌸 《八风册》全卷目次顺利掩卷。天地承运，周而复始。");
            resolveAllChaptersBook(); // 全册功德圆满
        });
    });
}