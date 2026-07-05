// js/chapters/liangfeng.js
const wait = ms => new Promise(r => setTimeout(r, ms));

const nextClick = (element) => new Promise(resolve => {
    element.addEventListener('click', resolve, { once: true });
});

// 辅助函数：墨迹渐显
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

function revealText(element, speed = 35) {
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
    // 🌟【架构重组】完美精简为两页，每页满载 9 个省份，彻底填满空间空白
    const pagesData = [
        [
            { id: 'zhili',    name: '直隶', poem: '燕山雪花大如席，片片吹落轩辕台。', author: '——李白《北风行》', note: '京华烟云，长城内外。' },
            { id: 'shandong', name: '山东', poem: '会当凌绝顶，一览众山小。', author: '——杜甫《望岳》', note: '泰山岩岩，鲁邦所瞻。' },
            { id: 'henan',    name: '河南', poem: '黄河远上白云间，一片孤城万仞山。', author: '——王之涣《凉州词》', note: '中原故土，河洛风烟。' },
            { id: 'shanxi1',  name: '山西', poem: '白日依山尽，黄河入海流。', author: '——王之涣《登鹳雀楼》', note: '表里山河，晋商古道。' },
            { id: 'shaanxi',  name: '陕西', poem: '长安一片月，万户捣衣声。', author: '——李白《子夜吴歌》', note: '秦川历历，汉阙犹存。' },
            { id: 'gansu',    name: '甘肃', poem: '羌笛何须怨杨柳，春风不度玉门关。', author: '——王之涣《凉州词》', note: '河西走廊，丝路驼铃。' },
            { id: 'jiangsu',  name: '江苏', poem: '江苏', poem: '姑苏城外寒山寺，夜半钟声到客船。', author: '——张继《枫桥夜泊》', note: '金陵旧梦，吴门烟水。' },
            { id: 'anhui',    name: '安徽', poem: '五岳归来不看山，黄山归来不看岳。', author: '——徐霞客', note: '徽岭白岳，水墨人家。' },
            { id: 'zhejiang', name: '浙江', poem: '三秋桂子，十里荷花。', author: '——柳永《望海潮》', note: '西湖烟雨，之江潮生。' }
        ],
        [
            { id: 'jiangxi',  name: '江西', poem: '落霞与孤鹜齐飞，秋水共长天一色。', author: '——王勃《滕王阁序》', note: '赣江悠悠，匡庐云雾。' },
            { id: 'hubei',    name: '湖北', poem: '黄鹤一去不复返，白云千载空悠悠。', author: '——崔颢《黄鹤楼》', note: '荆楚大地，云梦遗泽。' },
            { id: 'hunan',    name: '湖南', poem: '洞庭波涌连天雪，长岛人歌动地诗。', author: '——毛泽东', note: '潇湘夜雨，岳麓书声。' },
            { id: 'sichuan',  name: '四川', poem: '蜀道之难，难于上青天。', author: '——李白《蜀道难》', note: '巴山夜雨，锦城花重。' },
            { id: 'fujian',   name: '福建', poem: '海日生残夜，江春入旧年。', author: '——王湾《次北固山下》', note: '闽山苍苍，海波不惊。' },
            { id: 'guangdong',name: '广东', poem: '罗浮山下四时春，卢橘杨梅次第新。', author: '——苏轼《食荔枝》', note: '岭南风暖，潮汕月明。' },
            { id: 'guangxi',  name: '广西', poem: '江作青罗带，山如碧玉簪。', author: '——韩愈《送桂州严大夫', note: '桂林山水，八桂烟霞。' },
            { id: 'yunnan',   name: '云南', poem: '天气常如二三月，花枝不断四时春。', author: '——杨慎《滇海曲》', note: '苍山洱海，彩云之南。' },
            { id: 'guizhou',  name: '贵州', poem: '天无三日晴，地无三里平。', author: '——民谚', note: '黔山万壑，苗岭侗歌。' }
        ]
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
                transition: opacity 1.8s ease; position: relative;
                /* 确保舞台自身完美居中 */
                display: flex; justify-content: center; align-items: center;
            }

            /* 🌟【核心修复：粉碎偏台】使用 fit-content 动态紧锁 9 列，配合 margin: 0 auto 在屏幕正中死死对齐 */
            .woodblock-catalog-container {
                width: fit-content; 
                height: 68vh;
                border: 4px double #1a1a1a; 
                padding: 12px 25px; /* 横向适度扩充白边 */
                position: relative;
                background-color: #faf7f0; 
                box-shadow: inset 0 0 40px rgba(215,200,180,0.25);
                margin: 0 auto;
                transition: width 0.4s cubic-bezier(0.25, 1, 0.5, 1);
            }
            
            /* 纵向双页大画布 */
            .woodblock-page-canvas {
                height: 100%;
                writing-mode: vertical-rl; 
                display: flex;
                flex-direction: column; 
                justify-content: flex-start;
                align-items: flex-start;
            }

            /* 省份实体栏：高密度紧凑布局 */
            .woodblock-prov-column {
                height: 100%;
                display: inline-block;
                vertical-align: top;
                border-left: 1px solid #e3dac9; 
                transition: width 0.55s cubic-bezier(0.25, 1, 0.5, 1);
                width: 68px; /* 9列格局下更精致的初始身宽 */
                overflow: hidden;
                white-space: nowrap;
                position: relative;
            }
            
            /* 点击把手 */
            .prov-clickable-header {
                height: 100%; width: 68px;
                display: block; text-align: center;
                cursor: pointer; padding-top: 45px;
                box-sizing: border-box; user-select: none;
                position: absolute; right: 0; top: 0; z-index: 5;
            }
            .prov-large-name {
                font-size: 1.7rem; font-weight: bold; color: #1a1a1a;
                letter-spacing: 0.25em; transition: color 0.3s ease;
            }
            .prov-clickable-header:hover .prov-large-name { color: #962929; }

            /* 【折子展开内芯】 */
            .prov-folded-content {
                height: 100%;
                margin-right: 68px; 
                opacity: 0; width: 0;
                transition: width 0.55s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease;
                display: block; box-sizing: border-box;
                padding: 45px 22px 30px 22px;
                background-color: #f6f0e4; 
            }

            /* 展开激活状态 */
            .woodblock-prov-column.active {
                width: 255px; /* 完美的爆展宽度 */
                background-color: #faf6eb;
            }
            .woodblock-prov-column.active .prov-large-name { color: #962929; }
            .woodblock-prov-column.active .prov-folded-content {
                width: 187px; opacity: 1; pointer-events: auto;
            }

            /* 内部行气 */
            .inner-poem-row {
                font-size: 1.12rem; color: #2c2c2c; line-height: 2.2;
                letter-spacing: 0.15em; display: block; margin-left: 10px;
            }
            .inner-author-row {
                font-size: 0.85rem; color: #777777; display: block;
                margin-left: 18px; text-align: left; margin-bottom: 25px;
            }
            .inner-footnote-row {
                font-size: 0.95rem; color: #8c7355; font-weight: bold;
                line-height: 2; letter-spacing: 0.12em; display: block;
                border-right: 1px dashed rgba(140,115,85,0.25); padding-right: 6px;
            }

            /* 【修复位置】翻页引线：紧紧咬死在居中大框的右下角，再也不会满屏幕漂移 */
            .woodblock-page-btn {
                position: absolute; bottom: -55px;
                font-size: 1.05rem; letter-spacing: 0.2em; color: #777777;
                cursor: pointer; user-select: none; transition: color 0.3s ease;
            }
            .woodblock-page-btn:hover { color: #962929; font-weight: bold; }
            #btn-prev-page { right: 85px; }
            #btn-next-page { right: 0px; }
            .btn-disabled { opacity: 0.15 !important; pointer-events: none !important; }

            /* 左下角手书小楷 */
            #lf-final-handwritten {
                position: absolute; left: 0; bottom: -52px;
                font-size: 1rem; letter-spacing: 0.2em; color: #bbbbbb;
                opacity: 0; transition: opacity 2s ease;
                white-space: nowrap; pointer-events: none;
            }
        </style>

        <div class="liangfeng-wrapper" id="lf-wrapper">
            <div id="lf-title-screen" class="vertical-text font-kangxi">凉风</div>

            <div id="lf-intro" class="vertical-text font-kangxi" style="display: none;">
                凉风，西南风也。凉，寒也。阴气始行，微敛也。<br>
                属坤，八音为土。<br>
                立秋之风。
            </div>

            <div id="lf-content-stage">
                <div class="woodblock-catalog-container">
                    <div class="woodblock-page-canvas" id="woodblock-canvas"></div>
                    
                    <!-- 两页体制下的精美切卷引线 -->
                    <div class="woodblock-page-btn font-kangxi" id="btn-prev-page">【 前卷 】</div>
                    <div class="woodblock-page-btn font-kangxi" id="btn-next-page">【 次卷 】</div>

                    <div id="lf-final-handwritten" class="font-kangxi">君子之行，大地記之。</div>
                </div>
            </div>
        </div>
    `;

    const wrapper = document.getElementById('lf-wrapper');
    const titleScreen = document.getElementById('lf-title-screen');
    const intro = document.getElementById('lf-intro');
    const contentStage = document.getElementById('lf-content-stage');
    const canvas = document.getElementById('woodblock-canvas');
    
    const btnPrev = document.getElementById('btn-prev-page');
    const btnNext = document.getElementById('btn-next-page');
    const finalHandwritten = document.getElementById('lf-final-handwritten');

    container.classList.add('active');
    await wait(400);

    // ====== 第一幕：大字居中 ======
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

    // ====== 第三幕：双页大格刻本主交互 ======
    contentStage.style.display = 'flex'; // 强制激活flex完美居中
    await wait(50);
    contentStage.style.opacity = 1;

    let currentPageIndex = 0;
    const readProvincesPool = new Set();

    function renderWoodblockPage(pageIdx) {
        canvas.innerHTML = ''; 
        const currentList = pagesData[pageIdx];

        currentList.forEach((prov) => {
            const colNode = document.createElement('div');
            colNode.className = 'woodblock-prov-column';
            colNode.id = `col-${prov.id}`;

            colNode.innerHTML = `
                <div class="prov-clickable-header" id="head-${prov.id}">
                    <div class="prov-large-name font-kangxi">${prov.name}</div>
                </div>
                <div class="prov-folded-content">
                    <span class="inner-poem-row font-kangxi">${convertToSpans(prov.poem)}</span>
                    <span class="inner-author-row">${prov.author}</span>
                    <span class="inner-footnote-row font-kangxi">${convertToSpans(prov.note)}</span>
                </div>
            `;

            canvas.appendChild(colNode);

            const header = colNode.querySelector('.prov-clickable-header');
            header.addEventListener('click', async (e) => {
                e.stopPropagation();
                readProvincesPool.add(prov.id);

                if (colNode.classList.contains('active')) {
                    colNode.classList.remove('active');
                    return;
                }

                const allCols = canvas.querySelectorAll('.woodblock-prov-column');
                allCols.forEach(c => c.classList.remove('active'));

                colNode.classList.add('active');
                await wait(150); 
                revealText(colNode, 35);

                // 🌟【智能阈值】两页制下，当看画人在次卷（Page 1）且累计把玩过 6 个省份以上时，平滑触发终章
                if (readProvincesPool.size >= 6 && currentPageIndex === 1) {
                    triggerFinal收束Flow();
                }
            });
        });

        // 🌟 严格锁死 2 页制的按钮常态
        if (pageIdx === 0) btnPrev.classList.add('btn-disabled');
        else btnPrev.classList.remove('btn-disabled');

        if (pageIdx === 1) btnNext.classList.add('btn-disabled');
        else btnNext.classList.remove('btn-disabled');
    }

    btnPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentPageIndex > 0) { currentPageIndex--; renderWoodblockPage(currentPageIndex); }
    });
    btnNext.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentPageIndex < 1) { currentPageIndex++; renderWoodblockPage(currentPageIndex); }
    });

    // 默认加载第一卷（直隶至浙江编组）
    renderWoodblockPage(0);

    let is收束Triggered = false;
    function triggerFinal收束Flow() {
        if (is收束Triggered) return;
        is收束Triggered = true;

        setTimeout(async () => {
            finalHandwritten.style.opacity = '0.7'; 
            await wait(4500); 
            finalHandwritten.style.opacity = '0'; 
            await wait(2000);

            contentStage.style.opacity = 0;
            await wait(1800);
            container.innerHTML = '';
            container.classList.remove('active');
        }, 3000);
    }
}
