// js/chapters/qingming.js
const wait = ms => new Promise(r => setTimeout(r, ms));

// 交互辅助：等待点击
const nextClick = (element) => new Promise(resolve => {
    element.addEventListener('click', resolve, { once: true });
});

// 辅助函数：将纯文本/HTML里的每个字符用带过渡的span包裹，实现丝滑的手写/洇散效果
function convertToSpans(htmlString) {
    let result = '';
    let inTag = false;
    for (let i = 0; i < htmlString.length; i++) {
        const char = htmlString[i];
        if (char === '<') { inTag = true; result += char; }
        else if (char === '>') { inTag = false; result += char; }
        else {
            if (inTag) { result += char; }
            else { result += `<span class="char-ink" style="opacity:0; filter:blur(2px); transition: opacity 0.6s ease, filter 0.8s ease;">${char}</span>`; }
        }
    }
    return result;
}

// 依次亮起字符，模拟毛笔一笔一划在宣纸上洇开的动态
function revealPoemText(element, speed = 70) {
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
    // 1. 定义五则短章内容
    const shortChapters = [
        {
            title: '其一 · 声',
            content: '雨打芭蕉。<br>其声清越，其节不促。<br>一叶承一响，万叶各得其所。'
        },
        {
            title: '其二 · 色',
            content: '雨过南窗。<br>蕉叶如拭，其绿欲流。<br>万物濯洗，天地一新。'
        },
        {
            title: '其三 · 境',
            content: '有人读书于檐下。<br>雨声不与书声争。<br>两相清朗，各自安宁。'
        },
        {
            title: '其四 · 远',
            content: '东南风来。<br>雨线斜织，蕉影微摇。<br>此风此雨，不远千里，亦在此处。'
        },
        {
            title: '其五 · 余',
            content: '雨歇。<br>风未止。<br>叶上余响，如琴初罢。'
        }
    ];

    // 2. 注入清明专属美学结构与纯CSS写意动态
    container.innerHTML = `
        <style>
            .qingming-wrapper {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative; background-color: #ffffff;
            }
            #qm-title-screen { font-size: 3.8rem; letter-spacing: 0.6em; opacity: 0; transition: opacity 2s ease; cursor: pointer; }
            #qm-intro { font-size: 1.2rem; line-height: 3; opacity: 0; transition: opacity 2s ease; position: absolute; cursor: pointer; }
            
            /* 主交互舞台 */
            #qm-content-stage {
                width: 100%; height: 100%; display: none; opacity: 0;
                transition: opacity 2.5s ease; position: relative;
            }
            
            /* 左侧题跋区：古籍经典由右向左纵向流布 */
            .tiba-zone {
                position: absolute; left: 8%; top: 12%; height: 75vh;
                display: flex; flex-direction: row-reverse; gap: 40px;
                writing-mode: vertical-rl; line-height: 2; letter-spacing: 0.15em;
            }
            .poem-column {
                font-size: 1.05rem; color: #3a3a3a;
                transition: opacity 2s ease;
            }
            .poem-title { font-weight: bold; color: #1a1a1a; margin-left: 10px; font-size: 1.15rem; }

            /* 右侧水墨写意艺术区 */
            .ink-art-zone {
                position: absolute; right: 0; bottom: 0; width: 55vw; height: 85vh;
                pointer-events: none; opacity: 0.85;
            }
            
            /* SVG 动态芭蕉与雨线 */
            .banana-svg { width: 100%; height: 100%; }
            @keyframes rain-drift {
                0% { transform: translate(0, -60px); }
                100% { transform: translate(-40px, 180px); }
            }
            .rain-line {
                stroke: #e6e6e6; stroke-width: 1.2;
                animation: rain-drift 1.4s linear infinite;
            }
            @keyframes leaf-sway {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(0.8deg); }
            }
            .sway-leaf { transform-origin: bottom right; animation: leaf-sway 6s ease-in-out infinite; }

            /* 隐藏在画面中的诗眼触发点 */
            .trigger-dot {
                position: absolute; width: 32px; height: 32px;
                background: radial-gradient(circle, rgba(142,160,145,0.15) 0%, rgba(255,255,255,0) 70%);
                border-radius: 50%; cursor: pointer; pointer-events: auto;
                transition: transform 0.4s ease, background 0.4s ease;
                display: flex; justify-content: center; align-items: center;
            }
            .trigger-dot::after {
                content: ''; width: 4px; height: 4px; background-color: #cbdccb; border-radius: 50%;
                transition: background-color 0.4s ease;
            }
            .trigger-dot:hover { transform: scale(1.3); background: radial-gradient(circle, rgba(142,160,145,0.3) 0%, rgba(255,255,255,0) 70%); }
            .trigger-dot:hover::after { background-color: #7da082; }
            .trigger-dot.clicked { pointer-events: none; opacity: 0 !important; transition: opacity 1s ease; }

            /* 水墨大滴落入洇散背景特效 */
            #ink-splash {
                position: absolute; width: 100%; height: 100%; top:0; left:0;
                background: radial-gradient(circle, rgba(44,44,44,0.04) 0%, rgba(255,255,255,0) 70%);
                transform: scale(0); transition: transform 4s cubic-bezier(0.1, 0.8, 0.3, 1);
                pointer-events: none;
            }
            
            /* 结尾落幕提示 */
            #qm-next-prompt {
                position: absolute; bottom: 8%; left: 50%; transform: translateX(-50%);
                font-size: 1.1rem; letter-spacing: 0.3em; color: #999999;
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
                    <svg class="banana-svg" viewBox="0 0 600 600" preserveAspectRatio="xMaxYMax meet">
                        <line x1="150" y1="0" x2="50" y2="200" class="rain-line" style="animation-delay: 0s;" />
                        <line x1="300" y1="0" x2="200" y2="200" class="rain-line" style="animation-delay: 0.3s;" />
                        <line x1="450" y1="0" x2="350" y2="200" class="rain-line" style="animation-delay: 0.7s;" />
                        <line x1="580" y1="50" x2="480" y2="250" class="rain-line" style="animation-delay: 0.2s;" />
                        <line x1="200" y1="250" x2="100" y2="450" class="rain-line" style="animation-delay: 0.5s;" />
                        <line x1="400" y1="200" x2="300" y2="400" class="rain-line" style="animation-delay: 0.9s;" />
                        
                        <g class="sway-leaf">
                            <path d="M 300,600 Q 150,300 40,380 Q 180,520 300,600" fill="#f2f7f3" stroke="#cbdccb" stroke-width="1.2" />
                            <path d="M 300,600 Q 170,410 40,380" fill="none" stroke="#d5e2d5" stroke-width="1" stroke-dasharray="3 3" />
                        </g>
                        <g class="sway-leaf" style="animation-delay: -2s;">
                            <path d="M 300,600 Q 420,180 580,240 Q 460,480 300,600" fill="#eff5f0" stroke="#c0d3c0" stroke-width="1.2" />
                            <path d="M 300,600 Q 440,320 580,240" fill="none" stroke="#cbdccb" stroke-width="1" stroke-dasharray="3 3" />
                        </g>
                    </svg>
                </div>

                <div class="trigger-dot" id="dot-0" style="right: 32%; bottom: 58%;"></div>
                <div class="trigger-dot" id="dot-1" style="right: 12%; bottom: 64%;"></div>
                <div class="trigger-dot" id="dot-2" style="right: 44%; bottom: 34%;"></div>
                <div class="trigger-dot" id="dot-3" style="right: 22%; bottom: 28%;"></div>
                <div class="trigger-dot" id="dot-4" style="right: 15%; bottom: 44%;"></div>
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

    // 激活全屏舞台
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

    // ====== 第三幕：进入水墨长卷交互 ======
    contentStage.style.display = 'block';
    await wait(50);
    contentStage.style.opacity = 1;

    // 水墨大滴落下，背景优雅晕开极淡的灰
    await wait(200);
    inkSplash.style.transform = 'scale(1.5)';

    // 初始化交互计数器
    let clickedCount = 0;

    // 绑定五个点击点的行为逻辑
    for (let i = 0; i < 5; i++) {
        const dot = document.getElementById(`dot-${i}`);
        dot.addEventListener('click', async (e) => {
            e.stopPropagation(); // 阻止冒泡，不触发全局舞台点击
            dot.classList.add('clicked'); // 隐去当前点击点
            
            // 创建并插入一个新的垂直文本列
            const poemColumn = document.createElement('div');
            poemColumn.className = 'poem-column';
            
            const item = shortChapters[i];
            const structuredHTML = `
                <div class="poem-title font-kangxi">${item.title}</div>
                <div style="margin-top: 10px;">${convertToSpans(item.content)}</div>
            `;
            poemColumn.innerHTML = structuredHTML;
            tibaBox.appendChild(poemColumn); // 挂载到题跋区

            // 驱动一笔一划手书渐显动态
            await revealPoemText(poemColumn, 60);
            
            clickedCount++;
            
            // 当五则短章全部集齐出现后，执行清场与淡出逻辑
            if (clickedCount === 5) {
                await wait(4000); // 留出充足的时间供观者静静把玩、阅读完整卷题跋
                
                // 短章渐渐淡去，只留雨打芭蕉，触发点永不复现
                tibaBox.style.opacity = 0;
                await wait(2500);
                tibaBox.innerHTML = ''; // 彻底清理释放空间

                // 唤醒落幕点击提示
                nextPrompt.style.display = 'block';
                await wait(50);
                nextPrompt.style.opacity = 1;
            }
        });
    }

    // 等待最后的舞台点击，离场并全盘卸载清明舞台
    await nextClick(wrapper);
    container.classList.remove('active');
    await wait(2500);
    container.innerHTML = '';
}