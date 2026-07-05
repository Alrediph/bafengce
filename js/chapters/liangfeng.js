// js/chapters/liangfeng.js
const wait = ms => new Promise(r => setTimeout(r, ms));

const nextClick = (element) => new Promise(resolve => {
    element.addEventListener('click', resolve, { once: true });
});

// 辅助函数：细腻的墨迹渐显效果
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
    // 将诗句与具体的行政行省进行死锁绑定
    const provinceData = {
        'shaanxi': { name: '陕西 · 长安', text: '秋风吹渭水，<br>落叶满长安。' },
        'henan':   { name: '河南 · 洛阳', text: '洛阳城里见秋风，<br>欲作家书意万重。' },
        'jiangsu': { name: '江苏 · 金陵', text: '金陵夜寂凉风发，<br>独上高楼望吴越。' },
        'zhejiang':{ name: '浙江 · 临安', text: '山外青山楼外楼，<br>西湖歌舞几时休。' },
        'sichuan': { name: '四川 · 蜀道', text: '长风万里送秋雁，<br>对此可以酣高楼。' }
    };

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

            /* 右侧中国分省写意舆图区（完美对齐 image_381e7e 的质感） */
            .map-zone {
                position: absolute; right: 4%; top: 12%; width: 52vw; height: 76vh;
            }
            .china-map-svg { width: 100%; height: 100%; }
            
            /* 省份基础区块：复刻实物图的清爽灰蓝色调，白边勾勒 */
            .province-block {
                fill: #abc4d0;
                stroke: #ffffff;
                stroke-width: 1.5;
                transition: fill 0.4s ease, filter 0.4s ease;
            }
            
            /* 填充周围省份背景色，强化中国公鸡舆图的整体骨架感 */
            .bg-province { fill: #c6dae3; }
            .west-province { fill: #9bb7c6; }
            .south-province { fill: #bdcfd8; }

            /* 鼠标悬停时的优雅高亮提示 */
            .interactive-prov { cursor: pointer; }
            .interactive-prov:hover { fill: #86a9bc; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.08)); }
            
            /* 🌟 核心视觉：点中激活后的省份转为惊艳的朱砂红 */
            .interactive-prov.active {
                fill: #962929 !important;
                filter: drop-shadow(0 6px 12px rgba(150,41,41,0.2));
            }

            /* 左侧极其平稳的原生双排纵向题跋区 */
            .jixing-zone {
                position: absolute; 
                right: 54vw; /* 定位于地图左侧 */
                top: 8vh; 
                height: 84vh;
                writing-mode: vertical-rl;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                pointer-events: none;
            }
            .jixing-row {
                display: flex; flex-direction: column; /* 竖排文字下column即为横向向左平铺 */
                align-items: flex-start; justify-content: flex-start;
                height: 38vh; gap: 45px;
            }
            
            .jixing-column {
                font-size: 1.05rem; color: #333333; height: 100%;
                white-space: nowrap; pointer-events: auto;
            }
            .jixing-node-title {
                font-weight: bold; color: #962929; margin-left: 15px; font-size: 1.15rem;
            }

            #lf-next-prompt {
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 1.8rem; letter-spacing: 0.5em; color: #4a4a4a;
                opacity: 0; transition: opacity 2s ease; cursor: pointer; display: none;
                white-space: nowrap; text-align: center;
            }
        </style>

        <div class="liangfeng-wrapper" id="lf-wrapper">
            <!-- 幕一：大字居中 -->
            <div id="lf-title-screen" class="vertical-text font-kangxi">凉风</div>

            <!-- 幕二：启幕词 -->
            <div id="lf-intro" class="vertical-text font-kangxi" style="display: none;">
                凉风，西方风也。肃也。万物至此皆肃然而成也。<br>
                属兑，八音为革。<br>
                秋分之风。
            </div>

            <!-- 幕三：全景舆图交互舞台 -->
            <div id="lf-content-stage">
                <!-- 左侧双层物理题跋架 -->
                <div class="jixing-zone">
                    <div id="lf-row-top" class="jixing-row"></div>    <!-- 承接前三个点亮的省份 -->
                    <div id="lf-row-bottom" class="jixing-row"></div> <!-- 承接后两个点亮的省份 -->
                </div>

                <!-- 右侧极简精美手绘分省地图 (等比例像素高度还原 image_381e7e 骨骼) -->
                <div class="map-zone">
                    <svg class="china-map-svg" viewBox="0 0 500 400" preserveAspectRatio="xMidYMid meet">
                        <!-- 新疆、西藏、青海、内蒙等大西北背景轮廓 -->
                        <path d="M 20,120 L 120,100 L 160,150 L 140,240 L 40,240 Z" class="province-block west-province" />
                        <path d="M 40,240 L 140,240 L 180,210 L 210,260 L 150,330 L 50,320 Z" class="province-block west-province" />
                        <path d="M 140,190 L 210,180 L 230,230 L 210,260 L 180,210 Z" class="province-block west-province" />
                        <path d="M 120,100 L 260,110 L 320,80 L 300,140 L 210,180 Z" class="province-block bg-province" />
                        
                        <!-- 东北、华北、华南外围背景块 -->
                        <path d="M 320,80 L 380,40 L 420,90 L 370,130 L 320,120 Z" class="province-block bg-province" />
                        <path d="M 320,120 L 370,130 L 360,170 L 330,170 Z" class="province-block bg-province" />
                        <path d="M 190,320 L 250,310 L 280,360 L 220,380 Z" class="province-block south-province" />
                        <path d="M 250,310 L 320,310 L 340,350 L 280,360 Z" class="province-block south-province" />
                        <path d="M 320,310 L 390,300 L 370,340 L 340,350 Z" class="province-block south-province" />

                        <!-- 🌟 核心可交互省份一：四川（蜀道） -->
                        <path id="prov-sichuan" d="M 150,240 L 230,230 L 250,310 L 190,320 Z" class="province-block interactive-prov" />
                        
                        <!-- 🌟 核心可交互省份二：陕西（长安） -->
                        <path id="prov-shaanxi" d="M 230,160 L 270,150 L 260,240 L 230,230 Z" class="province-block interactive-prov" />
                        
                        <!-- 🌟 核心可交互省份三：河南（洛阳） -->
                        <path id="prov-henan" d="M 270,170 L 330,170 L 320,220 L 260,220 Z" class="province-block interactive-prov" />
                        
                        <!-- 🌟 核心可交互省份四：江苏（金陵） -->
                        <path id="prov-jiangsu" d="M 330,170 L 375,185 L 360,230 L 330,220 Z" class="province-block interactive-prov" />
                        
                        <!-- 🌟 核心可交互省份五：浙江（临安） -->
                        <path id="prov-zhejiang" d="M 350,230 L 385,235 L 375,285 L 340,270 Z" class="province-block interactive-prov" />
                    </svg>
                </div>
            </div>

            <!-- 结束引线 -->
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

    // ====== 第三幕：全景分省舆图手动点击 ======
    contentStage.style.display = 'block';
    await wait(50);
    contentStage.style.opacity = 1;

    let currentRevealedCount = 0;
    const clickedProvinces = new Set();

    const provIds = ['prov-shaanxi', 'prov-henan', 'prov-jiangsu', 'prov-zhejiang', 'prov-sichuan'];
    const provKeys = ['shaanxi', 'henan', 'jiangsu', 'zhejiang', 'sichuan'];

    provIds.forEach((id, idx) => {
        const provBlock = document.getElementById(id);
        const key = provKeys[idx];
        const item = provinceData[key];

        provBlock.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            // 拦截重复点击
            if (clickedProvinces.has(key)) return;
            clickedProvinces.add(key);

            // 1. 瞬间将当前省份渲染为醒目的朱砂红
            provBlock.classList.add('active');

            // 2. 左侧独立双轨生成题跋列
            const poemColumn = document.createElement('div');
            poemColumn.className = 'poem-column';
            poemColumn.style.writingMode = 'vertical-rl';
            poemColumn.style.fontSize = '1.05rem';
            poemColumn.style.height = '100%';
            poemColumn.style.display = 'inline-block';
            poemColumn.style.verticalAlign = 'top';
            poemColumn.style.whiteSpace = 'nowrap';

            // 按照点击出的先后顺序显示其一到其五
            const titlePrefixes = ['其一', '其二', '其三', '其四', '其五'];
            const currentPrefix = titlePrefixes[currentRevealedCount];
            
            poemColumn.innerHTML = `
                <div class="jixing-node-title font-kangxi">${currentPrefix} · ${item.name}</div>
                <div style="line-height: 2.3; letter-spacing: 0.15em; margin-top: 10px;">${convertToSpans(item.text)}</div>
            `;

            // 分轨排布：前3个去上排，后2个去下排，绝对不出界
            if (currentRevealedCount < 3) {
                document.getElementById('lf-row-top').appendChild(poemColumn);
            } else {
                document.getElementById('lf-row-bottom').appendChild(poemColumn);
            }

            currentRevealedCount++;

            // 3. 驱动毛笔字迹渐显
            await revealText(poemColumn, 45);

            // 4. 当五个核心省份全部被点亮，画卷谢幕
            if (clickedProvinces.size === 5) {
                await wait(5000);
                
                // 长卷全清空
                contentStage.style.opacity = 0;
                contentStage.style.transition = 'opacity 2.5s ease';
                await wait(2500);
                contentStage.innerHTML = '';

                // 唤醒正中央结束语
                nextPrompt.style.display = 'block';
                await wait(50);
                nextPrompt.style.opacity = 1;
            }
        });
    });

    // 锁死最后的背景离场点击
    await nextClick(wrapper);
    container.classList.remove('active');
    await wait(2500);
    container.innerHTML = '';
}
