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
    // 🌟 注册当前活跃生命周期
    window.currentActiveChapter = 4;

    // 二卷本内地十八省
    const pagesData = [
        [
            { id: 'zhili',    name: '直隶', poem: '燕山雪花大如席，片片吹落轩辕台。', author: '——李白《北风行》', note: '京华烟云，长城内外。' },
            { id: 'shandong', name: '山东', poem: '会当凌绝顶，一览众山小。', author: '——杜甫《望岳》', note: '泰山岩岩，鲁邦所瞻。' },
            { id: 'henan',    name: '河南', poem: '谁家玉笛暗飞声，散入春风满洛城。', author: '——李白《春夜洛城闻笛》', note: '中原故土，河洛风烟。' },
            { id: 'shanxi1',  name: '山西', poem: '白日依山尽，黄河入海流。', author: '——王之涣《登鹳雀楼》', note: '表里山河，晋商古道。' },
            { id: 'shaanxi',  name: '陕西', poem: '长安一片月，万户捣衣声。', author: '——李白《子夜吴歌》', note: '秦川历历，汉阙犹存。' },
            { id: 'gansu',    name: '甘肃', poem: '羌笛何须怨杨柳，春风不度玉门关。', author: '——王之涣《凉州词》', note: '河西走廊，丝路驼铃。' },
            { id: 'jiangsu',  name: '江苏', poem: '姑苏城外寒山寺，夜半钟声到客船。', author: '——张继《枫桥夜泊》', note: '金陵旧梦，吴门烟水。' },
            { id: 'anhui',    name: '安徽', poem: '五岳归来不看山，黄山归来不看岳。', author: '——徐霞客', note: '徽岭白岳，水墨人家。' },
            { id: 'zhejiang', name: '浙江', poem: '三秋桂子，十里荷花。', author: '——柳永《望海潮》', note: '西湖烟雨，之江潮生。' }
        ],
        [
            { id: 'jiangxi',  name: '江西', poem: '落霞与孤鹜齐飞，秋水共长天一色。', author: '——王勃《滕王阁序》', note: '赣江悠悠，匡庐云雾。' },
            { id: 'hubei',    name: '湖北', poem: '黄鹤一去不复返，白云千载空悠悠。', author: '——崔颢《黄鹤楼》', note: '荆楚大地，云梦遗泽。' },
            { id: 'hunan',    name: '湖南', poem: '洞庭波涌连天雪，长岛人歌动地诗。', author: '——毛泽东', note: '潇湘夜雨，岳麓书声。' },
            { id: 'sichuan',  name: '四川', poem: '蜀道之难，难于上青天。', author: '——李白《蜀道难》', note: '巴山夜雨，锦城花重。' },
            { id: 'fujian',   name: '福建', poem: '南国多山水，闽中独妙奇。', author: '——杜荀鹤《闽中别所知》', note: '闽山苍苍，海波不惊。' },
            { id: 'guangdong',name: '广东', poem: '罗浮山下四时春，卢橘杨梅次第新。', author: '——苏轼《食荔枝》', note: '岭南风暖，潮汕月明。' },
            { id: 'guangxi',  name: '广西', poem: '江作青罗带，山如碧玉簪。', author: '——韩愈《送桂州严大夫》', note: '桂林山水，八桂烟霞. ' },
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
            #lf-title-screen { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 3.8rem; letter-spacing: 0.6em; text-indent: 0.6em;
                opacity: 0; transition: opacity 2s ease; cursor: pointer; white-space: nowrap; text-align: center;
            }
            #lf-intro { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 1.2rem; line-height: 2.8; letter-spacing: 0.15em; 
                opacity: 0; transition: opacity 2s ease; cursor: pointer;
                writing-mode: vertical-rl; white-space: nowrap;
            }
            #lf-content-stage {
                width: 100%; height: 100%; display: none; opacity: 0;
                transition: opacity 1.8s ease; position: relative;
                display: flex; justify-content: center; align-items: center;
            }
            .woodblock-catalog-container {
                writing-mode: horizontal-tb !important;
                width: fit-content !important; height: 68vh;
                border: 4px double #1a1a1a; padding: 12px 25px; 
                position: relative; background-color: #faf7f0; 
                box-shadow: inset 0 0 40px rgba(215,200,180,0.25);
                margin: 0 auto; transition: width 0.4s cubic-bezier(0.25, 1, 0.5, 1);
            }
            .woodblock-page-canvas {
                height: 100%; display: flex !important; flex-direction: row-reverse !important; 
                justify-content: flex-start; align-items: flex-start;
            }
            .woodblock-prov-column {
                writing-mode: vertical-rl !important;
                height: 100%; display: inline-block; vertical-align: top;
                border-left: 1px solid #e3dac9; width: 68px; overflow: hidden;
                white-space: nowrap; position: relative;
                transition: width 0.55s cubic-bezier(0.25, 1, 0.5, 1);
            }
            .prov-clickable-header {
                height: 100%; width: 68px; display: block; text-align: center;
                cursor: pointer; padding-top: 45px; box-sizing: border-box; 
                user-select: none; position: absolute; right: 0; top: 0; z-index: 5;
            }
            .prov-large-name {
                font-size: 1.7rem; font-weight: bold; color: #1a1a1a;
                letter-spacing: 0.25em; transition: color 0.3s ease;
            }
            .prov-clickable-header:hover .prov-large-name { color: #962929; }
            .prov-folded-content {
                height: 100%; margin-right: 68px; opacity: 0; width: 0;
                display: block; box-sizing: border-box; padding: 45px 22px 30px 22px;
                background-color: #f6f0e4; 
                transition: width 0.55s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease;
            }
            .woodblock-prov-column.active { width: 255px; background-color: #faf6eb; }
            .woodblock-prov-column.active .prov-large-name { color: #962929; }
            .woodblock-prov-column.active .prov-folded-content { width: 187px; opacity: 1; pointer-events: auto; }
            .inner-poem-row { font-size: 1.12rem; color: #2c2c2c; line-height: 2.2; letter-spacing: 0.15em; display: block; margin-left: 10px; }
            .inner-author-row { font-size: 0.85rem; color: #777777; display: block; margin-left: 18px; text-align: left; margin-bottom: 25px; }
            .inner-footnote-row { font-size: 0.95rem; color: #8c7355; font-weight: bold; line-height: 2; letter-spacing: 0.12em; display: block; border-right: 1px dashed rgba(140,115,85,0.25); padding-right: 6px; }
            
            .woodblock-footer-bar {
                position: absolute; bottom: -50px; left: 0px; 
                display: flex !important; flex-direction: row !important;
                align-items: center !important; justify-content: flex-start !important;
                gap: 16px; writing-mode: horizontal-tb !important; direction: ltr !important;
            }
            .woodblock-page-btn {
                display: flex !important; flex-direction: row !important;
                align-items: center !important; justify-content: center !important;
                writing-mode: horizontal-tb !important; white-space: nowrap !important;        
                font-size: 1.05rem; color: #777777; cursor: pointer; user-select: none; transition: color 0.3s ease;
            }
            .woodblock-page-btn:hover { color: #962929; font-weight: bold; }
            .btn-disabled { opacity: 0.15 !important; pointer-events: none !important; }
            .woodblock-page-btn span { display: inline-block !important; writing-mode: horizontal-tb !important; white-space: nowrap !important; }
            
            #lf-outro-screen {
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 2.4rem; letter-spacing: 0.5em; color: #2a2a2a;
                opacity: 0; transition: opacity 2s ease; white-space: nowrap; text-align: center;
                display: none; pointer-events: none;
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
                    <div class="woodblock-footer-bar" id="woodblock-foot">
                        <div class="woodblock-page-btn font-kangxi" id="btn-prev-page">
                            <span>【</span><span>前</span><span>卷</span><span>】</span>
                        </div>
                        <div class="woodblock-page-btn font-kangxi" id="btn-next-page">
                            <span>【</span><span>次</span><span>卷</span><span>】</span>
                        </div>
                    </div>
                </div>
            </div>
            <div id="lf-outro-screen" class="font-kangxi">君子之行，大地記之。</div>
        </div>
    `;

    const wrapper = document.getElementById('lf-wrapper');
    const titleScreen = document.getElementById('lf-title-screen');
    const intro = document.getElementById('lf-intro');
    const contentStage = document.getElementById('lf-content-stage');
    const canvas = document.getElementById('woodblock-canvas');
    const btnPrev = document.getElementById('btn-prev-page');
    const btnNext = document.getElementById('btn-next-page');
    const outroScreen = document.getElementById('lf-outro-screen');

    container.classList.add('active');
    await wait(400);

    // ====== 第一幕：“凉风”居中 ======
    titleScreen.style.opacity = 1;
    await nextClick(wrapper);
    titleScreen.style.opacity = 0;
    await wait(2000);
    titleScreen.style.display = 'none';

    // ====== 第二幕 ======
    intro.style.display = 'block';
    await wait(50);
    intro.style.opacity = 1;
    await nextClick(wrapper);
    intro.style.opacity = 0;
    await wait(2000);
    intro.style.display = 'none';

    // ====== 第三幕 ======
    contentStage.style.display = 'flex'; 
    await wait(50);
    contentStage.style.opacity = 1;

    let currentPageIndex = 0;

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

                if (colNode.classList.contains('active')) {
                    colNode.classList.remove('active');
                    return;
                }

                const allCols = canvas.querySelectorAll('.woodblock-prov-column');
                allCols.forEach(c => c.classList.remove('active'));

                colNode.className = 'woodblock-prov-column active';
                await wait(150); 
                revealText(colNode, 35);
            });
        });

        if (pageIdx === 0) {
            btnPrev.className = 'woodblock-page-btn font-kangxi btn-disabled';
            btnNext.className = 'woodblock-page-btn font-kangxi';
            btnNext.innerHTML = '<span>【</span><span>次</span><span>卷</span><span>】</span>';
        } else if (pageIdx === 1) {
            btnPrev.className = 'woodblock-page-btn font-kangxi';
            btnNext.className = 'woodblock-page-btn font-kangxi';
            btnNext.innerHTML = '<span>【</span><span>掩</span><span>卷</span><span>】</span>';
        }
    }

    // 独立流锁
    const chapterMasterLock = new Promise((resolveMasterFlow) => {
        btnPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentPageIndex > 0) { 
                currentPageIndex--; 
                renderWoodblockPage(currentPageIndex); 
            }
        });

        btnNext.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (currentPageIndex === 0) {
                currentPageIndex = 1;
                renderWoodblockPage(currentPageIndex);
            } else if (currentPageIndex === 1) {
                await runStandaloneOutroPage();
                // 🌟 正式移交放行条，激活第五开
                window.currentActiveChapter = 5;
                resolveMasterFlow();
            }
        });
    });

    renderWoodblockPage(0);

    async function runStandaloneOutroPage() {
        contentStage.style.opacity = 0;
        await wait(1800);
        contentStage.style.display = 'none';

        outroScreen.style.display = 'block';
        await wait(50);
        outroScreen.style.opacity = '1'; 
        
        await nextClick(wrapper);
        
        outroScreen.style.opacity = '0'; 
        await wait(1800);
        container.innerHTML = '';
        container.classList.remove('active');
    }

    await chapterMasterLock;
}
