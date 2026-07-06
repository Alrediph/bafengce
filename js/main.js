// js/main.js
import playPrologue from './chapters/prologue.js?v=4';
import playMingshu from './chapters/mingshu.js?v=4';
import playQingming from './chapters/qingming.js?v=4';
import playJingfeng from './chapters/jingfeng.js?v=4';
import playLiangfeng from './chapters/liangfeng.js?v=4';
import playChanghe from './chapters/changhe.js?v=4';
import playBuzhou from './chapters/buzhou.js?v=4';
import playGuangmo from './chapters/guangmo.js?v=4';   // 🌟 强切 v4 版本，彻底融化第七开缓存死锁
import playRongfeng from './chapters/rongfeng.js?v=4'; // 🌟 强切 v4 版本，彻底融化第八开缓存死锁

async function init() {
    const prologueContainer = document.getElementById('prologue');
    const mingshuContainer = document.getElementById('chapter-1');
    const qingmingContainer = document.getElementById('chapter-2');
    const jingfengContainer = document.getElementById('chapter-3');
    const liangfengContainer = document.getElementById('chapter-4');
    const changheContainer = document.getElementById('chapter-5');
    const buzhouContainer = document.getElementById('chapter-6');
    const guangmoContainer = document.getElementById('chapter-7');
    const rongfengContainer = document.getElementById('chapter-8');

    // 1. 序幕
    await playPrologue(prologueContainer);

    // 2. 第一开 · 明庶风
    await playMingshu(mingshuContainer);

    // 3. 第二开 · 清明风
    await playQingming(qingmingContainer);

    // 4. 第三开 · 景风
    await playJingfeng(jingfengContainer);

    // 5. 第四开 · 凉风
    await playLiangfeng(liangfengContainer);

    // 6. 第五开 · 阊阖风
    await playChanghe(changheContainer);

    // 7. 第六开 · 不周风
    await playBuzhou(buzhouContainer);

    // 8. 第七开 · 广莫风
    await playGuangmo(guangmoContainer);

    // 9. 第八开 · 融风
    await playRongfeng(rongfengContainer);
}

window.addEventListener('DOMContentLoaded', init);
