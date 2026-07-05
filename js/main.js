// js/main.js
import playPrologue from './chapters/prologue.js';
import playMingshu from './chapters/mingshu.js';
import playQingming from './chapters/qingming.js';
import playJingfeng from './chapters/jingfeng.js'; // 🌟 引入全新的第三开景风模块

async function init() {
    const prologueContainer = document.getElementById('prologue');
    const mingshuContainer = document.getElementById('chapter-1');
    const qingmingContainer = document.getElementById('chapter-2');
    const jingfengContainer = document.getElementById('chapter-3'); // 🌟 锁定第三开容器

    // 1. 播放序幕
    await playPrologue(prologueContainer);

    // 2. 播放第一开 · 明庶
    await playMingshu(mingshuContainer);

    // 3. 播放第二开 · 清明
    await playQingming(qingmingContainer);

    // 4. 播放第三开 · 景风
    await playJingfeng(jingfengContainer);
}

window.addEventListener('DOMContentLoaded', init);
