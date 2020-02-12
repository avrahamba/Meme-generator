'use strict'

let activeLine = null;
let startMove = { x: 0, y: 0 }
let gImg;
function initGallery() {

    let container = document.querySelector('.gallery-container');
    let strHtml = getImages().map(img => `
    <div class="card" onclick="enterGenerator(${img.id})">
        <img src="images/full/${img.url}"/>
    </div>
    `).join('');
    container.innerHTML = strHtml;
}
function enterGenerator(id) {
    setImg(id);
    document.querySelector('.gallery-container').classList.add('hidden');
    document.querySelector('.editor-container').classList.remove('hidden');
    document.querySelector('.about').classList.add('hidden');
    initMemeGenerator();
}
function initMemeGenerator() {
    let meme = getMeme();
    document.querySelector('.hidden-img').src = `images/full/${getImgUrl(meme.selectedImgId)}`;
    render(meme);
    addline();
}

function render(meme) {
    let canvas = document.querySelector('#meme-canvas');
    let ctx = canvas.getContext('2d');
    var elImg = document.querySelector('.hidden-img')
    let ratio = elImg.width / elImg.height;
    resizeCanvas(ratio);
    ctx.drawImage(elImg, 0, 0, canvas.width, canvas.height)
    meme.lines.forEach((line, inx) => {
        ctx.strokeStyle = line.colorStroke;
        ctx.fillStyle = line.colorfill;
        ctx.font = `${line.size}px Ariel`;
        ctx.textAlign = 'center'

        line.height = ctx.measureText(line.text).actualBoundingBoxAscent;
        line.width = ctx.measureText(line.text).width;
        ctx.fillText(line.text, line.x, line.y);
        ctx.strokeText(line.text, line.x, line.y);
    });
}

function resizeCanvas(ratio) {
    let canvas = document.querySelector('#meme-canvas');
    let elContainer = document.querySelector('.canvas-container');
    elContainer.style.height = elContainer.offsetWidth / ratio + 'px'
    canvas.width = elContainer.offsetWidth;
    canvas.height = elContainer.offsetHeight;
}


function changeText(elText) {
    changeTextLine(elText.value);
    render(getMeme());
}
function addline() {
    let memeLineCount = getMeme().lines.length;
    let canvas = document.querySelector('#meme-canvas');
    let y = canvas.height / 2;
    if (memeLineCount === 0 || memeLineCount === 1) y = (memeLineCount) ? canvas.height - 100 : 100;
    addLineService(canvas.width / 2, y)
    document.querySelector('.edit-text').value = '';
}

function clickOnCanvas(ev) {
    let { offsetX, offsetY } = ev;
    let line = getLine(offsetX, offsetY);
    if (line)
        document.querySelector('.edit-text').value = line.text;

}

function onRemoveLine() {
    removeLine();
    render(getMeme());
}

function onMoveLine(diff) {
    moveLine({ x: 0, y: diff });
    render(getMeme());
}

function onChangeSize(diff) {
    changeSize(diff);
    render(getMeme());
}

function onChangeColor(elColor, fill) {
    changeColor(elColor.value, fill)
    render(getMeme());
}
function onDownload(elLink) {
    let canvas = document.querySelector('#meme-canvas');
    const data = canvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-meme.jpg';
}

function loadGallery() {
    document.querySelector('.editor-container').classList.add('hidden');
    document.querySelector('.about').classList.remove('hidden');
    document.querySelector('.gallery-container').classList.remove('hidden');
    initGallery();

}

function onMouseDownCanvas(ev) {

    let { offsetX, offsetY } = ev;
    startMove.x = ev.offsetX
    startMove.y = ev.offsetY
    activeLine = getLine(offsetX, offsetY);
    window.addEventListener('mouseup', () => { activeLine = null });
}
function onMousMoveCanvas(ev) {
    if (!activeLine) return;
    moveLine({ x: startMove.x - ev.offsetX, y: startMove.y - ev.offsetY },startMove);
    render(getMeme());
}