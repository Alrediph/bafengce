// js/chapters/liangfeng.js
const wait = ms => new Promise(r => setTimeout(r, ms));

const nextClick = (element) => new Promise(resolve => {
    element.addEventListener('click', resolve, { once: true });
});

// 辅助函数：将字符用带有动态模糊过渡的span包裹，实现细腻的墨迹渐显
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

function revealText(element, speed = 45) {
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

export default async function playLiangfeng(container) {
    // 1. 定制属于文人长卷的五个写意足迹节点数据
    const footprints = [
        { name: '长安', coord: { x: 220, y: 310 }, text: '秋风吹渭水，<br>落叶满长安。' },
        { name: '洛阳', coord: { x: 290, y: 290 }, text: '洛阳城里见秋风，<br>欲作家书意万重。' },
        { name: '金陵', coord: { x: 380, y: 340 }, text: '金陵夜寂凉风发，<br>独上高楼望吴越。' },
        { name: '临安', coord: { x: 410, y: 380 }, text: '山外青山楼外楼，<br>西湖歌舞几时休。' },
        { name: '蜀道', coord: { x: 140, y: 380 }, text: '长风万里送秋雁，<br>对此可以酣高楼。' }
    ];

    container.innerHTML = `
        <style>
            .liangfeng-wrapper {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative; background-color: #ffffff;
            }
            #lf-title-screen { font-size: 3.8rem; letter-spacing: 0.6em; opacity: 0; transition: opacity 2s ease; cursor: pointer; }
            #lf-intro { font-size: 1.2rem; line-height: 3; opacity: 0; transition: opacity 2s ease; position: absolute; cursor: pointer; }
            
            #lf-content-stage {
                width: 100%; height: 100%; display: none; opacity: 0;
                transition: opacity 2s ease; position: relative;
            }

            /* 左侧写意山河舆图区 */
            .map-zone {
                position: absolute; left: 6%; top: 10%; width: 55vw; height: 80vh;
            }
            .map-svg { width: 100%; height: 100%; overflow: visible; }
            
            /* 山河写意白描线网 */
            .map-outline {
                stroke: #e8e8e8; stroke-width: 1; fill: none; stroke-dasharray: 4 4;
            }

            /* 地图整体写意轮廓弧线 */
            .map-coastline {
                stroke: #f2f5f2; stroke-width: 2; fill: none;
            }

            /* 隐约的灰色全路网虚线基底 */
            .bg-route-line {
                stroke: #f0f0f0; stroke-width: 1.2; fill: none; stroke-dasharray: 2 4;
            }

            /* 激活时亮起的朱砂红连接线 */
            .travel-line-seg {
                stroke: #962929; stroke-width: 1.5; fill: none;
                stroke-dasharray: 200; stroke-dashoffset: 200;
                transition: stroke-dashoffset 1.5s ease-out;
            }
            .travel-line-seg.draw {
                stroke-dashoffset: 0;
            }

            /* 足迹水墨核心圆点 */
            .map-dot {
                fill: #2c2c2c; opacity: 0; transform: scale(0);
                transform-origin: center;
                transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease;
            }
            .map-dot.bloom { opacity: 1; transform: scale(1.3); fill: #962929; }
            
            /* 交互触发圈：带有向外扩散扩散的动画效果 */
            .map-dot-ring {
                stroke: #962929; stroke-width: 1; fill: none; opacity: 0;
                transform-origin: center; transform: scale(0.5);
            }
            @keyframes ring-pulse {
                0% { transform: scale(0.5); opacity: 0.8; }
                100% { transform: scale(2.2); opacity: 0; }
            }
            .map-dot-ring.active { animation: ring-pulse 2s infinite ease-out; }

            /* 舆图古朴名签 */
            .map-label {
                font-size: 0.95rem; fill: #777777; opacity: 0.4;
                transition: opacity 0.8s ease, fill 0.5s ease; 
                font-family: 'KangXi', serif;
                user-select: none;
            }
            .map-label.show { opacity: 1; fill: #1a1a1a; font-weight: bold; }

            /* 🌟【扩大点击热区】隐形的大圆圈，确保手指和鼠标极其容易点中 */
            .map-click-target {
                fill: transparent; cursor: pointer; pointer-events: auto;
            }
            .map-click-target:hover + .map-label { opacity: 0.9; fill: #962929; }

            /* 右侧极其稳固的原生纵向题跋纪行区 */
            .jixing-zone {
                position: absolute; 
                right: 52vw; /* 定位于屏幕中线左侧一点 */
                top: 15vh; 
                height: 70vh;
                writing-mode: vertical-rl; /* 自右向左纵向流动 */
            }
            
            .jixing-column {
                font-size: 1.1rem; 
                color: #333333;
                height: 100%;
                display: inline-block; /* 稳固的横向并排 */
                vertical-align: top;
                margin-left: 50px; /* 每列题跋之间的黄金白地间距 */
                white-space: nowrap;
            }
            
            .jixing-node-title {
                font-weight: bold; 
                color: #962929; 
                margin-left: 15px; 
                font-size: 1.2rem; 
                display: block;
            }

            /* 正中央高雅收尾大字 */
            #lf-next-prompt {
                position: absolute; 
                top: 50%; left: 50%; 
                transform: translate(-50%, -50%);
                font-size: 1.8rem; letter-spacing: 0.5em; color: #4a4a4a;
                opacity: 0; transition: opacity 2s ease; cursor: pointer; display: none;
                white-space: nowrap; text-align: center;
            }
        </style>

        <div class="liangfeng-wrapper" id="lf-wrapper">
            <div id="lf-title-screen" class="vertical-text font-kangxi">凉风</div>

            <div id="lf-intro" class="vertical-text font-kangxi" style="display: none;">
                凉风，西方风也。肃也。万物至此皆肃然而成也。<br>
                属兑，八音为革。<br>
                秋分之风。
            </div>

            <div id="lf-content-stage">
                <div class="map-zone">
                    <svg class="map-svg" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
                        <path d="M 30,0 L 30,500 M 130,0 L 130,500 M 230,0 L 230,500 M 330,0 L 330,500 M 430,0 L 430,500" class="map-outline" />
                        <path d="M 0,100 L 500,100 M 0,200 L 500,200 M 0,300 L 500,300 M 0,400 L 500,400" class="map-outline" />
                        
                        <path d="M 50,450 Q 150,420 200,360 T 380,330 T 480,260" class="map-coastline" />
                        <path d="M 100,260 Q 220,240 280,300 T 450,280" class="map-coastline" />

                        <path d="M 220,310 L 290,290 L 380,340 L 410,380 L 140,380" class="bg-route-line" />

                        <line id="line-0-1" x1="220" y1="310" x2="290" y2="290" class="travel-line-seg" />
                        <line id="line-1-2" x1="290" y1="290" x2="380" y2="340" class="travel-line-seg" />
                        <line id="line-2-3" x1="380" y1="340" x2="410" y2="380" class="travel-line-seg" />
                        <line id="line-3-4" x1="410" y1="380" x2="140" y2="380" class="travel-line-seg" />

                        ${footprints.map((fp, idx) => `
                            <g id="node-g-${idx}">
                                <circle id="ring-${idx}" cx="${fp.coord.x}" cy="${fp.coord.y}" r="8" class="map-dot-ring" />
                                <circle id="dot-${idx}" cx="${fp.coord.x}" cy="${fp.coord.y}" r="4.5" class="map-dot" />
                                <text id="lbl-${idx}" x="${fp.coord.x + 12}" y="${fp.coord.y + 5}" class="map-label">${fp.name}</text>
                                <circle class="map-click-target" cx="${fp.coord.x}" cy="${fp.coord.y}" r="22" id="target-${idx}" />
                            </g>
                        `).join('')}
                    </svg>
                </div>

                <div class="jixing-zone" id="lf-jixing-box"></div>
            </div>

            <div id="lf-next-prompt" class="font-kangxi">凉风至。君子结庐。</div>
        </div>
    `;

    const wrapper = document.getElementById('lf-wrapper');
    const titleScreen = document.getElementById('lf-title-screen');
    const intro = document.getElementById('lf-intro');
    const contentStage = document.getElementById('lf-content-stage');
    const jixingBox = document.getElementById('lf-jixing-box');
    const nextPrompt = document.getElementById('lf-next-prompt');

    container.classList.add('active');
    await wait(400);

    // ====== 第一幕：“凉风”大字 ======
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

    // ====== 第三幕：全景舆图手动探访 ======
    contentStage.style.display = 'block';
    await wait(50);
    contentStage.style.opacity = 1;

    // 🌟 维护一个纯粹的绝对顺序计数器，锁定诗句其一到其五的完美流向
    let currentRevealedIndex = 0;

    // 用来记录哪些站点已经被点亮过，防止观者重复点击同一个点刷数据
    const activatedNodes = new Set();

    // 为 5 个大靶心依次挂载手动点击监听
    for (let i = 0; i < 5; i++) {
        const target = document.getElementById(`target-${i}`);
        target.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            // 如果这个省/城市已经亮过了，直接拦截，不做重复处理
            if (activatedNodes.has(i)) return;
            activatedNodes.add(i);

            // 1. 瞬间点亮地图上的视觉元素
            const dot = document.getElementById(`dot-${i}`);
            const ring = document.getElementById(`ring-${i}`);
            const lbl = document.getElementById(`lbl-${i}`);
            
            dot.classList.add('bloom');
            lbl.classList.add('show');
            ring.classList.add('active');

            // 2. 🌟 智能绘制连线：如果上一站也被点亮了，就自动画出它们之间的红色连线纽带
            if (i > 0 && activatedNodes.has(i - 1)) {
                const lineSeg = document.getElementById(`line-${i-1}-${i}`);
                if (lineSeg) lineSeg.classList.add('draw');
            }
            if (i < 4 && activatedNodes.has(i + 1)) {
                const lineSeg = document.getElementById(`line-${i}-${i+1}`);
                if (lineSeg) lineSeg.classList.add('draw');
            }

            // 3. 右侧严谨生出本站对应的游历诗句
            const item = footprints[i];
            const poemColumn = document.createElement('div');
            poemColumn.className = 'jixing-column';
            
            // 题跋小标题序号借用 currentRevealedIndex 保持美感秩序
            const titles = ['其一', '其二', '其三', '其四', '其五'];
            const currentTitle = titles[currentRevealedIndex];
            currentRevealedIndex++;

            poemColumn.innerHTML = `
                <span class="jixing-node-title font-kangxi">${currentTitle} · ${item.name}</span>
                <span style="line-height: 2.3; letter-spacing: 0.15em;">${convertToSpans(item.text)}</span>
            `;
            
            jixingBox.appendChild(poemColumn);

            // 驱动字迹手写洇出
            await revealText(poemColumn, 45);

            // 4. 当 5 个城市全部被观者亲自抚点亮起，开启最终谢幕
            if (activatedNodes.size === 5) {
                await wait(5000); // 留出充足时间供观者把玩长卷舆图
                
                // 舆图与诗列优雅隐退
                const stage = document.getElementById('lf-content-stage');
                stage.style.opacity = 0;
                stage.style.transition = 'opacity 2.5s ease';
                await wait(2500);
                stage.innerHTML = ''; // 清空释放空间

                // 亮起正中央最终引线大字
                nextPrompt.style.display = 'block';
                await wait(50);
                nextPrompt.style.opacity = 1;
            }
        });
    }

    // 强力阻塞控制：只有在最后出场词完全显现后，点击大背景才允许跨入下一章
    const finalExiter = new Promise(resolveExit => {
        wrapper.addEventListener('click', () => {
            if (nextPrompt.style.opacity === '1') {
                resolveExit();
            }
        });
    });

    await finalExiter;
    container.classList.remove('active');
    await wait(2500);
    container.innerHTML = '';
}