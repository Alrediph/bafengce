// js/main.js
import playPrologue from './chapters/prologue.js?v=3';
import playMingshu from './chapters/mingshu.js?v=3';
import playQingming from './chapters/qingming.js?v=3';
import playJingfeng from './chapters/jingfeng.js?v=3';
import playLiangfeng from './chapters/liangfeng.js?v=3'; // 🌟 引入全新第四开

async function init() {
    const prologueContainer = document.getElementById('prologue');
    const mingshuContainer = document.getElementById('chapter-1');
    const qingmingContainer = document.getElementById('chapter-2');
    const jingfengContainer = document.getElementById('chapter-3');
    const liangfengContainer = document.getElementById('chapter-4'); // 🌟 锁定第四开容器

    // 1. 序幕
    await playPrologue(prologueContainer);

    // 2. 第一开 · 明庶
    await playMingshu(mingshuContainer);

    // 3. 第二开 · 清明
    await playQingming(qingmingContainer);

    // 4. 第三开 · 景风
    await playJingfeng(jingfengContainer);

    // 5. 第四开 · 凉风
    await playLiangfeng(liangfengContainer);
}

window.addEventListener('DOMContentLoaded', init);
