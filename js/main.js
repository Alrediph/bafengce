// js/main.js
import playPrologue from './chapters/prologue.js?v=3';
import playMingshu from './chapters/mingshu.js?v=3';
import playQingming from './chapters/qingming.js?v=3';
import playJingfeng from './chapters/jingfeng.js?v=3';
import playLiangfeng from './chapters/liangfeng.js?v=3';
import playChanghe from './chapters/changhe.js?v=3'; // 🌟 精准引入第五开 · 阊阖风

async function init() {
    const prologueContainer = document.getElementById('prologue');
    const mingshuContainer = document.getElementById('chapter-1');
    const qingmingContainer = document.getElementById('chapter-2');
    const jingfengContainer = document.getElementById('chapter-3');
    const liangfengContainer = document.getElementById('chapter-4');
    const changheContainer = document.getElementById('chapter-5'); // 锁定第五开容器

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

    // 6. 第五开 · 阊阖风
    await playChanghe(changheContainer);
}

window.addEventListener('DOMContentLoaded', init);
