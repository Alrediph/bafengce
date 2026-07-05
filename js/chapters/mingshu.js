// js/chapters/mingshu.js
const wait = ms => new Promise(r => setTimeout(r, ms));

// 核心机制：等待用户在屏幕上点击一次，才允许进到下一幕
const nextClick = (element) => new Promise(resolve => {
    element.addEventListener('click', resolve, { once: true });
});

export default async function playMingshu(container) {
    // 动态注入精细调校后的多幕结构与内嵌样式
    container.innerHTML = `
        <style>
            .mingshu-wrapper {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                cursor: pointer; /* 鼠标指针变为手型，含蓄提示观者此处可点击 */
            }
            
            /* 幕一：“明庶”大字居中 */
            #ms-title-screen {
                font-size: 3.8rem;
                letter-spacing: 0.6em;
                opacity: 0;
                transition: opacity 2s ease;
                user-select: none;
            }

            /* 幕二：启幕词 */
            #ms-intro {
                font-size: 1.2rem;
                line-height: 3;
                opacity: 0;
                transition: opacity 2s ease;
                position: absolute;
            }

            /* 幕三：真正的横向经折装折子 */
            #ms-book-container {
                width: 100%;
                max-width: 90vw;
                height: 65vh;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                transition: opacity 2.5s ease;
                position: absolute;
                pointer-events: none; /* 初始隐藏时防止阻挡父级点击 */
            }
            
            #ms-book-container.active {
                pointer-events: auto;
            }

            .folding-book {
                display: flex;
                flex-direction: row-reverse; /* 古籍从右往左流动的经典秩序 */
                overflow-x: auto;
                overflow-y: hidden;
                width: auto;
                max-width: 100%;
                height: 100%;
                padding: 10px 0;
                scroll-behavior: smooth;
                
                /* 隐藏现代滚动条，保持宣纸画卷的纯净感 */
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            .folding-book::-webkit-scrollbar {
                display: none;
            }

            .fold-page {
                border-left: 1px dashed #e2e2e2; /* 经折装的虚线折痕 */
                padding: 0 45px;
                height: 100%;
                flex-shrink: 0; /* 【核心修复】死锁宽度，坚决防止折页被挤压或垂直错位 */
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
            }
            
            .fold-page.cover-page {
                border-left: none;
                justify-content: center;
                align-items: center;
                padding: 0 60px;
            }
        </style>

        <div class="mingshu-wrapper" id="ms-wrapper">
            <!-- 【新加幕】“明庶”二字居中 -->
            <div id="ms-title-screen" class="vertical-text font-kangxi">明庶</div>

            <!-- 幕二：启幕词 -->
            <div id="ms-intro" class="vertical-text font-kangxi" style="display: none;">
                明庶风，东方风也。庶，众也。风以生物，明众物尽出也。<br>
                属震，八音为竹。<br>
                春分之风。
            </div>

            <!-- 幕三：横排折子正文 -->
            <div id="ms-book-container" style="display: none;">
                <div class="folding-book vertical-text">
                    <!-- 末页 (最左边，收尾) -->
                    <div class="fold-page cover-page">
                        <div class="font-kangxi" style="font-size: 1.25rem; font-weight: bold; letter-spacing: 0.3em;">明庶风至。君子如竹。</div>
                    </div>
                    <!-- 第四折 -->
                    <div class="fold-page">
                        <div class="font-kangxi" style="font-size: 1.3rem; font-weight: bold;">君子和而不同。</div>
                        <div style="font-size: 0.95rem; color: #7a7a7a; margin-right: 15px; font-family: serif;">——《论语·子路》</div>
                        <div style="font-size: 1.1rem; color: #4a4a4a; margin-right: 15px;">八风各至，不相扰也。</div>
                    </div>
                    <!-- 第三折 -->
                    <div class="fold-page">
                        <div class="font-kangxi" style="font-size: 1.3rem; font-weight: bold;">君子不器。</div>
                        <div style="font-size: 0.95rem; color: #7a7a7a; margin-right: 15px; font-family: serif;">——《论语·为政》</div>
                        <div style="font-size: 1.1rem; color: #4a4a4a; margin-right: 15px;">风无定形，万形皆可。</div>
                    </div>
                    <!-- 第二折 -->
                    <div class="fold-page">
                        <div class="font-kangxi" style="font-size: 1.3rem; font-weight: bold;">君子之德风。</div>
                        <div style="font-size: 0.95rem; color: #7a7a7a; margin-right: 15px; font-family: serif;">——孔子</div>
                        <div style="font-size: 1.1rem; color: #4a4a4a; margin-right: 15px;">风行草上，万物从之。</div>
                    </div>
                    <!-- 第一折 (最右边，入场首折) -->
                    <div class="fold-page" style="border-right: none;">
                        <div class="font-kangxi" style="font-size: 1.3rem; font-weight: bold;">君子以明庶政，无敢折狱。</div>
                        <div style="font-size: 0.95rem; color: #7a7a7a; margin-right: 15px; font-family: serif;">——《象》曰山下有火，贲。</div>
                        <div style="font-size: 1.1rem; color: #4a4a4a; margin-right: 15px;">山下有火，其辉有度。</div>
                    </div>
                </div>
            </div>

            <!-- 旁注 -->
            <div class="font-kangxi" style="position: absolute; bottom: 4%; right: 4%; font-size: 0.8rem; color: #cccccc; writing-mode: vertical-rl; letter-spacing: 0.1em;">震 · 竹</div>
        </div>
    `;

    const wrapper = document.getElementById('ms-wrapper');
    const titleScreen = document.getElementById('ms-title-screen');
    const intro = document.getElementById('ms-intro');
    const bookContainer = document.getElementById('ms-book-container');

    // 唤醒明庶开舞台
    container.classList.add('active');
    await wait(400);

    // ====== 第一幕：“明庶”大字居中浮现 ======
    titleScreen.style.opacity = 1;
    await nextClick(wrapper); // 🌟 停住，等待用户点击屏幕

    // 大字消散
    titleScreen.style.opacity = 0;
    await wait(2000);
    titleScreen.style.display = 'none';

    // ====== 第二幕：启幕词逐渐浮现 ======
    intro.style.display = 'block';
    await wait(50);
    intro.style.opacity = 1;
    await nextClick(wrapper); // 🌟 再次停住，等待用户点击屏幕

    // 启幕词隐去
    intro.style.opacity = 0;
    await wait(2000);
    intro.style.display = 'none';

    // ====== 第三幕：真正的横排折子作为一个整体浮现 ======
    bookContainer.style.display = 'flex';
    await wait(50);
    bookContainer.style.opacity = 1;
    bookContainer.classList.add('active');
    
    // 至此，折子静静并排平铺在画布上，用户可以自由地横向滑动/滚轮品读
}
