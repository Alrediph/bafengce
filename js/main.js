import playPrologue from './chapters/prologue.js';
import playMingshu from './chapters/mingshu.js';

async function init() {
    const prologueContainer = document.getElementById('prologue');
    const mingshuContainer = document.getElementById('chapter-1');

    await playPrologue(prologueContainer);
    await playMingshu(mingshuContainer);
}
window.addEventListener('DOMContentLoaded', init);