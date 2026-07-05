// js/chapters/jingfeng.js
const wait = ms => new Promise(r => setTimeout(r, ms));

const nextClick = (element) => new Promise(resolve => {
    element.addEventListener('click', resolve, { once: true });
});

export default async function playJingfeng(container) {
    // 1. 完整录入九支尊贵上上签文数据
    const allSigns = [
        { num: '一', poem: '东风先到竹枝头，<br>万卷书开月满楼。<br>此去青山皆旧识，<br>不须行处问春秋。', reply: '学业精进，前路有光。<br>所遇皆善，所行皆通。' },
        { num: '二', poem: '弦上春风指下生，<br>一音初动万音成。<br>从今便是无弦处，<br>亦有天风自在鸣。', reply: '内心安宁，诸事和谐。<br>不求而得，不争而明。' },
        { num: '三', poem: '夏木阴阴正可人，<br>午窗晴日暖于春。<br>平生不解趋炎事，<br>自有清凉到尔身。', reply: '身康体健，心境清凉。<br>不为外物所扰，自有清福长伴。' },
        { num: '四', poem: '四海交游似旧时，<br>天涯何处不相知。<br>此心如月无亏缺，<br>照见人间总可期。', reply: '情谊深厚，所遇皆诚。<br>无论远近，总有人与尔同心。' },
        { num: '五', poem: '一年好景此时多，<br>万事从容各自和。<br>莫问前程多少路，<br>景风到处即山河。', reply: '事事顺遂，万物得时。<br>不必忧虑前路，风所到处，皆是好景。' },
        { num: '六', poem: '蚕月桑青叶叶新，<br>一丝一缕自殷勤。<br>他年若问经纶事，<br>已在春山深处闻。', reply: '才华自成，不假外求。<br>所学者深，所成者远。' },
        { num: '七', poem: '古涧寒泉彻底清，<br>千年松下一舟横。<br>世间风浪无侵处，<br>只有天风送月明。', reply: '心境澄澈，不染尘扰。<br>无论世路如何，自有净土一方。' },
        { num: '八', poem: '鹤在青霄云在空，<br>不须网罗不须笼。<br>一身自与天风远，<br>万里山河在眼中。', reply: '自在无碍，眼界开阔。<br>不被束缚，不为形役。' },
        { num: '九', poem: '灯火千门夜不寒，<br>有人长在月中看。<br>此生不被风波累，<br>只有春风与岁安。', reply: '岁岁平安，年年如春。<br>风霜不侵，所遇皆暖。' }
    ];

    container.innerHTML = `
        <style>
            .jingfeng-wrapper {
                width: 100%; height: 100%;
                display: flex; justify-content: center; align-items: center;
                position: relative; background-color: #ffffff;
            }
            #jf-title-screen { font-size: 3.8rem; letter-spacing: 0.6em; opacity: 0; transition: opacity 2s ease; cursor: pointer; }
            #jf-intro { font-size: 1.2rem; line-height: 3; opacity: 0; transition: opacity 2s ease; position: absolute; cursor: pointer; }
            
            #jf-content-stage {
                width: 100%; height: 100%; display: none; opacity: 0;
                transition: opacity 2s ease; position: relative;
            }

            /* 【完美修复】仿 image_365fe7 3D六角形等轴测签筒定位 */
            .cylinder-container {
                position: absolute; top: 24%; left: 50%; transform: translateX(-50%);
                width: 130px; height: 240px; cursor: pointer;
                transition: transform 0.12s ease;
            }
            .cylinder-svg { width: 100%; height: 100%; overflow: visible; }
            
            .solstice-light {
                position: absolute; top: 0; left: 50%; transform: translateX(-50%);
                width: 2px; height: 24vh;
                background: linear-gradient(to bottom, rgba(235,225,200,0) 0%, rgba(225,210,180,0.3) 60%, rgba(255,255,255,0) 100%);
                pointer-events: none;
            }

            /* 筒身剧烈连带颤晃 */
            @keyframes cylinder-shake {
                0%, 100% { transform: translateX(-50%) rotate(0deg); }
                15% { transform: translateX(-54%) rotate(-9deg) translateY(-2px); }
                30% { transform: translateX(-46%) rotate(8deg) translateY(1px); }
                45% { transform: translateX(-53%) rotate(-7deg) translateY(-1px); }
                60% { transform: translateX(-47%) rotate(5deg); }
                75% { transform: translateX(-51%) rotate(-3deg); }
                90% { transform: translateX(-49%) rotate(2deg); }
            }
            .shaking { animation: cylinder-shake 0.6s ease-in-out; }

            /* 【完美复刻实物照片】精美双层红呢滚边洒金笺纸卡片结构 */
            .fortune-card-wrapper {
                position: absolute; top: 50%; left: 50%;
                transform: translate(-50%, -45%) scale(0.9);
                opacity: 0; pointer-events: none;
                transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease;
                
                background-color: #962929; /* 实物大红衬底呢纸色 */
                padding: 16px 20px;
                border-radius: 4px;
                box-shadow: 0 20px 50px rgba(50,15,15,0.2);
                display: block;
            }
            .fortune-card-wrapper.reveal {
                opacity: 1; pointer-events: auto;
                transform: translate(-50%, -50%) scale(1);
            }

            .fortune-card-inner {
                background-color: #faf6ed; /* 纯正素雅宣纸色 */
                border: 1px solid #e1d7be;
                padding: 30px 35px 35px 35px;
                width: 350px; min-height: 460px;
                box-sizing: border-box;
                position: relative;
                
                /* 【高级内敛】纯CSS粒子级模拟高档洒金宣纸纹理 */
                background-image: 
                    radial-gradient(rgba(218,165,32,0.22) 1px, transparent 0), 
                    radial-gradient(rgba(218,165,32,0.18) 1.5px, transparent 0);
                background-size: 28px 28px, 44px 44px;
                background-position: 0 0, 10px 14px;
                box-shadow: inset 0 0 30px rgba(235,220,190,0.35);
            }

            /* 签额头：横排剧目 */
            .card-header-title {
                font-size: 1.55rem; font-weight: bold; color: #962929;
                letter-spacing: 0.5em; padding-bottom: 12px; margin-right: -0.5em;
                text-align: center; font-family: 'KangXi', serif;
            }
            .card-header-divider {
                width: 100%; border-top: 1px dashed #962929; margin-bottom: 30px; opacity: 0.5;
            }

            /* 【终极修复】死锁纵向原生分栏模型，坚决不允许重叠与倒向 */
            .card-body-columns {
                writing-mode: vertical-rl; /* 强制自右向左纵向流动 */
                height: 270px; width: 100%;
                box-sizing: border-box;
                padding-right: 10px;
            }

            .card-section {
                display: inline-block; /* 保证在vertical-rl容器中横向稳固并排 */
                vertical-align: top;
                height: 100%;
            }
            /* 诗曰与解曰之间留出极具呼吸感的黄金长白间隔 */
            .card-section.poem-zone { margin-left: 55px; } 
            
            .section-lbl {
                font-weight: bold; color: #962929; font-size: 1.15rem;
                margin-left: 15px; display: block; font-family: 'KangXi', serif;
                border-left: 1px solid rgba(150,41,41,0.25);
                padding-left: 4px;
            }
            .section-txt {
                font-size: 1.05rem; color: #2c2c2c; line-height: 2.4;
                letter-spacing: 0.16em; display: block; white-space: nowrap;
            }

            .click-dismiss-tip {
                position: absolute; bottom: -38px; left: 50%; transform: translateX(-50%);
                color: #aaaaaa; font-size: 0.85rem; letter-spacing: 0.2em; opacity: 0.8; white-space: nowrap;
            }
            
            #jf-next-prompt {
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-size: 1.8rem; letter-spacing: 0.5em; color: #4a4a4a;
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

                <div class="cylinder-container" id="jf-cylinder">
                    <svg class="cylinder-svg" viewBox="0 0 140 240">
                        <defs>
                            <linearGradient id="top-cap-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#462e18" />
                                <stop offset="100%" stop-color="#281a0e" />
                            </linearGradient>
                            <linearGradient id="face-left-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#edd6a4" />
                                <stop offset="100%" stop-color="#d5b97f" />
                            </linearGradient>
                            <linearGradient id="face-center-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#e1c78d" />
                                <stop offset="100%" stop-color="#caab68" />
                            </linearGradient>
                            <linearGradient id="face-right-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#b69654" />
                                <stop offset="100%" stop-color="#967739" />
                            </linearGradient>
                            <radialGradient id="cylinder-shadow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stop-color="rgba(0,0,0,0.14)" />
                                <stop offset="100%" stop-color="rgba(0,0,0,0)" />
                            </radialGradient>
                        </defs>
                        <ellipse cx="70" cy="222" rx="38" ry="7" fill="url(#cylinder-shadow)" />
                        
                        <g id="peaking-sticks">
                            <path d="M 64,48 L 61,16 L 65,16 Z" fill="#845e38" />
                            <path d="M 69,48 L 70,11 L 74,11 Z" fill="#a47b52" />
                            <path d="M 74,48 L 79,20 L 83,20 Z" fill="#bca076" />
                        </g>

                        <polygon points="35,60 55,75 55,210 35,195" fill="url(#face-left-grad)" stroke="#967739" stroke-width="0.4" />
                        <polygon points="55,75 85,75 85,210 55,210" fill="url(#face-center-grad)" stroke="#967739" stroke-width="0.4" />
                        <polygon points="85,75 105,60 105,195 85,210" fill="url(#face-right-grad)" stroke="#7e6027" stroke-width="0.4" />
                        
                        <polygon points="35,60 55,45 85,45 105,60 85,75 55,75" fill="url(#top-cap-grad)" stroke="#281a0e" stroke-width="0.4" />
                        
                        <circle cx="70" cy="60" r="4.5" fill="#140c06" />
                        
                        <line x1="45" y1="80" x2="45" y2="180" stroke="rgba(255,255,255,0.18)" stroke-width="0.8" />
                        <line x1="68" y1="90" x2="68" y2="195" stroke="rgba(0,0,0,0.06)" stroke-width="1" />
                        <line x1="76" y1="105" x2="76" y2="170" stroke="rgba(255,255,255,0.2)" stroke-width="0.6" />
                        <line x1="94" y1="85" x2="94" y2="175" stroke="rgba(0,0,0,0.09)" stroke-width="0.8" />
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
                    <div class="click-dismiss-tip font-kangxi">點擊簽條 · 收起復擲</div>
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

    let lastSignIndex = -1;
    let totalDrawnCount = 0;

    container.classList.add('active');
    await wait(400);

    // ====== 第一幕：“景风”大字 ======
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

    // ====== 第三幕：摇签交互 ======
    contentStage.style.display = 'block';
    await wait(50);
    contentStage.style.opacity = 1;

    cylinder.addEventListener('click', async (e) => {
        e.stopPropagation(); 
        
        if (cardWrap.classList.contains('reveal')) {
            cardWrap.classList.remove('reveal');
            await wait(500);
        }

        // 触发高级3D连带震颤
        cylinder.classList.add('shaking');
        await wait(620); 
        cylinder.classList.remove('shaking');

        // 查重随机算法
        let randomIndex = Math.floor(Math.random() * allSigns.length);
        while (randomIndex === lastSignIndex) {
            randomIndex = Math.floor(Math.random() * allSigns.length);
        }
        lastSignIndex = randomIndex; 
        totalDrawnCount++;

        const drawnSign = allSigns[randomIndex];

        // 完美填充
        slotTitle.innerText = `第 ${drawnSign.num} 签 · 上上`;
        slotPoem.innerHTML = drawnSign.poem;
        slotReply.innerHTML = drawnSign.reply;

        // 弹起显现
        cardWrap.classList.add('reveal');

        if (totalDrawnCount >= 3) {
            prepareExitOption();
        }
    });

    cardWrap.addEventListener('click', (e) => {
        e.stopPropagation();
        cardWrap.classList.remove('reveal');
    });

    function prepareExitOption() {
        if (nextPrompt.style.display === 'block') return;
        
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

    await nextClick(wrapper);
    container.classList.remove('active');
    await wait(2500);
    container.innerHTML = '';
}
