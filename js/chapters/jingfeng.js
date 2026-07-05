// js/chapters/jingfeng.js
const wait = ms => new Promise(r => setTimeout(r, ms));

const nextClick = (element) => new Promise(resolve => {
    element.addEventListener('click', resolve, { once: true });
});

export default async function playJingfeng(container) {
    // 1. 完整录入大纲定稿的九支尊贵上上签文数据
    const allSigns = [
        { num: '一', poem: '东风先到竹枝头，<br>万卷书开月满楼。<br>此去青山皆旧识，<br>不须行处问春秋。', reply: '学业精进，前路有光。<br>所遇皆善，所行皆通。' },
        { num: '二', poem: '弦上春风指下生，<br>一音初动万音成。<br>从今便是无弦处，<br>亦有天风自在鸣。', reply: '内心安宁，诸事和谐。<br>不求而得，不争而明。' },
        { num: '三', poem: '夏木阴阴正可人，<br>午窗晴日暖于春。<br>平生不解趋炎事，<br>自有清凉到尔身。', reply: '身康体健，心境清凉。<br>不为外物所扰，自有清福长伴。' },
        { num: '四', poem: '四海交游似旧时，<br>天涯何处不相知。<br>此心如月无亏缺，<br>照见人间总可期。', reply: '情谊深厚，所遇皆诚。<br>无论远近，总有人与尔同心。' },
        { num: '五', poem: '一年好景此时多，<br>万事从容各自和。<br>莫问前程多少路，<br>景风到处即山河。', reply: '事事顺遂，万物得时。<br>不必忧虑前路，风所到处，皆是好景。' },
        { num: '六', poem: '蚕月桑青叶叶新，<br>一丝一缕自殷勤。<br>他年若问经纶事，<br>已在春山深处闻。', reply: '才华自成，不假外求。<br>所学者深，所成者远。' },
        { num: '七', poem: '古涧寒泉彻底清，<br>千年松下一舟横。<br>世间风浪无侵处，<br>只有天风送月明。', reply: '心境澄澈，不染尘扰。<br>无论世路如何，自有净土一方。' },
        { num: '八', poem: '鹤在青霄云在空，<br>不须罗网不须笼。<br>一身自与天风远，<br>万里山河在眼中。', reply: '自在无碍，眼界开阔。<br>不被束缚，不为形役。' },
        { num: '九', poem: '灯火千门夜不寒，<br>有人长在月中看。<br>此生不被风波累，<br>只有春风与岁安。', reply: '岁岁平安，年年如春。<br>风霜不侵，所遇皆暖。' }
    ];

    // 2. 注入景风专属多幕动态与照片级别的签条视觉样式
    container.innerHTML = `
        <style>
            .jingfeng-wrapper {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative; background-color: #ffffff;
            }
            #jf-title-screen { font-size: 3.8rem; letter-spacing: 0.6em; opacity: 0; transition: opacity 2s ease; cursor: pointer; }
            #jf-intro { font-size: 1.2rem; line-height: 3; opacity: 0; transition: opacity 2s ease; position: absolute; cursor: pointer; }
            
            /* 交互大舞台 */
            #jf-content-stage {
                width: 100%; height: 100%; display: none; opacity: 0;
                transition: opacity 2s ease; position: relative;
            }

            /* 极简竹木签筒 */
            .cylinder-box {
                position: absolute; top: 26%; left: 50%; transform: translateX(-50%);
                width: 70px; height: 160px; cursor: pointer;
                transition: transform 0.15s ease;
            }
            .cylinder-svg { width: 100%; height: 100%; overflow: visible; }
            
            /* 夏至正午日照虚光线效果 */
            .solstice-light {
                position: absolute; top: 0; left: 50%; transform: translateX(-50%);
                width: 2px; height: 26vh;
                background: linear-gradient(to bottom, rgba(235,225,200,0) 0%, rgba(225,210,180,0.35) 60%, rgba(255,255,255,0) 100%);
                pointer-events: none;
            }

            /* 签筒强烈震动动画关键帧 */
            @keyframes cylinder-shake {
                0%, 100% { transform: translateX(-50%) rotate(0deg); }
                15% { transform: translateX(-53%) rotate(-8deg); }
                30% { transform: translateX(-47%) rotate(7deg); }
                45% { transform: translateX(-52%) rotate(-6deg); }
                60% { transform: translateX(-48%) rotate(5deg); }
                75% { transform: translateX(-51%) rotate(-3deg); }
                90% { transform: translateX(-49%) rotate(2deg); }
            }
            .shaking { animation: cylinder-shake 0.6s ease-in-out; }

            /* 【完美复刻实物照片】浮空水占解心签条样式 */
            .fortune-card-wrapper {
                position: absolute; top: 50%; left: 50%;
                transform: translate(-50%, -46%) scale(0.9);
                opacity: 0; pointer-events: none;
                transition: transform 1.2s cubic-bezier(0.15, 0.85, 0.35, 1), opacity 1s ease;
                
                /* 红呢绒质感外衬包边 */
                background-color: #8c2323; 
                padding: 15px 18px;
                border-radius: 3px;
                box-shadow: 0 16px 45px rgba(40,10,10,0.18);
                display: flex; flex-direction: column; align-items: center;
            }
            .fortune-card-wrapper.reveal {
                opacity: 1; pointer-events: auto;
                transform: translate(-50%, -50%) scale(1);
            }

            .fortune-card-inner {
                background-color: #fbf9f3; /* 洒金素宣内芯纸质色 */
                border: 1px dashed #d0c5ad;
                padding: 30px 35px 35px 35px;
                display: flex; flex-direction: column; align-items: center;
                width: 320px; min-height: 440px;
            }

            /* 签头：横排 */
            .card-header-title {
                font-size: 1.6rem; font-weight: bold; color: #8c2323;
                letter-spacing: 0.4em; padding-bottom: 12px; margin-right: -0.4em;
                text-align: center; font-family: 'KangXi', serif;
            }
            .card-header-divider {
                width: 100%; border-top: 1px dashed #8c2323; margin-bottom: 25px; opacity: 0.6;
            }

            /* 签身正文：严格依照照片实行自右向左的纵向分栏流布 */
            .card-body-columns {
                writing-mode: vertical-rl;
                height: 280px; width: 100%;
                display: flex; flex-direction: column;
                align-items: flex-start; justify-content: flex-start;
            }

            .card-section {
                display: inline-block; vertical-align: top; height: 100%; flex-shrink: 0;
            }
            .card-section.poem-zone { margin-left: 45px; } /* 诗曰与解曰之间的开阔黄金留白 */
            
            .section-lbl {
                font-weight: bold; color: #8c2323; font-size: 1.15rem;
                margin-left: 12px; display: block; font-family: 'KangXi', serif;
            }
            .section-txt {
                font-size: 1.05rem; color: #2c2c2c; line-height: 2.3;
                letter-spacing: 0.15em; display: block; white-space: nowrap;
            }

            /* 遮罩提示层 */
            .click-dismiss-tip {
                position: absolute; bottom: -35px; color: #aaaaaa; font-size: 0.85rem;
                letter-spacing: 0.2em; opacity: 0.8; white-space: nowrap;
            }
            
            #jf-next-prompt {
                position: absolute; bottom: 8%; left: 50%; transform: translateX(-50%);
                font-size: 1.6rem; letter-spacing: 0.5em; color: #4a4a4a;
                opacity: 0; transition: opacity 2s ease; cursor: pointer; display: none;
                white-space: nowrap; text-align: center;
            }
        </style>

        <div class="jingfeng-wrapper" id="jf-wrapper">
            <div id="jf-title-screen" class="vertical-text font-kangxi">景风</div>

            <div id="jf-intro" class="vertical-text font-kangxi" style="display: none;">
                景风，南方风也。景，大也。日光遍照，万物咸亨。<br>
                属离，八音为丝。<br>
                夏至之风。
            </div>

            <div id="jf-content-stage">
                <div class="solstice-light"></div>

                <div class="cylinder-box" id="jf-cylinder">
                    <svg class="cylinder-svg" viewBox="0 0 70 160">
                        <rect x="2" y="25" width="66" height="133" rx="4" fill="none" stroke="#555555" stroke-width="1.5"/>
                        <line x1="12" y1="25" x2="12" y2="4" stroke="#777777" stroke-width="2"/>
                        <line x1="24" y1="25" x2="20" y2="2" stroke="#555555" stroke-width="2.2"/>
                        <line x1="35" y1="25" x2="35" y2="6" stroke="#666666" stroke-width="2"/>
                        <line x1="46" y1="25" x2="50" y2="3" stroke="#555555" stroke-width="2.2"/>
                        <line x1="58" y1="25" x2="56" y2="8" stroke="#777777" stroke-width="2"/>
                    </svg>
                </div>

                <div class="fortune-card-wrapper" id="jf-card-wrap">
                    <div class="fortune-card-inner">
                        <div class="card-header-title" id="card-title-slot">第 壹 签 · 上上</div>
                        <div class="card-header-divider"></div>
                        
                        <div class="card-body-columns">
                            <div class="card-section poem-zone">
                                <span class="section-lbl">诗曰</span>
                                <span class="section-txt" id="card-poem-slot"></span>
                            </div>
                            <div class="card-section">
                                <span class="section-lbl">解曰</span>
                                <span class="section-txt" id="card-reply-slot"></span>
                            </div>
                        </div>
                    </div>
                    <div class="click-dismiss-tip font-kangxi">点击签条 · 收起复掷</div>
                </div>
            </div>

            <div id="jf-next-prompt" class="font-kangxi">景风长养。点击续行。</div>
        </div>
    `;

    const wrapper = document.getElementById('jf-wrapper');
    const titleScreen = document.getElementById('jf-title-screen');
    const intro = document.getElementById('jf-intro');
    const contentStage = document.getElementById('jf-content-stage');
    const cylinder = document.getElementById('jf-cylinder');
    const cardWrap = document.getElementById('jf-card-wrap');
    
    const slotTitle = document.getElementById('card-title-slot');
    const slotPoem = document.getElementById('card-poem-slot');
    const slotReply = document.getElementById('card-reply-slot');
    const nextPrompt = document.getElementById('jf-next-prompt');

    // 追踪上一支抽到的签索引，绝对锁死连续重复抽签
    let lastSignIndex = -1;
    let totalDrawnCount = 0;

    container.classList.add('active');
    await wait(400);

    // ====== 第一幕：居中“景风”大字浮现 ======
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

    // ====== 第三幕：摇签主场景拉开 ======
    contentStage.style.display = 'block';
    await wait(50);
    contentStage.style.opacity = 1;

    // 绑定签筒的摇掷交互行为
    cylinder.addEventListener('click', async (e) => {
        e.stopPropagation(); // 阻止触发全局大背景点击
        
        // 如果当前已经展示了签条，点击签筒直接闭合当前签条，准备重新摇掷
        if (cardWrap.classList.contains('reveal')) {
            cardWrap.classList.remove('reveal');
            await wait(600);
        }

        // 启动极其逼真的筒身剧烈颤抖动态效果
        cylinder.classList.add('shaking');
        await wait(650); // 等待摇晃完毕
        cylinder.classList.remove('shaking');

        // 纯随机抽取逻辑，循环校验确保同一支永不连续出现两次
        let randomIndex = Math.floor(Math.random() * allSigns.length);
        while (randomIndex === lastSignIndex) {
            randomIndex = Math.floor(Math.random() * allSigns.length);
        }
        lastSignIndex = randomIndex; // 锁存本次索引
        totalDrawnCount++;

        const drawnSign = allSigns[randomIndex];

        // 精准渲染数据到照片复刻面板中
        slotTitle.innerText = `第 ${drawnSign.num} 签 · 上上`;
        slotPoem.innerHTML = drawnSign.poem;
        slotReply.innerHTML = drawnSign.reply;

        // 优雅从下方弹起滑出签卡
        cardWrap.classList.add('reveal');

        // 当用户至少摇过3次签、尽情把玩过互动后，我们含蓄地准备好放行下一开的结束门槛
        if (totalDrawnCount >= 3) {
            prepareExitOption();
        }
    });

    // 点击打开的签卡本身，使其优雅退场闭合，回到单纯悬挂签筒的状态
    cardWrap.addEventListener('click', (e) => {
        e.stopPropagation();
        cardWrap.classList.remove('reveal');
    });

    // 辅助离场控制
    function prepareExitOption() {
        if (nextPrompt.style.display === 'block') return;
        
        // 当签卡闭合且摇签数达标时，点击大白背景即可真正激活出场词
        wrapper.addEventListener('click', async () => {
            if (cardWrap.classList.contains('reveal')) return;
            
            cylinder.style.opacity = 0;
            cylinder.style.transition = 'opacity 2s ease';
            await wait(1500);
            cylinder.style.display = 'none';

            nextPrompt.style.display = 'block';
            await wait(50);
            nextPrompt.style.opacity = 1;
        }, { once: true });
    }

    // 等待终章大字被点击，彻底全盘卸载景风模块
    await nextClick(wrapper);
    container.classList.remove('active');
    await wait(2500);
    container.innerHTML = '';
}