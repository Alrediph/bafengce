// js/chapters/qingming.js
const wait = ms => new Promise(r => setTimeout(r, ms));

const nextClick = (element) => new Promise(resolve => {
    element.addEventListener('click', resolve, { once: true });
});

// 辅助函数：将纯文本里的每个字符用带过渡的span包裹，实现更高级的墨迹渐显
function convertToSpans(htmlString) {
    let result = '';
    let inTag = false;
    for (let i = 0; i < htmlString.length; i++) {
        const char = htmlString[i];
        if (char === '<') { inTag = true; result += char; }
        else if (char === '>') { inTag = false; result += char; }
        else {
            if (inTag) { result += char; }
            else { result += `<span class="char-ink" style="opacity:0; filter:blur(1px); transition: opacity 0.5s ease, filter 0.6s ease;">${char}</span>`; }
        }
    }
    return result;
}

function revealPoemText(element, speed = 50) {
    const chars = element.querySelectorAll('.char-ink');
    let delay = 0;
    chars.forEach((char) => {
        setTimeout(() => {
            char.style.opacity = '1';
            char.style.filter = 'blur(0px)';
        }, delay);
        delay += speed;
    });
    return new Promise(resolve => setTimeout(resolve, delay));
}

export default async function playQingming(container) {
    const shortChapters = [
        { title: '其一 · 声', content: '雨打芭蕉。<br>其声清越，其节不促。<br>一叶承一响，万叶各得其所。' },
        { title: '其二 · 色', content: '雨过南窗。<br>蕉叶如拭，其绿欲流。<br>万物濯洗，天地一新。' },
        { title: '其三 · 境', content: '有人读书于檐下。<br>雨声不与书声争。<br>两相清朗，各自安宁。' },
        { title: '其四 · 远', content: '东南风来。<br>雨线斜织，蕉影微摇。<br>此风此雨，不远千里，亦在此处。' },
        { title: '其五 · 余', content: '雨歇。<br>风未止。<br>叶上余响，如琴初罢。' }
    ];

    container.innerHTML = `
        <style>
            .qingming-wrapper {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative; background-color: #ffffff;
            }
            #qm-title-screen { font-size: 3.8rem; letter-spacing: 0.6em; opacity: 0; transition: opacity 2s ease; cursor: pointer; }
            #qm-intro { font-size: 1.2rem; line-height: 3; opacity: 0; transition: opacity 2s ease; position: absolute; cursor: pointer; }
            
            #qm-content-stage {
                width: 100%; height: 100%; display: none; opacity: 0;
                transition: opacity 2.5s ease; position: relative;
            }
            
            /* 【核心修复】高雅的题跋画卷区：严格控制高度，不允许任何换行堆叠，让文字自然向左平铺 */
            .tiba-zone {
                position: absolute; 
                right: 55vw; /* 从屏幕中偏右侧开始往左延伸 */
                top: 15vh; 
                height: 70vh;
                display: flex; 
                flex-direction: row; /* 顺应竖排文字左移的自然流向 */
                align-items: flex-start;
                justify-content: flex-start;
                writing-mode: vertical-rl; 
                gap: 50px; /* 锁死每首小诗之间的黄金留白间距 */
            }
            
            .poem-column {
                font-size: 1.1rem; 
                color: #333333;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                flex-shrink: 0; /* 坚决不允许列宽度被无情挤压 */
            }
            
            .poem-title { 
                font-weight: bold; 
                color: #000000; 
                margin-bottom: 20px; 
                font-size: 1.2rem; 
            }

            /* 右侧高级极简写意艺术区 */
            .ink-art-zone {
                position: absolute; right: 5%; bottom: 5%; width: 45vw; height: 80vh;
                pointer-events: none;
            }
            .banana-svg { width: 100%; height: 100%; }
            
            /* 极纤细高质感的动态斜雨线 */
            @keyframes rain-fall {
                0% { stroke-dashoffset: 0; }
                100% { stroke-dashoffset: -100; }
            }
            .rain-line {
                stroke: #e8e8e8; stroke-width: 1;
                stroke-dasharray: 4 20;
                animation: rain-fall 2s linear infinite;
            }
            
            /* 优雅微弱的芭蕉叶呼吸摇曳 */
            @keyframes leaf-breathe {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(0.5deg); }
            }
            .sway-leaf { transform-origin: 90% 90%; animation: leaf-breathe 8s ease-in-out infinite; }

            /* 隐匿在空气中的半透明意境触发点 */
            .trigger-dot {
                position: absolute; width: 40px; height: 40px;
                background: radial-gradient(circle, rgba(160,175,165,0.18) 0%, rgba(255,255,255,0) 70%);
                border-radius: 50%; cursor: pointer; pointer-events: auto;
                transition: transform 0.4s ease, background 0.4s ease, opacity 0.8s ease;
                display: flex; justify-content: center; align-items: center;
            }
            .trigger-dot::after {
                content: ''; width: 3px; height: 3px; background-color: #b0c2b0; border-radius: 50%;
            }
            .trigger-dot:hover { transform: scale(1.4); background: radial-gradient(circle, rgba(160,175,165,0.35) 0%, rgba(255,255,255,0) 70%); }
            .trigger-dot.clicked { pointer-events: none; opacity: 0 !important; }

            /* 【核心修复】真实可见的真水墨落纸洇散特效 */
            #ink-splash {
                position: absolute; width: 300px; height: 300px;
                top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: radial-gradient(circle, rgba(40,40,40,0.06) 0%, rgba(40,40,40,0.02) 40%, rgba(255,255,255,0) 70%);
                border-radius: 50%; pointer-events: none; opacity: 0;
            }
            @keyframes ink-bloom {
                0% { transform: translate(-50%, -50%) scale(0.2); opacity: 0; filter: blur(4px); }
                20% { opacity: 1; filter: blur(2px); }
                100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; filter: blur(12px); }
            }
            .ink-blooming { animation: ink-bloom 4s cubic-bezier(0.1, 0.6, 0.2, 1) forwards; }
            
            #qm-next-prompt {
                position: absolute; bottom: 8%; left: 50%; transform: translateX(-50%);
                font-size: 1.1rem; letter-spacing: 0.3em; color: #a0a0a0;
                opacity: 0; transition: opacity 2s ease; cursor: pointer; display: none;
            }
        </style>

        <div class="qingming-wrapper" id="qm-wrapper">
            <div id="qm-title-screen" class="vertical-text font-kangxi">清明</div>

            <div id="qm-intro" class="vertical-text font-kangxi" style="display: none;">
                清明风，东南风也。清，明也。风以洁，清明而朗也。<br>
                属巽，八音为木。<br>
                立夏之风。
            </div>

            <div id="qm-content-stage">
                <div id="ink-splash"></div>

                <div class="tiba-zone" id="qm-tiba-box"></div>

                <div class="ink-art-zone">
                    <svg class="banana-svg" viewBox="0 0 500 700">
                        <line x1="100" y1="-100" x2="-200" y2="500" class="rain-line" style="animation-delay: 0s;" />
                        <line x1="300" y1="-100" x2="0" y2="500" class="rain-line" style="animation-delay: 0.4s;" />
                        <line x1="500" y1="-100" x2="200" y2="500" class="rain-line" style="animation-delay: 0.8s;" />
                        <line x1="200" y1="200" x2="-100" y2="800" class="rain-line" style="animation-delay: 0.2s;" />
                        <line x1="450" y1="150" x2="150" y2="750" class="rain-line" style="animation-delay: 0.6s;" />
                        
                        <g class="sway-leaf">
                            <path d="M 450,650 C 350,500 200,320 50,300 C 180,450 350,600 450,650 Z" fill="#fcfdfc" stroke="#d0ded0" stroke-width="1" />
                            <path d="M 450,650 C 350,500 200,320 50,300" fill="none" stroke="#e0eae0" stroke-width="1" stroke-dasharray="2 2" />
                            <path d="M 450,650 C 400,420 320,180 180,100 C 260,300 380,520 450,650 Z" fill="#fafdfa" stroke="#c2d4c2" stroke-width="1" />
                            <path d="M 450,650 C 400,420 320,180 180,100" fill="none" stroke="#d5ebd5" stroke-width="1" stroke-dasharray="2 2" />
                        </g>
                    </svg>
                </div>

                <div class="trigger-dot" id="dot-a" style="right: 38%; top: 32%;"></div>
                <div class="trigger-dot" id="dot-b" style="right: 18%; top: 22%;"></div>
                <div class="trigger-dot" id="dot-c" style="right: 42%; top: 55%;"></div>
                <div class="trigger-dot" id="dot-d" style="right: 26%; top: 62%;"></div>
                <div class="trigger-dot" id="dot-e" style="right: 12%; top: 48%;"></div>
            </div>

            <div id="qm-next-prompt" class="font-kangxi">清明雨歇。点击续行。</div>
        </div>
    `;

    const wrapper = document.getElementById('qm-wrapper');
    const titleScreen = document.getElementById('qm-title-screen');
    const intro = document.getElementById('qm-intro');
    const contentStage = document.getElementById('qm-content-stage');
    const inkSplash = document.getElementById('ink-splash');
    const tibaBox = document.getElementById('qm-tiba-box');
    const nextPrompt = document.getElementById('qm-next-prompt');

    container.classList.add('active');
    await wait(400);

    // ====== 第一幕：居中“清明”浮现 ======
    titleScreen.style.opacity = 1;
    await nextClick(wrapper);
    titleScreen.style.opacity = 0;
    await wait(2000);
    titleScreen.style.display = 'none';

    // ====== 第二幕：启幕词徐徐升起 ======
    intro.style.display = 'block';
    await wait(50);
    intro.style.opacity = 1;
    await nextClick(wrapper);
    intro.style.opacity = 0;
    await wait(2000);
    intro.style.display = 'none';

    // ====== 第三幕：进入全景交互长卷 ======
    contentStage.style.display = 'block';
    await wait(50);
    contentStage.style.opacity = 1;

    // 🌟 强效促发：真实水墨大滴落下，在白宣纸中央优雅洇散消失
    inkSplash.classList.add('暗引', 'ink-blooming');

    // 🌟【核心修复】维护一个绝对的线型计数器，锁定诗句一到五的绝对出场顺序
    let currentRevealedIndex = 0;

    const dots = ['dot-a', 'dot-b', 'dot-c', 'dot-d', 'dot-e'];
    dots.forEach(dotId => {
        const dot = document.getElementById(dotId);
        dot.addEventListener('click', async (e) => {
            e.stopPropagation();
            dot.classList.add('clicked'); // 隐去当前点击的点
            
            // 永远抓取当前时序应该出现的诗，绝不错乱！
            const item = shortChapters[currentRevealedIndex];
            currentRevealedIndex++;

            const poemColumn = document.createElement('div');
            poemColumn.className = 'poem-column';
            poemColumn.innerHTML = `
                <div class="poem-title font-kangxi">${item.title}</div>
                <div style="line-height: 2.3; letter-spacing: 0.15em;">${convertToSpans(item.content)}</div>
            `;
            
            // 挂载到题跋区
            tibaBox.appendChild(poemColumn);

            // 驱动毛笔字迹行云流水地洇出
            await revealPoemText(poemColumn, 45);
            
            // 当五则短章齐聚，执行空灵谢幕
            if (currentRevealedIndex === 5) {
                await wait(5000); // 留出充足的时间供他赏阅完整的白宣题跋
                tibaBox.style.opacity = 0;
                tibaBox.style.transition = 'opacity 2.5s ease';
                await wait(2500);
                tibaBox.innerHTML = '';

                nextPrompt.style.display = 'block';
                await wait(50);
                nextPrompt.style.opacity = 1;
            }
        });
    });

    await nextClick(wrapper);
    container.classList.remove('active');
    await wait(2500);
    container.innerHTML = '';
}
