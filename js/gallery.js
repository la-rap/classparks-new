// --- Toast-style Masonry: auto row spans based on real image height ---
const grid = document.getElementById('toastGrid');

function resizeGridItem(item) {
    const styles = getComputedStyle(grid);
    const rowGap = parseInt(styles.getPropertyValue('gap')) || parseInt(styles.getPropertyValue('grid-row-gap')) || 0;
    const rowSize = parseInt(styles.getPropertyValue('grid-auto-rows')) || 8;
    const img = item.querySelector('img');
    if (!img) return;
    const itemHeight = img.getBoundingClientRect().height;
    const rowSpan = Math.ceil((itemHeight + rowGap) / (rowSize + rowGap));
    item.style.gridRowEnd = 'span ' + rowSpan;
}

function resizeAll() {
    document.querySelectorAll('#toastGrid .gallery-item').forEach(resizeGridItem);
}

// Recalc once loaded and on resize
window.addEventListener('load', resizeAll);
window.addEventListener('resize', () => { clearTimeout(window.__mR); window.__mR = setTimeout(resizeAll, 120); });

// Recalc each image when it loads
document.querySelectorAll('#toastGrid img').forEach(img => {
    if (img.complete) { resizeGridItem(img.closest('.gallery-item')); }
    else { img.addEventListener('load', () => resizeGridItem(img.closest('.gallery-item')), { once: true }); }
});

// --- Lightbox navigation like the Toast gallery ---
const items = Array.from(document.querySelectorAll('.gallery-item'));
const modalEl = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
let current = 0;

function openAt(index) {
    current = (index + items.length) % items.length;
    modalImg.src = items[current].dataset.full;
}

// Click any tile to open at that index
items.forEach((el, i) => {
    el.addEventListener('click', () => openAt(i));
});

// Prev / Next buttons
document.querySelector('.modal-prev').addEventListener('click', () => openAt(current - 1));
document.querySelector('.modal-next').addEventListener('click', () => openAt(current + 1));

// Keyboard arrows while modal is open
modalEl.addEventListener('shown.bs.modal', () => {
    function onKey(e) {
        if (e.key === 'ArrowLeft') { openAt(current - 1); }
        if (e.key === 'ArrowRight') { openAt(current + 1); }
    }
    window.addEventListener('keydown', onKey);
    modalEl.addEventListener('hidden.bs.modal', () => window.removeEventListener('keydown', onKey), { once: true });
});
