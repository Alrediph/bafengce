const wait = ms => new Promise(r => setTimeout(r, ms));

export default async function playMingshu(container) {
    container.innerHTML = `
        <div id="ms-intro" class="vertical-text font-kangxi" style="font-size: 1.2rem; line-height: 3; opacity: 0; transition: opacity 3s ease;">
            明庶风，东方风也。庶，众也。风以生物，明众物尽出也。<br>
            属震，八音为竹。<br>
            春分之风。
        </div>
        <div id="ms-book" class="vertical-text" style="display: flex; flex-direction: row-reverse; gap: 24px; opacity: 0; transform: scale(0.98); transition: opacity 2.5s ease, transform 2.5s ease; position: absolute;">
            <div style="padding: 0 30px; height: 60vh; display: flex; align-items: center; justify-content: center;">
                <div class="font-kangxi" style="font-size: 1.2rem; font-weight: bold;">明庶风至。君子如竹。</div>
            </div>
            <div style="border-left: 1px dashed #e0e0e0; padding: 0 30px; height: 60vh;">
                <div class="font-kangxi" style="font-size: 1.3rem; font-weight: bold;">君子和而不同。</div>
                <div style="font-size: 0.95rem; color: #7a7a7a; margin-right: 15px;">——《论语·子路》</div>
                <div style="font-size: 1.1rem; color: #4a4a4a; margin-right: 15px;">八风各至，不相扰也。</div>
            </div>
            <div style="border-left: 1px dashed #e0e0e0; padding: 0 30px; height: 60vh;">
                <div class="font-kangxi" style="font-size: 1.3rem; font-weight: bold;">君子不器。</div>
                <div style="font-size: 0.95rem; color: #7a7a7a; margin-right: 15px;">——《论语·为政》</div>
                <div style="font-size: 1.1rem; color: #4a4a4a; margin-right: 15px;">风无定形，万形皆可。</div>
            </div>
            <div style="border-left: 1px dashed #e0e0e0; padding: 0 30px; height: 60vh;">
                <div class="font-kangxi" style="font-size: 1.3rem; font-weight: bold;">君子之德风。</div>
                <div style="font-size: 0.95rem; color: #7a7a7a; margin-right: 15px;">——孔子</div>
                <div style="font-size: 1.1rem; color: #4a4a4a; margin-right: 15px;">风行草上，万物从之。</div>
            </div>
            <div style="border-left: 1px dashed #e0e0e0; padding: 0 30px; height: 60vh;">
                <div class="font-kangxi" style="font-size: 1.3rem; font-weight: bold;">君子以明庶政，无敢折狱。</div>
                <div style="font-size: 0.95rem; color: #7a7a7a; margin-right: 15px;">——《象》曰山下有火，贲。</div>
                <div style="font-size: 1.1rem; color: #4a4a4a; margin-right: 15px;">山下有火，其辉有度。</div>
            </div>
        </div>
        <div class="font-kangxi" style="position: absolute; bottom: 4%; right: 4%; font-size: 0.8rem; color: #cccccc; writing-mode: vertical-rl; letter-spacing: 0.1em;">震 · 竹</div>
    `;
    const intro = document.getElementById('ms-intro');
    const book = document.getElementById('ms-book');

    container.classList.add('active');
    await wait(1500);
    intro.style.opacity = 1;
    await wait(5000);
    intro.style.opacity = 0;
    await wait(2500);
    intro.style.display = 'none';

    book.style.opacity = 1;
    book.style.transform = 'scale(1)';
}