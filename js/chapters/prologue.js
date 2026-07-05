const wait = ms => new Promise(r => setTimeout(r, ms));

export default async function playPrologue(container) {
    container.innerHTML = `
        <div id="p-text" class="vertical-text font-kangxi" style="font-size: 1.8rem; font-weight: 300; opacity: 0; transition: opacity 2s ease;">
            自由的灵魂，眼里都带着风。
        </div>
        <div id="p-title" class="vertical-text font-kangxi" style="font-size: 2.5rem; letter-spacing: 0.4em; opacity: 0; transition: opacity 1.5s ease; display: none;">
            八风册
        </div>
    `;
    const text = document.getElementById('p-text');
    const title = document.getElementById('p-title');

    container.classList.add('active');
    await wait(1000);
    text.style.opacity = 1;
    await wait(4000);
    text.style.opacity = 0;
    await wait(2500);
    text.style.display = 'none';

    title.style.display = 'block';
    await wait(50);
    title.style.opacity = 1;
    await wait(2500);
    title.style.opacity = 0;
    await wait(2000);

    container.classList.remove('active');
    await wait(2500);
    container.innerHTML = '';
}