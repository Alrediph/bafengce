// js/chapters/qingming.js
const wait = ms => new Promise(r => setTimeout(r, ms));

const nextClick = (element) => new Promise(resolve => {
    element.addEventListener('click', resolve, { once: true });
});

// 辅助函数：将字符用带有动态模糊过渡的span包裹，实现更细腻的墨迹渐显
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

function revealPoemText(element, speed = 45) {
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
                transition: opacity 1.5s ease; position: relative;
            }
            
            /* 【核心修复：双层固定物理轨道】彻底废除不稳定的嵌套Flex，使用绝对高度错开上下排 */
            .tiba-row-top {
                position: absolute;
                right: 52vw; /* 从中线偏左开始往左平铺 */
                top: 10vh;
                height: 36vh;
                display: flex;
                flex-direction: column; /* 在竖排文字下，column代表真正的横向并排 */
                justify-content: flex-start;
                align-items: flex-start;
                writing-mode: vertical-rl;
                gap: 55px; /* 每首诗之间不可撼动的黄金留白 */
                transition: opacity 2s ease;
            }
            
            .tiba-row-bottom {
                position: absolute;
                right: 52vw; /* 与第一排对齐线完全咬死，绝错位 */
                top: 52vh; /* 精准定位在下半部分，坚决防止出界 */
                height: 36vh;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                writing-mode: vertical-rl;
                gap: 55px;
                transition: opacity 2s ease;
            }
            
            .poem-column {
                font-size: 1.05rem; 
                color: #333333;
                height: 100%;
                white-space: nowrap;
                flex-shrink: 0;
            }
            
            .poem-title { 
                font-weight: bold; 
                color: #000000; 
                margin-left: 15px; 
                font-size: 1.15rem; 
            }

            /* 右侧白描写意艺术区：初始隐藏 */
            .ink-art-zone {
                position: absolute; right: 5%; bottom: 5%; width: 45vw; height: 80vh;
                pointer-events: none;
                opacity: 0;
                transition: opacity 2s ease;
            }
            .banana-svg { width: 100%; height: 100%; }
            
            /* 纤细动态斜雨线 */
            @keyframes rain-fall {
                0% { stroke-dashoffset: 0; }
                100% { stroke-dashoffset: -100; }
            }
            .rain-line {
                stroke: #e8e8e8; stroke-width: 1;
                stroke-dasharray: 4 20;
                animation: rain-fall 2s linear infinite;
            }
            
            /* 芭蕉叶摇曳 */
            @keyframes leaf-breathe {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(0.5deg); }
            }
            .sway-leaf { transform-origin: 90% 90%; animation: leaf-breathe 8s ease-in-out infinite; }

            /* 意境触发点：初始完全隐藏且不可点击 */
            .trigger-dot {
                position: absolute; width: 40px; height: 40px;
                background: radial-gradient(circle, rgba(160,175,165,0.18) 0%, rgba(255,255,255,0) 70%);
                border-radius: 50%; cursor: pointer; 
                display: flex; justify-content: center; align-items: center;
                opacity: 0;
                pointer-events: none;
                transition: transform 0.4s ease, background 0.4s ease, opacity 2s ease;
            }
            .trigger-dot::after {
                content: ''; width: 3px; height: 3px; background-color: #b0c2b0; border-radius: 50%;
            }
            .trigger-dot:hover { transform: scale(1.4); background: radial-gradient(circle, rgba(160,175,165,0.35) 0%, rgba(255,255,255,0) 70%); }
            .trigger-dot.clicked { pointer-events: none; opacity: 0 !important; }

            /* 【高饱和度真水波特效】显著加深浓黑对比度，模拟浓墨击中纸面荡开涟漪 */
            #ink-splash {
                position: absolute; width: 50px; height: 50px;
                top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0);
                border-radius: 50%; pointer-events: none; opacity: 0;
                box-sizing: border-box;
            }
            @keyframes water-ripple-effect {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 1; background: rgba(0, 0, 0, 0.95); border: 0px solid transparent; }
                15% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; background: rgba(0, 0, 0, 0.85); }
                35% { transform: translate(-50%, -50%) scale(4); opacity: 0.7; background: transparent; border: 6px solid rgba(0, 0, 0, 0.7); }
                100% { transform: translate(-50%, -50%) scale(28); opacity: 0; border: 1px solid rgba(0, 0, 0, 0); filter: blur(10px); }
            }
            .ink-blooming { animation: water-ripple-effect 2.5s cubic-bezier(0.1, 0.6, 0.2, 1) forwards; }
            
            /* 【核心修复：结尾词居中放大】 */
            #qm-next-prompt {
                position: absolute; 
                top: 50%; left: 50%; 
                transform: translate(-50%, -50%); /* 完美的正中央绝对死锁 */
                font-size: 1.8rem; /* 字体显著放大，极具视觉张力 */
                letter-spacing: 0.5em; 
                color: #4a4a4a;
                opacity: 0; 
                transition: opacity 2s ease; 
                cursor: pointer; 
                display: none;
                white-space: nowrap;
                text-align: center;
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

                <div id="tiba-row-top" class="tiba-row-top"></div>    
                <div id="tiba-row-bottom" class="tiba-row-bottom"></div> 

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
    const artZone = document.querySelector('.ink-art-zone');
    const nextPrompt = document.getElementById('qm-next-prompt');

    container.classList.add('active');
    await wait(400);

    // ====== 第一幕：“清明”居中大字 ======
    titleScreen.style.opacity = 1;
    await nextClick(wrapper);
    titleScreen.style.opacity = 0;
    await wait(2000);
    titleScreen.style.display = 'none';

    // ====== 第二幕：启幕词 ======
    intro.style.display = 'block';
    await wait(50);
    intro.style.opacity = 1;
    await nextClick(wrapper);
    intro.style.opacity = 0;
    await wait(2000);
    intro.style.display = 'none';

    // ====== 第三幕：进入全景长卷舞台 ======
    contentStage.style.display = 'block';
    await wait(50);
    contentStage.style.opacity = 1;

    // 🌟【时序重构】第一步：轰轰烈烈地炸开一记浓黑水墨水纹圈
    inkSplash.classList.add('ink-blooming');
    
    // 🌟【时序重构】第二步：死锁 2.5 秒，强制等待水波完全激荡完毕并消散归零！
    await wait(2500);
    inkSplash.style.display = 'none'; // 彻底销毁水波图层，实现“水滴先出现并消失”

    // 🌟【时序重构】第三步：水滴彻底消散后，芭蕉叶和斜织雨线才开始优雅、干净地淡入
    artZone.style.opacity = '0.85';
    await wait(1200); 

    // 🌟【时序重构】第四步：画面平稳后，五个悬浮触发热区才正式亮起迎客
    const dotsList = ['dot-a', 'dot-b', 'dot-c', 'dot-d', 'dot-e'];
    dotsList.forEach(dotId => {
        const d = document.getElementById(dotId);
        d.style.opacity = '1';
        d.style.pointerEvents = 'auto';
    });

    // 绝对的线性时序计数器
    let currentRevealedIndex = 0;

    dotsList.forEach(dotId => {
        const dot = document.getElementById(dotId);
        dot.addEventListener('click', async (e) => {
            e.stopPropagation();
            dot.classList.add('clicked'); 
            
            const item = shortChapters[currentRevealedIndex];
            
            // 创建单列小诗
            const poemColumn = document.createElement('div');
            poemColumn.className = 'poem-column';
            poemColumn.innerHTML = `
                <div class="poem-title font-kangxi">${item.title}</div>
                <div style="line-height: 2.3; letter-spacing: 0.15em;">${convertToSpans(item.content)}</div>
            `;
            
            // 🌟【物理层级双轨控制】
            if (currentRevealedIndex < 3) {
                // 其一、其二、其三 稳稳流向第一排轨道（高位）
                document.getElementById('tiba-row-top').appendChild(poemColumn);
            } else {
                // 其四、其五 稳稳流向第二排轨道（低位），绝不发生横向溢出
                document.getElementById('tiba-row-bottom').appendChild(poemColumn);
            }

            currentRevealedIndex++;

            // 驱动水墨笔迹渐现
            await revealPoemText(poemColumn, 45);
            
            // 当五章集齐，执行空灵谢幕
            if (currentRevealedIndex === 5) {
                await wait(5000); 
                
                // 诗行与芭蕉齐消散，给最末一句话留出最干净的宣纸白地
                document.getElementById('tiba-row-top').style.opacity = 0;
                document.getElementById('tiba-row-bottom').style.opacity = 0;
                artZone.style.opacity = 0;
                await wait(2000);
                
                document.getElementById('tiba-row-top').innerHTML = '';
                document.getElementById('tiba-row-bottom').innerHTML = '';

                // 唤醒正中央放大的“清明雨歇”
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
